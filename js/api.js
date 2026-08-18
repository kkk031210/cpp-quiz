/**
 * LLM API 模块
 * 支持多 Provider（DeepSeek / OpenAI / 通义千问 / 自定义）
 * 统一使用 OpenAI 兼容格式调用
 */

const Api = {
  // 预置 Provider 配置
  providers: {
    deepseek: {
      name: "DeepSeek",
      baseUrl: "https://api.deepseek.com/v1",
      defaultModel: "deepseek-chat",
      models: ["deepseek-chat", "deepseek-reasoner"]
    },
    openai: {
      name: "OpenAI",
      baseUrl: "https://api.openai.com/v1",
      defaultModel: "gpt-4o-mini",
      models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"]
    },
    qwen: {
      name: "通义千问",
      baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
      defaultModel: "qwen-plus",
      models: ["qwen-turbo", "qwen-plus", "qwen-max"]
    },
    zhipu: {
      name: "智谱清言",
      baseUrl: "https://open.bigmodel.cn/api/paas/v4",
      defaultModel: "glm-4-flash",
      models: ["glm-4-flash", "glm-4", "glm-4-air"]
    },
    custom: {
      name: "自定义",
      baseUrl: "",
      defaultModel: "",
      models: []
    }
  },

  /**
   * 获取当前配置
   */
  getConfig() {
    const settings = Storage.getSettings();
    return {
      provider: settings.provider || "deepseek",
      apiKey: settings.apiKey || "",
      baseUrl: settings.baseUrl || this.providers[settings.provider || "deepseek"].baseUrl,
      model: settings.model || this.providers[settings.provider || "deepseek"].defaultModel
    };
  },

  /**
   * 测试 API 连接
   */
  async testConnection() {
    const config = this.getConfig();
    if (!config.apiKey) {
      return { success: false, message: "请先填写 API Key" };
    }
    try {
      const res = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: this._getHeaders(config.apiKey),
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: "user", content: "回复 ok" }],
          max_tokens: 10
        })
      });
      if (res.ok) {
        return { success: true, message: "连接成功！" };
      } else {
        const errData = await res.json().catch(() => ({}));
        return { success: false, message: `连接失败: ${errData.error?.message || res.statusText}` };
      }
    } catch (e) {
      return { success: false, message: `网络错误: ${e.message}` };
    }
  },

  /**
   * 生成题目
   * @param {string[]} knowledgePointNames - 知识点名称数组
   * @param {string[]} types - 题型数组 ['choice', 'fill', 'short']
   * @param {number} count - 题目数量
   * @param {string} difficulty - 难度 '简单'|'中等'|'困难'|'随机'
   * @returns {Promise<Array>} 题目数组
   */
  async generateQuestions(knowledgePointNames, types, count, difficulty) {
    const config = this.getConfig();
    if (!config.apiKey) {
      throw new Error("请先在设置中配置 API Key");
    }

    const typeMap = { choice: "选择题", fill: "填空题", short: "简答题" };
    const typeNames = types.map(t => typeMap[t]).join("、");
    const diffText = difficulty === "随机" ? "随机搭配简单、中等、困难三种难度" : `以${difficulty}为主`;

    const prompt = this._buildGenerationPrompt(knowledgePointNames, typeNames, count, diffText);

    const res = await this._callApi(config, prompt, 8192);
    return this._parseQuestions(res);
  },

  /**
   * 评判简答题
   */
  async evaluateShortAnswer(question, userAnswer, standardAnswer) {
    const config = this.getConfig();
    if (!config.apiKey) {
      throw new Error("请先在设置中配置 API Key");
    }

    const prompt = `你是一个C++面试评判专家。请评判用户的答案是否正确。

题目：${question}
标准答案：${standardAnswer}
用户答案：${userAnswer}

评判标准：
- correct: 用户答案涵盖了标准答案的核心要点，基本正确
- partial: 用户答案部分正确，但有遗漏或小错误
- wrong: 用户答案与标准答案不符或严重缺失

请以JSON格式返回（只返回JSON，不要其他文本）：
{"result": "correct" | "partial" | "wrong", "score": 0-100, "comment": "简短点评，指出优缺点"}`;

    const res = await this._callApi(config, prompt, 4096);
    return this._parseJson(res);
  },

  // ===== 内部方法 =====

  _getHeaders(apiKey) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };
  },

  _buildGenerationPrompt(kpNames, typeNames, count, diffText) {
    return `你是一个C++面试题出题专家，擅长考察C++程序员的深度理解。请根据以下要求生成面试题：

知识点：${kpNames.join("、")}
题型：${typeNames}
数量：共${count}题（各题型尽量均匀分配）
难度：${diffText}

严格要求：
1. 题目必须准确，符合C++标准（以C++20/23为准）
2. 每道题必须包含详细解析，说明为什么这个答案是对的
3. 选择题必须有4个选项（A/B/C/D），只有一个正确答案
4. 填空题的空格用 ______ 表示，必须提供keywords数组用于关键词匹配判分
5. 简答题的标准答案要条理清晰，列出关键要点
6. 题目要有区分度，不能太简单也不能太偏
7. knowledgePoint字段填写该题所属的知识点名称

请严格以JSON数组格式返回，不要包含markdown代码块标记，不要包含其他任何文本：
[
  {
    "type": "choice",
    "question": "题干内容",
    "options": ["选项A内容", "选项B内容", "选项C内容", "选项D内容"],
    "answer": 0,
    "explanation": "详细解析",
    "difficulty": "中等",
    "knowledgePoint": "知识点名称"
  },
  {
    "type": "fill",
    "question": "题干内容，空格用______表示",
    "answer": "标准答案",
    "keywords": ["关键词1", "关键词2", "关键词3"],
    "explanation": "详细解析",
    "difficulty": "简单",
    "knowledgePoint": "知识点名称"
  },
  {
    "type": "short",
    "question": "简答题题干",
    "answer": "标准答案，条理清晰",
    "explanation": "补充说明和易错点",
    "difficulty": "困难",
    "knowledgePoint": "知识点名称"
  }
]`;
  },

  async _callApi(config, prompt, maxTokens) {
    const body = {
      model: config.model,
      messages: [
        { role: "system", content: "你是一个专业的C++技术面试官。请严格按照用户要求的JSON格式返回内容，不要添加任何额外文本或markdown标记。" },
        { role: "user", content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    };

    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: this._getHeaders(config.apiKey),
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(`API调用失败 (${res.status}): ${errData.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const choice = data.choices[0];
    const content = choice?.message?.content || "";

    // 思考型模型可能先输出 reasoning_content，若 token 不够 content 会为空
    if (!content.trim()) {
      if (choice?.finish_reason === "length") {
        // token 上限不足被截断：加倍后自动重试一次
        if (maxTokens < 32768) {
          return this._callApi(config, prompt, maxTokens * 2);
        }
        throw new Error("回复因模型输出长度限制被截断（思考型模型消耗大量token）。建议在设置中更换为非思考型模型，或减少题目数量。");
      }
      throw new Error("模型返回了空内容，请重试或更换模型");
    }

    // 即使有内容，如果被截断也重试拿完整结果（JSON 截断会导致解析失败）
    if (choice?.finish_reason === "length" && maxTokens < 32768) {
      return this._callApi(config, prompt, maxTokens * 2);
    }

    return content;
  },

  _parseQuestions(rawText) {
    // 清理可能的 markdown 代码块标记
    let text = rawText.trim();
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");

    const questions = this._parseJson(text);
    if (!Array.isArray(questions)) {
      throw new Error("返回格式错误：期望JSON数组");
    }

    // 校验和规范化每道题
    return questions.map((q, idx) => {
      if (!q.type || !q.question) {
        throw new Error(`第${idx + 1}题格式不完整`);
      }
      const normalized = {
        id: `gen_${Date.now()}_${idx}`,
        type: q.type,
        question: q.question,
        answer: q.answer,
        explanation: q.explanation || "",
        difficulty: q.difficulty || "中等",
        knowledgePoint: q.knowledgePoint || "未分类"
      };
      if (q.type === "choice") {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(`第${idx + 1}题选项不完整`);
        }
        normalized.options = q.options;
        normalized.answer = Number(q.answer) || 0;
      }
      if (q.type === "fill") {
        normalized.keywords = Array.isArray(q.keywords) ? q.keywords : [String(q.answer)];
      }
      return normalized;
    });
  },

  _parseJson(text) {
    // 尝试直接解析
    try {
      return JSON.parse(text);
    } catch (e) {
      // 尝试提取 JSON 部分
      const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch (e2) {
          // 最后尝试：移除可能的注释和尾部逗号
          try {
            const cleaned = match[0]
              .replace(/\/\*[\s\S]*?\*\//g, "")
              .replace(/\/\/.*$/gm, "")
              .replace(/,(\s*[}\]])/g, "$1");
            return JSON.parse(cleaned);
          } catch (e3) {
            throw new Error("JSON解析失败: " + e3.message);
          }
        }
      }
      throw new Error("无法解析返回内容为JSON");
    }
  }
};
