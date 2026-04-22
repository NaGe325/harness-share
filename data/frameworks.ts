export type Category = "framework" | "memory" | "protocol";

export type Framework = {
  id: string;
  name: string;
  org: string;
  category: Category;
  accentColor: string;
  tagline: string;
  oneSentence: string;
  description: string;
  preferences: string[];
  focus: string;
  useCases: { title: string; detail: string }[];
  antiPatterns: string[];
  installCmd: string;
  helloWorld: string;
  keyApis: { name: string; explain: string }[];
  versus: { other: string; diff: string }[];
  urls: { github: string; docs?: string };
  stars: string;
  firstRelease: string;
  language: string;
};

export const frameworks: Framework[] = [
  {
    id: `langgraph`,
    name: `LangGraph`,
    org: `LangChain`,
    category: `framework`,
    accentColor: `#639922`,
    tagline: `Graph-based orchestration · the production workhorse`,
    oneSentence: `把多 agent 工作流建模成可持久化、可恢复的有向图，工业界最广泛使用的多 agent 编排层。`,
    description: `LangGraph 的核心抽象是一张图：节点是函数或 agent，边是跳转规则，状态是强类型对象。Checkpointer 把每一步的状态写入持久存储，意味着你可以在任何一步暂停、恢复、分支、时间旅行。LangGraph 2.0 把三年生产经验沉淀成标准原语：Router、Supervisor、Subagent，让常见多 agent 拓扑不必再手搓。它不像 CrewAI 那样倚重角色比喻，也不像 AutoGen 那样围绕对话展开，它就是一个严肃的工作流引擎，长得像 Airflow 遇到了 LLM。`,
    preferences: [`图结构优先`, `状态强类型`, `Checkpoint 恢复`, `HITL 原生`, `确定性控制流`],
    focus: `生产级 workflow 的可控性、可观测性、可恢复性。如果你的 agent 要跑几个小时甚至几天，它是最成熟的选择。`,
    useCases: [
      {
        title: `长时间运行的多 agent 任务`,
        detail: `例如研究 agent 跑 5 小时做深度调研，中间失败要能从 checkpoint 恢复而不是从头再来。`,
      },
      {
        title: `需要人工审批的业务流程`,
        detail: `在图中任意节点 interrupt，暂停等人工输入，人工决策后恢复执行。金融、医疗、法律场景常用。`,
      },
      {
        title: `有显式分支逻辑的复杂流程`,
        detail: `客服分派、工单分级、合同审查，这类确定性分支逻辑用图结构比对话范式清晰得多。`,
      },
    ],
    antiPatterns: [
      `只是想做一个单 agent + 几个工具：杀鸡用牛刀，OpenAI Agents SDK 更合适`,
      `快速 PoC / hackathon demo：setup 成本偏高，smolagents 或 CrewAI 更快`,
    ],
    installCmd: `pip install langgraph langchain-core`,
    helloWorld: `from typing import TypedDict
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

class State(TypedDict):
    messages: list
    next_action: str

def plan(state: State) -> State:
    state["next_action"] = "search"
    return state

def act(state: State) -> State:
    state["messages"].append("搜索结果")
    return state

def router(state: State) -> str:
    return "act" if state["next_action"] else END

graph = StateGraph(State)
graph.add_node("plan", plan)
graph.add_node("act", act)
graph.set_entry_point("plan")
graph.add_conditional_edges("plan", router)
graph.add_edge("act", "plan")

app = graph.compile(checkpointer=MemorySaver())
result = app.invoke(
    {"messages": [], "next_action": ""},
    config={"configurable": {"thread_id": "1"}},
)`,
    keyApis: [
      { name: `StateGraph`, explain: `用 TypedDict 声明状态 schema，add_node 添加节点，add_edge 连边。` },
      { name: `Checkpointer`, explain: `MemorySaver（内存）、SqliteSaver（本地）、PostgresSaver（生产）三种存储。` },
      { name: `interrupt`, explain: `在节点内调用 interrupt() 暂停图，等人工输入后从断点恢复。` },
      { name: `Command`, explain: `节点返回 Command 可以同时更新状态 + 指定下一个节点，比单纯返回 state 更灵活。` },
    ],
    versus: [
      { other: `vs AutoGen`, diff: `LangGraph 是图，AutoGen 是对话。前者适合确定流程，后者适合探索性协作。` },
      { other: `vs CrewAI`, diff: `CrewAI 的 Flow 类似 LangGraph 但更简单；真正复杂的分支和恢复逻辑，LangGraph 更硬。` },
    ],
    urls: { github: `https://github.com/langchain-ai/langgraph`, docs: `https://langchain-ai.github.io/langgraph/` },
    stars: `11k+`,
    firstRelease: `2024`,
    language: `Python / JavaScript`,
  },
  {
    id: `autogen`,
    name: `AutoGen`,
    org: `Microsoft`,
    category: `framework`,
    accentColor: `#378ADD`,
    tagline: `Conversational multi-agent · research first, scales up`,
    oneSentence: `微软的多 agent 对话框架，让多个 AI 像团队一样"开会"解决问题。`,
    description: `AutoGen 的哲学很简单：多个有不同能力和人格的 agent 围绕一个任务互相对话，协作产出结果。AgentChat 层覆盖了完整生命周期：agent loop、工具集成、终止条件、HITL。GroupChat 支持 round-robin、selector、magentic 等不同发言策略。Code execution 是一等公民：你可以让 agent 写代码、在 Docker / Jupyter 里真跑一下、把输出带回对话。研究圈非常喜欢它，微软 Magentic-One、GAIA benchmark 的很多 SOTA 方案都基于 AutoGen。`,
    preferences: [`对话范式`, `代码执行一等公民`, `研究 / 学术友好`, `AutoGen Studio GUI`, `多角色协作`],
    focus: `让多个 agent 像研究团队一样自由对话。它关心"怎么把会议开好"，而不是"怎么把流程固化成图"。`,
    useCases: [
      { title: `研究原型 · 论文复现`, detail: `agent 辩论、多视角评审（writer-reviewer-critic）、新 prompting 技术的快速验证。` },
      { title: `自动化代码生成闭环`, detail: `coder agent 写代码 → executor 跑 → critic 读报错 → 循环直到通过。` },
      { title: `多学科问答 / 决策支持`, detail: `医学 + 法律 + 财务 agent 协作回答跨领域问题，适合 case study 型任务。` },
    ],
    antiPatterns: [
      `严苛 SLA 的生产服务：对话范式本质不确定，难保证 P99`,
      `需要精确分支控制：图结构框架更合适`,
    ],
    installCmd: `pip install autogen-agentchat autogen-ext[openai]`,
    helloWorld: `from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination
from autogen_ext.models.openai import OpenAIChatCompletionClient

client = OpenAIChatCompletionClient(model="gpt-4o")

writer = AssistantAgent(
    name="writer",
    model_client=client,
    system_message="你是一个技术作者，写出有来源支撑的 claim。",
)
critic = AssistantAgent(
    name="critic",
    model_client=client,
    system_message="你审查 writer 的 claim。满意时回复 APPROVE。",
)

team = RoundRobinGroupChat(
    [writer, critic],
    termination_condition=TextMentionTermination("APPROVE"),
)
await team.run(task="写一段关于 harness engineering 的 200 字介绍")`,
    keyApis: [
      { name: `AssistantAgent`, explain: `主力 agent 类，绑定 model_client、system_message、tools。` },
      { name: `RoundRobinGroupChat / SelectorGroupChat`, explain: `两种团队发言策略：轮流 vs 由 LLM 选择下一个发言者。` },
      { name: `UserProxyAgent`, explain: `HITL 节点，让人工介入对话；可以批准、拒绝、修改。` },
      { name: `CodeExecutor`, explain: `支持 DockerCommandLineCodeExecutor、LocalCommandLineCodeExecutor 等。` },
    ],
    versus: [
      { other: `vs LangGraph`, diff: `AutoGen 对话驱动，LangGraph 图驱动。前者适合"探索"，后者适合"执行"。` },
      { other: `vs CrewAI`, diff: `两个都用"团队"比喻，但 AutoGen 更技术化 / 学术化，CrewAI 更产品化。` },
    ],
    urls: { github: `https://github.com/microsoft/autogen`, docs: `https://microsoft.github.io/autogen/` },
    stars: `35k+`,
    firstRelease: `2023`,
    language: `Python / .NET`,
  },
  {
    id: `openai-agents`,
    name: `Agents SDK`,
    org: `OpenAI`,
    category: `framework`,
    accentColor: `#1A1917`,
    tagline: `Lightweight handoff + guardrails · Swarm grown up`,
    oneSentence: `OpenAI 官方轻量级多 agent 框架，核心是 handoff（职责转交）和 guardrails（安全护栏）。`,
    description: `OpenAI 的 Swarm 是实验项目，Agents SDK 是它的生产级继任者。整个 API 只有少数几个概念：Agent、Tool、Handoff、Guardrail、Runner。handoff 本质是个特殊 tool call，模型决定把控制权转给哪个下游 agent。guardrail 是并行跑的检查器，对输入输出做校验。内置 tracing 和 Responses API 集成，一切都给 OpenAI 生态最顺的体验。Python 和 TypeScript 双版本同步发布。`,
    preferences: [`极简 API`, `handoff 语义`, `OpenAI 原生体验`, `内置 tracing`, `Python + TypeScript`],
    focus: `简单优于复杂。它不暴露图，不暴露状态机，只把"谁负责什么"说清楚。`,
    useCases: [
      { title: `客服 / 工单分派`, detail: `一个 triage agent 识别意图，handoff 到账单 / 技术 / 投诉 / 退货等领域专家。` },
      { title: `多语言 / 多领域分发`, detail: `用户的查询先被路由 agent 分类，再交给对应语言或领域专长的 agent。` },
      { title: `已深度用 OpenAI 生态的团队`, detail: `如果你已经在用 Responses API、Computer Use、Structured Outputs，Agents SDK 是最自然的扩展。` },
    ],
    antiPatterns: [
      `需要确定性的多步工作流：handoff 不是流程引擎，用 LangGraph`,
      `对 vendor lock-in 敏感：虽然能换模型，但体验最好的就是 OpenAI`,
    ],
    installCmd: `pip install openai-agents`,
    helloWorld: `from agents import Agent, Runner, function_tool

@function_tool
def lookup_order(order_id: str) -> str:
    return f"订单 {order_id} 正在运输中"

billing = Agent(
    name="billing",
    instructions="你处理所有账单和付款相关问题。",
    tools=[lookup_order],
)

tech = Agent(
    name="tech_support",
    instructions="你处理所有技术故障和产品使用问题。",
)

triage = Agent(
    name="triage",
    instructions="识别用户意图，账单类问题转给 billing，技术类问题转给 tech_support。",
    handoffs=[billing, tech],
)

result = Runner.run_sync(triage, "我的订单 #1234 还没到")
print(result.final_output)`,
    keyApis: [
      { name: `Agent`, explain: `定义 name、instructions、tools、handoffs、output_type。` },
      { name: `handoff(target, on_handoff=...)`, explain: `配置高级 handoff 行为，可以在转交时执行回调、传递 input_filter。` },
      { name: `Guardrail`, explain: `input_guardrails / output_guardrails 列表，并行跑检查器（比如 PII 检测）。` },
      { name: `Runner.run / run_sync / run_streamed`, explain: `三种运行模式。run_streamed 返回异步迭代器流式输出。` },
    ],
    versus: [
      { other: `vs LangGraph`, diff: `Agents SDK 以 handoff 为轴，LangGraph 以图为轴。前者适合转交，后者适合流程。` },
      { other: `vs CrewAI`, diff: `CrewAI 倚重角色建模，Agents SDK 只关心 handoff 拓扑，API 更薄。` },
    ],
    urls: { github: `https://github.com/openai/openai-agents-python`, docs: `https://openai.github.io/openai-agents-python/` },
    stars: `9k+`,
    firstRelease: `2025`,
    language: `Python / TypeScript`,
  },
  {
    id: `crewai`,
    name: `CrewAI`,
    org: `crewAIInc`,
    category: `framework`,
    accentColor: `#E24B4A`,
    tagline: `Role-based teams · business-friendly by design`,
    oneSentence: `双层架构：Crew（自治协作）+ Flow（事件驱动控制流），把业务流程映射成一支 AI 团队。`,
    description: `CrewAI 押注一个观念：企业里的工作本来就是团队协作，那 AI 也应该按团队的方式组织。每个 agent 有 role / goal / backstory，就像员工的岗位、目标、简历。Crew 是自治层，你给任务，agent 自己委派。Flow 是确定性层，事件驱动、条件分支、Pydantic 共享状态，用来搭骨架。两层混用才是精髓：骨架用 Flow 确保流程不乱，创造性环节让 Crew 自由发挥。文档极多、社区教程活跃，是非技术背景的 PM 和 analyst 的首选。`,
    preferences: [`角色建模`, `业务流程友好`, `教程社区活跃`, `Pydantic 状态`, `双层自治 + 确定性`],
    focus: `关心"团队协作的比喻"而不是技术抽象。让非技术背景的同事也能读懂 agent 代码。`,
    useCases: [
      { title: `内容生产流水线`, detail: `researcher → writer → editor → SEO specialist，每个 agent 一个角色，产出博客 / 报告 / 营销文案。` },
      { title: `市场与竞品分析`, detail: `数据爬取 agent + 趋势分析 agent + 洞察撰写 agent，一键产出季度分析报告。` },
      { title: `业务流程自动化`, detail: `合同审查、报销审核、面试初筛，能映射成"一支团队"的业务流程都合适。` },
    ],
    antiPatterns: [
      `需要精细分支 / 长时 checkpoint 恢复：LangGraph 更硬`,
      `只是单 agent：角色抽象反而累赘`,
    ],
    installCmd: `pip install crewai crewai-tools`,
    helloWorld: `from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool

researcher = Agent(
    role="Senior Research Analyst",
    goal="挖掘 AI agent 领域最新趋势",
    backstory="你有 10 年行业分析经验，以识别早期信号见长。",
    tools=[SerperDevTool()],
    verbose=True,
)

writer = Agent(
    role="Tech Writer",
    goal="写清晰、不废话的技术分析",
    backstory="你在 Stratechery 风格的分析媒体工作多年。",
)

research = Task(
    description="调研 {topic} 方向过去 30 天的新进展",
    agent=researcher,
    expected_output="5 个关键发现，每个附带来源",
)

write = Task(
    description="基于调研写一篇 800 字分析",
    agent=writer,
    context=[research],
    expected_output="一篇结构化的分析文章",
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research, write],
    process=Process.sequential,
)
result = crew.kickoff(inputs={"topic": "harness engineering"})`,
    keyApis: [
      { name: `Agent(role, goal, backstory)`, explain: `角色三要素。backstory 质量直接影响 agent 行为，不要空。` },
      { name: `Task(description, expected_output, context)`, explain: `任务描述 + 期望输出 + 上游依赖（context 数组）。` },
      { name: `Crew(process=sequential|hierarchical)`, explain: `顺序执行 vs 有 manager agent 动态委派。` },
      { name: `Flow`, explain: `@start、@listen 装饰器搭事件驱动图，适合确定性部分。` },
    ],
    versus: [
      { other: `vs AutoGen`, diff: `都用团队比喻，但 CrewAI 更产品化，AutoGen 更研究化。` },
      { other: `vs LangGraph`, diff: `LangGraph 暴露图结构给开发者，CrewAI 把图藏起来只给你"团队"这个概念。` },
    ],
    urls: { github: `https://github.com/crewAIInc/crewAI`, docs: `https://docs.crewai.com/` },
    stars: `25k+`,
    firstRelease: `2024`,
    language: `Python`,
  },
  {
    id: `pydantic-ai`,
    name: `Pydantic AI`,
    org: `Pydantic`,
    category: `framework`,
    accentColor: `#D4537E`,
    tagline: `Type-safe agents · Pydantic all the way down`,
    oneSentence: `类型安全的 agent 框架，把 agent 输出错误从运行时 bug 降级为类型检查失败。`,
    description: `Pydantic AI 由 Pydantic 核心团队出品，目标是把 Pydantic 在数据验证领域的严谨性带到 agent 世界。工具定义、参数、返回值、agent 输出全部 Pydantic 模型化。RunContext 是核心抽象，用依赖注入传递 per-request 的用户 ID、数据库连接、API client，避免全局状态污染。和 FastAPI 的心智模型几乎一致，如果你团队已经在用 Pydantic 和 FastAPI，学习成本接近零。Logfire 集成内置，tracing 和 observability 开箱即用。`,
    preferences: [`类型安全第一`, `IDE 友好`, `可测试`, `依赖注入`, `FastAPI 风味`],
    focus: `别让 LLM 的不确定性污染你的 Python 类型系统。output_type 是契约，违反契约即报错。`,
    useCases: [
      { title: `结构化数据抽取`, detail: `发票、合同、医疗报告、科研论文，输出是严格的 Pydantic 模型，直接塞进数据库。` },
      { title: `企业 Python 应用`, detail: `Python 技术栈成熟、team 已经在用 Pydantic / FastAPI / SQLModel 的项目，无缝集成。` },
      { title: `合规 / 审计敏感场景`, detail: `金融风控、医疗诊断前置、法律文档分析，每一步输出可验证、可追溯。` },
    ],
    antiPatterns: [
      `多 agent 复杂编排：Pydantic AI 是 agent 层，不是 orchestration 层`,
      `非 Python 项目：只有 Python 版本`,
    ],
    installCmd: `pip install 'pydantic-ai[openai]'`,
    helloWorld: `from dataclasses import dataclass
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext

class Invoice(BaseModel):
    vendor: str
    total: float = Field(gt=0)
    currency: str = Field(pattern=r"^[A-Z]{3}$")
    line_items: list[str]

@dataclass
class Deps:
    db_session: object
    user_id: str

agent = Agent(
    "openai:gpt-4o",
    deps_type=Deps,
    output_type=Invoice,
    system_prompt="从发票文本中提取结构化信息。",
)

@agent.tool
def lookup_vendor(ctx: RunContext[Deps], name: str) -> dict:
    return ctx.deps.db_session.query(name)

result = agent.run_sync(
    "从这张发票里提取字段: ...",
    deps=Deps(db_session=session, user_id="u1"),
)
print(result.output.total)`,
    keyApis: [
      { name: `Agent(model, output_type=, deps_type=)`, explain: `output_type 是 Pydantic 模型，agent 强制产出该类型；deps_type 启用依赖注入。` },
      { name: `RunContext[Deps]`, explain: `tool 函数第一参数，通过 ctx.deps 拿到 per-request 依赖。` },
      { name: `@agent.tool / @agent.tool_plain`, explain: `前者可拿 ctx，后者无 ctx。工具定义即 Pydantic 校验参数。` },
      { name: `Logfire 集成`, explain: `import logfire; logfire.configure() 一行接入生产级 observability。` },
    ],
    versus: [
      { other: `vs LangGraph`, diff: `Pydantic AI 是单 agent 层，LangGraph 是 orchestration 层，可以组合使用。` },
      { other: `vs OpenAI Agents SDK`, diff: `Pydantic AI 强调结构化输出契约，OpenAI SDK 更关注 handoff 拓扑。` },
    ],
    urls: { github: `https://github.com/pydantic/pydantic-ai`, docs: `https://ai.pydantic.dev/` },
    stars: `8k+`,
    firstRelease: `2024`,
    language: `Python`,
  },
  {
    id: `google-adk`,
    name: `ADK`,
    org: `Google`,
    category: `framework`,
    accentColor: `#185FA5`,
    tagline: `Agent Development Kit · Vertex AI native`,
    oneSentence: `Google 的代码优先 agent 框架，内置多 agent 编排、工具注册、eval pipeline，Vertex AI 深度集成。`,
    description: `ADK（Agent Development Kit）是 Google 把 Gemini 能力和 Vertex AI 基础设施整合进 agent 开发的官方答案。Runner / AgentTool 模式是把 sub-agent 封装成 tool 的参考实现。117 prompt 的 eval harness 内置，test 基础设施完整。原生对接 Gemini 2M context、多模态、tool use，Vertex AI 部署管控（RBAC、审计、cost tracking）一体化。非 GCP 生态不推荐，但如果你在 Google Cloud 里，它的集成深度其他框架比不了。`,
    preferences: [`GCP 原生`, `Gemini 深度集成`, `eval harness 内置`, `生产部署一体化`, `多 agent 拓扑`],
    focus: `在 Google Cloud 里把 agent 投产。合规、审计、成本管控链路完整。`,
    useCases: [
      { title: `GCP 内企业部署`, detail: `已经在 Vertex AI 训练模型、用 BigQuery 存数据的团队，ADK 是最短路径。` },
      { title: `长文档处理`, detail: `Gemini 2M token context 可以一次塞下整本书，agent 可以不用做 RAG 就处理巨型文档。` },
      { title: `多模态 agent`, detail: `图像 + 视频 + 音频输入的 agent 应用，Gemini 原生支持，ADK 开箱即用。` },
    ],
    antiPatterns: [
      `不在 GCP 生态：LangGraph 更通用`,
      `需要 OpenAI 模型为主：ADK 的甜区是 Gemini`,
    ],
    installCmd: `pip install google-adk`,
    helloWorld: `from google.adk.agents import Agent
from google.adk.tools import google_search

planner = Agent(
    name="planner",
    model="gemini-2.0-flash",
    instruction="把用户请求拆解成步骤",
)

worker = Agent(
    name="worker",
    model="gemini-2.0-flash",
    instruction="执行具体步骤",
    tools=[google_search],
)

root = Agent(
    name="coordinator",
    model="gemini-2.0-flash",
    instruction="协调 planner 和 worker 完成任务",
    sub_agents=[planner, worker],
)

# adk web  →  本地 dev UI
# adk run  →  命令行运行`,
    keyApis: [
      { name: `Agent(name, model, instruction, tools, sub_agents)`, explain: `sub_agents 让子 agent 成为可被调用的 tool。` },
      { name: `Runner`, explain: `运行时，管理 session、state、event 流。` },
      { name: `AgentTool`, explain: `显式把另一个 agent 包装成 tool，比 sub_agents 更细粒度控制。` },
      { name: `adk web / adk run`, explain: `CLI 命令，提供本地 dev UI，调试多 agent 流程极方便。` },
    ],
    versus: [
      { other: `vs LangGraph`, diff: `ADK 在 GCP 里体验最好，LangGraph 云无关。` },
      { other: `vs OpenAI Agents SDK`, diff: `类似的 handoff-via-tool 设计，但 ADK 更企业化，有更完整部署栈。` },
    ],
    urls: { github: `https://github.com/google/adk-python`, docs: `https://google.github.io/adk-docs/` },
    stars: `5k+`,
    firstRelease: `2025`,
    language: `Python / Java`,
  },
  {
    id: `smolagents`,
    name: `smolagents`,
    org: `Hugging Face`,
    category: `framework`,
    accentColor: `#EF9F27`,
    tagline: `~1000 lines readable · code-agent paradigm`,
    oneSentence: `HuggingFace 故意极简的 agent 库，核心约 1000 行，一个下午读完；code-agent 模式是它的杀手锏。`,
    description: `smolagents 有一个独特信念：让模型直接写 Python 代码来调用工具，而不是走 JSON tool call 的来回。这叫 code-agent 范式。在数学 / 数据分析 / 算法任务上，code-agent 的精度常常比 JSON tool call 高 15-30%，因为 Python 本身就是模型最熟悉的 DSL，还能原生写循环、条件、嵌套调用。三种沙盒可选：E2B（云端）、Docker（本地）、Pyodide（浏览器）。对开源模型（Llama、Qwen、DeepSeek）的支持是一等公民，HuggingFace Hub 上所有模型都能直接当 agent 后端。`,
    preferences: [`极简透明`, `教学友好`, `开源模型`, `code-agent 范式`, `沙盒隔离`],
    focus: `让 agent 原理可读，让非 OpenAI 模型也能当 agent。一切以"你能读懂并修改"为前提。`,
    useCases: [
      { title: `学习 / 教学`, detail: `想真懂 agent loop 怎么跑，不是调用黑盒，而是读完整套源码。` },
      { title: `开源模型 agent`, detail: `跑 Llama 3.3 / Qwen 2.5 / DeepSeek V3 当 agent 后端，完全不依赖 OpenAI。` },
      { title: `数学 / 数据分析任务`, detail: `code-agent 模式在这类任务上效果最好，可以直接用 pandas / numpy / sympy。` },
    ],
    antiPatterns: [
      `企业级 SLA 生产服务：功能精简，要自己加稳定性层`,
      `复杂多 agent 编排：不是它的主战场`,
    ],
    installCmd: `pip install smolagents`,
    helloWorld: `from smolagents import CodeAgent, HfApiModel, tool

@tool
def get_weather(location: str, celsius: bool = True) -> str:
    """
    获取指定地点天气。

    Args:
        location: 城市名
        celsius: 是否用摄氏度
    """
    return f"{location} 现在 22 度，晴"

agent = CodeAgent(
    tools=[get_weather],
    model=HfApiModel("meta-llama/Llama-3.3-70B-Instruct"),
)

# agent 内部直接生成并执行 Python 代码：
# t1 = get_weather("Tokyo")
# t2 = get_weather("Paris")
# print(float(t1.split()[2]) - float(t2.split()[2]))
result = agent.run("比较东京和巴黎现在的气温，差多少度？")`,
    keyApis: [
      { name: `CodeAgent vs ToolCallingAgent`, explain: `CodeAgent 写 Python 代码调工具（默认，推荐）；ToolCallingAgent 走 JSON tool call（兼容老模型）。` },
      { name: `@tool decorator`, explain: `docstring 被 parse 成 tool 描述，args 类型注解被转成 schema。` },
      { name: `HfApiModel / LiteLLMModel / TransformersModel`, explain: `三种后端：HF Inference API、LiteLLM 代理、本地 transformers。` },
      { name: `additional_authorized_imports`, explain: `扩展 code-agent 可以 import 的白名单，比如 pandas、requests。` },
    ],
    versus: [
      { other: `vs LangGraph`, diff: `量级完全不同。smolagents 是教学和原型，LangGraph 是生产。` },
      { other: `vs AutoGen`, diff: `都偏研究，但 smolagents 更轻更透明，AutoGen 功能更全。` },
    ],
    urls: { github: `https://github.com/huggingface/smolagents`, docs: `https://huggingface.co/docs/smolagents/` },
    stars: `11k+`,
    firstRelease: `2024`,
    language: `Python`,
  },
  {
    id: `letta`,
    name: `Letta`,
    org: `letta-ai`,
    category: `memory`,
    accentColor: `#7F77DD`,
    tagline: `Stateful agents · the MemGPT reference`,
    oneSentence: `MemGPT 论文的工业实现，三层记忆架构，为"有状态 agent"定义了参考范式。`,
    description: `Letta 不是"给 agent 加个记忆插件"，而是把 agent 架构按记忆为中心重新设计。三层记忆：core memory（一直在 context 里，存 persona 和关键用户事实，约 1-2k token）、archival memory（向量库，按需检索历史片段）、recall memory（全对话历史，按时间或 entity 召回）。agent 自己决定什么进入哪一层，因为它们就是 agent 的工具。如果你的产品核心价值是"这个 AI 真的认识我"，Letta 的架构思路是当前最成熟的参考。`,
    preferences: [`有状态优先`, `memory-first 设计`, `persona 持久化`, `跨 session 一致`, `agent 自主管理记忆`],
    focus: `关心"这个 agent 真的认识我吗"，而不是"它这次回答得好不好"。`,
    useCases: [
      { title: `陪伴型 / 生活助理 AI`, detail: `要记得用户几个月前说过什么、偏好什么、有什么禁忌。Letta 的 core memory 专为此设计。` },
      { title: `长期客户助理`, detail: `B2C 产品中，每个用户有专属 agent，随着时间积累人格化关系。` },
      { title: `虚拟角色 / NPC`, detail: `游戏 / 小说 / 互动剧场里的角色，需要人格一致、记得情节发展。` },
    ],
    antiPatterns: [
      `无状态任务 agent（一次性 workflow）：overkill，用 LangGraph`,
      `只是想给现有 agent 加点记忆：用 mem0 接入成本更低`,
    ],
    installCmd: `pip install letta-client  # server 通过 Docker 部署`,
    helloWorld: `from letta_client import Letta

client = Letta(base_url="http://localhost:8283")

agent = client.agents.create(
    name="my-assistant",
    model="openai/gpt-4o",
    embedding="openai/text-embedding-3-small",
    memory_blocks=[
        {
            "label": "persona",
            "value": "我是一个重视长期关系的助理。",
        },
        {
            "label": "human",
            "value": "用户是一名 CMU 学生，在找 ML 实习。",
        },
    ],
)

# agent 会主动把重要信息写入 core memory
response = client.agents.messages.create(
    agent_id=agent.id,
    messages=[{"role": "user", "content": "记一下，我对花生过敏。"}],
)

# 下次对话，不管隔多久，memory blocks 一直在 context 里
response = client.agents.messages.create(
    agent_id=agent.id,
    messages=[{"role": "user", "content": "推荐一个晚餐？"}],
)`,
    keyApis: [
      { name: `memory_blocks`, explain: `core memory 的基本单元，有 label 和 value，agent 可以通过工具读写自己的 blocks。` },
      { name: `archival memory`, explain: `向量库后端（pgvector / chroma），agent 用 archival_memory_search 和 archival_memory_insert 工具操作。` },
      { name: `Sleep-time compute`, explain: `agent 空闲时后台 reflection，整理短期记忆到长期，类似"睡觉巩固记忆"。` },
      { name: `ADE（Agent Development Environment）`, explain: `可视化 GUI，调试 agent 记忆状态、消息流、工具调用。` },
    ],
    versus: [
      { other: `vs mem0`, diff: `Letta 是"为记忆而生的 agent 架构"，mem0 是"可嵌入的记忆层"。定位互补。` },
      { other: `vs LangGraph`, diff: `LangGraph 关心 workflow，Letta 关心 continuity。通常两者可以组合。` },
    ],
    urls: { github: `https://github.com/letta-ai/letta`, docs: `https://docs.letta.com/` },
    stars: `17k+`,
    firstRelease: `2023`,
    language: `Python`,
  },
  {
    id: `mem0`,
    name: `mem0`,
    org: `mem0ai`,
    category: `memory`,
    accentColor: `#1D9E75`,
    tagline: `Universal memory layer · three lines to add`,
    oneSentence: `YC 投资的即插即用记忆层，不要求你重构 agent 架构，任何框架三行接入。`,
    description: `mem0 的哲学和 Letta 相反：Letta 让你按它的范式重写 agent，mem0 让你在现有 agent 上加一层。自动从对话中抽取事实 / 偏好 / 关系，存到向量 + 图混合存储，下次对话相关记忆自动召回。AWS Agent SDK 选它作独家记忆 provider，足以说明生态认可度。托管版和自部署版都有。核心哲学是：记忆不应该是一个架构决策，而是像 log / cache 一样的基础设施能力，随时加，随时换。`,
    preferences: [`接入成本极低`, `框架无关`, `托管 / 自部署双版本`, `多 agent 共享`, `自动事实抽取`],
    focus: `别让"加记忆"变成重写系统。已有 agent 上三行代码就能用。`,
    useCases: [
      { title: `给现有 agent 补记忆`, detail: `客服 bot / 文档助手 / 编程副驾驶，想让它记住用户偏好，不想动核心逻辑。` },
      { title: `多 agent 共享用户画像`, detail: `同一个用户被 5 个不同 agent 服务，记忆通过 mem0 集中，画像一致。` },
      { title: `B2B SaaS 里的记忆能力`, detail: `你的产品是 agent 平台，想让终端用户"训练他们自己的 agent"，mem0 是基础层。` },
    ],
    antiPatterns: [
      `记忆是产品核心差异化：考虑 Letta 的深度架构方案`,
      `对事实召回精度要求极高：自己做检索更可控`,
    ],
    installCmd: `pip install mem0ai`,
    helloWorld: `from mem0 import Memory

m = Memory()

# 添加记忆（自动从对话抽取事实）
m.add(
    messages=[
        {"role": "user", "content": "我对花生过敏，最爱吃川菜"},
        {"role": "assistant", "content": "记下了"},
    ],
    user_id="alice",
)

# 后续对话时检索
memories = m.search(
    query="有什么晚餐推荐？",
    user_id="alice",
    limit=3,
)
# 返回: [{"memory": "对花生过敏", "score": 0.91}, ...]

# 把 memories 注入到已有 agent 的 system prompt
context = "\\n".join(m["memory"] for m in memories["results"])
system = f"用户记忆：\\n{context}\\n请基于这些偏好回答。"`,
    keyApis: [
      { name: `Memory.add(messages, user_id)`, explain: `自动从对话中抽取事实，用 LLM 做 extraction + deduplication。` },
      { name: `Memory.search(query, user_id)`, explain: `向量 + 图混合检索，返回带分数的 memory 列表。` },
      { name: `user_id / agent_id / run_id 三级维度`, explain: `记忆可以按用户、agent、会话隔离或共享。` },
      { name: `托管版`, explain: `app.mem0.ai 提供 hosted 版本，免维护存储层。` },
    ],
    versus: [
      { other: `vs Letta`, diff: `mem0 是记忆"即插件"，Letta 是记忆"即架构"。前者快，后者深。` },
      { other: `vs Zep`, diff: `Zep 更强调对话摘要和 temporal graph，mem0 更通用、接入更快。` },
    ],
    urls: { github: `https://github.com/mem0ai/mem0`, docs: `https://docs.mem0.ai/` },
    stars: `31k+`,
    firstRelease: `2024`,
    language: `Python / TypeScript`,
  },
  {
    id: `mcp`,
    name: `MCP + Agent SDK`,
    org: `Anthropic`,
    category: `protocol`,
    accentColor: `#D85A30`,
    tagline: `Agent-to-tool standard · the new USB-C`,
    oneSentence: `Model Context Protocol：Anthropic 提出的开放协议，已成为 agent 和工具通信的事实标准。`,
    description: `MCP 是 agent 世界的 USB-C。在 MCP 出现之前，每个框架都有自己的 tool 定义格式，每个服务（GitHub、Slack、Postgres）都要为每个框架写一遍适配。MCP 让服务方一次开发就能被所有支持 MCP 的客户端（Claude / Cursor / Codex / Windsurf）即插即用。OpenAI 和 Google 的 Agents SDK 也已经支持 MCP server。配套的 Claude Agent SDK 更进一步，把整个 Claude Code 的 harness 暴露成 programmable API：工具循环、PreToolUse / PostToolUse hooks、subagent、allowedTools 权限控制、session 恢复。`,
    preferences: [`标准化`, `可组合`, `安全优先`, `跨 LLM 复用`, `生态互操作`],
    focus: `关心"同一个工具，不同 agent / 不同 LLM 都能用"，以及"危险操作能被层层拦截"。`,
    useCases: [
      { title: `MCP Server 开发者`, detail: `把你公司的 API（内部 CRM、监控系统、代码仓库）封装成 MCP server，所有 agent 客户端即插即用。` },
      { title: `MCP Client 开发者`, detail: `自研 IDE 助手、企业内部 agent 平台，想要一个工具生态，接入 MCP 立刻有数百个 servers 可选。` },
      { title: `Coding agent harness`, detail: `用 Claude Agent SDK 继承 Claude Code 整个 harness，不用从零写 tool loop、context 管理、permission system。` },
    ],
    antiPatterns: [
      `单体应用 agent 只有几个内部工具：直接在 agent 代码里写 function 更简单`,
      `严格封闭的企业环境：MCP 目前的 transport 和认证方案还在演进`,
    ],
    installCmd: `pip install claude-agent-sdk  # 或: npm install @modelcontextprotocol/sdk`,
    helloWorld: `from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

options = ClaudeAgentOptions(
    mcp_servers={
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {"GITHUB_TOKEN": "..."},
        },
        "postgres": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-postgres"],
        },
    },
    allowed_tools=["Read", "Grep", "Bash"],
    permission_mode="default",
    system_prompt="你是一个代码审查助手。",
)

async def main():
    async with ClaudeSDKClient(options=options) as client:
        await client.query("检查最近的 PR 是否引入了 SQL 注入风险")
        async for msg in client.receive_response():
            print(msg)`,
    keyApis: [
      { name: `ClaudeAgentOptions`, explain: `harness 配置中心。mcp_servers、allowed_tools、permission_mode、system_prompt、hooks。` },
      { name: `mcp_servers`, explain: `接入 MCP 生态。可以是 stdio（本地进程）、sse / http（远程服务）。` },
      { name: `hooks: PreToolUse / PostToolUse`, explain: `工具执行前后拦截，做审计、修改参数、deny 操作。配合 allowedTools 形成权限五层评估。` },
      { name: `can_use_tool callback`, explain: `最后一层权限，每个 tool call 都会触发。返回 allow / deny / approve_with_changes / suggest_alternative。` },
    ],
    versus: [
      { other: `vs LangChain tools`, diff: `LangChain 的 tool 只在 LangChain 生态用，MCP 跨生态。` },
      { other: `vs OpenAI function calling`, diff: `function calling 是模型层 API，MCP 是跨 agent / 跨模型的协议层。两者互补。` },
    ],
    urls: { github: `https://github.com/modelcontextprotocol`, docs: `https://modelcontextprotocol.io/` },
    stars: `45k+`,
    firstRelease: `2024`,
    language: `TypeScript / Python / Rust`,
  },
];

export function getFrameworkById(id: string): Framework | undefined {
  return frameworks.find((f) => f.id === id);
}

export const categoryLabels: Record<Category, string> = {
  framework: `核心框架`,
  memory: `记忆与状态`,
  protocol: `工具与协议`,
};

export const categoryDescriptions: Record<Category, string> = {
  framework: `Agent workflow 编排与多 agent 协作的主骨架。`,
  memory: `让 agent 跨 session 保持状态、记得用户的层。`,
  protocol: `跨 agent / 跨 LLM 的工具和通信标准。`,
};
