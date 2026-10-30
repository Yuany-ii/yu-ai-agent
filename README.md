# 星图智能体平台软件 V1.0

面向企业业务咨询与任务自动化的智能体应用系统。以检索增强生成（RAG）与自主规划执行（ReAct）为核心，
提供从智能体配置、DAG 工作流编排、运行审批、质量评测到定时触发和多智能体协作的完整工程闭环。

## 功能模块

| 模块 | 能力 | 说明 |
|---|---|---|
| 智能顾问 | 知识库检索问答 | 先检索平台知识库，再结合检索片段生成带依据的结构化回答，支持多轮追问 |
| 任务智能体 | 自主规划与工具调用 | 将目标拆解为多个步骤，调用工具逐步执行，执行轨迹实时可视化 |
| 文档问答 | 上传文档后精确提问 | 上传 Markdown / 纯文本文档即时建索引，严格依据正文作答并标注引用 |
| 文档分级授权 | 私有 / 指定成员 / 平台公开 | 可见性由单一服务出口判定，列表过滤、正文读取、提问、授权、删除全部复用 |
| 访问申请审批 | 越权访问转系统流程 | 成员填写理由提交申请，所有者或管理员在审批中心通过或驳回，全程留痕 |
| 文档版本管理 | 上传新版本与回滚 | 历史版本完整保留；回滚以历史内容生成新版本，不覆盖不删除，可沿版本号追溯 |
| 引用溯源 | 回答定位到原文 | 文档切片带字符偏移，回答问题后可在原文视图精确高亮对应区间 |
| 会话分享 | 只读链接 | 生成分享令牌，无需登录即可查看完整问答记录；可随时取消，取消后立即失效 |
| 数据看板 | 运行指标汇总 | 文档分布、会话与分享数量、待审申请、越权拦截次数，配趋势图与分布图 |
| 访问审计 | 操作留痕 | 记录查看、提问、上传、授权、删除、审批、回滚等操作，拒绝访问同样留痕 |
| 会话管理 | 会话记录组织 | 各模块独立维护会话列表，支持新建、切换、重命名、删除，本地持久化 |
| 结果导出 | Markdown / PDF | 导出完整对话记录，PDF 带软件名称、时间标记与中文字体嵌入 |
| 智能体编排 | 可配置智能体与版本发布 | 配置提示词、模型、知识范围、工具白名单和可见范围，保存版本快照并单独发布 |
| 工作流编排 | DAG 节点编排与校验 | 支持开始、知识检索、大模型、工具、条件、审批、多智能体、输出八类节点 |
| 运行中心 | 任务生命周期与轨迹 | 保存运行快照、节点轨迹、耗时和 Token 估算，支持暂停、恢复、取消、重试 |
| 质量评测 | 测试集与发布门禁 | 组合期望词、禁用词、引用和格式约束形成可比较的评测记录 |
| 知识治理 | 切片配置与混合检索 | 联合计算词法命中、语义哈希余弦和覆盖度，并记录知识缺口 |
| 安全中心 | 脱敏、注入检测与工具分级 | 模型调用前检测风险与脱敏，高风险工具需要审批或默认禁用 |
| 多智能体协作 | 规划、检索、执行、复核 | 四个角色显式传递中间结果，各阶段独立留痕 |
| 自动化触发 | 模板、定时任务与外部 API | 工作流模板复制，独立令牌外部调用，分钟级定时执行 |
| 反馈闭环 | 运行评分与纠错 | 低分反馈自动形成知识缺口，用于后续评测和知识治理 |

## 技术架构

**服务端**：Java 17+ / Spring Boot 3 / Spring AI

```
src/main/java/com/xingtu/platform/
├── agent/          智能体核心（BaseAgent 状态机、ReActAgent、ToolCallAgent、StarManus）
├── app/            业务应用（ConsultApp 智能顾问）
├── controller/     接口层（对话、文档、访问申请、看板、导出、鉴权）
├── tools/          工具集（搜索、抓取、文件读写、PDF 生成、资源下载、终端、终止）
├── rag/            检索增强（文档加载、向量库、上下文增强）
├── advisor/        请求响应拦截与日志
├── security/       令牌鉴权（TokenStore、AuthInterceptor、UserDirectory）
├── exception/      越权与参数异常统一响应
├── service/        文档存储与访问判定、审批状态机、版本管理、会话与指标
└── studio/         智能体配置、DAG 引擎、运行状态机、质量评测、知识治理、
                    安全策略、多智能体协作、模板与自动化触发
```

