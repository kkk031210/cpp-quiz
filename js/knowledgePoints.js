/**
 * 面试知识点体系（模块化）
 * 四大模块：C++ / Linux 应用 / 网络编程 / 数据库编程
 * 每个模块包含独立的知识点列表
 */

const QuizModules = [
  {
    id: "cpp",
    name: "C++",
    icon: "💻",
    description: "语言基础 · 面向对象 · 现代特性",
    knowledgePoints: [
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
    ]
  },
  {
    id: "linux",
    name: "Linux 应用",
    icon: "🐧",
    description: "系统编程 · 进程线程 · IPC · 调试",
    knowledgePoints: [
      {
        id: "linux_process",
        name: "进程与线程",
        icon: "🔄",
        description: "fork/exec、进程模型、pthread、守护进程",
        topics: ["fork", "exec", "僵尸进程", "孤儿进程", "pthread", "线程模型", "守护进程", "进程状态"]
      },
      {
        id: "linux_fileio",
        name: "文件与IO",
        icon: "📁",
        description: "open/read/write、文件描述符、fcntl、缓冲区",
        topics: ["open", "read", "write", "文件描述符", "fcntl", "IO缓冲", "文件锁", "lseek", "dup/dup2"]
      },
      {
        id: "linux_ipc",
        name: "进程间通信IPC",
        icon: "🔗",
        description: "pipe、共享内存、消息队列、信号量、Unix域套接字",
        topics: ["pipe", "FIFO", "共享内存", "消息队列", "信号量", "Unix域套接字", "mmap", "IPC对比"]
      },
      {
        id: "linux_signal",
        name: "信号机制",
        icon: "🔔",
        description: "sigaction、可重入函数、中断系统调用",
        topics: ["signal", "sigaction", "信号处理", "可重入", "中断系统调用", "sigwait", "实时信号"]
      },
      {
        id: "linux_memory",
        name: "Linux内存管理",
        icon: "🧠",
        description: "malloc实现、mmap、虚拟内存、内存映射",
        topics: ["malloc", "mmap", "虚拟内存", "页表", "内存映射", "brk", "OOM", "内存碎片"]
      },
      {
        id: "linux_debug",
        name: "性能与调试",
        icon: "🔍",
        description: "gdb、strace、core dump、perf、系统调用追踪",
        topics: ["gdb", "strace", "core dump", "perf", "valgrind", "pstack", "tcpdump", "性能分析"]
      }
    ]
  },
  {
    id: "network",
    name: "网络编程",
    icon: "🌐",
    description: "Socket · IO复用 · TCP · 高并发",
    knowledgePoints: [
      {
        id: "net_socket",
        name: "Socket基础",
        icon: "🔌",
        description: "TCP/UDP API、阻塞与非阻塞、字节序",
        topics: ["socket", "bind", "listen", "accept", "connect", "阻塞非阻塞", "字节序", "UDP编程", "shutdown"]
      },
      {
        id: "net_io_multiplex",
        name: "I/O多路复用",
        icon: "🔄",
        description: "select/poll/epoll、Reactor模型、事件驱动",
        topics: ["select", "poll", "epoll", "水平触发", "边缘触发", "Reactor", "ET/LT对比", "epoll底层"]
      },
      {
        id: "net_tcp",
        name: "TCP协议细节",
        icon: "📡",
        description: "三次握手/四次挥手、TIME_WAIT、粘包、keepalive",
        topics: ["三次握手", "四次挥手", "TIME_WAIT", "粘包拆包", "keepalive", "滑动窗口", "拥塞控制", "半关闭", "NAGLE"]
      },
      {
        id: "net_server_model",
        name: "并发服务器模型",
        icon: "🖥️",
        description: "多进程/多线程/线程池、Reactor/Proactor",
        topics: ["多进程模型", "多线程模型", "线程池", "Reactor", "Proactor", "半同步半异步", "one loop per thread"]
      },
      {
        id: "net_high_perf",
        name: "高性能I/O",
        icon: "🚀",
        description: "零拷贝、sendfile、mmap、SO_REUSEPORT、连接池",
        topics: ["零拷贝", "sendfile", "mmap", "SO_REUSEPORT", "SO_REUSEADDR", "连接池", "nginx模型", "异步IO"]
      },
      {
        id: "net_library",
        name: "网络库思想",
        icon: "📚",
        description: "muduo/libevent/Asio 设计要点、定时器、buffer设计",
        topics: ["muduo", "libevent", "Asio", "Reactor模式", "定时器", "Buffer设计", "半包处理", "心跳机制"]
      }
    ]
  },
  {
    id: "database",
    name: "数据库编程",
    icon: "🗄️",
    description: "SQL · 索引 · 事务 · 存储 · 缓存",
    knowledgePoints: [
      {
        id: "db_sql",
        name: "SQL基础",
        icon: "📝",
        description: "DDL/DML、连接查询、子查询、聚合与分组",
        topics: ["DDL", "DML", "INNER JOIN", "LEFT JOIN", "子查询", "GROUP BY", "HAVING", "视图", "存储过程"]
      },
      {
        id: "db_index",
        name: "索引与优化",
        icon: "📑",
        description: "B+树、执行计划、覆盖索引、慢查询优化",
        topics: ["B+树", "聚簇索引", "二级索引", "执行计划", "覆盖索引", "最左前缀", "慢查询", "索引失效"]
      },
      {
        id: "db_transaction",
        name: "事务与锁",
        icon: "🔐",
        description: "ACID、隔离级别、MVCC、行锁表锁、死锁",
        topics: ["ACID", "隔离级别", "MVCC", "行锁", "表锁", "间隙锁", "死锁", "幻读", "乐观锁", "悲观锁"]
      },
      {
        id: "db_engine",
        name: "存储引擎",
        icon: "⚙️",
        description: "InnoDB架构、redo/undo/binlog、WAL、刷盘策略",
        topics: ["InnoDB", "redo log", "undo log", "binlog", "WAL", "两阶段提交", "buffer pool", "页结构"]
      },
      {
        id: "db_programming",
        name: "连接池与编程",
        icon: "🧩",
        description: "预处理语句、连接池、ORM思想、SQL注入防护",
        topics: ["预处理语句", "连接池", "ORM", "SQL注入", "事务编程", "批量操作", "读写分离"]
      },
      {
        id: "db_cache",
        name: "缓存设计",
        icon: "⚡",
        description: "Redis数据结构、穿透/雪崩/击穿、缓存一致性",
        topics: ["Redis数据结构", "缓存穿透", "缓存雪崩", "缓存击穿", "缓存一致性", "过期策略", "布隆过滤器", "分布式锁"]
      }
    ]
  }
];

/**
 * 扁平化知识点列表（兼容旧代码）
 * 每个知识点附加 moduleId / moduleName 字段
 */
const KnowledgePoints = QuizModules.flatMap(m =>
  m.knowledgePoints.map(kp => ({ ...kp, moduleId: m.id, moduleName: m.name }))
);
