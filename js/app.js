/**
 * 主应用逻辑
 * SPA 路由 + 首页 + 答题 + 学习中心 + 设置
 */

const App = {
  // 当前答题状态
  quizState: {
    questions: [],
    currentIndex: 0,
    answers: [],     // { questionId, userAnswer, isCorrect, result }
    mode: null       // 'custom' | 'quick'
  },

  // 图表实例
  charts: {},

  // 当前激活模块（首页与快速练习用）
  currentModule: "cpp",

  // 学习中心模块筛选：'all' 或模块ID
  statsModuleFilter: "all",

  // ===== 模块辅助 =====

  _getModule() {
    const settings = Storage.getSettings();
    return QuizModules.find(m => m.id === settings.lastModule) || QuizModules[0];
  },

  _setCurrentModule(moduleId) {
    this.currentModule = moduleId;
    const settings = Storage.getSettings();
    settings.lastModule = moduleId;
    Storage.saveSettings(settings);
  },

  // 某知识点属于哪个模块
  _moduleOfKp(kpName) {
    const kp = KnowledgePoints.find(k => k.name === kpName);
    return kp ? kp.moduleId : null;
  },

  // ===== 路由 =====

  navigate(route) {
    // 更新导航高亮
    document.querySelectorAll(".nav-link").forEach(el => {
      el.classList.toggle("active", el.dataset.route === route);
    });

    const main = document.getElementById("main-content");
    switch (route) {
      case "home":
        main.innerHTML = this._renderHome();
        this._initHome();
        break;
      case "quiz":
        if (this.quizState.questions.length === 0) {
          this.navigate("home");
          return;
        }
        main.innerHTML = this._renderQuiz();
        this._initQuiz();
        break;
      case "result":
        main.innerHTML = this._renderResult();
        this._initResult();
        break;
      case "stats":
        main.innerHTML = this._renderStats();
        this._initStats();
        break;
      case "settings":
        main.innerHTML = this._renderSettings();
        this._initSettings();
        break;
      default:
        main.innerHTML = this._renderHome();
        this._initHome();
    }
  },

  // ===== 首页 =====

  _renderHome() {
    const settings = Storage.getSettings();
    const hasProgress = Storage.getProgress();
    const module = this._getModule();

    const moduleTabs = QuizModules.map(m => `
      <button class="module-tab ${m.id === module.id ? "active" : ""}" data-module="${m.id}" onclick="App._selectModule('${m.id}')">
        <span class="module-icon">${m.icon}</span>
        <span class="module-name">${m.name}</span>
        <span class="module-desc">${m.description}</span>
      </button>
    `).join("");

    return `
      <div class="page-home">
        ${!settings.apiKey ? `
          <div class="banner banner-warning">
            ⚠️ 还未配置 API Key，请先前往 <a onclick="App.navigate('settings')">设置页</a> 配置大模型 API
          </div>
        ` : ""}

        ${hasProgress ? `
          <div class="banner banner-info">
            📌 有未完成的练习，<a onclick="App._resumeProgress()">点击继续</a> 或 <a onclick="Storage.clearProgress(); App.navigate('home')">放弃</a>
          </div>
        ` : ""}

        <div class="home-section">
          <h2 class="section-title">选择模块</h2>
          <div class="module-tabs">
            ${moduleTabs}
          </div>
        </div>

        <div class="home-section">
          <h2 class="section-title">选择练习模式</h2>
          <div class="mode-tabs">
            <button class="mode-tab active" data-mode="custom" onclick="App._selectMode('custom')">
              <span class="mode-icon">📝</span>
              <span class="mode-name">自定义组卷</span>
              <span class="mode-desc">自选知识点、题型、数量</span>
            </button>
            <button class="mode-tab" data-mode="quick" onclick="App._selectMode('quick')">
              <span class="mode-icon">⚡</span>
              <span class="mode-name">快速练习</span>
              <span class="mode-desc">当前模块随机知识点</span>
            </button>
          </div>
        </div>

        <div id="custom-config" class="home-section">
          <h2 class="section-title">选择知识点 <span class="section-hint">（${module.name} 模块，可多选）</span></h2>
          <div class="kp-grid" id="kp-grid">
            ${this._renderKpGrid()}
          </div>
        </div>

        <div id="custom-options" class="home-section">
          <h2 class="section-title">练习设置</h2>
          <div class="options-row">
            <div class="option-group">
              <label class="option-label">题型</label>
              <div class="checkbox-group">
                <label class="chip"><input type="checkbox" value="choice" checked> 选择题</label>
                <label class="chip"><input type="checkbox" value="fill" checked> 填空题</label>
                <label class="chip"><input type="checkbox" value="short" checked> 简答题</label>
              </div>
            </div>
            <div class="option-group">
              <label class="option-label">题目数量</label>
              <select id="question-count" class="select">
                <option value="5">5 题</option>
                <option value="10" selected>10 题</option>
                <option value="15">15 题</option>
                <option value="20">20 题</option>
              </select>
            </div>
            <div class="option-group">
              <label class="option-label">难度</label>
              <select id="question-difficulty" class="select">
                <option value="随机" selected>随机</option>
                <option value="简单">简单</option>
                <option value="中等">中等</option>
                <option value="困难">困难</option>
              </select>
            </div>
          </div>
        </div>

        <div class="home-section">
          <button class="btn btn-primary btn-large" id="start-quiz-btn" onclick="App._startQuiz()">
            🚀 开始练习
          </button>
        </div>
      </div>
    `;
  },

  // 渲染当前模块的知识点卡片网格
  _renderKpGrid() {
    const module = this._getModule();
    const kpCards = module.knowledgePoints.map(kp => `
      <label class="kp-card" data-kp-id="${kp.id}">
        <input type="checkbox" value="${kp.name}" class="kp-checkbox">
        <span class="kp-icon">${kp.icon}</span>
        <span class="kp-name">${kp.name}</span>
        <span class="kp-desc">${kp.description}</span>
      </label>
    `).join("");

    return `
      <label class="kp-card kp-card-all">
        <input type="checkbox" id="select-all-kp" onchange="App._toggleAllKp(this.checked)">
        <span class="kp-icon">✅</span>
        <span class="kp-name">全选</span>
        <span class="kp-desc">选择${module.name}模块所有知识点</span>
      </label>
      ${kpCards}
    `;
  },

  _initHome() {
    this._currentMode = "custom";
    this.currentModule = this._getModule().id;
  },

  // 切换模块：更新高亮并重渲染知识点网格
  _selectModule(moduleId) {
    this._setCurrentModule(moduleId);
    this.currentModule = moduleId;
    document.querySelectorAll(".module-tab").forEach(el => {
      el.classList.toggle("active", el.dataset.module === moduleId);
    });
    const grid = document.getElementById("kp-grid");
    if (grid) {
      grid.innerHTML = this._renderKpGrid();
      const title = grid.closest(".home-section")?.querySelector(".section-title");
      if (title) {
        const module = this._getModule();
        title.innerHTML = `选择知识点 <span class="section-hint">（${module.name} 模块，可多选）</span>`;
      }
    }
  },

  _selectMode(mode) {
    this._currentMode = mode;
    document.querySelectorAll(".mode-tab").forEach(el => {
      el.classList.toggle("active", el.dataset.mode === mode);
    });
    const customConfig = document.getElementById("custom-config");
    const customOptions = document.getElementById("custom-options");
    if (mode === "quick") {
      customConfig.style.display = "none";
      customOptions.style.display = "none";
    } else {
      customConfig.style.display = "";
      customOptions.style.display = "";
    }
  },

  _toggleAllKp(checked) {
    document.querySelectorAll(".kp-checkbox").forEach(cb => {
      cb.checked = checked;
    });
  },

  async _startQuiz() {
    const settings = Storage.getSettings();
    if (!settings.apiKey) {
      this._toast("请先在设置中配置 API Key", "error");
      this.navigate("settings");
      return;
    }

    let kpNames, types, count, difficulty, moduleId;

    if (this._currentMode === "quick") {
      // 快速模式：从当前模块随机抽 3 个知识点
      const module = this._getModule();
      moduleId = module.id;
      const shuffled = [...module.knowledgePoints].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(3, shuffled.length));
      kpNames = selected.map(kp => kp.name);
      types = ["choice", "fill", "short"];
      count = 10;
      difficulty = "随机";
    } else {
      // 自定义模式：限定在当前模块内选择
      const module = this._getModule();
      moduleId = module.id;
      const moduleKpNames = new Set(module.knowledgePoints.map(kp => kp.name));
      kpNames = Array.from(document.querySelectorAll(".kp-checkbox:checked"))
        .map(cb => cb.value)
        .filter(name => moduleKpNames.has(name));
      if (kpNames.length === 0) {
        this._toast("请至少选择 1 个知识点", "error");
        return;
      }
      types = Array.from(document.querySelectorAll('.chip input:checked')).map(cb => cb.value);
      if (types.length === 0) {
        this._toast("请至少选择 1 种题型", "error");
        return;
      }
      count = parseInt(document.getElementById("question-count").value);
      difficulty = document.getElementById("question-difficulty").value;
    }

    // 显示加载状态
    const btn = document.getElementById("start-quiz-btn");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> 正在生成题目...';

    try {
      const questions = await Api.generateQuestions(kpNames, types, count, difficulty, moduleId);
      this.quizState = {
        questions,
        currentIndex: 0,
        answers: [],
        mode: this._currentMode,
        moduleId
      };
      Storage.clearProgress();
      this.navigate("quiz");
    } catch (e) {
      btn.disabled = false;
      btn.innerHTML = "🚀 开始练习";
      this._toast(`生成失败: ${e.message}`, "error");
    }
  },

  _resumeProgress() {
    const progress = Storage.getProgress();
    if (!progress) return;
    this.quizState = progress;
    this.navigate("quiz");
  },

  // ===== 答题页 =====

  _renderQuiz() {
    const { questions, currentIndex } = this.quizState;
    const q = questions[currentIndex];
    const total = questions.length;
    const progressPct = ((currentIndex) / total) * 100;

    let answerArea = "";
    if (q.type === "choice") {
      answerArea = q.options.map((opt, i) => `
        <label class="option-item" data-index="${i}" onclick="App._selectChoice(${i})">
          <span class="option-letter">${String.fromCharCode(65 + i)}</span>
          <span class="option-text">${this._escapeHtml(opt)}</span>
        </label>
      `).join("");
    } else if (q.type === "fill") {
      answerArea = `
        <input type="text" class="fill-input" id="fill-answer" placeholder="请输入答案..." 
               onkeydown="if(event.key==='Enter') App._submitAnswer()">
      `;
    } else if (q.type === "short") {
      answerArea = `
        <textarea class="short-input" id="short-answer" placeholder="请输入你的答案..." rows="6"></textarea>
      `;
    }

    const typeLabels = { choice: "选择题", fill: "填空题", short: "简答题" };
    const typeColors = { choice: "badge-blue", fill: "badge-green", short: "badge-purple" };
    const quizModule = QuizModules.find(m => m.id === this.quizState.moduleId);

    return `
      <div class="page-quiz">
        <div class="quiz-header">
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progressPct}%"></div>
          </div>
          <div class="quiz-progress-text">
            第 ${currentIndex + 1} / ${total} 题
          </div>
        </div>

        <div class="quiz-card" id="quiz-card">
          <div class="quiz-meta">
            ${quizModule ? `<span class="badge badge-module">${quizModule.icon} ${quizModule.name}</span>` : ""}
            <span class="badge ${typeColors[q.type]}">${typeLabels[q.type]}</span>
            <span class="badge badge-gray">${q.difficulty || "中等"}</span>
            <span class="badge badge-outline">${q.knowledgePoint}</span>
          </div>

          <div class="quiz-question">${this._escapeHtml(q.question)}</div>

          <div class="quiz-answer-area" id="answer-area">
            ${answerArea}
          </div>

          <div class="quiz-actions">
            <button class="btn btn-primary" id="submit-btn" onclick="App._submitAnswer()" disabled>
              提交答案
            </button>
            <button class="btn btn-text" onclick="App._quitQuiz()">退出</button>
          </div>
        </div>

        <div id="feedback-area"></div>
      </div>
    `;
  },

  _initQuiz() {
    const q = this.quizState.questions[this.quizState.currentIndex];
    if (q.type === "choice") {
      this._selectedChoice = null;
    } else if (q.type === "short") {
      // 简答题：输入内容后启用提交
      const textarea = document.getElementById("short-answer");
      if (textarea) {
        textarea.addEventListener("input", () => {
          document.getElementById("submit-btn").disabled = !textarea.value.trim();
        });
      }
    } else if (q.type === "fill") {
      const input = document.getElementById("fill-answer");
      if (input) {
        input.addEventListener("input", () => {
          document.getElementById("submit-btn").disabled = !input.value.trim();
        });
      }
    }
  },

  _selectChoice(index) {
    this._selectedChoice = index;
    document.querySelectorAll(".option-item").forEach((el, i) => {
      el.classList.toggle("selected", i === index);
    });
    document.getElementById("submit-btn").disabled = false;
  },

  async _submitAnswer() {
    const { questions, currentIndex } = this.quizState;
    const q = questions[currentIndex];
    let userAnswer = "";
    let isCorrect = false;
    let resultDetail = "";

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>';

    try {
      if (q.type === "choice") {
        userAnswer = this._selectedChoice;
        isCorrect = userAnswer === q.answer;
        resultDetail = isCorrect ? "✅ 回答正确！" : "❌ 回答错误";
      } else if (q.type === "fill") {
        userAnswer = document.getElementById("fill-answer").value.trim();
        const fillResult = this._checkFillAnswer(userAnswer, q.keywords || [q.answer], q.answer);
        isCorrect = fillResult.passed;
        resultDetail = isCorrect
          ? "✅ 回答正确！"
          : `❌ 关键词匹配未通过（匹配 ${fillResult.matched}/${fillResult.total}，需 ≥60%）`;
      } else if (q.type === "short") {
        userAnswer = document.getElementById("short-answer").value.trim();
        submitBtn.innerHTML = '<span class="spinner"></span> AI 评判中...';
        const evalResult = await Api.evaluateShortAnswer(q.question, userAnswer, q.answer, this.quizState.moduleId);
        isCorrect = evalResult.result === "correct";
        const resultMap = { correct: "✅ 回答正确", partial: "🟡 部分正确", wrong: "❌ 回答错误" };
        resultDetail = `${resultMap[evalResult.result] || "❌ 回答错误"}（得分: ${evalResult.score}）\n💬 ${evalResult.comment || ""}`;
      }

      // 记录答案
      this.quizState.answers.push({
        questionId: q.id,
        userAnswer,
        isCorrect,
        result: resultDetail
      });

      // 记录统计
      Storage.recordAnswer(q.knowledgePoint, q.type, isCorrect);

      // 错题加入错题本
      if (!isCorrect) {
        Storage.addWrongQuestion({
          ...q,
          userAnswer,
          userAnswerText: q.type === "choice" ? q.options[userAnswer] : userAnswer
        });
      }

      // 保存进度
      Storage.saveProgress(this.quizState);

      // 显示反馈
      this._showFeedback(q, userAnswer, isCorrect, resultDetail);

    } catch (e) {
      this._toast(`评判失败: ${e.message}`, "error");
      submitBtn.disabled = false;
      submitBtn.innerHTML = "提交答案";
    }
  },

  _checkFillAnswer(userAnswer, keywords, standardAnswer) {
    // 归一化：小写、去空白、全角转半角、去中英文标点
    const normalize = (s) => String(s || "")
      .toLowerCase()
      .replace(/[\s\u3000]+/g, "")
      .replace(/[\uFF01-\uFF5E]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
      .replace(/[.,/#!$%^&*;:{}=\-_`~()<>?"'[\]]|[。，、；：？！“”‘’（）【】《》]/g, "");

    const normUser = normalize(userAnswer);
    const normStd = normalize(standardAnswer);

    // 1. 与标准答案一致或包含标准答案 → 直接正确（关键词只是辅助）
    if (normStd && (normUser === normStd || normUser.includes(normStd))) {
      return { passed: true, matched: 1, total: 1 };
    }

    // 2. 关键词匹配：≥60% 算通过
    const kws = (keywords || []).map(normalize).filter(Boolean);
    if (kws.length === 0) {
      return { passed: false, matched: 0, total: 0 };
    }
    const matched = kws.filter(k => normUser.includes(k)).length;
    return { passed: matched / kws.length >= 0.6, matched, total: kws.length };
  },

  _showFeedback(q, userAnswer, isCorrect, resultDetail) {
    const feedbackArea = document.getElementById("feedback-area");
    const submitBtn = document.getElementById("submit-btn");

    let userAnswerDisplay = "";
    if (q.type === "choice") {
      userAnswerDisplay = `你的选择: ${String.fromCharCode(65 + userAnswer)}. ${q.options[userAnswer]}`;
    } else {
      userAnswerDisplay = `你的答案: ${this._escapeHtml(String(userAnswer))}`;
    }

    let correctAnswerDisplay = "";
    if (q.type === "choice") {
      correctAnswerDisplay = `正确答案: ${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`;
    } else {
      correctAnswerDisplay = `参考答案: ${this._escapeHtml(String(q.answer))}`;
    }

    feedbackArea.innerHTML = `
      <div class="feedback-card ${isCorrect ? "feedback-correct" : "feedback-wrong"}">
        <div class="feedback-result">${resultDetail.replace(/\n/g, "<br>")}</div>
        <div class="feedback-section">
          <div class="feedback-label">你的作答</div>
          <div class="feedback-content ${isCorrect ? "" : "content-wrong"}">${userAnswerDisplay}</div>
        </div>
        <div class="feedback-section">
          <div class="feedback-label">正确答案</div>
          <div class="feedback-content content-correct">${correctAnswerDisplay}</div>
        </div>
        <div class="feedback-section">
          <div class="feedback-label">📖 解析</div>
          <div class="feedback-explanation">${this._escapeHtml(q.explanation)}</div>
        </div>
      </div>
    `;

    const { currentIndex, questions } = this.quizState;
    const isLast = currentIndex === questions.length - 1;

    submitBtn.outerHTML = isLast
      ? `<button class="btn btn-primary" onclick="App._finishQuiz()">查看结果 →</button>`
      : `<button class="btn btn-primary" onclick="App._nextQuestion()">下一题 →</button>`;
  },

  _nextQuestion() {
    this.quizState.currentIndex++;
    Storage.saveProgress(this.quizState);
    this.navigate("quiz");
  },

  _finishQuiz() {
    Storage.clearProgress();
    this.navigate("result");
  },

  _quitQuiz() {
    if (confirm("确定退出吗？当前进度会保存，下次可以继续。")) {
      Storage.saveProgress(this.quizState);
      this.navigate("home");
    }
  },

  // ===== 结果页 =====

  _renderResult() {
    const { questions, answers } = this.quizState;
    const total = questions.length;
    const correct = answers.filter(a => a.isCorrect).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    const grade = pct >= 90 ? { text: "优秀！", color: "#16a34a", emoji: "🏆" }
                : pct >= 70 ? { text: "良好", color: "#2563eb", emoji: "👍" }
                : pct >= 60 ? { text: "及格", color: "#d97706", emoji: "💪" }
                : { text: "需加油", color: "#dc2626", emoji: "📚" };

    const wrongList = answers.filter(a => !a.isCorrect).map((a, i) => {
      const q = questions.find(qq => qq.id === a.questionId);
      return `
        <div class="result-wrong-item">
          <div class="result-wrong-q">${i + 1}. [${q.knowledgePoint}] ${this._escapeHtml(q.question)}</div>
          <div class="result-wrong-a content-wrong">你的答案: ${q.type === "choice" ? q.options[a.userAnswer] || "未作答" : this._escapeHtml(String(a.userAnswer))}</div>
          <div class="result-wrong-a content-correct">正确答案: ${q.type === "choice" ? q.options[q.answer] : this._escapeHtml(String(q.answer))}</div>
        </div>
      `;
    }).join("");

    return `
      <div class="page-result">
        <div class="result-hero">
          <div class="result-emoji">${grade.emoji}</div>
          <div class="result-score" style="color: ${grade.color}">${pct}<span class="result-score-unit">分</span></div>
          <div class="result-grade" style="color: ${grade.color}">${grade.text}</div>
          <div class="result-detail">共 ${total} 题，正确 ${correct} 题，错误 ${total - correct} 题</div>
        </div>

        ${wrongList ? `
          <div class="result-section">
            <h3 class="section-title">错题回顾</h3>
            ${wrongList}
          </div>
        ` : ""}

        <div class="result-actions">
          <button class="btn btn-primary" onclick="App.navigate('home')">再练一组</button>
          <button class="btn btn-text" onclick="App.navigate('stats')">查看学习统计</button>
        </div>
      </div>
    `;
  },

  _initResult() {
    // 记录练习历史
    const { questions, answers } = this.quizState;
    const correct = answers.filter(a => a.isCorrect).length;
    Storage.addHistory({
      total: questions.length,
      correct,
      knowledgePoints: [...new Set(questions.map(q => q.knowledgePoint))]
    });
  },

  // ===== 学习中心 =====

  _renderStats() {
    const stats = Storage.getStats();
    const moduleFilter = this.statsModuleFilter;

    // 按模块筛选范围计算数字面板
    let answered = stats.totalAnswered, correct = stats.totalCorrect;
    if (moduleFilter !== "all") {
      const module = QuizModules.find(m => m.id === moduleFilter);
      answered = 0; correct = 0;
      module.knowledgePoints.forEach(kp => {
        const s = stats.byKnowledgePoint[kp.name];
        if (s) { answered += s.answered; correct += s.correct; }
      });
    }
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

    const wrongQuestions = this._filteredWrongQuestions();

    const moduleFilterTabs = `
      <button class="module-tab ${moduleFilter === "all" ? "active" : ""}" data-module="all" onclick="App._setStatsModuleFilter('all')">
        <span class="module-icon">📚</span>
        <span class="module-name">全部</span>
      </button>
      ${QuizModules.map(m => `
        <button class="module-tab ${moduleFilter === m.id ? "active" : ""}" data-module="${m.id}" onclick="App._setStatsModuleFilter('${m.id}')">
          <span class="module-icon">${m.icon}</span>
          <span class="module-name">${m.name}</span>
        </button>
      `).join("")}
    `;

    return `
      <div class="page-stats">
        <div class="home-section stats-module-filter">
          <h2 class="section-title">学习范围</h2>
          <div class="module-tabs module-tabs-sm">
            ${moduleFilterTabs}
          </div>
        </div>

        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-value">${answered}</div>
            <div class="stat-label">${moduleFilter === "all" ? "总答题数" : "模块答题数"}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value ${accuracy >= 60 ? "text-green" : "text-red"}">${accuracy}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${wrongQuestions.length}</div>
            <div class="stat-label">错题数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.streak.current}</div>
            <div class="stat-label">连续天数</div>
          </div>
        </div>

        <div class="stats-charts">
          <div class="chart-card">
            <h3 class="chart-title">${moduleFilter === "all" ? "各模块掌握度" : "知识点掌握度"}</h3>
            <canvas id="radar-chart"></canvas>
            <div id="radar-empty" class="chart-empty" style="display:none">暂无该范围内的练习数据，先去刷几题吧～</div>
          </div>
          <div class="chart-card">
            <h3 class="chart-title">最近 7 天练习</h3>
            <canvas id="bar-chart"></canvas>
          </div>
        </div>

        <div class="wrong-book">
          <div class="wrong-book-header">
            <h3 class="section-title">错题本 <span class="section-hint">（${wrongQuestions.length} 题）</span></h3>
            ${wrongQuestions.length > 0 ? `
              <div class="wrong-book-actions">
                <select id="wrong-filter" class="select select-sm" onchange="App._filterWrongQuestions()">
                  <option value="">全部知识点</option>
                  ${this._wrongFilterOptions(wrongQuestions)}
                </select>
                <button class="btn btn-text btn-danger" onclick="App._clearWrongBook()">清空</button>
              </div>
            ` : ""}
          </div>

          <div id="wrong-list">
            ${this._renderWrongList(wrongQuestions)}
          </div>
        </div>
      </div>
    `;
  },

  // 按模块筛选错题
  _filteredWrongQuestions() {
    const moduleFilter = this.statsModuleFilter;
    let list = Storage.getWrongQuestions();
    if (moduleFilter !== "all") {
      const kpNames = new Set(
        KnowledgePoints.filter(kp => kp.moduleId === moduleFilter).map(kp => kp.name)
      );
      list = list.filter(q => kpNames.has(q.knowledgePoint));
    }
    return list;
  },

  // 错题知识点下拉选项（随模块筛选联动）
  _wrongFilterOptions(wrongQuestions) {
    const moduleFilter = this.statsModuleFilter;
    const kps = [...new Set(wrongQuestions.map(q => q.knowledgePoint))];
    if (moduleFilter !== "all") {
      const moduleKps = new Set(
        KnowledgePoints.filter(kp => kp.moduleId === moduleFilter).map(kp => kp.name)
      );
      return kps.filter(kp => moduleKps.has(kp)).map(kp =>
        `<option value="${kp}">${kp}</option>`
      ).join("");
    }
    return kps.map(kp => `<option value="${kp}">${kp}</option>`).join("");
  },

  _setStatsModuleFilter(filter) {
    this.statsModuleFilter = filter;
    this.navigate("stats");
  },

  _renderWrongList(wrongQuestions) {
    if (wrongQuestions.length === 0) {
      return '<div class="empty-state">🎉 还没有错题，继续练习吧！</div>';
    }
    return wrongQuestions.map((q, i) => `
      <div class="wrong-item" data-kp="${q.knowledgePoint}">
        <div class="wrong-item-header">
          <span class="badge badge-outline">${q.knowledgePoint}</span>
          <span class="badge badge-gray">${q.type === "choice" ? "选择" : q.type === "fill" ? "填空" : "简答"}</span>
          <button class="btn btn-text btn-sm" onclick="App._removeWrong('${q._hash}')">删除</button>
        </div>
        <div class="wrong-item-q">${this._escapeHtml(q.question)}</div>
        <div class="wrong-item-a content-wrong">你的答案: ${q.type === "choice" ? q.options?.[q.userAnswer] || "未作答" : this._escapeHtml(String(q.userAnswer || ""))}</div>
        <div class="wrong-item-a content-correct">正确答案: ${q.type === "choice" ? q.options?.[q.answer] || "" : this._escapeHtml(String(q.answer))}</div>
        ${q.explanation ? `<div class="wrong-item-explain">📖 ${this._escapeHtml(q.explanation)}</div>` : ""}
      </div>
    `).join("");
  },

  _initStats() {
    this._renderRadarChart();
    this._renderBarChart();
  },

  _renderRadarChart() {
    const stats = Storage.getStats();
    const moduleFilter = this.statsModuleFilter;
    const emptyEl = document.getElementById("radar-empty");
    const canvas = document.getElementById("radar-chart");
    if (!canvas) return;

    let labels, data;
    let hasData = false;

    if (moduleFilter === "all") {
      // 全部：按模块维度聚合
      labels = QuizModules.map(m => m.name);
      data = labels.map(name => {
        const module = QuizModules.find(m => m.name === name);
        let answered = 0, correct = 0;
        module.knowledgePoints.forEach(kp => {
          const s = stats.byKnowledgePoint[kp.name];
          if (s) { answered += s.answered; correct += s.correct; }
        });
        if (answered > 0) hasData = true;
        return answered > 0 ? Math.round((correct / answered) * 100) : 0;
      });
    } else {
      // 单模块：该模块的知识点维度
      const module = QuizModules.find(m => m.id === moduleFilter);
      labels = module.knowledgePoints.map(kp => kp.name);
      data = labels.map(name => {
        const s = stats.byKnowledgePoint[name];
        if (s && s.answered > 0) {
          hasData = true;
          return Math.round((s.correct / s.answered) * 100);
        }
        return 0;
      });
    }

    // 无数据时显示占位，销毁旧图表
    if (this.charts.radar) { this.charts.radar.destroy(); this.charts.radar = null; }
    if (!hasData) {
      canvas.style.display = "none";
      if (emptyEl) emptyEl.style.display = "";
      return;
    }
    canvas.style.display = "";
    if (emptyEl) emptyEl.style.display = "none";

    const ctx = canvas.getContext("2d");
    this.charts.radar = new Chart(ctx, {
      type: "radar",
      data: {
        labels,
        datasets: [{
          label: "正确率 (%)",
          data,
          backgroundColor: "rgba(37, 99, 235, 0.15)",
          borderColor: "rgba(37, 99, 235, 0.8)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(37, 99, 235, 1)",
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { stepSize: 20, font: { size: 10 } },
            pointLabels: { font: { size: 11 } }
          }
        }
      }
    });
  },

  _renderBarChart() {
    const stats = Storage.getStats();
    const today = Storage._today();
    const labels = [];
    const answeredData = [];
    const correctData = [];

    for (let i = 6; i >= 0; i--) {
      const date = Storage._dateOffset(-i);
      const d = stats.daily[date] || { answered: 0, correct: 0 };
      const dateLabel = date.slice(5); // MM-DD
      labels.push(dateLabel);
      answeredData.push(d.answered);
      correctData.push(d.correct);
    }

    const ctx = document.getElementById("bar-chart");
    if (!ctx) return;

    if (this.charts.bar) this.charts.bar.destroy();

    this.charts.bar = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "答题数",
            data: answeredData,
            backgroundColor: "rgba(37, 99, 235, 0.6)",
            borderRadius: 4
          },
          {
            label: "正确数",
            data: correctData,
            backgroundColor: "rgba(22, 163, 74, 0.6)",
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  },

  _filterWrongQuestions() {
    const filter = document.getElementById("wrong-filter").value;
    let wrongQuestions = this._filteredWrongQuestions();
    if (filter) wrongQuestions = wrongQuestions.filter(q => q.knowledgePoint === filter);
    document.getElementById("wrong-list").innerHTML = this._renderWrongList(wrongQuestions);
  },

  _removeWrong(hash) {
    Storage.removeWrongQuestion(hash);
    this.navigate("stats");
  },

  _clearWrongBook() {
    if (confirm("确定清空所有错题吗？此操作不可撤销。")) {
      Storage.clearWrongQuestions();
      this.navigate("stats");
      this._toast("错题本已清空", "info");
    }
  },

  // ===== 设置页 =====

  _renderSettings() {
    const settings = Storage.getSettings();
    const provider = Api.providers[settings.provider] || Api.providers.custom;

    const providerOptions = Object.entries(Api.providers).map(([key, p]) =>
      `<option value="${key}" ${key === settings.provider ? "selected" : ""}>${p.name}</option>`
    ).join("");

    const modelOptions = provider.models.length > 0
      ? provider.models.map(m =>
          `<option value="${m}" ${m === settings.model ? "selected" : ""}>${m}</option>`
        ).join("")
      : "";

    return `
      <div class="page-settings">
        <div class="settings-section">
          <h2 class="section-title">API 配置</h2>
          <div class="form-group">
            <label class="form-label">服务商</label>
            <select id="setting-provider" class="select" onchange="App._onProviderChange()">
              ${providerOptions}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">API Base URL</label>
            <input type="text" id="setting-baseurl" class="input" value="${settings.baseUrl || provider.baseUrl}" placeholder="https://api.example.com/v1">
          </div>
          <div class="form-group">
            <label class="form-label">API Key</label>
            <input type="password" id="setting-apikey" class="input" value="${settings.apiKey}" placeholder="sk-...">
          </div>
          <div class="form-group">
            <label class="form-label">模型</label>
            ${provider.models.length > 0 ? `
              <select id="setting-model" class="select">
                ${modelOptions}
              </select>
            ` : `
              <input type="text" id="setting-model" class="input" value="${settings.model}" placeholder="model-name">
            `}
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" onclick="App._testConnection()">测试连接</button>
            <button class="btn btn-primary" onclick="App._saveSettings()">保存设置</button>
          </div>
        </div>

        <div class="settings-section">
          <h2 class="section-title">练习偏好</h2>
          <div class="form-group">
            <label class="form-label">默认题目数量</label>
            <select id="setting-default-count" class="select">
              <option value="5" ${settings.defaultCount === 5 ? "selected" : ""}>5 题</option>
              <option value="10" ${settings.defaultCount === 10 ? "selected" : ""}>10 题</option>
              <option value="15" ${settings.defaultCount === 15 ? "selected" : ""}>15 题</option>
              <option value="20" ${settings.defaultCount === 20 ? "selected" : ""}>20 题</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">默认难度</label>
            <select id="setting-default-difficulty" class="select">
              <option value="随机" ${settings.defaultDifficulty === "随机" ? "selected" : ""}>随机</option>
              <option value="简单" ${settings.defaultDifficulty === "简单" ? "selected" : ""}>简单</option>
              <option value="中等" ${settings.defaultDifficulty === "中等" ? "selected" : ""}>中等</option>
              <option value="困难" ${settings.defaultDifficulty === "困难" ? "selected" : ""}>困难</option>
            </select>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="setting-show-explanation" ${settings.showExplanationImmediately ? "checked" : ""}>
              答题后立即显示解析
            </label>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" onclick="App._savePreferences()">保存偏好</button>
          </div>
        </div>

        <div class="settings-section">
          <h2 class="section-title">数据管理</h2>
          <div class="form-actions">
            <button class="btn btn-secondary" onclick="App._exportData()">导出数据</button>
            <button class="btn btn-secondary" onclick="App._importData()">导入数据</button>
            <button class="btn btn-text btn-danger" onclick="App._clearAllData()">清空所有数据</button>
          </div>
          <input type="file" id="import-file" accept=".json" style="display:none" onchange="App._handleImport(event)">
        </div>
      </div>
    `;
  },

  _initSettings() {
    // 无特殊初始化
  },

  _onProviderChange() {
    const providerKey = document.getElementById("setting-provider").value;
    const provider = Api.providers[providerKey];
    document.getElementById("setting-baseurl").value = provider.baseUrl;

    // 更新模型选择
    const modelGroup = document.getElementById("setting-model");
    if (provider.models.length > 0) {
      const select = document.createElement("select");
      select.id = "setting-model";
      select.className = "select";
      select.innerHTML = provider.models.map(m =>
        `<option value="${m}">${m}</option>`
      ).join("");
      modelGroup.replaceWith(select);
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.id = "setting-model";
      input.className = "input";
      input.placeholder = "model-name";
      modelGroup.replaceWith(input);
    }
  },

  async _testConnection() {
    this._saveSettings();
    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> 测试中...';
    const result = await Api.testConnection();
    btn.disabled = false;
    btn.innerHTML = "测试连接";
    this._toast(result.message, result.success ? "success" : "error");
  },

  _saveSettings() {
    const providerKey = document.getElementById("setting-provider").value;
    const settings = {
      ...Storage.getSettings(),
      provider: providerKey,
      baseUrl: document.getElementById("setting-baseurl").value.trim(),
      apiKey: document.getElementById("setting-apikey").value.trim(),
      model: document.getElementById("setting-model").value.trim()
    };
    Storage.saveSettings(settings);
    this._toast("设置已保存", "success");
  },

  _savePreferences() {
    const settings = {
      ...Storage.getSettings(),
      defaultCount: parseInt(document.getElementById("setting-default-count").value),
      defaultDifficulty: document.getElementById("setting-default-difficulty").value,
      showExplanationImmediately: document.getElementById("setting-show-explanation").checked
    };
    Storage.saveSettings(settings);
    this._toast("偏好已保存", "success");
  },

  _exportData() {
    const data = Storage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cpp-quiz-backup-${Storage._today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this._toast("数据已导出", "success");
  },

  _importData() {
    document.getElementById("import-file").click();
  },

  _handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        Storage.importData(data);
        this._toast("数据导入成功", "success");
        this.navigate("settings");
      } catch (err) {
        this._toast("导入失败: 文件格式错误", "error");
      }
    };
    reader.readAsText(file);
  },

  _clearAllData() {
    if (confirm("⚠️ 确定清空所有数据吗？包括设置、错题本、统计数据，此操作不可撤销！")) {
      Storage.clearAllData();
      this._toast("所有数据已清空", "info");
      this.navigate("home");
    }
  },

  // ===== 工具方法 =====

  _toast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  _escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = String(text);
    return div.innerHTML;
  }
};

// 启动应用
document.addEventListener("DOMContentLoaded", () => {
  App.navigate("home");
});
