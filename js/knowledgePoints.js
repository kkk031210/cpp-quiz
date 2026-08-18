/**
 * C++ 面试知识点体系
 * 17 个分类，覆盖 C++ 基础到 C++23 + Qt
 */
const KnowledgePoints = [
  {
    id: "basics",
    name: "C++基础语法",
    icon: "🔧",
    description: "const/static/inline、类型转换、作用域、初始化列表",
    topics: ["const", "static", "inline", "constexpr", "类型转换", "作用域", "初始化列表", "extern"]
  },
  {
    id: "pointer_ref",
    name: "指针与引用",
    icon: "📌",
    description: "指针运算、引用本质、函数指针、空指针与野指针",
    topics: ["指针运算", "引用本质", "函数指针", "空指针", "野指针", "多级指针", "引用折叠"]
  },
  {
    id: "oop",
    name: "面向对象编程",
    icon: "🧱",
    description: "封装/继承/多态、构造析构、拷贝构造、赋值运算符",
    topics: ["封装", "继承", "多态", "构造函数", "析构函数", "拷贝构造", "赋值运算符", "三/五/零法则"]
  },
  {
    id: "virtual",
    name: "虚函数与多态",
    icon: "⚡",
    description: "虚函数表、纯虚函数、虚析构函数、override/final",
    topics: ["虚函数表", "纯虚函数", "虚析构函数", "override", "final", "动态绑定", "抽象类"]
  },
  {
    id: "memory",
    name: "内存管理",
    icon: "💾",
    description: "new/delete、堆栈区别、内存泄漏、内存对齐",
    topics: ["new/delete", "malloc/free", "堆栈区别", "内存泄漏", "内存对齐", "placement new", "allocator"]
  },
  {
    id: "smart_ptr",
    name: "智能指针",
    icon: "🔒",
    description: "unique_ptr、shared_ptr、weak_ptr、循环引用",
    topics: ["unique_ptr", "shared_ptr", "weak_ptr", "循环引用", "make_unique", "make_shared", "自定义删除器"]
  },
  {
    id: "stl",
    name: "STL容器",
    icon: "📦",
    description: "vector/map/set底层、迭代器失效、emplace vs push_back",
    topics: ["vector扩容", "map底层", "set底层", "unordered_map", "迭代器失效", "emplace", "push_back", "allocator"]
  },
  {
    id: "template",
    name: "模板与泛型",
    icon: "📐",
    description: "函数模板/类模板、模板特化、SFINAE、变参模板",
    topics: ["函数模板", "类模板", "全特化", "偏特化", "SFINAE", "变参模板", "if constexpr", "concepts"]
  },
  {
    id: "move_semantics",
    name: "移动语义与右值引用",
    icon: "🚀",
    description: "右值引用、move/forward、移动构造、完美转发",
    topics: ["右值引用", "std::move", "std::forward", "移动构造", "完美转发", "引用折叠", "万能引用"]
  },
  {
    id: "lambda",
    name: "Lambda与函数式",
    icon: "🔥",
    description: "捕获方式、返回类型推导、std::function、std::bind",
    topics: ["Lambda捕获", "返回类型推导", "std::function", "std::bind", "闭包", "泛型Lambda"]
  },
  {
    id: "multithreading",
    name: "多线程并发",
    icon: "🧵",
    description: "thread/mutex/条件变量、死锁、atomic、锁机制",
    topics: ["std::thread", "mutex", "lock_guard", "unique_lock", "条件变量", "死锁", "atomic", "future/promise", "内存序"]
  },
  {
    id: "compile",
    name: "编译链接",
    icon: "🔗",
    description: "编译过程、头文件、链接错误、ODR",
    topics: ["预处理", "编译", "汇编", "链接", "头文件", "ODR", "链接错误", "动态库静态库", "符号可见性"]
  },
  {
    id: "cpp11_14",
    name: "C++11/14新特性",
    icon: "🆕",
    description: "auto、nullptr、范围for、constexpr、decltype、强类型enum、委托构造",
    topics: ["auto", "nullptr", "范围for", "decltype", "强类型enum", "委托构造", "继承构造", "二进制字面量", "constexpr"]
  },
  {
    id: "cpp17",
    name: "C++17新特性",
    icon: "🆕",
    description: "structured binding、optional/variant/any、if constexpr、fold expressions、string_view",
    topics: ["结构化绑定", "std::optional", "std::variant", "std::any", "if constexpr", "fold表达式", "string_view", "filesystem", "并行STL"]
  },
  {
    id: "cpp20",
    name: "C++20新特性",
    icon: "🆕",
    description: "concepts、ranges、coroutines、modules、三路比较、格式化库",
    topics: ["concepts", "ranges", "协程", "modules", "三路比较<=>", "std::format", "consteval", "constinit", "指定初始化"]
  },
  {
    id: "cpp23",
    name: "C++23新特性",
    icon: "🆕",
    description: "std::expected、std::print、deducing this、if consteval、std::span扩展",
    topics: ["std::expected", "std::print", "deducing this", "if consteval", "std::span", "std::mdspan", "静态call operator", "显式this参数"]
  },
  {
    id: "qt",
    name: "Qt基础",
    icon: "🎨",
    description: "信号与槽机制、QObject生命周期、事件循环、QString、QPointer、moc原理",
    topics: ["信号与槽", "QObject生命周期", "事件循环", "QString", "QPointer", "Q_OBJECT宏", "moc原理", "父子对象树", "QML", "Qt智能指针"]
  }
];
