/**
 * LocalStorage 存储模块
 * 管理：设置、错题本、学习统计、练习记录
 */

const Storage = {
  KEYS: {
    SETTINGS: "cpp_quiz_settings",
    WRONG_QUESTIONS: "cpp_quiz_wrong_questions",
    STATS: "cpp_quiz_stats",
    HISTORY: "cpp_quiz_history",
    PROGRESS: "cpp_quiz_progress"
  },

  // ===== 设置 =====

  getSettings() {
    return this._get(this.KEYS.SETTINGS, {
      provider: "deepseek",
      apiKey: "",
      baseUrl: "",
      model: "",
      defaultCount: 10,
      defaultDifficulty: "随机",
      showExplanationImmediately: true
    });
  },

  saveSettings(settings) {
    this._set(this.KEYS.SETTINGS, settings);
  },

  // ===== 错题本 =====

  getWrongQuestions() {
    return this._get(this.KEYS.WRONG_QUESTIONS, []);
  },

  addWrongQuestion(question) {
    const list = this.getWrongQuestions();
    // 避免重复（用题目内容哈希）
    const hash = this._hashQuestion(question);
    if (!list.find(q => q._hash === hash)) {
      question._hash = hash;
      question._addedAt = Date.now();
      list.push(question);
      this._set(this.KEYS.WRONG_QUESTIONS, list);
    }
  },

  removeWrongQuestion(hash) {
    const list = this.getWrongQuestions().filter(q => q._hash !== hash);
    this._set(this.KEYS.WRONG_QUESTIONS, list);
  },

  clearWrongQuestions() {
    this._set(this.KEYS.WRONG_QUESTIONS, []);
  },

  // ===== 学习统计 =====

  getStats() {
    return this._get(this.KEYS.STATS, {
      totalAnswered: 0,
      totalCorrect: 0,
      byKnowledgePoint: {}, // { "指针与引用": { answered: 10, correct: 7 } }
      byType: { choice: { answered: 0, correct: 0 }, fill: { answered: 0, correct: 0 }, short: { answered: 0, correct: 0 } },
      daily: {}, // { "2026-08-18": { answered: 20, correct: 15 } }
      streak: { current: 0, lastDate: null, best: 0 }
    });
  },

  recordAnswer(knowledgePoint, type, isCorrect) {
    const stats = this.getStats();
    const today = this._today();

    // 总计
    stats.totalAnswered++;
    if (isCorrect) stats.totalCorrect++;

    // 按知识点
    if (!stats.byKnowledgePoint[knowledgePoint]) {
      stats.byKnowledgePoint[knowledgePoint] = { answered: 0, correct: 0 };
    }
    stats.byKnowledgePoint[knowledgePoint].answered++;
    if (isCorrect) stats.byKnowledgePoint[knowledgePoint].correct++;

    // 按题型
    if (!stats.byType[type]) {
      stats.byType[type] = { answered: 0, correct: 0 };
    }
    stats.byType[type].answered++;
    if (isCorrect) stats.byType[type].correct++;

    // 按天
    if (!stats.daily[today]) {
      stats.daily[today] = { answered: 0, correct: 0 };
    }
    stats.daily[today].answered++;
    if (isCorrect) stats.daily[today].correct++;

    // 连续天数
    if (stats.streak.lastDate !== today) {
      const yesterday = this._dateOffset(-1);
      if (stats.streak.lastDate === yesterday) {
        stats.streak.current++;
      } else {
        stats.streak.current = 1;
      }
      stats.streak.lastDate = today;
      if (stats.streak.current > stats.streak.best) {
        stats.streak.best = stats.streak.current;
      }
    }

    this._set(this.KEYS.STATS, stats);
  },

  // ===== 练习记录 =====

  getHistory() {
    return this._get(this.KEYS.HISTORY, []);
  },

  addHistory(record) {
    const list = this.getHistory();
    list.unshift({ ...record, timestamp: Date.now() });
    // 保留最近 100 条
    if (list.length > 100) list.length = 100;
    this._set(this.KEYS.HISTORY, list);
  },

  // ===== 进度保存（中途退出时） =====

  getProgress() {
    return this._get(this.KEYS.PROGRESS, null);
  },

  saveProgress(progress) {
    this._set(this.KEYS.PROGRESS, progress);
  },

  clearProgress() {
    this._remove(this.KEYS.PROGRESS);
  },

  // ===== 数据管理 =====

  exportData() {
    return {
      settings: this.getSettings(),
      wrongQuestions: this.getWrongQuestions(),
      stats: this.getStats(),
      history: this.getHistory(),
      exportedAt: new Date().toISOString()
    };
  },

  importData(data) {
    if (data.settings) this._set(this.KEYS.SETTINGS, data.settings);
    if (data.wrongQuestions) this._set(this.KEYS.WRONG_QUESTIONS, data.wrongQuestions);
    if (data.stats) this._set(this.KEYS.STATS, data.stats);
    if (data.history) this._set(this.KEYS.HISTORY, data.history);
  },

  clearAllData() {
    Object.values(this.KEYS).forEach(k => this._remove(k));
  },

  // ===== 内部工具 =====

  _get(key, defaultValue) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage write error:", e);
    }
  },

  _remove(key) {
    localStorage.removeItem(key);
  },

  _hashQuestion(q) {
    const str = (q.type || "") + "|" + (q.question || "");
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return "h" + Math.abs(hash).toString(36);
  },

  _today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  _dateOffset(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
};
