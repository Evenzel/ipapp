from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="PatentOS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Patent(BaseModel):
    id: str
    title: str
    owner: str
    inventor: str
    status: str
    priority: str
    filingDate: str
    deadline: str
    jurisdiction: str
    category: str


ITEMS = [
    Patent(
        id="PT-2026-041",
        title="Adaptive Battery Life Prediction System",
        owner="Alpha Mobility",
        inventor="Kim Jihoon + 2",
        status="examination",
        priority="high",
        filingDate="2026-02-12",
        deadline="2026-07-08",
        jurisdiction="KR / US / EP",
        category="AI / Battery",
    ),
    Patent(
        id="PT-2026-038",
        title="Next-Gen Cooling Module Controller",
        owner="Alpha Mobility",
        inventor="Park Seoyeon",
        status="filing",
        priority="medium",
        filingDate="2026-04-27",
        deadline="2026-06-30",
        jurisdiction="KR",
        category="HW / Thermal",
    ),
    Patent(
        id="PT-2025-119",
        title="Factory Equipment Anomaly Detection Model",
        owner="Alpha Mobility",
        inventor="Lee Minjae + 4",
        status="registered",
        priority="high",
        filingDate="2025-09-03",
        deadline="2027-09-03",
        jurisdiction="US / JP",
        category="AI / Manufacturing",
    ),
]


@app.get("/api/health")
def health():
    return {"ok": True, "service": "PatentOS API"}


@app.get("/api/patents")
def list_patents():
    return {"items": ITEMS}


@app.get("/api/patents/{patent_id}")
def get_patent(patent_id: str):
    for item in ITEMS:
        if item.id == patent_id:
            return item
    return {"error": "not_found", "id": patent_id}
