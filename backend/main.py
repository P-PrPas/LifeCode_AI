from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import DOBRequest, AnalysisResponse, NumberAnalysis
from services.calculator import process_dob
from services.ai_analyzer import get_life_code_analysis

app = FastAPI(title="Life Code API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend to access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/analyze", response_model=AnalysisResponse)
def analyze_life_code(request: DOBRequest):
    try:
        # 1. Process calculations
        inner_world_data = process_dob(request.thai_dob)
        outer_world_data = process_dob(request.chinese_dob)
        
        # 2. Build Prompt for AI
        prompt = f"""
คุณคือผู้เชี่ยวชาญด้านรหัสชีวิต (Life Code) ที่ประยุกต์ใช้ปฏิทินไทย(ความคิด/โลกภายใน) และปฏิทินจีน(การกระทำ/โลกภายนอก)

นี่คือข้อมูลของ User:
ฝั่งความคิด (Inner World):
- เลขพรสวรรค์: {inner_world_data['gift_number']}, รหัสชีวิต: {inner_world_data['life_code']}
- คะแนนตัวเลข: {inner_world_data['weights']}
- คอมโบที่ได้: {inner_world_data['combo_lines'] if inner_world_data['combo_lines'] else 'ไม่มี'}

ฝั่งการกระทำ (Outer World):
- เลขพรสวรรค์: {outer_world_data['gift_number']}, รหัสชีวิต: {outer_world_data['life_code']}
- คะแนนตัวเลข: {outer_world_data['weights']}
- คอมโบที่ได้: {outer_world_data['combo_lines'] if outer_world_data['combo_lines'] else 'ไม่มี'}

คำสั่ง:
ให้วิเคราะห์อุปนิสัย, พรสวรรค์, และโดยเฉพาะ "ความขัดแย้ง (Conflict)" ระหว่างความคิดและการกระทำ (เช่น คิดอย่างแต่ทำอีกอย่าง) พร้อมให้คำแนะนำในการใช้ชีวิต
        """
        
        # 3. Get AI Analysis
        ai_analysis_text = get_life_code_analysis(prompt)
        
        return AnalysisResponse(
            inner_world=NumberAnalysis(**inner_world_data),
            outer_world=NumberAnalysis(**outer_world_data),
            ai_analysis=ai_analysis_text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
