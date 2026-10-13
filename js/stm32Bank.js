/**
 * STM32 内置题库（离线，无需 API Key）
 * 依据粤嵌 STM32 课程笔记 16 章整理，题目与解析均忠实于笔记内容
 *
 * 数据结构：
 * [
 *   {
 *     id, name, icon, description,     // 章节信息，name 必须与 knowledgePoints 中的知识点名称一致
 *     questions: [
 *       {
 *         type,          // "choice" 选择题 | "fill" 填空题 | "short" 简答题
 *         question,      // 题干
 *         options,       // 仅选择题：选项数组
 *         answer,        // 选择题为正确选项下标(number)；填空/简答为标准答案(string)
 *         keywords,      // 填空/简答：用于要点匹配判分，必须从标准答案中提取
 *         explanation,   // 详细解析
 *         difficulty     // "简单" | "中等" | "困难"
 *       }
 *     ]
 *   }
 * ]
 * 注意：字符串中的换行一律使用 \n 转义，不得出现真实换行
 */

const Stm32Bank = [
  // ==================== 一、GPIO ====================
  {
    id: "stm32_gpio",
    name: "GPIO",
    icon: "🔌",
    description: "工作模式 · 引脚命名 · LED/按键/蜂鸣器驱动",
    questions: [
      {
        type: "choice",
        question: "STM32F407ZET6 一共有 144 个引脚，其中 GPIO 口的数量是多少？",
        options: ["144 个", "112 个", "114 个", "128 个"],
        answer: 2,
        explanation: "144 是芯片的全部引脚数，但并不是所有引脚都是 GPIO。STM32F407ZET6 的 GPIO 数量为 16×7+2 = 114 个。GPIO 引脚划分为「组号 + 引脚号」，命名规则为 PXY，X 为组号（A/B/C…），Y 为引脚号（0-15）。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "关于 STM32 开漏输出模式的特点，下列描述正确的是？",
        options: [
          "既能输出高电平，也能输出低电平",
          "只能输出低电平，不能输出高电平",
          "只能输出高电平，不能输出低电平",
          "输出能力与推挽输出完全一致"
        ],
        answer: 1,
        explanation: "开漏输出只能主动输出低电平，无法主动输出高电平，要得到高电平必须依靠外部上拉电阻。推挽输出则既能输出高电平也能输出低电平。复用推挽与复用开漏的特性和普通推挽/开漏一致，区别只在于引脚由片上外设（如 SPI、IIC）而非 GPIO 控制。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "板载按键 KEY0 接在 PA0 上，另一端接地，按下时引脚为低电平。该引脚应配置为哪种模式？",
        options: ["浮空输入", "上拉输入", "下拉输入", "模拟输入"],
        answer: 1,
        explanation: "按键一端接 GPIO、另一端接 GND，未按下时引脚悬空，必须靠上拉电阻把空闲电平拉高以确定状态：未按下读到高电平（松开），按下读到低电平（按下）。笔记中特别强调「内外上下拉保持一致」，即外部已有上拉时内部也配置为上拉，避免两边冲突。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "STM32 数字电路中供电为 3.3V，判定为高电平的电压范围是？",
        options: ["0V ~ 0.99V", "2.3V ~ 3.3V", "0.99V ~ 2.3V", "2.0V ~ 3.3V"],
        answer: 1,
        explanation: "高电平：VDD×0.7 = 3.3×0.7 = 2.3V 到 3.3V；低电平：VDD×0.3 = 0.99V 到 0V。中间的 0.99V~2.3V 属于不确定区域，实际电路中要避免信号长时间停留在该区间。笔记中特别提示：所有 MCU 开发都必须依赖 datasheet，需要具备英文开发手册的阅读能力。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "GPIO 命名规则 PXY 中，X 代表 ______，Y 代表 ______。",
        answer: "组号、引脚号",
        keywords: ["组号", "引脚号"],
        explanation: "STM32 的 GPIO 引脚划分为「组号（A/B/C/D/E/F/G/H）+ 引脚（0-15）」。例如 PA0 表示 A 组第 0 号引脚，PF9 表示 F 组第 9 号引脚。板载 LED0 接 PF9，就是 F 组的第 9 号引脚。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "上拉输入模式下引脚空闲时读到 ______ 电平，下拉输入模式下引脚空闲时读到 ______ 电平。",
        answer: "高、低",
        keywords: ["高", "低"],
        explanation: "上拉输入：空闲时读到高电平；下拉输入：空闲时读到低电平；浮空输入：电平高低完全取决于外部输入，引脚悬空时电平不确定。模拟输入：ADC 模数转换专用模式。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "STM32 中专门为 ADC 模数转换设计的 GPIO 输入模式是 ______ 模式。",
        answer: "模拟输入",
        keywords: ["模拟输入"],
        explanation: "模拟输入是 ADC 模数转换的专用模式。使用 ADC 采集滑动变阻器电压时，PA5（ADC1_IN5/ADC2_IN5）就配置为模拟输入。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "对 GPIO 进行任何配置之前，必须先使能该 GPIO 组对应的 ______，也就是让 GPIO 口由休眠变为唤醒，否则所有配置都不生效。",
        answer: "时钟",
        keywords: ["时钟"],
        explanation: "芯片的外设和模块上电后处于休眠状态（为了低功耗），且不能借助传统开关量控制，而是借助时钟控制，必须通过 RCC 时钟控制寄存器开启时钟把外设唤醒，配置才会生效。这是驱动 LED、按键、串口等所有外设软件流程的第一步。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "MCU 的开发方式经历了从寄存器开发到库函数开发，再到 ______ 开发的演进。",
        answer: "HAL",
        keywords: ["HAL"],
        explanation: "笔记给出的演进路线：寄存器开发 → 库函数开发 → HAL 开发。寄存器开发最贴近硬件但可读性差，库函数开发在两者之间取得平衡，HAL 库抽象层次最高、跨系列可移植性最好，但代码体积和时序开销也最大。",
        difficulty: "简单"
      },
      {
        type: "short",
        question: "对比上拉输入、下拉输入、浮空输入三种模式的区别，并说明各自适用的场景。",
        answer: "上拉输入：引脚空闲时读到高电平，适用于「按键一端接引脚、另一端接地」的场合，能避免引脚悬空导致电平不定。\n下拉输入：引脚空闲时读到低电平，适用于「按键一端接引脚、另一端接 VCC」的场合。\n浮空输入：不接入内部上下拉电阻，引脚电平完全由外部输入决定，适用于外部信号本身已有确定上下拉驱动的场景（如传感器输出、串口 RX 引脚）；缺点是引脚悬空时电平不确定、易受干扰。",
        keywords: ["上拉", "下拉", "浮空", "高电平", "低电平", "外部"],
        explanation: "三者本质区别在于引脚空闲（无外部驱动）时的默认电平由谁决定。面试时建议补充：内部上下拉的阻值较大、驱动能力弱，所以板载按键电路通常还配外部上拉，配置时要做到内外上下拉一致，否则会形成分压导致电平异常。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "说明推挽输出与开漏输出的区别，并解释开漏输出为什么适合总线型应用（如 IIC）。",
        answer: "推挽输出：内部上下两个管子配合工作，既能主动输出高电平，也能主动输出低电平，驱动能力强。\n开漏输出：只能主动把电平拉低，输出高电平必须依靠外部上拉电阻。\n开漏适合总线的两个原因：一是多个设备的输出引脚可以并联挂到同一根总线上，任何设备拉低总线即为低电平，无人拉低时由上拉电阻恢复高电平，实现「线与」逻辑；二是若用推挽输出并联，当一方输出高、另一方输出低时会形成短路，烧毁 GPIO。",
        keywords: ["推挽", "开漏", "上拉电阻", "线与", "短路"],
        explanation: "这是 IIC 相关面试题的基础。开漏的代价是上升沿由 RC 充电决定，边沿变缓，因此想要更高速率需要减小上拉电阻阻值（但会增加功耗）。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "以驱动板载 LED0（PF9，低电平点亮）为例，描述 GPIO 软件实现的完整步骤，并说明其中「使配置生效」为什么不能省略。",
        answer: "完整四步：\n1）使能对应 GPIO 组的时钟：让 GPIO 口由休眠变为唤醒（供电）；\n2）设置功能脚位：查看原理图得到 LED0 为 PF9，配置为推挽输出；\n3）使配置生效：把结构体中的配置真正写入硬件寄存器；\n4）根据电路逻辑完成控制：LED 为低电平点亮、高电平关闭，所以拉低引脚点亮、拉高引脚熄灭。\n第三步不能省略的原因：结构体只是内存中的配置数据，只有调用配置写入函数后配置才会写入寄存器从而真正生效；跳过这一步，引脚的复用、模式、速度等参数都保持复位默认值，外设不会有预期反应。",
        keywords: ["时钟", "推挽", "配置生效", "寄存器", "低电平"],
        explanation: "笔记总结的库函数编程规律：外设配置步骤是固定的（结构体配置 → 使配置生效），函数命名也有规律（外设名_函数名，如 GPIO_SetBits、GPIO_ResetBits、GPIO_ReadInputDataBit）。排查外设不工作时，优先检查时钟是否使能、配置是否生效。",
        difficulty: "简单"
      }
    ]
  },

  // ==================== 二、时钟体系 ====================
  {
    id: "stm32_clock",
    name: "时钟体系",
    icon: "⏰",
    description: "时钟源 · 总线频率 · 启动流程",
    questions: [
      {
        type: "choice",
        question: "STM32F407 中 APB1 与 APB2 总线的最大频率分别是多少？",
        options: ["84MHz、42MHz", "42MHz、84MHz", "168MHz、84MHz", "42MHz、168MHz"],
        answer: 1,
        explanation: "AHB = HCLK = 168MHz（高级高速总线 AHB1、AHB2 最大 168MHz）；AHB/2 = APB2 = 84MHz；AHB/4 = APB1 = 42MHz。使用某个外设前必须先查手册确认它挂在哪条总线上，再用对应的 RCC 函数开启时钟。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "独立看门狗（IWDG）使用的时钟源是哪一个？",
        options: ["HSI 16MHz", "HSE 8MHz", "LSI 32KHz", "LSE 32.768KHz"],
        answer: 2,
        explanation: "两大次时钟源的分工：LSI（32KHz）主要给独立看门狗使用；LSE（32.768KHz）主要给 RTC 时钟使用。32.768KHz 是 2 的 15 次方，经过 15 级二分频正好得到 1Hz，非常适合计时。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "关于 HSE 外部高速晶振，芯片手册要求的频率范围是？",
        options: ["4MHz ~ 16MHz", "4MHz ~ 26MHz", "8MHz ~ 26MHz", "8MHz ~ 168MHz"],
        answer: 1,
        explanation: "三大主时钟源：HSI 内部 16MHz（芯片起振频率符合要求）、HSE 外部 8MHz（芯片手册要求范围 4-26MHz，实际开发板通常焊 8MHz）、PLL 锁相环倍频后可达 168MHz（芯片运行最大频率）。时钟的产生方式有晶振（晶体振荡器）、RC 电阻电容振荡器、OSC 石英晶体振荡器等。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "关于定时器外设的时钟频率，下列说法正确的是？",
        options: [
          "定时器频率固定等于所挂总线频率",
          "当总线分频系数不为 1 时，定时器外设频率要乘以 2",
          "当总线分频系数不为 1 时，定时器外设频率要除以 2",
          "定时器不依赖总线时钟，独立工作"
        ],
        answer: 1,
        explanation: "定时器外设与挂载在同一条总线上的其他外设不同：当分频系数不为 1 时，定时器外设的频率要 ×2。例如 TIM6 挂在 APB1（42MHz）上，其实际时钟为 42×2 = 84MHz。做定时时间计算时忽略这一点会导致定时时长差一倍。",
        difficulty: "困难"
      },
      {
        type: "fill",
        question: "STM32 的三大主时钟源是 ______、______ 和 PLL 锁相环倍频。",
        answer: "HSI、HSE",
        keywords: ["HSI", "HSE"],
        explanation: "三大主时钟源：HSI（内部 16MHz）、HSE（外部 8MHz）、PLL 锁相环倍频到 168MHz。两大次时钟源：LSI（32KHz，主要给独立看门狗使用）、LSE（32.768KHz，主要给 RTC 时钟使用）。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "STM32F407 中 AHB = HCLK = ______ MHz，其中 AHB/2 = APB2 = 84MHz。",
        answer: "168",
        keywords: ["168"],
        explanation: "时钟树的分频关系：AHB = HCLK = 168MHz；AHB/2 = APB2 = 84MHz；AHB/4 = APB1 = 42MHz。开启外设时钟时使用的 AHB1/AHB2/APB1/APB2 分类就对应这几条总线，对应函数如 RCC_AXBXPeriphClockCmd()。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "SysTick 系统滴答定时器是一个 ______ 位的向下递减计数器，计数范围是 2^24-1 到 0。",
        answer: "24",
        keywords: ["24"],
        explanation: "SysTick 的两个关键参数：计数频率（AHB/8 = 168/8 = 21MHz 或 HCLK = 168MHz）与计数范围（24 位向下递减计数器，2^24-1 递减到 0）。支持中断方式与非中断方式。频率换算关系：1Hz = 1S、1KHz = 1MS、1MHz = 1US。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "在 STM32 中 ______ 才是第一个被执行的入口，而不是 main 函数；它首先初始化堆栈指针 SP，并把 PC 程序计数器指向自身。",
        answer: "Reset_Handler",
        keywords: ["Reset_Handler"],
        explanation: "startup 启动文件提供 C 语言运行环境（STM32 裸机无操作系统，C 语言运行环境必须借助堆栈，而堆栈由启动文件准备）。流程为：初始化 SP → 系统复位并设置 PC = Reset_Handler → 初始化中断向量表 → 配置系统时钟（systeminit → syscoreclock 初始化 APB、AHB、PLL）→ 调用 __main 完成软件堆栈初始化 → 最终才调用 main()。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "为什么 STM32 的外设和模块一上电处于休眠状态？要使用某个外设时应该怎么做？",
        answer: "外设上电即休眠的目的是为了降低功耗，并且这些外设不能借助传统的开关量进行控制，而是借助时钟进行控制。\n使用方法：\n1）先在芯片参考手册上确认目标外设挂在哪条时钟总线上（AHB1、AHB2、APB1 或 APB2）；\n2）使用固定的 RCC 时钟控制寄存器函数开启时钟，如 RCC_AXBXPeriphClockCmd()，使外设由休眠变为唤醒；\n3）之后再配置该外设的引脚、模式等参数，配置才会生效。",
        keywords: ["休眠", "低功耗", "时钟", "总线", "RCC"],
        explanation: "这是嵌入式笔试高频题，也是实际调试中最常见的坑：忘记开时钟，外设怎么配都没反应。排错顺序建议：时钟 → 引脚复用 → 配置是否生效 → 电路逻辑。",
        difficulty: "简单"
      },
      {
        type: "short",
        question: "在 STM32 中 main 是第一个被执行的函数吗？请完整描述 STM32 的启动流程。",
        answer: "不是。main 不是第一个被执行的函数，startup 启动文件中的 Reset_Handler 才是入口。启动流程：\n1）初始化堆栈指针 SP —— 主要是为了提供 C 语言运行环境（Set the initial SP）；\n2）进行系统复位，设置 PC 程序计数器指向 Reset_Handler —— PC 指向哪里程序就从哪里运行；\n3）初始化中断向量表 —— 所有中断服务函数无参数、无返回值且名称固定；\n4）配置系统时钟与外部 SRAM（systeminit → syscoreclock 初始化 APB、AHB、PLL 等）；\n5）调用 __main 进行软件堆栈初始化，进而才调用 main() 函数。",
        keywords: ["不是", "Reset_Handler", "堆栈指针", "中断向量表", "main"],
        explanation: "这是笔记中明确标注的面试题。要点在于理解裸机环境下没有操作系统提供 C 运行环境，堆栈指针、向量表都要靠启动文件准备，系统时钟也要在 main 之前配置好。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "在 STM32F4 上如何把主频配置为 168MHz？需要修改哪些文件与宏定义？",
        answer: "主要修改两处与外部晶振（HSE）相关的定义：\n1）打开 system_stm32f4xx.c（由 startup 启动文件调用）的第 254 行，将 #define PLL_M 8 改为与板上晶振匹配的分频值；\n2）打开 stm32f4xx.h 的第 127 行，将 #define HSE_VALUE (uint32_t 8000000) 改为实际外部晶振频率（开发板一般是 8MHz）。\n此外还需在时钟配置中设置好 AHB、APB1、APB2 的分频，保证不超过各自最大频率（AHB 168MHz、APB2 84MHz、APB1 42MHz），使 PLL 倍频输出达到 168MHz。",
        keywords: ["system_stm32f4xx.c", "PLL_M", "HSE_VALUE", "stm32f4xx.h"],
        explanation: "验证方法（笔记中的任务练习）：用示波器配合排针输出 GPIO 高低电平 + DELAY 函数观察波形，再用按键动态切换 HSI、HSE、PLL 三种时钟源观察现象变化，这属于可以写在简历上的动手经验。",
        difficulty: "困难"
      }
    ]
  },

  // ==================== 三、中断体系 ====================
  {
    id: "stm32_interrupt",
    name: "中断体系",
    icon: "🔔",
    description: "NVIC · EXTI · 前后台系统",
    questions: [
      {
        type: "choice",
        question: "STM32 中 GPIO 引脚与 EXTI 外部中断线的连接是借助什么完成的？",
        options: ["GPIO 控制寄存器", "SYSCFG 寄存器", "NVIC 寄存器", "RCC 时钟寄存器"],
        answer: 1,
        explanation: "连接方式为 PXY → SYSCFG → EXTIY，例如 PA0 → SYSCFG → EXTI0。因此配置外部中断时必须先使能 SYSCFG 时钟，再调用 SYSCFG_EXTILineConfig 把引脚与 EXTI 线绑定。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "关于中断服务函数的编写要求，下列说法错误的是？",
        options: [
          "没有参数、没有返回值，名称固定",
          "不能随意更改函数名称",
          "可以加入 DELAY 延时以提高稳定性",
          "讲究「快进快出」，只置标志位"
        ],
        answer: 2,
        explanation: "中断服务函数绝不能加入 DELAY 或耗时操作。笔记中的案例就指出了问题：按键控制 LED 闪烁时引入 DELAY 会阻塞主线程，导致按键无法被及时响应（要求按键按下立刻熄灭 LED 的实现会异常）。中断讲究快进快出，只做置标志位等工作，具体业务交给后台 while(1) 处理。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "STM32 的 NVIC（嵌套向量中断控制器）可编程优先级是多少位、对应多少个优先级？",
        options: ["4 位，16 个可编程优先级", "8 位，256 个", "2 位，4 个", "3 位，8 个"],
        answer: 0,
        explanation: "NVIC 负责给若干中断服务函数分配优先级，保证中断触发不紊乱，共 16 个可编程优先级，由 4 位寄存器配置。优先级又分为抢占优先级与响应（子）优先级两种，同样通过这个 4 位寄存器划分。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "STM32 内部一共有 23 个外部中断，其中能够连接到 GPIO 上的有多少个？",
        options: ["23 个", "16 个", "7 个", "19 个"],
        answer: 1,
        explanation: "23 个外部中断中只有 16 个能连接到 GPIO，另外 7 个连接在其他外设上。这也是 GPIO 引脚按引脚号复用 EXTI 线的由来：PA0/PB0/PC0… 共用 EXTI0，所以同一时刻同一引脚号只能选一个组用于外部中断。",
        difficulty: "困难"
      },
      {
        type: "fill",
        question: "STM32 内部一共有 ______ 个外部中断，其中能连接在 GPIO 上的只有 ______ 个，另外 7 个在别的外设上。",
        answer: "23、16",
        keywords: ["23", "16"],
        explanation: "记住这组数字有助于回答「为什么 PA0 和 PB0 不能同时做外部中断」这类问题：因为 EXTI0 这条线只能通过 SYSCFG 选择连接到其中一个引脚。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "前后台系统中，前台（中断服务函数）一般负责置 ______，后台（while(1)）负责查询该标志并执行具体的业务逻辑。",
        answer: "标志位",
        keywords: ["标志位"],
        explanation: "这是前后台系统的核心分工口诀。中断里只把变量置位（flag = 1），主循环中发现标志变化后再执行 LED 闪烁、蜂鸣器开关等耗时业务，从而兼顾实时性与不阻塞。笔记指出：按键控制 LED 闪烁熄灭出现异常，原因就是没有长久保存标志位，并且引入了 DELAY 函数阻塞了主线程。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "STM32 的中断优先级分为响应优先级和抢占优先级，二者是通过一个 ______ 位的寄存器进行配置的。",
        answer: "4",
        keywords: ["4"],
        explanation: "与 NVIC 的 4 位寄存器对应。抢占优先级决定能否打断正在执行的中断（嵌套），响应优先级不能打断同级，只在多个中断同时挂起时决定谁先执行。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "什么是前后台系统？前台与后台各自的职责是什么？相比裸机轮询系统有什么优势？",
        answer: "前后台系统由一个 while(1) 循环（后台）加若干中断服务函数（前台）构成。\n前台（中断服务函数）：用于处理按键中断、定时器中断、串口中断等对实时性要求比较高的场景，职责是尽快响应事件并置标志位，禁止 DELAY 或耗时操作，讲究快进快出。\n后台（while(1)）：负责查询标志位是否变化，执行具体的业务处理，例如 LED 闪烁、BEEP 开关。\n优势：裸机轮询系统只有一个 while(1)，代码自上而下依次执行，所有代码优先级相同。当加入 DELAY 函数后会阻塞主线程，导致按键响应不及时（笔记案例：按键按下想立刻熄灭闪烁的 LED 会失效）。改成前后台后，紧急事件通过中断立刻得到响应，实时性大幅提升。",
        keywords: ["while(1)", "中断服务函数", "标志位", "实时性", "阻塞"],
        explanation: "笔记中给了三层演进：裸机系统（轮询系统，一个 while(1)）→ 前后台系统（while(1) + 若干中断服务函数）→ 实时操作系统（多个 while(1) 分配成独立任务 + 中断服务函数 + RTOS 管理，配套消息队列、事件标志组、互斥锁、信号量、临界区）。面试时能讲清这个演进脉络是加分项。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "什么是中断？中断嵌套时如何处理？现场保护和现场恢复由谁完成？",
        answer: "中断的概念：当一件事正在运行时，突然有一个更加紧急的事情打断了当前事件，系统转而运行更紧急的事件，执行完毕后再回到被中断处继续执行。\n中断嵌套：当低优先级中断正在执行时，更高优先级的中断可以再次打断它；多个中断同时发生时，先执行优先级更高的中断。\n现场保护与现场恢复：即保存与恢复寄存器内容、断点信息，由编译器系统帮助完成，开发者不需要手动处理，只需按规定格式编写中断服务函数（无参数、无返回值、名称固定）。",
        keywords: ["打断", "现场保护", "现场恢复", "编译器", "名称固定"],
        explanation: "「现场」指的是 CPU 寄存器组与返回地址。理解这一点有助于解释为什么中断服务函数必须快进快出：嵌套层数越多、每层占用的堆栈越深，越容易导致堆栈溢出。",
        difficulty: "简单"
      },
      {
        type: "short",
        question: "请完整描述利用外部中断（EXTI）监测按键的配置流程，并说明中断服务函数内部必须做哪三件事。",
        answer: "配置流程（共 10 步）：\n1）使能对应 GPIO 组的时钟（如 GPIOA、GPIOE）；\n2）设置引脚功能为上拉输入；\n3）使 GPIO 配置生效；\n4）使能 SYSCFG 时钟；\n5）利用 SYSCFG_EXTILineConfig 将 GPIO 与 EXTI 连接起来；\n6）EXTI 的结构体配置；\n7）使 EXTI 配置生效；\n8）NVIC 的结构体配置；\n9）使 NVIC 配置生效；\n10）编写外部中断的服务函数。\n中断服务函数内必须做三件事：① 获取中断标志位（硬件置位 1）；② 执行实际的业务代码；③ 清除标志位（软件复位 0）。漏掉第③步会导致中断反复触发。",
        keywords: ["时钟", "SYSCFG", "EXTI", "NVIC", "中断服务函数", "清除标志位"],
        explanation: "笔记总结的库函数编程规律：外设结构体统一命名为 外设名_InitTypeDef（GPIO_InitTypeDef、EXTI_InitTypeDef、USART_InitTypeDef），函数命名为 外设名_函数名，且外设配置步骤都是固定的。掌握这条规律后，任何新外设都能按套路配置。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 四、TIM 和 PWM ====================
  {
    id: "stm32_tim",
    name: "TIM和PWM",
    icon: "⏱️",
    description: "定时器分类 · 计数与分频 · PWM 输出",
    questions: [
      {
        type: "choice",
        question: "下列哪一组属于 STM32F407 的基本定时器？",
        options: ["TIM1 和 TIM8", "TIM2 和 TIM5", "TIM6 和 TIM7", "TIM9 和 TIM14"],
        answer: 2,
        explanation: "定时器分类：高级定时器 TIM1、TIM8（16 位递增/递减/递增递减自动重载计数器、16 位预分频、支持输入捕获与 PWM 与死区等）；通用定时器 TIM2-TIM5、TIM9-TIM14；基本定时器 TIM6、TIM7（16 位自动递增重载计数器 + 16 位可编程预分频器，功能最简单）。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "STM32F407 通用定时器中，属于 32 位计数器的是哪两个？",
        options: ["TIM2 和 TIM5", "TIM3 和 TIM4", "TIM9 和 TIM14", "TIM6 和 TIM7"],
        answer: 0,
        explanation: "TIM2 和 TIM5 是 32 位递增、递减、递增/递减自动重载计数器；TIM3、TIM4 是 16 位；TIM9 到 TIM14 是 16 位递增自动重载计数器，带 16 位预分频器与 PWM 功能。需要更大计数范围（更长定时）时优先用 TIM2/TIM5。",
        difficulty: "困难"
      },
      {
        type: "choice",
        question: "PWM1 模式下，当计数器寄存器 CNT 的值小于捕获比较寄存器 CCR 的值时，输出什么电平？",
        options: ["低电平", "高电平", "保持上一状态不变", "由时钟极性决定"],
        answer: 1,
        explanation: "PWM1：CNT < CCR 时输出高电平，反之输出低电平；PWM2 恰好相反（CNT < CCR 时输出低电平，反之输出高电平）。两者极性相反，实际使用中按驱动电路的有效电平来选择。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "在 PWM 输出的四个关键寄存器中，决定占空比大小的是哪一个？",
        options: ["TIMx_CNT", "TIMx_PSC", "TIMx_ARR", "TIMx_CCR"],
        answer: 3,
        explanation: "TIMx_CNT 是计数器寄存器，开启定时器后自增；TIMx_PSC 是预分频寄存器，修改定时器频率；TIMx_ARR 是自动重载寄存器，决定计数范围；TIMx_CCR 是捕获比较寄存器，决定占空比大小。调光场景改的就是 CCR。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "定时器的计数频率由 ______ 寄存器的分频值决定，计数范围由 ______ 寄存器决定，占空比由 ______ 寄存器决定。",
        answer: "PSC、ARR、CCR",
        keywords: ["PSC", "ARR", "CCR"],
        explanation: "计数频率 = 定时器时钟 / 预分频值；计数范围 0 到 ARR（如 0-65535）；占空比 = CCR/ARR。三者配合就能算出精确的定时时间与波形。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "定时器时钟为 84MHz、预分频值设为 8400 时，分频后的计数频率是 ______ KHz，即计数一个数需要 0.1ms。",
        answer: "10",
        keywords: ["10"],
        explanation: "计算过程：84 000 000 / 8400 = 10000Hz = 10KHz = 0.1ms。注意定时器时钟要先按「分频系数不为 1 时频率 ×2」的规则换算（TIM6 挂 APB1 42MHz，实际为 84MHz）。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "PWM 中，在一个周期内 ______ 所占周期时间的比值称为占空比，占空比越大等效输出的模拟电压越大。",
        answer: "有效电平",
        keywords: ["有效电平"],
        explanation: "PWM（脉冲宽度调制）就是利用微控制器的数字输出对模拟电压进行控制。周期是一个上升沿/下降沿到下一个上升沿/下降沿的时间，频率是单位时间内周期的个数，占空比是在周期内有效电平所占周期时间的比值。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "定时器的计数模式分为向上计数、向下计数和向上向下计数，当计数值达到 ______ 值时定时器会溢出并产生定时器中断。",
        answer: "自动重装",
        keywords: ["自动重装"],
        explanation: "定时器本质就是一个计数器，通过时钟来计数，利用计数功能完成计时需求。当计数值达到自动重装值时定时器溢出并产生中断，从而告知用户计时时间点。触发方式有中断形式（依赖中断服务函数）和非中断形式（从寄存器读取计数值判断）。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "定时器的输入捕获功能和 PWM 功能分别有哪些典型应用场景？软件 PWM 与硬件 PWM 的实现方式有何区别？",
        answer: "PWM 的典型应用：电机控制、舵机控制、呼吸灯、手电筒等需要等效模拟量输出的场景。\n输入捕获的典型应用：水流传感器、旋转编码器等需要测量脉冲宽度、周期或计数的场景。\n软件 PWM：利用软件定时器 + 中断反转 IO 口实现，本质上就是按时间反转高低电平，占用 CPU 且精度受中断响应影响。\n硬件 PWM：利用定时器的相关寄存器（CNT、PSC、ARR、CCR）直接产生波形，不需要 CPU 参与反转，精度高、抖动小。",
        keywords: ["电机", "舵机", "输入捕获", "水流传感器", "编码器", "中断", "寄存器"],
        explanation: "定时器是 STM32 控制外设模块的关键，为精准的时间控制提供了基础，同时可以实现 PWM 功能、输入捕获、编码器接口、死区生成等。面试时把「软件 PWM 靠中断翻转、硬件 PWM 靠寄存器」这条区别讲清楚即可体现理解深度。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "以利用基本定时器中断控制 LED 和蜂鸣器为例，描述定时器的完整配置与使用步骤。",
        answer: "共 8 步：\n1）使能定时器的时钟；\n2）定时器的结构体配置（设置预分频值、计数范围/自动重装值、计数模式等）；\n3）使定时器配置生效；\n4）开启定时器中断；\n5）NVIC 结构体配置（优先级分组、抢占与响应优先级）；\n6）使 NVIC 的配置生效；\n7）运行定时器；\n8）提供定时器的中断服务函数：8.1）获取定时器中断标志；8.2）书写业务代码（如翻转 LED、开关蜂鸣器）；8.3）清除中断标志位。",
        keywords: ["时钟", "结构体", "NVIC", "中断服务函数", "清除中断标志"],
        explanation: "与外部中断的流程完全同构，体现了「外设配置步骤是固定的」这条库函数编程规律。中断服务函数里只做翻转或置标志位这类轻量操作，真正的业务逻辑应交由 while(1) 处理。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "LED0 挂在 PF9 上并具备硬件 PWM 能力，现需实现四个按键分别把 LED0 调光到 25%、50%、75%、100%。请描述软件实现流程，并说明配置复用模式的原因。",
        answer: "实现流程（共 10 步）：\n1）使能 GPIOF 的时钟；\n2）GPIO 模式配置为复用模式（推挽）；\n3）使 GPIO 配置生效；\n4）使能对应定时器的时钟；\n5）将 GPIO 复用为该定时器通道；\n6）定时器时基单元配置（PSC、ARR 设定周期）；\n7）使定时器配置生效；\n8）PWM 功能配置（PWM 模式、极性、使能输出通道）；\n9）PWM 配置生效；\n10）启动定时器。之后在按键逻辑中修改 CCR 的值即可改变占空比：25% 对应 CCR = ARR×0.25，依此类推。\n配置复用模式的原因：此时引脚不再由 GPIO 数据寄存器控制，而是交给片上的定时器外设直接驱动，这样才能得到硬件 PWM 波形。",
        keywords: ["复用", "时基", "PWM", "CCR", "定时器"],
        explanation: "LED0 挂载 TIM4_CH1，属于通用定时器，因此具备硬件 PWM 能力。占空比通过修改捕获比较寄存器（CCR）来调节，这是调光、调速类需求的核心手段。",
        difficulty: "困难"
      }
    ]
  },

  // ==================== 五、看门狗 ====================
  {
    id: "stm32_wdg",
    name: "看门狗",
    icon: "🐕",
    description: "独立看门狗 · 窗口看门狗 · 复位机制",
    questions: [
      {
        type: "choice",
        question: "关于看门狗的本质，下列描述最准确的是？",
        options: [
          "一个用于计时的普通定时器",
          "一个高级的复位电路",
          "一个电源管理模块",
          "一个中断控制器"
        ],
        answer: 1,
        explanation: "看门狗本质上就是一个高级的复位电路。笔记按复位来源做了分类：按键复位针对 MCU 芯片进行复位，上电复位针对整个系统进行复位，软件复位即看门狗复位（分为独立看门狗和窗口看门狗）。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "独立看门狗（IWDG）的计数器和计数范围是？",
        options: ["16 位，0x0000-0xFFFF", "12 位，0x000-0xFFF", "7 位，0-127", "24 位，0-0xFFFFFF"],
        answer: 1,
        explanation: "独立看门狗的本质是定时器：由 LSI 的 32KHz 提供时钟，驱动一个 12 位（0x000---0xFFF）向下递减的计数器，计数频率可选 4、8、16、32、64、128、256 分频。千万不能把这个递减计数器减到 0，否则会产生复位。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "窗口看门狗（WWDG）的提前唤醒中断 EWI 在计数器减到多少时触发？",
        options: ["0x00", "0x3F", "0x40", "0x7F"],
        answer: 2,
        explanation: "窗口看门狗是 7 位向下递减计数器（128），EWI 提前唤醒中断在 0x40（64）时触发，这也是最晚的喂狗时机。WWDG 挂载在 APB1（42MHz）总线上，分频系数为 1、2、4、8。",
        difficulty: "困难"
      },
      {
        type: "choice",
        question: "关于独立看门狗与窗口看门狗的适用场景，下列说法正确的是？",
        options: [
          "IWDG 适合对时间精度要求较高的场合，WWDG 适合精度要求低的场合",
          "IWDG 适合作为主程序之外完全独立工作、对时间精度要求较低的场合；WWDG 适合要求在精确计时窗口起作用的场合",
          "两者适用场景完全相同，可以互换",
          "IWDG 只能用软件复位，WWDG 只能用硬件复位"
        ],
        answer: 1,
        explanation: "IWDG 最适合应用于需要看门狗在主程序之外完全独立工作、对时间精度要求较低的场合；WWDG 最适合要求看门狗在精确计时窗口起作用的应用程序。IWDG 用独立的 LSI 时钟，因此即使主时钟失效也能工作。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "独立看门狗的时钟由 ______ 提供，我们所有的喂狗操作本质上就是 ______ 计数器。",
        answer: "LSI、重载",
        keywords: ["LSI", "重载"],
        explanation: "独立看门狗的三个关键特征：① 时钟由 LSI 的 32K 提供；② 向下递减计数器；③ 计数范围 0x000---0xFFF。喂狗（重载计数器）必须在计数器减到 0 之前完成。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "窗口看门狗挂载在 ______ 总线上，其分频系数为 1、2、4、8。",
        answer: "APB1",
        keywords: ["APB1"],
        explanation: "WWDG 挂在 APB1（42MHz）总线上。注意窗口看门狗既有「上限」（喂狗不能太早）也有「下限」（不能太晚，最晚在 0x40 触发 EWI），因此称为「窗口」。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "在无人值守的设备中，为防止电磁干扰、温度干扰、静电干扰导致寄存器或外设异常，需要依靠 ______ 定期检查控制器内部的运行情况。",
        answer: "看门狗",
        keywords: ["看门狗"],
        explanation: "设备产品经常受到人为干扰、电磁干扰、温度干扰、静电干扰，会造成微控制器内的寄存器或者外设模块出现异常，从而导致系统运行错误。看门狗可以定期检查控制器内部的运行情况，一旦发生异常就发出复位信号使系统复位，并且可以通知到用户，特别适合无人值守的场景。",
        difficulty: "简单"
      },
      {
        type: "short",
        question: "请描述独立看门狗监测系统运行情况的配置步骤，并说明「在合适的地方喂狗」的含义。",
        answer: "配置步骤（共 5 步）：\n1）使能独立看门狗的时钟；\n2）设置独立看门狗的分频值（4/8/16/32/64/128/256）；\n3）设置独立看门狗的计数值（0x000-0xFFF）；\n4）喂狗（重载计数器）；\n5）开启看门狗。\n「在合适的地方喂狗」的含义：喂狗位置决定了看门狗真正监控的代码范围。如果把喂狗放在主循环最开始，那么只要主循环能跑完一轮就说明系统没有卡死；如果放在某个耗时的任务内部，则只能监控该任务。喂狗周期必须小于溢出时间（由 LSI 频率与分频值决定），否则会误触发复位。",
        keywords: ["时钟", "分频", "计数值", "喂狗", "重载"],
        explanation: "核心认知是：看门狗监控的是「你多久喂一次狗」，而不是「程序是否正确」。因此喂狗要放在能证明关键逻辑仍正常运行的位置，绝不能放在中断里（否则主循环卡死而中断仍在跑，看门狗形同虚设）。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "请描述窗口看门狗监测系统运行状态的配置步骤。",
        answer: "配置步骤（共 8 步）：\n1）使能 WWDG 看门狗的时钟；\n2）设置 WWDG 预分频值（1、2、4、8）；\n3）设置 WWDG 的窗口上限；\n4）开启 WWDG 窗口看门狗；\n5）开启 WWDG 提前唤醒中断 EWI；\n6）NVIC 的结构体配置；\n7）使 NVIC 配置生效；\n8）提供 WWDG 的中断服务函数。",
        keywords: ["时钟", "预分频", "窗口", "EWI", "NVIC"],
        explanation: "窗口看门狗的特点是「喂狗既不能太早也不能太晚」：早于窗口上限喂狗会被视为程序异常（可能跑飞了才开始喂），晚于 0x40 就会复位。EWI 中断给了一个最后的补救机会，可以在中断里做一些安全处理。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 六、FLASH ====================
  {
    id: "stm32_flash",
    name: "FLASH闪存",
    icon: "💾",
    description: "存储器演进 · 扇区结构 · 掉电存储",
    questions: [
      {
        type: "choice",
        question: "关于 EEPROM 与 FLASH 的擦写次数，下列数据正确的是？",
        options: [
          "EEPROM 约 1 万次，FLASH 约 10 万次",
          "EEPROM 约 100 万次，FLASH 约 10 万次",
          "EEPROM 约 10 万次，FLASH 约 100 万次",
          "两者相同，都是 100 万次"
        ],
        answer: 1,
        explanation: "这是笔记中明确标注的面试题。EEPROM 与 FLASH 的四大区别：① 读写速率不同，EEPROM 针对单个字节，FLASH 针对某页；② 保存数据寿命不同，EEPROM 约 100 年，FLASH 约 20 年；③ 擦写次数不同，EEPROM 约 100 万次，FLASH 约 10 万次；④ 稳定性不同，EEPROM 出错概率小，FLASH 出错概率大。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "STM32F407ZET6 内部 FLASH 的扇区划分是怎样的？",
        options: [
          "共 8 个扇区，扇区 0-3 各 16K，扇区 4 为 64K，之后各 128K",
          "共 8 个扇区，每个扇区 128K",
          "共 12 个扇区，每个扇区 16K",
          "共 4 个扇区，扇区 0-3 各 64K"
        ],
        answer: 0,
        explanation: "STM32F407ZET6 有 8 个扇区：扇区 0、1、2、3 分别是 16K，扇区 4 是 64K，以后的扇区都是 128K。支持扇区擦除和全擦除，支持字节、半字、字、双字写入。从 0x08000000 开始存储用户代码，企业中单独存储 FLASH 变量时从最后一页开始写入。",
        difficulty: "困难"
      },
      {
        type: "choice",
        question: "FLASH 擦除后单元中的默认值是什么？写入时遵循什么规律？",
        options: [
          "0x00，只能 0 变 1",
          "0xFF，只能 1 变 0",
          "0xFF，既可以 0 变 1 也可以 1 变 0",
          "0x00，只能 1 变 0"
        ],
        answer: 1,
        explanation: "扇区擦除后默认的值是 0xFF，写入时只能把 1 变成 0，不能把 0 变成 1。所以修改已写入的数据必须先擦除整个扇区，这也是 FLASH 不能像 RAM 那样任意覆盖写入的根本原因。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "下列哪一项不是 FLASH 写入失败的原因？",
        options: [
          "MCU 供电电压不稳定",
          "FLASH 读写不一致",
          "FLASH 擦写需要一定时间，没有加入延时函数",
          "写入的数据长度没有对齐到 4 字节"
        ],
        answer: 3,
        explanation: "笔记指出 FLASH 写入失败的三个原因：① MCU 供电电压不稳定；② FLASH 读写不一致，建议一次写入多个数据，遍历找出出现次数最多的当作正确数据；③ FLASH 擦写需要一段时间，因此需要加入延时函数，一定要注意查看手册。数据对齐问题在笔记中并未提及，属于干扰项。",
        difficulty: "困难"
      },
      {
        type: "fill",
        question: "存储器进化史为 ROM → PROM → EPROM → EEPROM → ______。",
        answer: "FLASH",
        keywords: ["FLASH"],
        explanation: "ROM：出厂完成编程，无法更改；PROM：可以写入一次，写错无法更改；EPROM：支持多次写入，写入前通过紫外线灯擦除；EEPROM：支持随时读写擦，电擦除（MCU 提供稳定的电压）；FLASH：是广义的 EEPROM，是 EEPROM 的加强版。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "FLASH 属于闪存的一种，是一种 ______ 存储器，具有掉电不丢失的功能。",
        answer: "非易失性",
        keywords: ["非易失"],
        explanation: "非易失性存储器即掉电后数据仍然保留。常见的外部 FLASH 有两类：Nand FLASH（存储大型程序、字库/图片，擦写速度快，如 GD25Q）和 Nor FLASH（容量中等，支持随机读写，擦写速度适中，如 W25Q128）。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "STM32 内部 FLASH 从地址 0x08000000 开始存储用户代码，企业中单独存储 FLASH 变量时从 ______ 开始写入。",
        answer: "最后一页",
        keywords: ["最后一页"],
        explanation: "从 0x08000000 开始存放用户代码；把用户数据存在最后一页（或最后几个扇区）可以避免擦写时破坏程序本身。这是嵌入式产品中保存掉电不丢失参数的常见做法。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "请描述利用 FLASH 掉电存储特性完成变量读写的完整操作流程。",
        answer: "共 6 步：\n1）FLASH 解锁；\n2）清除 FLASH 标志位；\n3）扇区擦除（擦除后默认值为 0xFF，只能 1 变 0，不能 0 变 1）；\n4）数据写入（字节、半字、字、双字）；\n5）FLASH 上锁；\n6）数据读取。",
        keywords: ["解锁", "标志位", "扇区擦除", "写入", "上锁", "读取"],
        explanation: "解锁与上锁是为了防止误操作破坏 FLASH 内容（写入前必须解锁，写完立即上锁）。擦除必须先于写入，因为擦除后为 0xFF，写入只能把 1 置成 0，无法把 0 恢复成 1。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "EEPROM 和 FLASH 有什么区别？",
        answer: "共四点区别：\n1）读写速率不同：EEPROM 针对于单个字节操作，FLASH 针对于某页操作（所以 FLASH 擦写粒度更大，写入前必须整扇区/整页擦除）；\n2）保存数据寿命不同：EEPROM 大约 100 年，FLASH 大约 20 年；\n3）擦写次数不同：EEPROM 擦写约 100 万次，FLASH 擦写约 10 万次；\n4）稳定性不同：EEPROM 出错概率小，FLASH 出错概率大。",
        keywords: ["字节", "页", "100", "20", "擦写", "稳定性"],
        explanation: "这是笔记中直接标注的面试题。补充一句加分：FLASH 是广义的 EEPROM，是 EEPROM 的加强版，成本更低、容量更大，因此大容量存储用 FLASH，而对频繁小字节改写和长期保存要求高的场合用 EEPROM。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "Nand FLASH 与 Nor FLASH 有什么区别？各自适用于什么场景？",
        answer: "Nand FLASH：用于存储大型程序、字库、图片等；擦写速度快，但一般是按页访问、不支持任意随机字节读写；代表型号 GD25Q。\nNor FLASH：容量中等；支持随机读写；擦写速度适中；代表型号 W25Q128。\n选择依据：需要大容量、快速批量擦写（如存放字库、图片资源）选 Nand；需要在总线上直接随机读取、作为程序存储器（XIP）使用时选 Nor。",
        keywords: ["Nand", "Nor", "字库", "随机读写", "W25Q128"],
        explanation: "笔记中两种 FLASH 的对比是理解外部存储选型的基础。W25Q128 正是第 13 章 SPI 实验所驱动的芯片，两章的实验是衔接的。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 七、USART 和 UART ====================
  {
    id: "stm32_usart",
    name: "USART和UART",
    icon: "📡",
    description: "串行通信概念 · 帧格式 · 波特率",
    questions: [
      {
        type: "choice",
        question: "USART 属于哪种通信协议类型？",
        options: [
          "串行、异步、半双工",
          "串行、同步、全双工",
          "并行、同步、全双工",
          "串行、异步、单工"
        ],
        answer: 1,
        explanation: "USART 是通用同步异步收发器，是一种串行、同步、全双工的通信协议。串行指数据按位（Bit）逐位发送；同步指数据传输要等待对方应答、靠一根 CLOCK 时钟线同步；全双工指数据可以双向传输且收发可以同时进行。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "下列关于 RS485 的描述，正确的是？",
        options: [
          "通讯距离 20m，逻辑 1 为 -5V 到 -15V",
          "通讯距离 1200m，差分信号，逻辑 1 为 +2V 到 +6V",
          "通讯距离 1.5m，逻辑 1 为 3.3V",
          "通讯距离 1200m，单端信号，逻辑 1 为 3.3V"
        ],
        answer: 1,
        explanation: "三种接口对比：USART 通讯距离 1.5m，逻辑 1 为 3.3V、逻辑 0 为 0V；RS232 通讯距离 20m，逻辑 1 为 -5V 到 -15V、逻辑 0 为 +5V 到 +15V；RS485 通讯距离 1200m，采用差分信号，逻辑 1 为 +2V 到 +6V、逻辑 0 为 -2V 到 -6V。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "在 USART 的帧格式中，起始位是什么电平、几个比特？",
        options: ["1bit 高电平", "1bit 低电平", "0.5bit 高电平", "2bit 低电平"],
        answer: 1,
        explanation: "USART 帧格式：起始位为 1bit 低电平；数据位低位先行；校验位为奇偶校验或 CRC 校验；停止位为 0.5/1/1.5/2bit 高电平。笔记举例发送 0x77：起始位 + 0111 0111（低位先行）+ 校验位 + 停止位。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "在单片机中实现 printf 函数，下列哪项不是必要条件？",
        options: [
          "包含 #include <stdio.h>",
          "在魔术棒按钮中勾选 Use MicroLIB",
          "printf 只能重定向到一个 USART",
          "必须同时开启串口接收中断"
        ],
        answer: 3,
        explanation: "笔记给出的三个条件：① 包含 #include <stdio.h>；② 在魔术棒按钮中勾选 Use MicroLIB；③ printf 只能重定向到一个 USART。printf 是仅发送的功能，与串口接收中断无关，因此第 4 项不是必要条件。",
        difficulty: "困难"
      },
      {
        type: "fill",
        question: "串行通信按数据传输方向可分为单工、______ 和全双工三种；其中全双工是指数据可以双向传输且收发可以同时进行。",
        answer: "半双工",
        keywords: ["半双工"],
        explanation: "单工：数据只能单向传输；半双工：数据可以双向传输，但同一时刻只能单向传输；全双工：数据可以双向传输，收发可以同时进行。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "波特率 115200 表示传输一个 bit 需要约 ______ 微秒（us）。",
        answer: "8.6",
        keywords: ["8.6"],
        explanation: "计算方式为取倒数：1/2400 ≈ 416us、1/4800 = 208us、1/9600 ≈ 104us、1/115200 ≈ 8.6us。笔记说明：比特率和波特率并不是同一个概念，但在 MCU 开发中我们认为波特率就是比特率，描述的是传输一个 bit 所需要的时间，使用场景是异步模式下双方约定通讯速率。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "USART 的通信管脚中，TX 是数据 ______ 脚，RX 是数据 ______ 脚。",
        answer: "发送、接收",
        keywords: ["发送", "接收"],
        explanation: "USART 点对点通讯方式的四个管脚：VCC（输入电源的正极）、GND（输入电源的负极）、TX（数据发送脚）、RX（数据接收脚）。接线时要注意交叉连接：本机 TX 接对方 RX。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "在 USART 的串口配置中，TX 引脚需要配置为复用推挽输出，RX 引脚需要配置为 ______ 输入。",
        answer: "上拉",
        keywords: ["上拉"],
        explanation: "笔记的配置流程中明确要求：设置脚位功能，复用推挽输出 TX、上拉输入 RX。这与按键电路一样，是为了避免接收引脚在空闲/悬空时电平不定而误触发。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "请描述利用 USART 与 QT 上位机通讯的完整软件实现流程。",
        answer: "共 12 步：\n1）时钟使能 GPIOA 组的时钟；\n2）设置脚位功能：复用推挽输出 TX、上拉输入 RX；\n3）使 GPIO 配置生效；\n4）使能 USART1 的时钟；\n5）将 GPIO 复用为串口；\n6）USART 结构体配置（波特率、字长、停止位、校验位、模式等）；\n7）使 USART1 配置生效；\n8）启动串口接收中断；\n9）NVIC 结构体配置；\n10）使 NVIC 配置生效；\n11）启动串口；\n12）提供中断服务函数：① 获取中断标志位；② 具体业务代码；③ 清除中断标志位。",
        keywords: ["时钟", "复用", "USART", "NVIC", "中断服务函数", "清除"],
        explanation: "硬件上 USART1_Tx 接 U1_Tx、USART1_Rx 接 U1_Rx，分析控制逻辑时要看懂跳线帽的作用。整个流程与外部中断、定时器中断完全同构，再次印证「外设配置步骤是固定的」。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "USART、RS232、RS485 三种串行接口有什么区别？",
        answer: "从三个维度对比：\n1）通讯距离：USART 约 1.5m，RS232 约 20m，RS485 约 1200m；\n2）电平定义：USART 为单端信号，逻辑 1 是 3.3V、逻辑 0 是 0V；RS232 逻辑 1 为 -5V 到 -15V、逻辑 0 为 +5V 到 +15V；RS485 为差分信号，逻辑 1 为 +2V 到 +6V、逻辑 0 为 -2V 到 -6V；\n3）抗干扰与组网能力：RS485 采用差分信号、抗共模干扰能力强且支持多点组网，因此适合工业现场的长距离、多节点通讯；USART 只能板内或短距离点对点；RS232 适合中距离点对点、需要负逻辑电平的场合。",
        keywords: ["1.5", "20", "1200", "差分", "3.3", "抗干扰"],
        explanation: "记忆要点：距离越远越需要差分信号。RS485 的差分特性在 CAN 总线上同样被采用，这是工业通讯抗干扰的核心手段。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 八、ADC 和 DAC ====================
  {
    id: "stm32_adc",
    name: "ADC和DAC",
    icon: "📊",
    description: "PCM 采样 · 精度与通道 · 转换周期",
    questions: [
      {
        type: "choice",
        question: "STM32 内部 ADC 的位数（转换精度）是多少？",
        options: ["8 位", "10 位", "12 位", "16 位"],
        answer: 2,
        explanation: "STM32 内部由一个 12 位逐次趋近型的 ADC，12 位代表的是 ADC 的转换精度（对比外挂的 ADC0809 是 8 位）。12 位对应 0-4095，因此转换结果为 4095 时对应满量程 3.3V。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "STM32 内部 ADC 的通道数量是？",
        options: [
          "每个 ADC 有 8 个通道，全部来自外部",
          "每个 ADC 有 19 个通道，可测量外部 16 个通道，内部 3 个（VBAT、温度、VREF）",
          "每个 ADC 有 16 个通道，全部来自外部",
          "每个 ADC 有 19 个通道，全部来自外部"
        ],
        answer: 1,
        explanation: "STM32 内部 ADC 有 3 个，每个 ADC 都有 19 个通道，可以测量来自外部的 16 个通道，内部 3 个通道为 VBAT、温度、VREF。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "ADC 的规则组通道与注入组通道在数据寄存器上的区别是？",
        options: [
          "规则组有 4 个 16 位数据寄存器，注入组只有 1 个",
          "规则组有 1 个 16 位数据寄存器（只保存最后一次转换结果），注入组有 4 个 16 位数据寄存器",
          "两者都是 1 个 16 位数据寄存器",
          "两者都是 4 个 16 位数据寄存器"
        ],
        answer: 1,
        explanation: "规则组通道：1 个 16 位数据寄存器，只能保存最后一次的转换结果，因此可以申请 DMA 请求进行数据实时转运；注入组通道：4 个 16 位数据寄存器，可以保存四个通道的转换结果。",
        difficulty: "困难"
      },
      {
        type: "choice",
        question: "STM32F4 的 ADC 完成一次转换所需的采样与转换周期是多少？",
        options: [
          "12.5 + 1.5 = 14 个周期，约 1us",
          "12 + 3 = 15 个周期，约 1.07us",
          "3 + 12 = 15 个周期，约 0.5us",
          "1.5 + 12 = 13.5 个周期，约 1.2us"
        ],
        answer: 1,
        explanation: "ADC 总时间 = 采样周期 + 转换周期。STM32F1：12.5 + 1.5 = 14 个周期，14×(1/14) = 1us；STM32F4：12 + 3 = 15 个周期，15×(1/14) ≈ 1.07us。注意 ADC 频率不能超过 36M，实际会降频到 14M。",
        difficulty: "困难"
      },
      {
        type: "fill",
        question: "模数转换的过程（PCM 脉冲编码调制）依次为采样、保持、______ 和编码。",
        answer: "量化",
        keywords: ["量化"],
        explanation: "采样：在一定的周期内获取连续变化的数据，即对数据离散化，采样时要注意样本要包含原本的信号信息且该样本还可以还原信号；保持：关闭采样开关进行静置；量化：获取样本数据；编码：用二进制数据表示物理量。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "STM32 内部 ADC 的转换结果是 0---______ 对应 0---3.3V，因此转换值为 2048 时对应电压 1.65V。",
        answer: "4095",
        keywords: ["4095"],
        explanation: "12 位 ADC 的满量程为 2^12-1 = 4095。换算公式：电压 = 3.3V × (转换值/4096)。笔记中的示例：2048 对应 3.3×(2048/4096) = 1.65V，1024 对应 0.82V，512 对应 0.41V。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "STM32 内部 ADC 有四种工作模式：单次、连续、扫描和 ______。",
        answer: "非扫描",
        keywords: ["非扫描"],
        explanation: "四种工作模式为单次、连续、扫描、非扫描。扫描模式用于按顺序转换多个通道，连续模式用于自动重复转换。配合 DMA 使用时通常开启扫描 + 连续模式。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "ADC 数据对齐方式中，左对齐实质上是将数据左移 4 位，结果扩大 ______ 倍；右对齐数据不变。",
        answer: "16",
        keywords: ["16"],
        explanation: "12 位结果放在 16 位寄存器中，右对齐时低 12 位有效、数值不变；左对齐相当于左移 4 位，结果扩大 16 倍。DAC 数据同样遵循左对齐和右对齐。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "请描述模数转换（PCM）的四个过程，并说明采样环节需要注意什么。",
        answer: "模数转换的四个过程：\n1）采样：在一定的周期内获取连续变化的数据，该过程就是对数据离散化；\n2）保持：关闭采样开关，进行静置；\n3）量化：获取样本数据；\n4）编码：用二进制数据表示物理量。\n采样环节需要注意：样本要包含原本的信号信息，并且该样本还可以还原信号。也就是说采样频率必须足够高（依据采样定理），否则会发生混叠、无法还原原始信号。",
        keywords: ["采样", "保持", "量化", "编码", "还原"],
        explanation: "PCM（脉冲编码调制）是将连续取值的模拟信号转换为时间离散、取值离散的数字信号在通道中传输。ADC 的转换原理是逐次比较型：由高位到低位依次进行比较，从而获取精准的转换值。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "STM32 的 ADC 转换速度有多快？采样周期与转换周期如何影响总时间？为什么 ADC 时钟需要降频？",
        answer: "ADC 总时间 = 采样周期 + 转换周期。\nSTM32F1：12.5（采样）+ 1.5（转换）= 14 个周期，在 14MHz 的 ADC 时钟下 14×(1/14) = 1us；\nSTM32F4：12（采样）+ 3（转换）= 15 个周期，15×(1/14) ≈ 1.07us。\n降频原因：ADC 频率不能超过 36M，所以实际会把时钟降频到 14M 使用。因为 ADC 内部的逐次趋近比较器需要稳定的建立时间，时钟过快会导致比较结果不可靠、精度下降。增大采样周期可以给高阻抗信号源更充分的充电时间，因此测量高内阻信号时需要选更长的采样周期。",
        keywords: ["采样周期", "转换周期", "36", "14", "1us"],
        explanation: "面对「你的 ADC 采集多快」这类面试问题，正确回答方式是给出「总时间 = 采样 + 转换」的计算过程与具体数值，并说明降频的物理原因，而不是只说一个模糊的结论。",
        difficulty: "困难"
      },
      {
        type: "short",
        question: "嵌入式开发中 0 欧姆电阻的作用是什么？",
        answer: "笔记给出两点：\n1）电路调试、电路修改：在 PCB 上预留 0Ω 电阻的焊盘，相当于一个可随时断开/短接的跳线位，方便调试、测量电流、改板时切换网络；\n2）信号的同频：用于把两个本应分开的网络连接起来使其参考电位一致，典型用法是模拟地与数字地之间用 0Ω 电阻单点连接，避免数字电路的开关地电流尖峰抬高模拟地电位、干扰 ADC 采样精度。\n补充：0Ω 电阻还可作为预留的滤波/匹配位置，以及替代跳线帽用于自动贴片。",
        keywords: ["调试", "电路修改", "同频", "地"],
        explanation: "这是笔记中标注的面试题，出现在 ADC 电压采集实验中。为什么模拟地和数字地要分开？因为数字电路开关瞬间会产生大的地电流尖峰，若与模拟地共用，会抬升 ADC 参考地电位导致采样抖动，通常用 0Ω 电阻或磁珠单点连接两地。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "DAC 有哪些特性？请描述利用 DAC 输出模拟电压再由 ADC 采集的配置流程。",
        answer: "DAC 的特性：① 有两个输出通道，DAC_OUT1 为 PA4、DAC_OUT2 为 PA5；② 12 位 DAC，写入寄存器数据时必须在 0-4095 范围内；③ 数据也遵循左对齐和右对齐；④ 可以产生噪声波和三角波。\n配置流程（共 7 步）：\n1）使能 GPIOA 组的时钟；\n2）设置模拟输入模式；\n3）使配置生效；\n4）使能 DAC 的时钟；\n5）配置 DAC 的结构体；\n6）使 DAC 配置生效；\n7）启动 DAC。之后写入 0-4095 即可输出对应模拟电压，用万用表或 ADC 采集验证。",
        keywords: ["PA4", "12", "4095", "对齐", "三角波", "模拟输入"],
        explanation: "DAC 与 ADC 互为逆过程：ADC 是模拟到数字，DAC 是数字到模拟。两者都使用 12 位精度与 0-4095 的数值范围，引脚也都要配置为模拟输入模式，形成对照记忆点。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 九、PWR 电源管理 ====================
  {
    id: "stm32_pwr",
    name: "PWR电源管理",
    icon: "🔋",
    description: "睡眠/停止/待机 · 低功耗设计",
    questions: [
      {
        type: "choice",
        question: "睡眠模式（Sleep Mode）下，芯片的硬件工作状态是？",
        options: [
          "CPU 停止运行，外设也全部停止，RAM 数据清空",
          "CPU 停止运行，外设（GPIO、TIM、USART）正常运行，RAM 区数据完整",
          "CPU 正常运行，只有外设停止",
          "整个芯片断电，仅保留唤醒电路"
        ],
        answer: 1,
        explanation: "睡眠模式是浅度休眠：核心原理是仅关闭 CPU 内核时钟（Cortex-M4），CPU 停止运行代码，所有的外设和中断系统都正常工作。硬件状态为 CPU 停止运行、外设（GPIO/TIM/USART）正常运行、RAM 区数据完整，支持所有中断唤醒（EXTI、TIM、USART）。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "待机模式（Standby Mode）下，哪些方式可以唤醒芯片？",
        options: [
          "所有中断都可以唤醒",
          "仅 EXTI 外部中断可以唤醒",
          "PA0（WKUP）专用唤醒、NRST 外部复位、IWDG 独立看门狗复位",
          "任意 GPIO 引脚都可以唤醒"
        ],
        answer: 2,
        explanation: "待机模式是深度睡眠：芯片核心电路全部断电，所有外设和 CPU 全部关闭，仅保留复位电路和唤醒电路，RAM 区数据全部清空。唤醒方式仅限 PA0（WKUP）专用唤醒、NRST 外部复位、IWDG 独立看门狗复位，单片机完全重启并从 main 函数开始执行。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "停止模式（Stop Mode）的唤醒条件是什么？唤醒后需要注意什么？",
        options: [
          "所有中断都能唤醒，唤醒后无需额外处理",
          "仅能通过外部中断 EXTI 唤醒，且唤醒后需要用 SystemInit 重新配置系统时钟",
          "只能通过 PA0 唤醒，唤醒后从 main 重新执行",
          "只能通过复位唤醒，RAM 数据会丢失"
        ],
        answer: 1,
        explanation: "停止模式是中度休眠：关闭内核时钟与外设时钟，CPU 和所有外设全部停止，但芯片不断电、RAM 区数据保留、GPIO 状态也被维持，仅能通过外部中断 EXTI 唤醒。笔记中的实现步骤特意标注了「实现停止模式（PWR_EnterSTOPMode）+ SystemInit」，因为唤醒后时钟会退回默认状态，必须重新初始化时钟。",
        difficulty: "困难"
      },
      {
        type: "choice",
        question: "自浅及深排列 STM32 的三大低功耗模式，正确的是？",
        options: [
          "待机模式 → 停止模式 → 睡眠模式",
          "睡眠模式 → 停止模式 → 待机模式",
          "停止模式 → 睡眠模式 → 待机模式",
          "睡眠模式 → 待机模式 → 停止模式"
        ],
        answer: 1,
        explanation: "由浅及深为睡眠模式 → 停止模式 → 待机模式，核心表现是模式越深、关闭的硬件越多、功耗越低。总结口诀：睡眠模式仅关闭 CPU，任何中断都能唤醒；停止模式关闭 CPU + 外设但芯片依旧供电，仅能外部中断唤醒；待机模式整个芯片全部断电，仅有 WKUP 唤醒或者复位唤醒。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "PWR 即 Power Control，属于 STM32 的外设，是实现 ______ 模式的核心硬件，负责管理芯片的供电策略、电压调节、时钟启停和 GPIO 状态。",
        answer: "低功耗",
        keywords: ["低功耗"],
        explanation: "低功耗模式是 MCU 为了降低能耗、延长续航时间而设计的一种工作模式。PWR 外设负责管理芯片的供电策略、电压调节、时钟启停、GPIO 状态，是低功耗方案的核心。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "实现睡眠模式使用的指令是 ______（Wait For Interrupt）。",
        answer: "WFI",
        keywords: ["WFI"],
        explanation: "笔记中的实现方式：睡眠模式用 WFI 指令；停止模式用 PWR_EnterSTOPMode 并配合 SystemInit 恢复时钟；待机模式用 PWR_ClearFlag、PWR_WakeupPinCmd、PWR_EnterStandby。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "待机模式下 RAM 区的数据会被 ______，而停止模式下 RAM 数据可以保存。",
        answer: "清空",
        keywords: ["清空"],
        explanation: "三级模式的硬件差异是判断「能否保持现场」的关键：睡眠模式 RAM 完整、外设正常；停止模式 RAM 数据保留、GPIO 状态维持；待机模式 RAM 数据全部清空、完全重启。因此需要保存运行状态时不能用待机模式，除非先把数据写入 FLASH。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "请对比睡眠模式、停止模式、待机模式三者的核心原理、硬件工作状态与唤醒条件。",
        answer: "1）睡眠模式（浅度休眠）：核心原理是仅关闭 CPU 内核时钟（Cortex-M4），CPU 停止运行代码，所有外设和中断系统正常工作。硬件状态：CPU 停止、外设（GPIO/TIM/USART）正常运行、RAM 数据完整。唤醒条件：支持所有中断唤醒（EXTI、TIM、USART）。\n2）停止模式（中度休眠）：核心原理是关闭内核时钟和外设时钟，CPU 与所有外设全部停止，但芯片不断电，RAM 区数据保留，GPIO 状态也被维持。硬件状态：CPU 停止、外设彻底不工作、RAM 数据可保存。唤醒条件：支持中断唤醒（EXTI），唤醒后需重新配置系统时钟。\n3）待机模式（深度睡眠）：核心原理是芯片核心电路全部断电，所有外设和 CPU 全部关闭，仅保留复位电路和唤醒电路。硬件状态：CPU 停止、外设彻底不工作、RAM 数据全部清空。唤醒条件：PA0（WKUP）专用唤醒、NRST 外部复位、IWDG 复位，单片机完全重启，从 main 函数开始执行。",
        keywords: ["内核时钟", "外设", "RAM", "唤醒", "EXTI", "WKUP"],
        explanation: "记忆主线：越深的模式关掉的硬件越多。面试时把「RAM 是否保留」和「谁能唤醒」这两条讲清楚，基本就能覆盖这个知识点。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "请描述通过三个按键切换分别进入三种低功耗模式的实现步骤。",
        answer: "共 4 个关键步骤：\n1）开启 PWR 电源管理寄存器的时钟；\n2）按键 1 实现睡眠模式：执行 WFI 指令；\n3）按键 2 实现停止模式：调用 PWR_EnterSTOPMode，唤醒后必须调用 SystemInit 重新配置系统时钟；\n4）按键 3 实现待机模式：调用 PWR_ClearFlag 清除标志位、PWR_WakeupPinCmd 使能唤醒引脚、PWR_EnterStandby 进入待机。\n此外按键引脚（如 PA0）需要提前配置为输入，并使能对应的 EXTI 中断以便唤醒。",
        keywords: ["PWR", "WFI", "EnterSTOPMode", "SystemInit", "Standby"],
        explanation: "三个坑要记住：① 必须先开 PWR 时钟；② 停止模式唤醒后一定要重新配置时钟，否则系统会以低速时钟运行；③ 待机模式是从 main 重新执行，现场不会保留。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 十、DMA ====================
  {
    id: "stm32_dma",
    name: "DMA",
    icon: "🚚",
    description: "Stream/Channel · 传输方向与模式 · FIFO",
    questions: [
      {
        type: "choice",
        question: "STM32F407ZET6 内部的 DMA 控制器及各控制器对 ADC 的支持情况是？",
        options: [
          "有 1 个 DMA，支持 ADC",
          "有 2 个 DMA：DMA1 不支持 ADC，DMA2 支持 ADC",
          "有 2 个 DMA：DMA1 支持 ADC，DMA2 不支持 ADC",
          "有 3 个 DMA，都支持 ADC"
        ],
        answer: 1,
        explanation: "STM32F407ZET6 内部有 2 个 DMA。DMA1 支持 USART、TIM、SPI 但不支持 ADC；DMA2 支持 ADC、TIM、SPI。外设与 DMA 控制器的对应关系出厂就已设定，选错了无法工作，这是 ADC + DMA 实验必须用 DMA2 的原因。",
        difficulty: "困难"
      },
      {
        type: "choice",
        question: "关于 DMA 的 Stream 与 Channel 架构，下列说法正确的是？",
        options: [
          "每个 DMA 控制器有 8 个 Channel，每个 Channel 内含 8 个 Stream",
          "每个 DMA 控制器有 8 个独立的 Stream，每个 Stream 内部有 8 个 Channel，具体连接哪个外设出厂已设定",
          "Stream 与 Channel 可以任意组合，不受硬件限制",
          "每个 DMA 控制器只有 1 个 Stream，多个 Channel 共用"
        ],
        answer: 1,
        explanation: "DMA 核心架构是 Stream（流）+ Channel（通道）。Stream 是 DMA 传输的核心单元，每个 DMA 控制器都有 8 个独立的 Stream，每个 Stream 同一时间只能处理一个外设数据；Channel 是每个 Stream 内部有 8 个 channel，具体连接在哪个外设上出厂就已经设定好了。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "关于 DMA 的传输方向，下列说法正确的是？",
        options: [
          "支持外设到存储器、存储器到外设、存储器到存储器，也支持外设到外设",
          "支持外设到存储器、存储器到外设、存储器到存储器，但不支持外设到外设",
          "只支持存储器到存储器",
          "只支持外设与存储器之间的双向传输"
        ],
        answer: 1,
        explanation: "DMA 支持三种传输方向：外设到存储器（P TO M）、存储器到外设（M TO P）、存储器到存储器（M TO M）。注意没有「外设到外设」的传输，如果需要，必须经内存中转。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "DMA 的 FIFO 缓冲区深度是多少？禁用 FIFO 后会怎样？",
        options: [
          "深度 8 字（32 字节）；禁用后数据仍需缓冲",
          "深度 4 字（16 字节）；禁用后数据不经过缓冲，外设每来一个数据立即进行转运",
          "深度 16 字（64 字节）；禁用后进入循环模式",
          "深度 2 字（8 字节）；禁用后传输停止"
        ],
        answer: 1,
        explanation: "每个 Stream 内置一个 4 字深度缓冲区（16 字节）的 FIFO，是外设和内存之间数据的中转站。禁用 FIFO 时数据不经过缓冲，外设每来一个数据立即进行转运。",
        difficulty: "困难"
      },
      {
        type: "fill",
        question: "DMA 的英文全称是 Direct Memory Access，它允许 ADC、USART、SPI、IIC 等外设与存储器之间直接进行信息传输，完全不需要 ______ 参与。",
        answer: "CPU",
        keywords: ["CPU"],
        explanation: "DMA 的作用是解放 CPU，让 CPU 在 DMA 传输数据的同时去处理其他任务（如计算、逻辑控制），大幅度提升系统效率。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "DMA 的两种传输模式中，完成设置转运次数后停止的是正常模式，完成转运后自动重置地址和计数器、实现无限传输（常用于 ADC）的是 ______ 模式。",
        answer: "循环",
        keywords: ["循环"],
        explanation: "正常模式：完成设置的转运次数后停止；循环模式：完成转运后自动重置地址和计数器，无限传输，ADC 连续采集场景常用循环模式。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "开启 DMA 的 FIFO 模式适合位宽不匹配、高速多通道、大流量场景；而 ______ 模式适合位宽一致、延迟低、单通道、低速率场景。",
        answer: "直接",
        keywords: ["直接"],
        explanation: "FIFO 模式：适合位宽不匹配、高速多通道、大流量场景；直接模式：适合位宽一致、延迟低、单通道、低速率场景。选择依据是「数据是否需要缓冲与合并」。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "什么是 DMA？相比 CPU 搬运数据，DMA 有哪些优势？",
        answer: "DMA（Direct Memory Access，直接存储器访问）是一种硬件机制，允许 ADC、USART、SPI、IIC 等外设与存储器之间直接进行信息传输，完全不需要 CPU 参与，作用是解放 CPU，让 CPU 在 DMA 传输数据的同时去处理其他任务（如计算、逻辑控制），大幅度提升系统效率。\n三大优势：\n1）零 CPU 消耗：数据传输过程不借助 CPU；\n2）传输速率快：DMA 挂载在 AHB 总线上，传输速率高于 CPU 转运；\n3）硬件同步：DMA 通过硬件请求信号进行同步，不需要软件轮询。",
        keywords: ["直接存储器访问", "解放CPU", "零CPU消耗", "AHB", "硬件同步"],
        explanation: "DMA 的价值在于把「数据搬运」这种低智力但高频的工作从 CPU 手里拿走。ADC 连续采样、串口大量收发、SPI 读写大块数据都是典型应用场景。",
        difficulty: "简单"
      },
      {
        type: "short",
        question: "请描述 ADC 与 DMA 配合使用的完整配置流程。",
        answer: "共 14 步：\n1）开启外设时钟；\n2）定义所有的结构体；\n3）GPIO 结构体配置（模拟输入）；\n4）使 GPIO 配置生效；\n5）ADC 结构体配置；\n6）ADC 通用配置生效；\n7）ADC 配置（规则组/注入组、转换周期）；\n8）ADC 配置生效；\n9）ADC 转换的采样与转换周期设置（总时间 = 采样 + 转换 = 3 + 12 = 15）；\n10）开启 ADC 转换；\n11）DMA 结构体配置；\n12）DMA 配置生效；\n13）启动 DMA；\n14）将 ADC 与 DMA 连接起来（使能 ADC 的 DMA 请求）。",
        keywords: ["时钟", "GPIO", "ADC", "DMA", "连接", "转换周期"],
        explanation: "最后一步「将 ADC 与 DMA 连接起来」最容易被遗漏——ADC 配置好了、DMA 也配置好了，但没有使能 ADC 的 DMA 请求，数据依旧不会自动搬运。此外必须用 DMA2，因为 DMA1 不支持 ADC。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 十一、单总线通讯 ====================
  {
    id: "stm32_onewire",
    name: "单总线通讯",
    icon: "➰",
    description: "单线双向 · DHT11 时序驱动",
    questions: [
      {
        type: "choice",
        question: "单总线技术只有一个数据引脚，它同时承担了什么功能？",
        options: [
          "只能作为数据线",
          "只能作为时钟线",
          "既当数据线，也当时钟线，因此称为「单线双向」",
          "作为电源线和数据线"
        ],
        answer: 2,
        explanation: "单总线技术由美国的达拉斯半导体公司推出，是一种专利技术，通常只有一根线，既可以当数据线，也可以当时钟线，因此叫「单线双向」。因为电路简单、硬件开销小、成本低，广泛应用于嵌入式领域。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "单总线技术的通讯速率是？",
        options: [
          "一般速率 16bit/s，最大速率 140Kbit/s",
          "一般速率 100Kbit/s，最大速率 400Kbit/s",
          "一般速率 1Mbit/s，最大速率 3.4Mbit/s",
          "一般速率 9.6Kbit/s，最大速率 37.5Mbit/s"
        ],
        answer: 0,
        explanation: "单总线的通讯速率：一般速率 16bit/s，最大速率 140Kbit/s。虽然速度慢，但胜在只需要一根线、硬件成本极低，非常适合温湿度传感器这类低速小数据量场景。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "驱动 DHT11 温湿度传感器时，其 DATA 引脚的模式应如何设置？",
        options: [
          "固定为推挽输出",
          "固定为上拉输入",
          "需要在 GPIO 输出和输入之间动态切换",
          "固定为模拟输入"
        ],
        answer: 2,
        explanation: "DHT11 的控制逻辑是：MCU 控制 DHT11 输出（MCU 侧为输出模式，发出复位信号），MCU 接收 DHT11 输入（MCU 侧切换为输入模式，读取应答与数据）。因此必须封装 GPIO 灵活输入输出的函数，在时序中动态切换方向。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "单总线常用于两类温湿度传感器：______ 和 DS18B20；此外还用于 WS2812B 灯带和时钟芯片。",
        answer: "DHT11",
        keywords: ["DHT11"],
        explanation: "单总线的典型应用场景：① DHT11 和 DS18B20 温湿度传感器；② WS2812B 灯带；③ 时钟芯片。单总线的三个引脚为 VCC（电源正极）、GND（电源负极）、DATA（时钟线和数据线）。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "单总线的通讯时序包括三个基本动作：复位信号和应答信号、写 0、写 ______。",
        answer: "1",
        keywords: ["1"],
        explanation: "单总线靠精确的电平持续时间来区分时序：复位信号与应答信号用于建立通讯、确认从机在线；写 0 与写 1 靠不同的低电平持续时间区分（写 0 为短低电平长高电平，写 1 为长低电平短高电平）。因此对延时精度要求很高。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "板载 DHT11 的 DATA 引脚接在 STM32 的 ______ 引脚上。",
        answer: "PG9",
        keywords: ["PG9"],
        explanation: "原理图给出的控制脚位为 DATA---124---PG9。定位脚位永远是驱动外设的第一步：查看原理图获取控制脚位 → 设置脚位功能 → 分析电路获取控制逻辑 → 软件实现。",
        difficulty: "困难"
      },
      {
        type: "short",
        question: "请描述利用单总线技术驱动 DHT11 温湿度传感器的软件编程思路。",
        answer: "共 5 步：\n1）使能 GPIO 口的时钟；\n2）封装 GPIO 灵活输入输出的函数（因为 DATA 引脚需要在输出与输入之间动态切换）；\n3）编写启动 DHT11 的函数：MCU 拉低总线发出复位信号，再释放总线并等待 DHT11 的应答信号；\n4）编写读取单个字节的函数：按位读取，通过高电平的持续时间判断该位是 0 还是 1；\n5）编写读取温湿度数据的函数：按 DHT11 的协议顺序读取湿度整数、湿度小数、温度整数、温度小数与校验字节，并做校验。",
        keywords: ["时钟", "输入输出", "启动", "单个字节", "温湿度"],
        explanation: "单总线的难点在于时序精度是微秒级的，因此延时函数必须准确、且要尽量减少无关的函数调用开销。这也是为什么在很多实现中会直接操作寄存器而不是调用库函数。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "为什么单总线协议的驱动对延时精度要求很高？",
        answer: "因为单总线只用一根线同时承担时钟和数据的功能，通讯双方无法依靠独立的时钟线来同步，只能靠约定好的电平持续时间来区分不同含义。\n具体来说：复位信号需要把总线拉低足够长的时间（典型为微秒量级）才能让从机识别；应答信号是固定的低电平+高电平组合；写 0 与写 1 的区别仅在于低电平持续时间的长短；读取数据时也需要在特定的时间窗口内采样电平。\n因此一旦延时出现偏差，就会把 1 判成 0、把复位信号漏掉，导致读取失败或校验错误。实现上要用准确的微秒级延时，并尽量避免在时序中间插入不确定耗时的操作（例如某些库函数调用、中断、串口打印）。",
        keywords: ["时钟", "延时", "微秒", "低电平", "采样", "校验"],
        explanation: "这条理解是排错的基础：单总线读不到数据时，先怀疑延时函数不准、再怀疑中断打断了时序、最后怀疑引脚模式切换不到位。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 十二、位带操作 ====================
  {
    id: "stm32_bitband",
    name: "位带操作",
    icon: "🎯",
    description: "位带区与别名区 · 地址计算公式",
    questions: [
      {
        type: "choice",
        question: "位带操作的核心作用是什么？",
        options: [
          "提高 Flash 的读写速度",
          "让 STM32 拥有原子性位操作的能力，显著提高位操作效率",
          "降低芯片功耗",
          "扩展 GPIO 的数量"
        ],
        answer: 1,
        explanation: "位带操作实质上就是为了让 STM32 拥有原子性位操作的能力，可以显著提高位操作的效率。它通过位带区与对应的位带别名区实现，位带别名区将位带区的每一个 bit 扩展为四字节 32bits（即一个字），所以位带别名区占用空间是位带区的 32 倍。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "位带别名区的空间是位带区的多少倍？",
        options: ["8 倍", "16 倍", "32 倍", "64 倍"],
        answer: 2,
        explanation: "位带别名区把位带区的每一个 bit 扩展为 4 字节（32 位），原本 1 字节装 8 个 bit，现在每个 bit 占 4 字节，所以放大 8×4 = 32 倍。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "位带地址计算公式 bit_word_addr = bit_band_base + (byte_offset × 32) + (bit_number × 4) 中，bit_number 的取值含义是？",
        options: [
          "目标位所在的字节编号，取值 0-255",
          "目标位的位位置，取值 0-7",
          "位带别名区的起始地址",
          "目标字在别名区中的编号"
        ],
        answer: 1,
        explanation: "公式中：bit_word_addr 代表别名区域中将映射到目标位的字的地址；bit_band_base 代表别名区域的起始地址；byte_offset 代表目标位所在位段区域中的字节编号；bit_number 代表目标位的位位置（0-7）。",
        difficulty: "困难"
      },
      {
        type: "fill",
        question: "位带操作最经典的应用场景是将 GPIO 的位带区与位带别名区关联起来，提供高效操作 ______ 的方法。",
        answer: "GPIO",
        keywords: ["GPIO"],
        explanation: "经典位带场景就是把 GPIO 的位带区与位带别名区关联起来，提供高效操作 GPIO 的方法。修改别名区中的一个「寄存器」就相当于修改了位带区中对应的那一个 bit。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "位带操作中，修改别名区的一个「寄存器」就相当于修改了位带区中对应的一个 ______。",
        answer: "bit",
        keywords: ["bit"],
        explanation: "位带区的 bit 与位带别名区的一个「寄存器」相对应，修改此「寄存器」就相当于修改了对应的 bit。因此可以用一条普通的 32 位写指令原子地完成对单个 bit 的修改，避免「读-改-写」三步操作被中断打断。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "在位带地址计算公式中，每个 bit 占用别名区 ______ 个字节。",
        answer: "4",
        keywords: ["4"],
        explanation: "每个 bit 在别名区占用 4 字节（即一个 32 位字），所以公式中 bit_number 要乘以 4；而每个字节含 8 个 bit，共占 8×4 = 32 字节，所以 byte_offset 要乘以 32。这正好解释了别名区是位带区 32 倍的原因。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "什么是位带操作？它为什么能提高位操作的效率？请写出地址计算公式并解释各参数含义。",
        answer: "位带操作是 STM32（Cortex-M 内核）提供的一种高效操作外设的方法，实质上是为了让 STM32 拥有原子性位操作的能力，可以显著提高位操作的效率。它由「位带区」和对应的「位带别名区」组成：位带别名区把位带区的每一个 bit 扩展为四字节 32bits（即一个字），所以别名区占用空间是位带区的 32 倍。位带区的 bit 与别名区的一个「寄存器」相对应，修改此「寄存器」就相当于修改了对应的 bit。\n效率提升的原因：不用先读出整个寄存器、修改目标位、再写回（读-改-写三步），而是用一条 32 位写指令直接完成对单个 bit 的修改，既减少指令条数，又具备原子性，不会被中断打断。\n地址计算公式：bit_word_addr = bit_band_base + (byte_offset × 32) + (bit_number × 4)\n其中 bit_word_addr 代表别名区域中将映射到目标位的字的地址；bit_band_base 代表别名区域的起始地址；byte_offset 代表目标位所在位段区域中的字节编号；bit_number 代表目标位的位位置（0-7）。",
        keywords: ["原子", "别名区", "32", "bit_band_base", "byte_offset", "bit_number"],
        explanation: "经典应用场景是把 GPIO 的位带区与位带别名区关联起来，用类似寄存器的写法直接操作某一个引脚，代码更简洁、效率更高。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 十三、软硬件 SPI ====================
  {
    id: "stm32_spi",
    name: "软硬件SPI",
    icon: "🔗",
    description: "一主多从 · CPOL/CPHA · W25Q128 读写",
    questions: [
      {
        type: "choice",
        question: "SPI 属于哪一类通讯总线？",
        options: [
          "串行、异步、半双工",
          "串行、同步、全双工",
          "并行、同步、全双工",
          "串行、同步、半双工"
        ],
        answer: 1,
        explanation: "SPI（Serial Peripheral Interface）串行外设总线，由摩托罗拉公司最先提出，是一种串行、同步、全双工的通讯总线。串行指数据按 bit 逐位发送；同步指发送数据后必须等待对方应答才能发送下一个数据；全双工指数据发送时可以同时接收。SPI 最大通讯速率可以达到 37.5Mbits/s。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "关于 SPI 的架构，下列说法正确的是？",
        options: [
          "多主多从，任何设备都能提供时钟",
          "一主多从，主设备通过 CS/SS 片选引脚决定和哪一个从设备同步通讯",
          "只能点对点连接，不支持多个从设备",
          "从设备提供时钟线"
        ],
        answer: 1,
        explanation: "SPI 遵循一主多从架构（Master/Slave），一般一个主机可以连接一个或者多个从设备。提供时钟线的为主设备，接收时钟线的为从设备。一般由主设备发起，主设备通过 CS/SS 片选引脚决定和其中一个从设备进行同步通讯，最终完成数据置换。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "关于 SPI 通讯中可以接入多少个从机，下列理解正确的是？",
        options: [
          "不受任何限制，理论上无限多",
          "与 GPIO 数量、总线频率有关，一条 SPI 建议接入不超过 8-10 个从机",
          "固定最多 128 个，由 7 位地址决定",
          "固定最多 32 个"
        ],
        answer: 1,
        explanation: "这条笔记标注的面试题的正确答案：① 与 GPIO 数量有关，一个 SPI 从机需要使用 4 个 GPIO（SCLK、MOSI、MISO、CS），每个从机还需要额外的片选脚；② 总线频率与从机的数量有关，从机越多、负载电容越大，速率越受限；③ 一条 SPI 建议接入不超过 8-10 个从机。",
        difficulty: "困难"
      },
      {
        type: "choice",
        question: "SPI2 与 SPI3 在 STM32 上的最大通讯速率是？",
        options: ["37.5Mbits/s", "21Mbits/s", "10Mbits/s", "3.4Mbits/s"],
        answer: 1,
        explanation: "STM32 内部硬件 SPI 的通讯速率：SPI1 为 37.5Mbits/s，SPI2 为 21Mbits/s，SPI3 为 21Mbits/s。注意这三个是各 SPI 的最大速率，SPI1 挂在 APB2（84MHz）上，因此速率明显更高。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "SPI 的四个通讯管脚中，MOSI 的含义是主机 ______、从机 ______。",
        answer: "输出、输入",
        keywords: ["输出", "输入"],
        explanation: "SPI 四个管脚：SCLK（串行时钟线）、MOSI（主机输出、从机输入）、MISO（主机输入、从机输出）、CS/SS（片选引脚）。名字本身就说明了方向，是理解 SPI 全双工的关键。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "SPI 的两个关键通讯参数是 CPOL 与 CPHA，其中 CPOL 决定总线空闲时 SCLK 的 ______ 高低，CPHA 决定主机采集从机数据的时机。",
        answer: "电平",
        keywords: ["电平"],
        explanation: "CPOL（时钟极性）：总线空闲时 SCLK 的电平高低；CPHA（时钟相位）：主机采集从机数据的时机。两者组合形成 SPI 的四种工作模式。另外 SPI 默认 MSB（高位先出）。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "W25Q128 的容量是 128Mbit，等于 ______ Mbyte。",
        answer: "16",
        keywords: ["16"],
        explanation: "128Mbit = 16Mbyte = 16×1024×1024 = 16777216 byte。由此可算：16777216/256 = 65536 page；16777216/(4×1024) = 4096 sector；16777216/(32×1024) = 512 block；16777216/(64×1024) = 256 block。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "在 SPI 驱动 W25Q128 的操作中，扇区擦除的指令是 0X______。",
        answer: "20",
        keywords: ["20"],
        explanation: "W25Q128 核心指令：写使能（解锁）为 0X06、写失能（上锁）为 0X04、扇区擦除为 0X20、页写入为 0X02、读取为 0X03。擦除和写入都需要先发写使能指令，操作完成后查询 BUSY 位确认完成，最后发写失能指令上锁。",
        difficulty: "困难"
      },
      {
        type: "short",
        question: "请描述利用硬件 SPI 读取外挂 FLASH 芯片信息的配置流程，并说明为什么 PB14 要单独配置为输出模式。",
        answer: "配置流程（共 9 步）：\n1）使能 GPIOB 的时钟；\n2）配置模式：PB14 配置为输出模式，其余三个引脚（PB3/PB4/PB5）配置为复用模式；\n3）使 GPIO 配置生效；\n4）使能 SPI 的时钟；\n5）将 GPIO 复用为 SPI1；\n6）配置 SPI 的结构体（主从模式、数据宽度、CPOL、CPHA、分频等）；\n7）使 SPI 结构体配置生效；\n8）启动 SPI；\n9）根据数据手册获取目标信息，验证 SPI 通讯完成。\nPB14 单独配置为输出模式的原因：PB14 用作 F_CS（软件片选），而该引脚没有硬件的 SPI1_NSS 功能，只能由 GPIO 手动控制片选电平——不通讯时为高电平，开始通讯时拉低。",
        keywords: ["时钟", "复用", "输出", "SPI", "片选", "CS"],
        explanation: "片选默认高电平、通讯时变低是 SPI 的硬件约定。选择 CS 进行设备片选后，MOSI、MISO、SCK 才进行数据发送和信号同步。用 GPIO 软件控制片选反而更灵活，因为可以在一次事务中连续操作多个指令而不释放片选。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "请描述利用 SPI 对 W25Q128 芯片进行读、写、擦操作的完整流程。",
        answer: "FLASH 的核心功能是解锁（写使能）、上锁（写失能）、读、写、擦，核心操作等于 SPI_sendbyte 加上 W25Q128 的命名指令。\n1）FLASH 解锁（写使能）：CS 变低 → SPI_sendbyte(0X06) → CS 变高；\n2）FLASH 上锁（写失能）：CS 变低 → SPI_sendbyte(0X04) → CS 变高；\n3）FLASH 擦除：先解锁（写使能）→ CS 变低 → SPI_sendbyte(0X20) → 发送 24 位扇区地址 → CS 变高 → 查询 BUSY 位判断是否完成 → 上锁（写失能）；\n4）FLASH 写入：先擦除 → 解锁（写使能）→ CS 变低 → SPI_sendbyte(0X02) → 24 位扇区地址 → 写入数据 → CS 变高 → 查询 BUSY 位 → 上锁（写失能）；\n5）FLASH 读取：CS 变低 → SPI_sendbyte(0X03) → 24 位扇区地址 → 数据置换 → CS 变高。",
        keywords: ["写使能", "写失能", "擦除", "写入", "读取", "BUSY"],
        explanation: "两条必须记住的规律：① 任何改变内容的操作（擦除、写入）之前都要先发写使能，之后要发写失能上锁，防止误操作；② 擦除和写入都需要时间，必须查询 BUSY 位或延时等待，不能发完指令立刻进行下一步。写入之前必须先擦除，因为写入只能把 1 变成 0。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 十四、IIC 总线 ====================
  {
    id: "stm32_iic",
    name: "IIC总线",
    icon: "🔀",
    description: "开漏与上拉 · 地址与速率 · 锁死排查",
    questions: [
      {
        type: "choice",
        question: "关于 IIC 总线的架构与寻址，下列说法正确的是？",
        options: [
          "单主单从，靠片选引脚选择设备",
          "多主多从，通过寻址实现，常见地址有 7 位（128 个）/10 位（1024 个）",
          "一主多从，必须有独立的片选线",
          "任何设备都可以当主机，且不需要唯一地址"
        ],
        answer: 1,
        explanation: "IIC 是由菲利普开发的串行同步半双工通讯协议，由一根时钟线和一根数据线组成，每个设备挂载在两根总线上且每个设备的地址必须固定且唯一，任何连接在总线上的设备既可以当主机也可以当从机（多主多从）。挂载数量靠寻址实现，常见地址有 7 位（128 个）和 10 位（1024 个）。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "IIC 总线的 SCL 和 SDA 为什么必须配置为复用开漏模式并加外部上拉电阻？",
        options: [
          "为了提高通讯速率",
          "因为推挽模式下会造成设备间的短路烧坏 GPIO，而开漏模式电平驱动能力弱无法输出 1，需要外部上拉提高驱动能力",
          "为了降低功耗",
          "为了支持更高的电压"
        ],
        answer: 1,
        explanation: "这是笔记标注的面试题。原因有两层：① 推挽模式下会造成设备间的短路从而烧坏 GPIO（一方输出高、另一方输出低时形成短路）；② 开漏模式下电平驱动能力弱、无法输出 1，需要设置外部上拉电阻提高驱动能力。整体遵循「线与」特性：只有所有设备都输出 1 时总线才为 1。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "IIC 总线的三种速率分别是？",
        options: [
          "标准 100K、快速 400K、高速 3.4M",
          "标准 10K、快速 100K、高速 1M",
          "标准 1M、快速 10M、高速 37.5M",
          "标准 9.6K、快速 115.2K、高速 1M"
        ],
        answer: 0,
        explanation: "IIC 的速率等级：标准 100K、快速 400K、高速 3.4M。不同速率的设备之间要兼容，笔记给出两种办法：① 速率要向下兼容；② 重开一路 IIC 通讯（把不同速率的设备挂到不同的 IIC 总线上）。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "关于软件 IIC 与硬件 IIC，下列说法正确的是？",
        options: [
          "硬件 IIC 应用广泛，软件 IIC 基本不使用",
          "硬件 IIC 基本不使用，因为 STM32 的硬件 IIC 频率与实际 IIC 频率不匹配，导致从机不应答；软件 IIC 应用场景广泛、接口灵活、不受硬件外设限制",
          "两者完全等价，可以随意选择",
          "软件 IIC 的速率一定低于硬件 IIC"
        ],
        answer: 1,
        explanation: "笔记给出的结论：硬件 IIC 基本不使用，原因是 STM32 的硬件 IIC 的频率与实际 IIC 频率不匹配，导致从机不应答；软件 IIC 应用场景广泛，接口灵活，不受硬件外设限制。因此实际项目里用两个普通 GPIO 模拟时序更为常见。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "IIC 的两根信号线是 SCL（串行时钟线）和 SDA（串行数据线），二者都是双向 IO，且都必须配置为 ______ 模式。",
        answer: "复用开漏",
        keywords: ["复用开漏"],
        explanation: "SCL 和 SDA 都是双向 IO，而且都必须配置为复用开漏模式。软件 IIC 时通常把 SCL 配置为开漏输出、SDA 灵活配置为输入与输出模式（读写切换）。外部上拉电阻一般取 1K-10K。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "IIC 锁死时，SCL 为高电平（主机控制），SDA 为 ______ 电平（从机控制）；解决方式有软件解锁（强行释放 SDA）和硬件解锁（硬件复位从机）两种。",
        answer: "低",
        keywords: ["低"],
        explanation: "空闲正常状态：SCL 高电平、SDA 高电平；锁死状态：SCL 为高电平（主机控制）、SDA 为低电平（从机控制）。方式一软件解锁：强行释放 SDA；方式二硬件解锁：硬件复位从机。",
        difficulty: "困难"
      },
      {
        type: "fill",
        question: "IIC 通讯时序的基本步骤为：通讯开始 → 主机向从机发送一个字节数据 → 从机向主机发送 1bit（应答）→ 从机向主机发送一个字节数据 → 主机向从机发送 1bit（应答）→ 通讯 ______。",
        answer: "结束",
        keywords: ["结束"],
        explanation: "这条时序说明了 IIC 是半双工：同一时刻只有一个方向在传数据，方向切换靠谁提供时钟、谁发应答来决定。每个字节传输后面都必须跟一位应答（ACK/NACK），这是 IIC 的可靠性机制。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "什么是 IIC 锁死？如何排查和解决？",
        answer: "IIC 锁死的表现：正常情况下空闲时 SCL 和 SDA 都应为高电平；锁死时 SCL 为高电平（由主机控制），而 SDA 被从机拉为低电平不放。这通常发生在主机在从机发送数据的过程中被复位或被干扰打断，主从双方的时序状态机不再同步，从机一直等待时钟而占住数据线。\n解决方式有两种：\n1）软件解锁：强行释放 SDA。典型做法是主机把 SCL 配置为输出并连续发出若干个时钟脉冲（一般为 9 个以上），让从机把剩余的数据位和应答位发送完毕从而释放 SDA，再补发一个停止条件；\n2）硬件解锁：硬件复位从机，把从机的电源断开再上电或使用其复位引脚，使从机状态机回到初始态。\n排查思路：先用示波器或逻辑分析仪观察 SCL/SDA 电平，确认是否为「SCL 高、SDA 低」；再检查上拉电阻是否缺失或阻值过大、总线速率是否过高、是否有设备在通讯中途掉电，以及软件时序是否被中断打断。",
        keywords: ["SCL", "SDA", "低电平", "软件解锁", "硬件复位", "上拉"],
        explanation: "这是笔记标注的面试题，也是 IIC 实际调试中最常遇到的问题。预防手段是：不要在主从通讯中途复位主机、给关键时序加临界区保护、加上拉电阻并合理选择阻值与速率。",
        difficulty: "困难"
      },
      {
        type: "short",
        question: "请描述完成软件 IIC 底层通讯的软件实现步骤。",
        answer: "共 9 步：\n1）使能 GPIOB 组的时钟；\n2）配置 GPIO：SCL 配置为开漏输出，SDA 灵活配置为输入和输出模式；\n3）使 GPIO 配置生效；\n4）编写 IIC 启动（通讯开始）函数；\n5）编写 IIC 结束（通讯停止）函数；\n6）编写主机向从机发送一个字节的函数；\n7）编写接收从机 1bit 应答的函数（从机向主机发送一个 bit）；\n8）编写从机向主机发送一个字节的函数；\n9）编写主机向从机发送 1bit 应答的函数。\n硬件上 IIC_SCL 接 PB8、IIC_SDA 接 PB9，两个引脚均支持软件与硬件 IIC；外部需要加上拉电阻 1K-10K。",
        keywords: ["时钟", "开漏", "启动", "结束", "字节", "应答"],
        explanation: "软件 IIC 的本质就是用 GPIO 加延时手动模拟出 SCL 与 SDA 的时序。因为 SDA 需要读也需要写，所以必须能在输入与输出模式之间动态切换，这一点与单总线驱动 DHT11 的思路一致。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 十五、CAN 总线通讯 ====================
  {
    id: "stm32_can",
    name: "CAN总线通讯",
    icon: "🚗",
    description: "差分电平 · 帧格式 · 位填充 · 多机组网",
    questions: [
      {
        type: "choice",
        question: "高速 CAN 总线规定，电压差为 0V 和 2V 分别表示什么？",
        options: [
          "0V 表示逻辑 0（显性），2V 表示逻辑 1（隐性）",
          "0V 表示逻辑 1（隐性），2V 表示逻辑 0（显性）",
          "0V 和 2V 都表示逻辑 1",
          "电位差与逻辑值无关"
        ],
        answer: 1,
        explanation: "CAN 总线采用差分信号，用得最多的是高速 CAN：规定电压差为 0V 时表示逻辑 1（隐性电平），电压差为 2V 时表示逻辑 0（显性电平）。低速 CAN 规定电压差为 -1.5V 时表示逻辑 1（隐性），电压差为 3V 时表示逻辑 0（显性）。",
        difficulty: "困难"
      },
      {
        type: "choice",
        question: "CAN 总线中报文 ID 与优先级的关系是？",
        options: [
          "ID 数字越大优先级越高",
          "ID 数字越小优先级越高",
          "优先级与 ID 无关，由发送顺序决定",
          "优先级由数据长度决定"
        ],
        answer: 1,
        explanation: "CAN 使用 11 位或 29 位报文 ID，用于区分消息，同时决定了消息的优先级，ID 数字越小优先级越高。这是由 CAN 总线「显性电平覆盖隐性电平」的仲裁机制决定的：仲裁时 ID 数值小（显性位更多）的节点胜出。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "关于 CAN 总线的数据帧各字段，下列说法正确的是？",
        options: [
          "标准 ID 为 11bit，范围 0x000-0x7FF；DLC 为 4bit",
          "标准 ID 为 11bit，范围 0x000-0xFFF；DLC 为 8bit",
          "标准 ID 为 29bit，范围 0x000-0x7FF；DLC 为 4bit",
          "标准 ID 为 11bit，范围 0x000-0x7FF；DLC 为 8bit"
        ],
        answer: 0,
        explanation: "标准 ID 为 11bit，范围 0x000-0x7FF，作用是帧的标识符并决定优先级（ID 越小优先级越高）；DLC（Data Length Code，数据长度码）为 4bit，范围 0000-1000，作用是告诉设备将要发送的数据字节数，如果 DLC 超过 8 还是按最大 8 字节处理。",
        difficulty: "困难"
      },
      {
        type: "choice",
        question: "关于 CAN 数据帧的位填充规则，下列说法正确的是？",
        options: [
          "连续出现 5 个相同电平就必须插入一个相反的 bit 位，填充规则不包括 EOF、ACK 界定符、CRC 界定符",
          "连续出现 3 个相同电平就必须插入一个相反的 bit 位，全部字段都要填充",
          "位填充只发生在 EOF 字段",
          "CAN 不使用位填充机制"
        ],
        answer: 0,
        explanation: "位填充规则：连续出现 5 个相同电平，必须出现一个相反的 bit 位。注意填充不包括 EOF、ACK 界定符、CRC 界定符这三个字段。位填充的目的是保证总线上有足够的跳变沿供接收方做位同步。",
        difficulty: "困难"
      },
      {
        type: "fill",
        question: "CAN 的数据帧中，帧结束（EOF）由连续 ______ 个隐性电平组成，标志着整帧数据传输完毕。",
        answer: "7",
        keywords: ["7"],
        explanation: "EOF 为 7bit，连续 7 个隐性电平。注意帧结束（EOF）出现显性电平会被认定为帧错误。与之对应，帧起始（SOF）为 1bit 显性电平，强制电平为逻辑 0（CAN_H-CAN_L = 2V），作用表示一帧数据的开始。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "CAN 数据帧中，CRC 校验字段长度是 ______ bit，其计算范围是从 SOF 开始直到数据场结束的所有位。",
        answer: "15",
        keywords: ["15"],
        explanation: "CRC 校验为 15bit，通过按位异或计算，计算范围从 SOF 开始直到数据场结束的所有位；如果校验值不一致，就会发送错误帧，请求重传。CRC 之后的 CRC 界定符为 1bit 强制隐性电平，用于分割 CRC 和应答 ACK。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "CAN 总线规定 5 种类型的协议帧：数据帧、遥控帧、错误帧、过载帧和 ______ 帧。",
        answer: "间隔",
        keywords: ["间隔"],
        explanation: "五种帧：数据帧（发送设备主动发送数据，广播式）、遥控帧（接收设备主动接收数据，请求式）、错误帧（某个设备出现错误时向其他设备通知错误）、过载帧（接收设备通知其他设备做好接收工作）、间隔帧（用于分隔遥控帧和数据帧）。",
        difficulty: "简单"
      },
      {
        type: "fill",
        question: "CAN 总线理论上可以挂载无数个节点，ISO 标准建议 ______ 个，工业上实际使用 30-60 个。",
        answer: "120",
        keywords: ["120"],
        explanation: "CAN 总线节点数量：理论上可以挂载无数个；ISO 标准建议 120 个；恩智浦 TJA1050 CAN 收发器支持 110 个；工业上实际使用 30-60 个。受限的主要因素是总线电容与驱动能力。",
        difficulty: "困难"
      },
      {
        type: "short",
        question: "CAN 总线有哪些特点？请与 USART、SPI、IIC 做对比。",
        answer: "CAN（Controller Area Network）是 BOSCH 公司提出的控制器局域网总线，特点是简洁、传输速度快、稳定可靠，广泛用于汽车电子和工业控制。主要特点：\n1）两根线（CAN_H 和 CAN_L），资源简单，不用供地；\n2）差分信号，抗干扰能力强；\n3）高速 CAN（125K-1Mbps，40m）、低速 CAN（10K-125Kbps，1000m）；\n4）串行异步半双工协议，多主多从；\n5）11 位/29 位报文 ID，用于区分消息并决定优先级，ID 越小优先级越高；\n6）可以实现 1-8 字节的数据传输；\n7）可分为广播式和请求式传输；\n8）具备应答、CRC、位填充、位同步、错误处理机制。\n与其他串行总线对比：USART 引脚 TX/RX，异步、全双工、点对点、距离 1.5m；SPI 引脚 CS/MOSI/MISO/CLK，同步、全双工、一主多从、距离 10m；IIC 引脚 SDA/SCL，同步、半双工、一/多主多从、距离 2m；CAN 引脚 CAN_H/CAN_L，异步、半双工、多主多从、距离 40m。",
        keywords: ["差分", "抗干扰", "多主多从", "ID", "半双工", "距离"],
        explanation: "对比记忆的关键维度是「引脚数、时钟方式（同步/异步）、双工方式、拓扑架构、通讯距离」五要素。CAN 的核心竞争力是差分传输带来的抗干扰能力与多主仲裁机制，因此成为汽车电子的标配。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "请描述 CAN 数据帧的完整格式（从帧起始到帧结束）。",
        answer: "依次为：\n1）帧起始（SOF）：1bit，强制显性电平（逻辑 0，CAN_H-CAN_L = 2V），表示一帧数据的开始；\n2）标准 ID：11bit，范围 0x000-0x7FF，是帧的标识符并决定优先级，ID 越小优先级越高；\n3）RTR：1bit，远程传输请求，0（显性）为数据帧、后随数据场，1（隐性）为遥控帧、请求其他节点发送该 ID 的数据、无数据场；\n4）IDE：1bit，标识符扩展，0（显性）为标准帧（11 位 ID）、1（隐性）为扩展帧（29 位 ID）；\n5）r0 保留位：1bit，必须发送显性电平 0，是 CAN 协议预留位用于未来协议拓展；\n6）DLC 数据长度码：4bit，范围 0000-1000，告诉设备将要发送的数据字节数，超过 8 仍按 8 字节处理；\n7）数据场（Data）：0-64bit（0-8 字节），输出实际数据，长度由 DLC 决定，若 DLC 为 0 则数据场不存在；\n8）CRC 校验：15bit，按位异或计算，范围为 SOF 到数据场结束的所有位，校验不一致则发送错误帧请求重传；\n9）CRC 界定符：1bit，强制隐性电平（1），用于分割 CRC 和应答 ACK；\n10）ACK 槽：1bit，发送方固定为隐性电平，任何正确收到该帧的节点会在此位置把总线显示为显性电平 0；\n11）ACK 界定符：1bit，强制隐性电平（1），是应答场的结束标志，在 ACK 槽与 ACK 界定符之间不允许由任何显性电平；\n12）帧结束（EOF）：7bit，连续 7 个隐性电平，标志整帧传输完毕，出现显性电平会被认定为帧错误。",
        keywords: ["SOF", "ID", "RTR", "IDE", "DLC", "CRC", "ACK", "EOF"],
        explanation: "记忆主线：起始 → 谁发的（ID/IDE）→ 要什么（RTR）→ 多长（DLC）→ 数据 → 校验（CRC）→ 应答（ACK）→ 结束（EOF）。位填充规则为连续 5 个相同电平插入一个相反位，但不包括 EOF、ACK 界定符与 CRC 界定符。",
        difficulty: "困难"
      },
      {
        type: "short",
        question: "请描述 CAN 总线通讯实现多块 MCU 组网通讯的软件实现流程。",
        answer: "共 13 步：\n1）使能 GPIOD 组的时钟；\n2）GPIO 结构体配置（CAN_TX 接 PD1、CAN_RX 接 PD0，配置为复用模式）；\n3）GPIO 配置生效；\n4）将 GPIO 口复用为 CAN 口；\n5）配置 CAN 的结构体（波特率、工作模式、自动重传等）；\n6）CAN 结构体配置生效；\n7）配置 CAN 的滤波器（笔记中配置为任意 ID、所有帧、32 位/屏蔽模式）；\n8）CAN 滤波器配置生效；\n9）开启 CAN 的中断；\n10）NVIC 结构体配置；\n11）NVIC 结构体配置生效；\n12）编写中断服务函数；\n13）编写 CAN 发送函数。\n硬件上 CAN_H 和 CAN_L 实现差分信号，需要挂接 120Ω 终端电阻。",
        keywords: ["时钟", "复用", "CAN", "滤波器", "NVIC", "中断服务函数"],
        explanation: "CAN 比前面的外设多出一个「滤波器配置」步骤：因为 CAN 是广播式的，总线上所有帧都会被每个节点收到，需要通过验收滤波器决定哪些 ID 的报文才值得进入接收缓冲区和产生中断，从而避免 CPU 被无关报文淹没。",
        difficulty: "中等"
      }
    ]
  },

  // ==================== 十六、FreeRTOS 移植 ====================
  {
    id: "stm32_freertos",
    name: "FreeRTOS移植",
    icon: "🧩",
    description: "RTOS 概念 · 源码结构 · 工程移植 · 配置项",
    questions: [
      {
        type: "choice",
        question: "RTOS 与电脑操作系统的本质区别是什么？",
        options: [
          "RTOS 没有 MMU（内存管理单元），不是电脑操作系统，本质是单片机内存管理的一些文件",
          "RTOS 没有中断机制",
          "RTOS 不能运行多个任务",
          "RTOS 只能用汇编开发"
        ],
        answer: 0,
        explanation: "RTOS（Real-Time Operating System）实时操作系统，并非电脑操作系统，因为它没有 MMU（内存管理单元），而是单片机内存管理的一些文件。当系统功能越复杂、人力无法对 MCU 内存进行合理分配时，就要使用操作系统进行优化。「实时」的含义是 RTOS 内部的任务需要在指定的时间片内完成。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "FreeRTOS 源码中，任务管理的核心文件是哪一个？",
        options: ["queue.c", "task.c", "list.c", "timer.c"],
        answer: 1,
        explanation: "Source 文件夹下的主要文件：include（头文件）、portable（运行环境）、croutine.c（协程式，基于 8/16 位单片机，32 位一般用不到）、event_group.c（事件标志组）、list.c（链表）、queue.c（队列）、task.c（任务管理代码，核心）、timer.c（定时器）。",
        difficulty: "中等"
      },
      {
        type: "choice",
        question: "FreeRTOS 的两种任务调度策略是？",
        options: [
          "抢占式调度与时间片轮转",
          "轮询调度与中断调度",
          "优先级反转与优先级继承",
          "静态调度与动态调度"
        ],
        answer: 0,
        explanation: "FreeRTOS 的任务调度策略：① 抢占式调度——每个任务设置优先级，数字越大优先级越高，高优先级任务可以抢占低优先级任务；② 时间片轮转——当任务优先级相同时，任务会固定运行一个时间片，时间片使用完就休眠退出，由下一个同优先级任务运行。",
        difficulty: "简单"
      },
      {
        type: "choice",
        question: "在 FreeRTOSConfig.h 中，允许使用的最大优先级 configMAX_PRIORITIES 默认配置为多少？",
        options: ["8", "16", "32", "64"],
        answer: 2,
        explanation: "configMAX_PRIORITIES 配置为 32，即可使用的最大优先级为 32。与之相关的还有：configTICK_RATE_HZ 为 1000（一秒中断 1000 次）、configMINIMAL_STACK_SIZE 为 128（空闲任务堆栈大小）、configUSE_16_BIT_TICKS 为 0（系统节拍计数器使用 32 位无符号整型）。",
        difficulty: "困难"
      },
      {
        type: "fill",
        question: "FreeRTOS 的特点包括开源免费不涉及版权问题、系统内核文件小（内核文件约 ______ KB）、移植简单、使用嵌入式 C 语言操作。",
        answer: "10",
        keywords: ["10"],
        explanation: "FreeRTOS 官网为 www.freertos.org，特点：① 开源免费，不涉及版权问题；② 系统内核文件小，内核文件 10KB；③ 移植简单，操作简单，使用嵌入式 C 语言操作；④ 目前市面上已经很少有纯裸机开发，大多数 MCU 厂商将 RTOS 嵌入产品。企业至少要掌握一种 RTOS：FreeRTOS、UCOSIII、RT-Thread、VxWorks。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "FreeRTOS 源码结构分为 Demo（不同型号 MCU 相关例程）、______（提供相关的许可证）和 Source（系统源码文件）三部分。",
        answer: "License",
        keywords: ["License"],
        explanation: "FreeRtos 目录下：Demo 为不同型号 MCU 的相关例程、License 提供相关的许可证、Source 为 FreeRTOS 的源码文件。Source 下又包含 include、portable 和若干 .c 文件。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "在 FreeRTOSConfig.h 中，configUSE_PREEMPTION 置 ______ 表示 RTOS 使用抢占式调度器，置 0 表示使用协作式调度器。",
        answer: "1",
        keywords: ["1"],
        explanation: "configUSE_PREEMPTION 置 1 使用抢占式调度器，置 0 使用协作式调度器（时间片）。协作式操作系统是任务主动释放 CPU 后才切换到下一个任务，任务切换的时机完全取决于正在运行的任务。与之配套的 configUSE_TIME_SLICING 置 1 使能时间片调度。",
        difficulty: "中等"
      },
      {
        type: "fill",
        question: "从裸机开发走向实时操作系统后，程序结构从「一个 while(1) + 若干中断服务函数」变为「多个中断服务函数 + 多个 ______ + RTOS 管理文件」。",
        answer: "while(1)",
        keywords: ["while(1)"],
        explanation: "三层演进：裸机开发（轮询 while(1)，或前后台 = 多个中断服务函数 + while(1)）→ 实时操作系统（多个中断服务函数 + 多个 while(1) 分配成独立任务 + RTOS 管理文件）。为什么必须使用 RTOS？用户对于任务的实时要求很高，并且在系统功能复杂时需要使用 RTOS。",
        difficulty: "中等"
      },
      {
        type: "short",
        question: "请描述 FreeRTOS 在 STM32F407 工程上的移植步骤。",
        answer: "1）创建一个 STM32 工程模板，并配置好相关时钟（168MHz）；\n2）系统移植：\n  a）在工程中创建一个 FREERTOS 的文件夹；\n  b）把 FreeRTOS 源码中 Source 文件夹下的所有内容复制到工程的 FREERTOS 文件夹；\n  c）把 FreeRTOS 源码中 DEMO 下 STM32F407ZG-SK 的 FreeRTOSConfig.h 复制到 FREERTOS 文件夹下的 include 文件夹内；\n  d）删除 FREERTOS 文件夹 portable 下除 keil（编译器）、memmang（内存管理文件）、RVDS（使用 MDK 编译环境所必须的文件）三个文件夹之外的所有内容；\n  e）打开工程新建两个分组：FREERTOSCOR 和 FREERTOSPORTABLE；\n  f）向 FREERTOSCOR 添加所有的 .h 和 6 个 .c；向 FREERTOSPORTABLE 添加 port.c、portmacro.h 和 heap4.c；\n  g）在魔术棒按钮中包含两个头文件路径 include 和 CM4F；\n  h）编译后出现 SystemCoreClock 无法识别，原因是编译器宏未开启，修改第 87 行为 #if defined (__ICCARM__) || (__CC_ARM) || (__GNUC__)，再次编译后再把 93、94、106、108 处的 1 均改为 0。",
        keywords: ["Source", "FreeRTOSConfig.h", "portable", "heap4", "include", "CM4F", "SystemCoreClock"],
        explanation: "移植的两个关键动作：一是 portable 目录要按编译器精简（只保留 keil/memmang/RVDS）；二是 FreeRTOSConfig.h 里的编译器宏与几个重定向配置要按所用编译器调整，否则会出现 SystemCoreClock 无法识别之类的编译错误。",
        difficulty: "困难"
      },
      {
        type: "short",
        question: "FreeRTOS 中的空闲钩子（Idle Hook）与时间片钩子（Tick Hook）分别是什么？使用时各有什么约束？",
        answer: "空闲钩子：由 configUSE_IDLE_HOOK 控制，置 1 时使用。它是一个由用户实现的函数，FreeRTOS 规定了函数名和参数：void vApplicationIdleHook(void)，这个函数在每个空闲任务周期都会被调用。作用包括：对于已经删除的 RTOS 任务，空闲任务可以释放分配给它们的堆栈内存，因此必须保证空闲任务可以被 CPU 执行；使用空闲钩子函数设置 CPU 进入省电模式是很常见的。约束：不可以调用会引起空闲任务阻塞的 API 函数。\n时间片钩子：由 configUSE_TICK_HOOK 控制，置 1 时使用。它也是一个由用户实现的函数，FreeRTOS 规定了函数名和参数：void vApplicationTickHook(void)，时间片中断可以周期性地调用它。约束：函数必须非常短小，不能大量使用堆栈，不能调用以 FromISR 结尾的 API 函数。",
        keywords: ["vApplicationIdleHook", "vApplicationTickHook", "堆栈", "省电", "FromISR"],
        explanation: "两个钩子的共同点是「由用户实现、名字和参数固定、必须轻量」。空闲钩子适合做省电、内存回收；时间片钩子适合做周期性计数、喂狗等极轻量工作。",
        difficulty: "困难"
      }
    ]
  }
];
