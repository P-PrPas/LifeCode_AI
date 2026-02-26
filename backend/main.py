from fastapi import FastAPI, HTTPException
from typing import Literal
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
        
        # 2. Build Prompt for AI based on language
        def build_prompt(lang: str) -> str:
            if lang.lower().startswith('e'):
                # English template
                return f"""
                You are an expert in Life Code numerology and a digital matrix analyst.
                Compare Inner World (Thai Solar Calendar – thoughts/identity) with Outer World (Chinese Lunar Calendar – actions/results).

                Life Code number meanings:
                1 = Self, leadership, confidence
                2 = Relationships, partnerships, communication
                3 = Creativity, expansion, expression
                4 = Structure, stability, discipline, responsibility
                5 = Change, movement, freedom, balance energy
                6 = Love, care, charm, family responsibility, wealth
                7 = Inner wisdom, learning, truth-seeking, spiritual growth
                8 = Power, authority, justice, high responsibility
                9 = Completion, higher success, humanitarianism, giving
                0 = Spirit, hidden potential, energy source, amplification of others

                Shape meanings (intensity of energy):
                - Circle (Base): basic energy from birth (1 point)
                - Triangle (Gift): innate talent or gift (3 points)
                - Square (Life Code): core life path (5 points)

                Here is the user data:
                Inner World:
                - Gift number: {inner_world_data['gift_number']}, Life code: {inner_world_data['life_code']}
                - Weights: {inner_world_data['weights']}
                - Combos: {inner_world_data['combo_lines'] if inner_world_data['combo_lines'] else 'none'}

                Outer World:
                - Gift number: {outer_world_data['gift_number']}, Life code: {outer_world_data['life_code']}
                - Weights: {outer_world_data['weights']}
                - Combos: {outer_world_data['combo_lines'] if outer_world_data['combo_lines'] else 'none'}

                Instructions:
                1. Analyze identity and conflict when inner and outer numbers differ significantly.
                2. Advise how to leverage "gifts (combo/triangles)" effectively.
                3. Summarize life overview in an encouraging, powerful, and credible tone.
                """
            else:
                # existing Thai prompt
                return f"""
                คุณคือผู้เชี่ยวชาญด้านรหัสชีวิต (Life Code) และนักวิเคราะห์รหัสดิจิทัล (Digital Matrix)
                วิเคราะห์ข้อมูลโดยเปรียบเทียบระหว่าง โลกภายใน (Thai Solar Calendar - ความคิด/ตัวตน) และ โลกภายนอก (Chinese Lunar Calendar - การกระทำ/ผลลัพธ์)

                แนวทางการวิเคราะห์ตัวเลข Life Code
                1 = ตัวตน เอกลักษณ์ ความเป็นผู้นำ ความเชื่อมั่น
                2 = ความสัมพันธ์ คู่ครอง หุ้นส่วน ความร่วมมือ การสื่อสาร
                3 = ความคิดสร้างสรรค์ การขยายตัว การแสดงออก การสื่อสารเชิงสร้างสรรค์
                4 = โครงสร้าง ความมั่นคง พื้นฐาน วินัย และความรับผิดชอบ
                5 = การเปลี่ยนแปลง การเคลื่อนไหว อิสรภาพ พลังงานของการปรับสมดุล
                6 = ความรัก การดูแล เสน่ห์ ความรับผิดชอบต่อครอบครัวและความมั่งคั่ง
                7 = ปัญญาภายใน การเรียนรู้จากประสบการณ์ การค้นหาความจริง และการเติบโตทางจิตใจ
                8 = อำนาจ การบริหาร การปกครอง ความยุติธรรม และความรับผิดชอบระดับสูง
                9 = ความสมบูรณ์ ความสำเร็จขั้นสูง นิมิต มนุษยธรรม และการให้
                0 = จิตวิญญาณ ศักยภาพที่ซ่อนอยู่ แหล่งพลัง และการขยายพลังของตัวเลขอื่น

                ความหมายของรูปทรง (ความเข้มข้นของพลังงาน):
                - วงกลม (Base): พลังงานพื้นฐานจากวันเกิด (1 คะแนน)
                - สามเหลี่ยม (Gift): พรสวรรค์หรือต้นทุนที่มีมาแต่เกิด (3 คะแนน)
                - สี่เหลี่ยม (Life Code): หัวใจสำคัญหรือวิถีชีวิตที่ต้องเดินไป (5 คะแนน)

                นี่คือข้อมูลของ User:
                โลกภายใน (Inner World):
                - เลขพรสวรรค์: {inner_world_data['gift_number']}, รหัสชีวิต: {inner_world_data['life_code']}
                - คะแนนตัวเลข: {inner_world_data['weights']}
                - คอมโบที่ได้: {inner_world_data['combo_lines'] if inner_world_data['combo_lines'] else 'ไม่มี'}

                โลกภายนอก (Outer World):
                - เลขพรสวรรค์: {outer_world_data['gift_number']}, รหัสชีวิต: {outer_world_data['life_code']}
                - คะแนนตัวเลข: {outer_world_data['weights']}
                - คอมโบที่ได้: {outer_world_data['combo_lines'] if outer_world_data['combo_lines'] else 'ไม่มี'}

                คำสั่ง:
                1. วิเคราะห์ตัวตนและความขัดแย้ง (Conflict) เช่น หากเลขในโลกภายในและภายนอกต่างกันมาก หมายถึงความคิดและการกระทำไม่สวนทางกันอย่างไร?
                2. คำแนะนำในการดึงเอา "พรสวรรค์ (Combo/Triangles)" ออกมาใช้ให้เกิดประโยชน์สูงสุด
                3. สรุปภาพรวมชีวิตด้วยน้ำเสียงที่ให้กำลังใจ ทรงพลัง และน่าเชื่อถือ
                """
        
        prompt = build_prompt(request.language)
        
        # 3. Get AI Analysis
        ai_analysis_text = get_life_code_analysis(prompt)
        
        return AnalysisResponse(
            inner_world=NumberAnalysis(**inner_world_data),
            outer_world=NumberAnalysis(**outer_world_data),
            ai_analysis=ai_analysis_text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
