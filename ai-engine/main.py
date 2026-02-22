import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils.extractor import extract_text
from services.gemini_service import analyze_document_and_generate_slides
from ppt_generator.generator import create_presentation

app = FastAPI(title="AI Presentation Generator Engine")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI Processing Engine is running"}

@app.post("/generate")
def generate_presentation(
    file_path: str = Form(None),
    theme: str = Form("Corporate"),
    slide_length: str = Form("Medium"),
    file: UploadFile = File(None)
):
    try:
        # Check if file sent via UploadFile or physical path from node
        actual_path = None
        if file_path and os.path.exists(file_path):
            actual_path = file_path
        elif file:
            actual_path = f"temp_{file.filename}"
            with open(actual_path, "wb") as f:
                f.write(file.file.read())
        
        if not actual_path:
            raise HTTPException(status_code=400, detail="No valid file provided")

        # 1. Extract Text
        text = extract_text(actual_path)
        
        # 2. Call Gemini
        json_slides = analyze_document_and_generate_slides(text, theme, slide_length)
        
        # 3. Generate PPT
        output_filename = f"generated_presentation_{os.path.basename(actual_path)}.pptx"
        output_filepath = os.path.abspath(output_filename)
        create_presentation(json_slides, theme, output_filepath)
        
        # Cleanup temp file if created from UploadFile
        if file and os.path.exists(actual_path):
            os.remove(actual_path)
            
        return {"status": "success", "file_url": output_filepath, "slide_count": len(json_slides.get('slides', []))}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
