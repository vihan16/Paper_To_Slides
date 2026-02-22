import fitz  # PyMuPDF
import docx
import os

def extract_text(file_path: str) -> str:
    """Extracts text from PDF, DOCX, or TXT files."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.pdf':
        return extract_from_pdf(file_path)
    elif ext == '.docx':
        return extract_from_docx(file_path)
    elif ext == '.txt':
        return extract_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported file format: {ext}")

def extract_from_pdf(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text() + "\n"
    return clean_text(text)

def extract_from_docx(file_path: str) -> str:
    doc = docx.Document(file_path)
    text = "\n".join([para.text for para in doc.paragraphs])
    return clean_text(text)

def extract_from_txt(file_path: str) -> str:
    with open(file_path, 'r', encoding='utf-8') as f:
        return clean_text(f.read())

def clean_text(text: str) -> str:
    # basic cleaning: remove excessive newlines
    lines = text.split('\n')
    cleaned = [line.strip() for line in lines if line.strip()]
    return '\n'.join(cleaned)
