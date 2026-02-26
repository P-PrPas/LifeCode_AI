from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class DOBRequest(BaseModel):
    thai_dob: str = Field(..., description="Date of birth from Thai calendar in YYYY-MM-DD format")
    chinese_dob: str = Field(..., description="Date of birth from Chinese calendar in YYYY-MM-DD format")
    language: str = Field('th', description="Preferred language for AI response ('th' or 'en')")

class ShapeCount(BaseModel):
    circles: int
    triangles: int
    squares: int

class NumberAnalysis(BaseModel):
    dob_digits: List[int]
    gift_number: int
    life_code: int
    weights: Dict[int, int]
    shapes: Dict[int, ShapeCount]
    combo_lines: List[str]

class AnalysisResponse(BaseModel):
    inner_world: NumberAnalysis
    outer_world: NumberAnalysis
    ai_analysis: str
