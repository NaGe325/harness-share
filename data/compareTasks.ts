export type CodeSample = {
  framework: string;
  frameworkName: string;
  code: string;
  note: string;
};

export type CompareTask = {
  id: string;
  title: string;
  description: string;
  requirement: string;
  tags: string[];
  samples: CodeSample[];
  takeaway: string;
};

export const compareTasks: CompareTask[] = [
  {
    id: `research-assistant`,
    title: `研究助手 · 搜索 → 摘要 → 结构化报告`,
    description: `三个框架同一个任务，看代码形状与心智模型差异`,
    requirement: `给定一个话题，先用 web search 搜索相关资料，LLM 总结成要点，最后输出结构化报告（标题 / 摘要 / 发现列表 / 参考来源）。`,
    tags: [`多步骤`, `结构化输出`, `常见`],
    samples: [
      {
        framework: `langgraph`,
        frameworkName: `LangGraph`,
        note: `显式图结构，每个步骤是一个节点，状态在节点间流转。适合后续要加 HITL 或错误恢复。`,
        code: `from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

class Report(BaseModel):
    title: str
    summary: str
    findings: list[str]
    sources: list[str]

class State(TypedDict):
    query: str
    search_results: list
    summary: str
    report: Report | None

llm = ChatOpenAI(model="gpt-4o")

def search_node(s: State) -> State:
    s["search_results"] = web_search(s["query"])
    return s

def summarize_node(s: State) -> State:
    content = "\\n".join(r["snippet"] for r in s["search_results"])
    s["summary"] = llm.invoke(f"总结: {content}").content
    return s

def structure_node(s: State) -> State:
    s["report"] = llm.with_structured_output(Report).invoke(
        f"转成结构化报告: {s['summary']}"
    )
    return s

graph = StateGraph(State)
graph.add_node("search", search_node)
graph.add_node("summarize", summarize_node)
graph.add_node("structure", structure_node)
graph.set_entry_point("search")
graph.add_edge("search", "summarize")
graph.add_edge("summarize", "structure")
graph.add_edge("structure", END)

app = graph.compile()
result = app.invoke({
    "query": "harness engineering trends 2026",
    "search_results": [], "summary": "", "report": None,
})
print(result["report"].title)`,
      },
      {
        framework: `crewai`,
        frameworkName: `CrewAI`,
        note: `两个角色（researcher / analyst）接力工作。backstory 塑造行为，sequential process 按顺序执行。`,
        code: `from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool
from pydantic import BaseModel

class Report(BaseModel):
    title: str
    summary: str
    findings: list[str]
    sources: list[str]

researcher = Agent(
    role="Senior Research Analyst",
    goal="挖掘 {topic} 领域最新、最可靠的信息",
    backstory="你在技术分析领域有 10 年经验。",
    tools=[SerperDevTool()],
    verbose=True,
)

analyst = Agent(
    role="Report Writer",
    goal="把研究发现整理成结构化报告",
    backstory="你写过 Stratechery 风格的深度分析。",
)

research_task = Task(
    description="调研 {topic}，至少找 5 个权威来源",
    agent=researcher,
    expected_output="研究发现列表，每个带来源链接",
)

report_task = Task(
    description="基于研究，输出结构化 Report",
    agent=analyst,
    context=[research_task],
    output_pydantic=Report,
    expected_output="完整的 Report 对象",
)

crew = Crew(
    agents=[researcher, analyst],
    tasks=[research_task, report_task],
    process=Process.sequential,
)

result = crew.kickoff(inputs={"topic": "harness engineering"})
report: Report = result.pydantic
print(report.title)`,
      },
      {
        framework: `smolagents`,
        frameworkName: `smolagents`,
        note: `一个 agent，让它自己写 Python 代码调工具。code-agent 范式，模型一次性规划多步。`,
        code: `from smolagents import CodeAgent, HfApiModel, tool
from pydantic import BaseModel

class Report(BaseModel):
    title: str
    summary: str
    findings: list[str]
    sources: list[str]

@tool
def web_search(query: str) -> list[dict]:
    """
    搜索网络，返回结果列表。

    Args:
        query: 搜索关键词
    """
    return search_api(query)

@tool
def final_report(
    title: str, summary: str,
    findings: list[str], sources: list[str],
) -> dict:
    """
    产出结构化 Report。

    Args:
        title: 报告标题
        summary: 摘要
        findings: 关键发现列表
        sources: 来源 URL 列表
    """
    return Report(
        title=title, summary=summary,
        findings=findings, sources=sources,
    ).model_dump()

agent = CodeAgent(
    tools=[web_search, final_report],
    model=HfApiModel("Qwen/Qwen2.5-72B-Instruct"),
    additional_authorized_imports=["json"],
)

# agent 自己生成 Python 代码调工具、做推理
result = agent.run(
    "调研 harness engineering 2026 最新趋势，"
    "产出含 title、summary、findings(5个)、sources 的 Report。"
)
print(result)`,
      },
    ],
    takeaway: `LangGraph 显式、冗长、可控；CrewAI 角色化、易读、隐式编排；smolagents 一段代码 + code-agent，模型自己规划。三个方案都对，选哪个看你下一步要加什么：要加 HITL 和恢复用 LangGraph，要加更多角色用 CrewAI，要跑开源模型或做教学用 smolagents。`,
  },
  {
    id: `customer-triage`,
    title: `客服工单分派 · 意图识别 → 路由`,
    description: `一个用户请求进来，先分类，再转给对应领域 agent。`,
    requirement: `用户发来消息，识别是账单 / 技术 / 退货哪类问题，转给对应 agent 处理。`,
    tags: [`路由`, `handoff`, `常见`],
    samples: [
      {
        framework: `openai-agents`,
        frameworkName: `OpenAI Agents SDK`,
        note: `天生就为这个场景设计。handoff 是一等公民，代码最短最直观。`,
        code: `from agents import Agent, Runner, function_tool

@function_tool
def lookup_order(order_id: str) -> dict:
    return {"status": "shipped", "tracking": "1Z..."}

@function_tool
def initiate_refund(order_id: str, reason: str) -> bool:
    return True

billing = Agent(
    name="billing",
    instructions="处理账单、付款、发票相关问题。",
    tools=[lookup_order],
)

tech = Agent(
    name="tech",
    instructions="处理技术故障、产品使用问题。",
)

returns = Agent(
    name="returns",
    instructions="处理退货、退款流程。",
    tools=[lookup_order, initiate_refund],
)

triage = Agent(
    name="triage",
    instructions=(
        "识别用户意图，转给对应的专家 agent："
        "账单问题 → billing，"
        "技术问题 → tech，"
        "退货退款 → returns。"
    ),
    handoffs=[billing, tech, returns],
)

result = Runner.run_sync(triage, "我要退货，订单 #1234")
print(result.final_output)`,
      },
      {
        framework: `langgraph`,
        frameworkName: `LangGraph`,
        note: `用条件边实现路由。更显式更冗长，好处是可以轻松加 HITL 节点或重试逻辑。`,
        code: `from typing import TypedDict, Literal
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

class State(TypedDict):
    query: str
    category: str
    response: str

llm = ChatOpenAI(model="gpt-4o")

def classify(s: State) -> State:
    result = llm.invoke(
        "将用户请求分类为 billing / tech / returns / unknown: "
        + s["query"]
    ).content.strip().lower()
    s["category"] = result if result in {"billing","tech","returns"} else "unknown"
    return s

def handle_billing(s: State) -> State:
    s["response"] = "billing agent 处理: " + s["query"]
    return s

def handle_tech(s: State) -> State:
    s["response"] = "tech agent 处理: " + s["query"]
    return s

def handle_returns(s: State) -> State:
    s["response"] = "returns agent 处理: " + s["query"]
    return s

def router(s: State) -> str:
    return s["category"] if s["category"] != "unknown" else END

graph = StateGraph(State)
graph.add_node("classify", classify)
graph.add_node("billing", handle_billing)
graph.add_node("tech", handle_tech)
graph.add_node("returns", handle_returns)
graph.set_entry_point("classify")
graph.add_conditional_edges("classify", router)
for node in ["billing", "tech", "returns"]:
    graph.add_edge(node, END)

app = graph.compile()
result = app.invoke({"query": "我要退货", "category": "", "response": ""})`,
      },
      {
        framework: `crewai`,
        frameworkName: `CrewAI`,
        note: `hierarchical process + manager agent，让一个主管 agent 动态分派，黑盒但灵活。`,
        code: `from crewai import Agent, Task, Crew, Process

billing = Agent(
    role="Billing Specialist",
    goal="解决账单、付款相关问题",
    backstory="前 Stripe 客服主管，精通支付系统。",
)

tech = Agent(
    role="Tech Support",
    goal="解决产品使用和故障",
    backstory="L3 级技术支持，擅长定位根因。",
)

returns = Agent(
    role="Returns Specialist",
    goal="处理退货退款",
    backstory="熟悉各类退货政策和流程。",
)

task = Task(
    description="处理客户请求: {query}",
    expected_output="给客户的回复",
)

# hierarchical: CrewAI 自动加一个 manager 做分派
crew = Crew(
    agents=[billing, tech, returns],
    tasks=[task],
    process=Process.hierarchical,
    manager_llm="gpt-4o",
)

result = crew.kickoff(inputs={"query": "订单 #1234 要退货"})`,
      },
    ],
    takeaway: `客服分派是 OpenAI Agents SDK 的主场，handoff 语义最贴合，代码最短。LangGraph 可以做但更啰嗦；CrewAI 的 hierarchical 是另一种思路，让 manager agent 动态调度，适合分类边界模糊的复杂场景。`,
  },
  {
    id: `memory-chat`,
    title: `带长期记忆的聊天 agent`,
    description: `用户说一次"我对花生过敏"，半年后再对话时 agent 还记得。`,
    requirement: `agent 能自动从对话抽取用户信息并持久化，下次对话时相关信息自动注入 context。`,
    tags: [`记忆`, `对话`, `持久化`],
    samples: [
      {
        framework: `mem0`,
        frameworkName: `mem0`,
        note: `即插即用。不改 agent 架构，add 和 search 两个调用就完成，任何框架都能接。`,
        code: `from mem0 import Memory
from openai import OpenAI

oa = OpenAI()
memory = Memory()

def chat(user_id: str, message: str) -> str:
    # 1. 检索相关记忆
    memories = memory.search(
        query=message, user_id=user_id, limit=3,
    )
    context = "\\n".join(
        f"- {m['memory']}" for m in memories["results"]
    )

    # 2. 构造 system prompt（注入记忆）
    system = f"你是用户的长期助理。\\n已知用户信息:\\n{context}"

    # 3. 调 LLM（任何框架 / 原生 API 都行）
    resp = oa.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": message},
        ],
    )
    reply = resp.choices[0].message.content

    # 4. 把新对话喂回去，自动抽取事实
    memory.add(
        messages=[
            {"role": "user", "content": message},
            {"role": "assistant", "content": reply},
        ],
        user_id=user_id,
    )
    return reply

chat("alice", "我对花生过敏")
# ... 几个月后 ...
chat("alice", "推荐一个晚餐")
# agent 会基于抽取的"花生过敏"过滤推荐`,
      },
      {
        framework: `letta`,
        frameworkName: `Letta`,
        note: `架构级方案。memory blocks + archival memory + agent 自主管理记忆层次，记忆是一等公民。`,
        code: `from letta_client import Letta

client = Letta(base_url="http://localhost:8283")

# 创建有持久记忆的 agent（memory blocks 永久存储）
agent = client.agents.create(
    name="alice-assistant",
    model="openai/gpt-4o",
    embedding="openai/text-embedding-3-small",
    memory_blocks=[
        {
            "label": "persona",
            "value": "我是 Alice 的长期生活助理，关心她的健康和偏好。",
            "limit": 2000,
        },
        {
            "label": "human",
            "value": "Alice 是我的用户。",
            "limit": 2000,
        },
    ],
)

# agent 会主动用工具更新自己的 memory blocks
response = client.agents.messages.create(
    agent_id=agent.id,
    messages=[
        {"role": "user", "content": "记一下，我对花生过敏。"},
    ],
)
# agent 内部调用:
# core_memory_append(label="human", content="对花生过敏")

# 几个月后，换会话也好，重启也好，memory blocks 始终在 context
response = client.agents.messages.create(
    agent_id=agent.id,
    messages=[
        {"role": "user", "content": "推荐一个晚餐？"},
    ],
)
# LLM 看到 human block 里的"对花生过敏"，自动规避`,
      },
    ],
    takeaway: `mem0 是"最小侵入"：你原来怎么做 agent 还怎么做，加两个调用。Letta 是"架构级"：整个 agent 为记忆而生，memory blocks 是一等公民。如果记忆是副功能，mem0；如果记忆是产品核心，Letta。`,
  },
];

export function getTaskById(id: string): CompareTask | undefined {
  return compareTasks.find((t) => t.id === id);
}
