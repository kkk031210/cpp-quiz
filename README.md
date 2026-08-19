# C++ 面试刷题助手

一个零依赖、纯前端的 C++ 面试刷题 Web 应用，帮助你在浏览器里系统地复习 C++ 面试知识点、自测答题，并借助大语言模型（LLM）生成与讲解题目。

> 项目地址：https://github.com/kkk031210/cpp-quiz

---

## ✨ 功能特性

- **首页**：按 17 个知识点分类浏览，快速进入对应专题的刷题。
- **答题模式**：支持「快速刷题」与「自定义选题」两种模式，逐题作答并即时判分。
- **学习中心**：基于答题数据生成统计图表（正确率、分类掌握度等），直观看到薄弱环节（使用 Chart.js）。
- **设置中心**：配置 LLM API（Provider / API Key / 模型），用于 AI 出题与解析。
- **知识点体系**：覆盖从 C++ 基础语法到 C++23 以及 Qt 的面试题树。
- **本地持久化**：答题记录与设置保存在浏览器 `localStorage`，刷新不丢失。

## 🧱 技术栈

- 原生 HTML / CSS / JavaScript（无框架、无构建步骤）
- [Chart.js](https://www.chartjs.org/)（通过 CDN 引入，用于学习中心图表）
- 浏览器 `localStorage` 做数据持久化
- LLM 调用采用 OpenAI 兼容格式，支持多 Provider

## 📁 目录结构

```
public/cppinterview/
├── index.html              # 应用入口（SPA 外壳 + 导航栏）
├── css/
│   └── style.css           # 全部样式
├── js/
│   ├── app.js              # 主应用：路由 / 首页 / 答题 / 学习中心 / 设置
│   ├── api.js              # LLM API 模块（DeepSeek / OpenAI / 通义千问 / 智谱 / 自定义）
│   ├── knowledgePoints.js  # C++ 面试知识点体系（17 个分类）
│   └── storage.js          # localStorage 读写封装
├── LICENSE                 # MIT 开源许可
├── LICENSE-SUPPLEMENT.md   # 开源许可补充协议（内容来源、转载署名、免责等）
└── README.md
```

## 🚀 快速开始

本项目为纯静态站点，**无需安装依赖、无需构建**。

方式一：直接打开

```
直接用浏览器打开 index.html 即可。
```

方式二：本地静态服务器（推荐，避免个别浏览器对本地文件协议的限制）

```bash
# Python
python -m http.server 8080

# 或 Node
npx serve .
```

然后访问 `http://localhost:8080`。

## ⚙️ 配置 LLM（可选）

学习中心 / AI 出题功能依赖外部大模型。进入应用内「设置」页：

1. 选择 Provider（DeepSeek / OpenAI / 通义千问 / 智谱清言 / 自定义）。
2. 填入对应的 API Key 与模型。
3. 保存后即可在答题中使用 AI 生成与讲解。

> API Key 仅保存在你本地浏览器的 `localStorage` 中，不会上传到本仓库或任何第三方服务器（除你所选的 LLM Provider 外）。

## 📚 知识点体系（17 类）

C++ 基础语法 · 指针与引用 · 面向对象编程 · 虚函数与多态 · 内存管理 · STL 容器 · STL 算法 · 模板与泛型 · 智能指针 · 并发与多线程 · 移动语义与完美转发 · 异常处理 · 类型特性与元编程 · C++11/14/17/20/23 新特性 · 设计模式 · 编译链接 · Qt 基础

## 📄 开源协议

本项目以 **MIT 许可**开源，详见 [`LICENSE`](./LICENSE)。

在此基础上，针对题库内容来源、转载署名、准确性免责等事项，另设 [`LICENSE-SUPPLEMENT.md`](./LICENSE-SUPPLEMENT.md)（开源许可补充协议）。**题库答案与解析仅供学习参考，不保证完全正确或符合最新招聘要求，不构成任何招聘 / 录用承诺。**
