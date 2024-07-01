from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import langgraph
from langchain_community.llms import Ollama
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain.agents import Tool
from langchain.agents import create_openai_functions_agent
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import Runnable
import json
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update this with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Agent(BaseModel):
    id: int
    name: str
    type: str
    model: str
    config: str

class Task(BaseModel):
    id: int
    description: str
    inputAgent: str
    outputAgent: str

class Config(BaseModel):
    agents: List[Agent]
    tasks: List[Task]

class HistoryItem(BaseModel):
    id: str
    timestamp: str
    config: Config

# In-memory storage for workflow history
workflow_history = []

def create_agent(agent: Agent) -> Runnable:
    try:
        config = json.loads(agent.config)
        llm = Ollama(model=agent.model)
        
        if agent.type == "search_agent":
            search_tool = Tool(
                name="Tavily Search",
                description="Search the internet for current information.",
                func=TavilySearchResults().run
            )
            tools = [search_tool]
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a helpful AI assistant with access to a search tool. Use it when you need current information."),
                ("human", "{input}"),
                ("human", "Use the search tool if you need to find current information.")
            ])
            return create_openai_functions_agent(llm, tools, prompt)
        elif agent.type == "custom_agent":
            # Implement custom agent logic here
            raise NotImplementedError("Custom agent type not implemented yet")
        else:
            raise ValueError(f"Unknown agent type: {agent.type}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating agent {agent.name}: {str(e)}")

@app.post("/run-workflow")
async def run_workflow(config: Config):
    try:
        print("Received config:", config)

        workflow = langgraph.Graph()

        for agent in config.agents:
             workflow.add_node(agent.name, create_agent(agent))

        for task in config.tasks:
            workflow.add_edge(task.inputAgent, task.outputAgent, description=task.description)

        result = workflow.run(config.workflowInput)

        # Save to history
        history_item = HistoryItem(
            id=str(len(workflow_history) + 1),
            timestamp=datetime.now().isoformat(),
            config=config
        )
        workflow_history.append(history_item)

        return {"result": f"Received {len(config.agents)} agents and {len(config.tasks)} tasks"}
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/workflow-history")
async def get_workflow_history():
    return workflow_history

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)