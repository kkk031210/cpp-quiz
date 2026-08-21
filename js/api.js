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

  // 各模块专属出题画像（system prompt + 出题指导）
  MODULE_PROFILES: {
    cpp: {
      expertName: "C++技术面试出题专家",
      system: "你是一位资深的C++技术面试官，擅长考察C++程序员的深度理解。请严格按照用户要求的JSON格式返回内容，不要添加任何额外文本或markdown标记。",
      guide: `面试重点：语言机制的本质（如const/static/inline的作用与区别）、内存模型（堆栈、智能指针、内存泄漏）、面向对象与多态（虚函数表、构造析构顺序）、模板元编程（SFINAE、特化）、移动语义（右值引用、完美转发）、STL容器底层实现与复杂度、多线程并发（锁、atomic、条件变量）、编译链接（ODR、静态/动态库）、现代C++新特性（C++11到C++23）、Qt框架（信号槽、事件循环、moc原理）。
题目要考察真实工程经验与底层原理，避免纯背诵型问题。涉及代码考察时用简短代码片段描述。`
    },
    linux: {
      expertName: "Linux服务端开发面试出题专家",
      system: "你是一位资深的Linux服务端开发面试官，精通系统编程。请严格按照用户要求的JSON格式返回内容，不要添加任何额外文本或markdown标记。",
      guide: `面试重点：进程与线程（fork/exec、僵尸进程、线程模型、守护进程）、文件IO（文件描述符、fcntl、缓冲区、IO模型）、进程间通信（pipe、共享内存、消息队列、信号量、Unix域套接字及对比）、信号机制（sigaction、可重入函数、中断系统调用）、内存管理（malloc实现、mmap、虚拟内存、页表）、性能调试（gdb、strace、core dump、perf）。
题目要考察系统调用背后的内核机制与实战经验，例如系统调用失败处理、同步与异步、阻塞与非阻塞。涉及代码考察时用简短代码片段描述。`
    },
    network: {
      expertName: "网络编程面试出题专家",
      system: "你是一位资深的网络编程面试官，精通TCP/IP协议栈与高并发服务器开发。请严格按照用户要求的JSON格式返回内容，不要添加任何额外文本或markdown标记。",
      guide: `面试重点：Socket编程（TCP/UDP API细节、阻塞非阻塞）、IO多路复用（select/poll/epoll原理与对比、LT/ET、Reactor模型）、TCP协议细节（三次握手、四次挥手、TIME_WAIT、粘包半包、keepalive、滑动窗口、拥塞控制）、并发服务器模型（多进程/多线程/线程池/Reactor/Proactor）、高性能IO（零拷贝、sendfile、mmap、SO_REUSEPORT）、网络库设计（muduo/libevent/Asio、定时器、buffer设计、心跳）。
题目要考察协议原理与工程实践的深度结合，例如epoll边缘触发为何要非阻塞、TIME_WAIT过多如何处理、粘包如何解决。`
    },
    database: {
      expertName: "数据库开发面试出题专家",
      system: "你是一位资深的数据库开发面试官，精通MySQL原理与Redis实践。请严格按照用户要求的JSON格式返回内容，不要添加任何额外文本或markdown标记。",
      guide: `面试重点：SQL基础（连接、子查询、分组聚合）、索引与优化（B+树原理、聚簇索引、执行计划、覆盖索引、最左前缀、索引失效场景）、事务与锁（ACID、隔离级别、MVCC、行锁表锁间隙锁、死锁）、存储引擎（InnoDB架构、redo/undo/binlog、WAL、两阶段提交）、编程实践（预处理防注入、连接池、ORM思想）、缓存设计（Redis数据结构、穿透/雪崩/击穿、缓存一致性、过期策略、布隆过滤器、分布式锁）。
题目要考察数据库原理的本质理解，避免纯背诵题，例如为什么要用B+树、MVCC如何解决读写并发、缓存与数据库一致性如何保证。`
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
   * @param {string} moduleId - 模块ID 'cpp'|'linux'|'network'|'database'
   * @returns {Promise<Array>} 题目数组
   */
  async generateQuestions(knowledgePointNames, types, count, difficulty, moduleId) {
    const config = this.getConfig();
    if (!config.apiKey) {
      throw new Error("请先在设置中配置 API Key");
    }

    const typeMap = { choice: "选择题", fill: "填空题", short: "简答题" };
    const typeNames = types.map(t => typeMap[t]).join("、");
    const diffText = difficulty === "随机" ? "随机搭配简单、中等、困难三种难度" : `以${difficulty}为主`;

    const prompt = this._buildGenerationPrompt(knowledgePointNames, typeNames, count, diffText, moduleId);

    const res = await this._callApi(config, prompt, 8192, moduleId);
    return this._parseQuestions(res);
  },

  /**
   * 评判简答题
   */
  async evaluateShortAnswer(question, userAnswer, standardAnswer, moduleId) {
    const config = this.getConfig();
    if (!config.apiKey) {
      throw new Error("请先在设置中配置 API Key");
    }

    const profile = this.MODULE_PROFILES[moduleId] || this.MODULE_PROFILES.cpp;
    const prompt = `你是${profile.expertName}。请评判用户的答案是否正确。

题目：${question}
标准答案：${standardAnswer}
用户答案：${userAnswer}

评判标准：
- correct: 用户答案涵盖了标准答案的核心要点，基本正确
- partial: 用户答案部分正确，但有遗漏或小错误
- wrong: 用户答案与标准答案不符或严重缺失

请以JSON格式返回（只返回JSON，不要其他文本）：
{"result": "correct" | "partial" | "wrong", "score": 0-100, "comment": "简短点评，指出优缺点"}`;

    const res = await this._callApi(config, prompt, 4096, moduleId);
    return this._parseJson(res);
  },

  // ===== 内部方法 =====

  _getHeaders(apiKey) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };
  },

  _buildGenerationPrompt(kpNames, typeNames, count, diffText, moduleId) {
    const profile = this.MODULE_PROFILES[moduleId] || this.MODULE_PROFILES.cpp;

    return `你是一位${profile.expertName}。请根据以下要求生成面试题：

知识点：${kpNames.join("、")}
题型：${typeNames}
数量：共${count}题（各题型尽量均匀分配）
难度：${diffText}

出题指导：
${profile.guide}

严格要求：
1. 题目必须准确、专业，符合该领域公认的标准与最佳实践
2. 每道题必须包含详细解析，说明为什么这个答案是对的，并指出常见误区
3. 选择题必须有4个选项（A/B/C/D），只有一个正确答案
4. 填空题的空格用 ______ 表示，必须提供keywords数组用于关键词匹配判分
5. 简答题的标准答案要条理清晰，列出关键要点
6. 题目要有区分度，不能太简单也不能太偏
7. knowledgePoint字段填写该题所属的知识点名称
8. 填空题的keywords必须是从标准答案中提取的核心词，不得包含标准答案中没有的扩展词（例如标准答案是"虚函数"时，keywords只能是["虚函数"]，不能是["虚函数","多态","动态绑定"]），否则用户答对也会被判错
9. JSON字符串值内部禁止包含真实换行符和Tab，需要换行时用\\n表示（如多要点答案写成"要点1\\n要点2"）

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

  async _callApi(config, prompt, maxTokens, moduleId) {
    const profile = this.MODULE_PROFILES[moduleId] || this.MODULE_PROFILES.cpp;
    const body = {
      model: config.model,
      messages: [
        { role: "system", content: profile.system },
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
          return this._callApi(config, prompt, maxTokens * 2, moduleId);
        }
        throw new Error("回复因模型输出长度限制被截断（思考型模型消耗大量token）。建议在设置中更换为非思考型模型，或减少题目数量。");
      }
      throw new Error("模型返回了空内容，请重试或更换模型");
    }

    // 即使有内容，如果被截断也重试拿完整结果（JSON 截断会导致解析失败）
    if (choice?.finish_reason === "length" && maxTokens < 32768) {
      return this._callApi(config, prompt, maxTokens * 2, moduleId);
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
    // 清洗字符串字面量中的裸控制字符（真实换行/Tab等），避免 "Bad control character" 错误
    const sanitized = this._sanitizeControlChars(text);
    // 尝试直接解析
    try {
      return JSON.parse(sanitized);
    } catch (e) {
      // 尝试提取 JSON 部分
      const match = sanitized.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
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
  },

  /**
   * 将 JSON 字符串字面量内部的裸控制字符（\n \r \t 等）转义为合法形式
   * 字符串外部（结构空白）的控制字符保持原样
   */
  _sanitizeControlChars(text) {
    let out = "";
    let inString = false;
    let escaped = false;
    for (const ch of text) {
      if (escaped) { out += ch; escaped = false; continue; }
      if (ch === "\\") { out += ch; escaped = true; continue; }
      if (ch === '"') { inString = !inString; out += ch; continue; }
      if (inString) {
        if (ch === "\n") out += "\\n";
        else if (ch === "\r") out += "\\r";
        else if (ch === "\t") out += "\\t";
        else if (ch < " ") out += " ";
        else out += ch;
      } else {
        out += ch;
      }
    }
    return out;
  }
};