**客户端**：Vue 3 / Vite / Vue Router

```
xingtu-frontend/src/
├── views/          页面（业务应用、编排中心、运行中心、质量中心、自动化、审批与看板）
├── components/     组件（AppHeader、ChatRoom、SessionList、AgentTrace、PermissionDialog、
│                   AuditPanel、ReferenceDrawer、VersionPanel、AppFooter）
├── composables/    组合式逻辑（useAuth 登录态、useSessions 会话状态）
└── api/            接口封装与流式事件解析
```

## 快速开始

### 1. 配置

模型和搜索密钥通过环境变量注入，源码中不保存真实密钥：

```bash
export DASHSCOPE_API_KEY=你的模型服务密钥
export SEARCH_API_KEY=你的搜索服务密钥
export AMAP_MAPS_API_KEY=你的地图服务密钥
```

PowerShell 使用 `$env:DASHSCOPE_API_KEY="..."`。不配置模型密钥时，平台仍可启动并使用编排中心、
知识治理、安全检测和不调用模型的工作流；实际大模型节点、评测和多智能体协作需要有效密钥。

### 2. 启动服务端

```bash
mvn spring-boot:run
```

接口文档：http://localhost:8123/api/swagger-ui.html

### 3. 启动客户端

```bash
cd xingtu-frontend
npm install
npm run dev
```

访问 http://localhost:5173

### 4. 构建部署

```bash
mvn clean package -DskipTests
cd xingtu-frontend && npm run build
```

前端产物位于 `dist/`，交由任意静态服务器托管即可。

## 接口一览

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/ai/consult/chat/sync` | 智能顾问同步问答 |
| GET | `/ai/consult/chat/sse` | 智能顾问流式问答 |
| GET | `/ai/consult/chat/rag` | 知识库检索问答（流式） |
| GET | `/ai/agent/chat` | 任务智能体执行（流式，含步骤事件） |
| POST | `/document/upload` | 上传文档并建立临时索引 |
| GET | `/document/ask` | 针对已上传文档提问（流式） |
| GET | `/document/count` | 查询缓存文档数量 |
| POST | `/export/pdf` | 导出对话记录为 PDF |
| GET/POST/PUT | `/studio/agents...` | 智能体配置、版本发布与复制 |
| GET/POST/PUT | `/studio/workflows...` | 工作流 DAG 编辑、校验与发布 |
| GET/POST | `/runs...` | 运行、轨迹、暂停恢复、审批、重试与反馈 |
| POST | `/quality/evaluations/run` | 使用测试集运行智能体评测 |
| GET/PUT | `/quality/knowledge...` | 知识治理、配置、重建索引和混合检索 |
| POST | `/quality/safety/scan` | 输入安全检测与敏感信息脱敏 |
| POST | `/studio/collaborations/run` | 规划、检索、执行、复核四角色协作 |
| POST | `/automation/triggers` | 创建外部 API 或定时触发任务 |
| POST | `/automation/public/{token}` | 使用独立令牌调用已发布工作流 |

流式事件约定：

- `[[STEP]]{"index":1,"total":20,"content":"..."}` —— 执行步骤事件
- `[[ANSWER]]总结文本` —— 最终答案事件
- `[DONE]` —— 流结束标记

## 交付文档

| 文件 | 说明 |
|---|---|
| `docs/星图智能体平台软件V1.0_源程序.docx` | 源程序文档，含原核心模块与新增工程模块 |
| `docs/星图智能体平台软件V1.0_用户手册.docx` | 用户手册，含功能说明、操作步骤与界面截图 |
| `docs/星图智能体平台软件V1.0_登记信息填报表.docx` | 软著登记信息填报参考与材料清单 |

## 运行环境

- 服务端：JDK 17+、Maven 3.6+
- 客户端：Chrome 100+ / Edge 100+ / Firefox 100+
- 依赖服务：大语言模型服务（按需）、搜索服务（使用联网工具时）
- 数据文件：`tmp/studio/`，保存智能体、工作流、运行、评测、安全事件与触发器

## 测试与构建

```bash
# 后端离线测试；外部模型和网络集成测试按设计跳过
mvn clean test

# 前端生产构建
cd xingtu-frontend
npm run build
```

## 说明

上传文档、智能体配置、工作流、运行记录、评测和安全事件均写入服务端 `tmp` 目录，
服务重启后自动恢复；会话同时保存在服务端与浏览器端。
