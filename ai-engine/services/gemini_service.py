import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

from typing import List, Optional
from typing_extensions import TypedDict

generation_config = {
  "temperature": 0.2,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-2.5-flash",
  generation_config=generation_config,
)

import requests
import urllib.parse

def chunk_text(text: str, chunk_size: int = 15000) -> list:
    """Basic chunking by character length to avoid token limits."""
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def generate_slide_image(prompt: str, output_path: str):
    """Uses Pixabay API to fetch a relevant image based on the prompt keywords."""
    try:
        # Extract main keywords from the prompt (very simplified for MVP)
        # e.g. "A modern illustration of a neural network" -> "neural network"
        keywords = prompt.replace("A modern, minimalist vector illustration representing ", "").replace(", solid pastel background", "").replace("A detailed diagram of ", "")
        encoded_query = urllib.parse.quote(keywords[:50])
        
        # Free API Key for demonstration (Pixabay allows client-side demo keys with limits)
        # In a real app this must be in .env
        pixabay_key = os.getenv("PIXABAY_API_KEY", "43469176-a212df860aeb875e634062f6b") 
        url = f"https://pixabay.com/api/?key={pixabay_key}&q={encoded_query}&image_type=photo&orientation=horizontal&per_page=3"
        
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data['totalHits'] > 0:
                # Get the first image URL
                image_url = data['hits'][0]['largeImageURL']
                
                # Download the actual image
                img_response = requests.get(image_url, stream=True)
                if img_response.status_code == 200:
                    with open(output_path, 'wb') as f:
                        for chunk in img_response.iter_content(1024):
                            f.write(chunk)
                    return True
                    
        # Fallback to random picsum if pixabay fails or finds nothing
        url_fallback = f"https://picsum.photos/seed/{encoded_query[:10]}/800/450"
        fb_response = requests.get(url_fallback, stream=True)
        if fb_response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in fb_response.iter_content(1024):
                    f.write(chunk)
            return True
            
    except Exception as e:
        print(f"Image gen error: {e}")
    return False

def analyze_document_and_generate_slides(text: str, theme: str, slide_length: str) -> dict:
    """
    Sends text to Gemini to generate structured JSON for slides.
    To handle very large documents, we chunk the text, summarize, and combine.
    For simplicity in this MVP, we will try to process the first large chunk or summarize chunks.
    """
    
    # Simple chunking strategy for MVP: If it's too large, take the first chunk to ensure success
    # In a full implementation, we would summarize each chunk and then combine.
    chunks = chunk_text(text, 30000)
    primary_text = chunks[0] if chunks else ""
    
    prompt = f"""
    You are an expert presentation layout engine. Convert the following academic/technical document text into a structured JSON infographic format.
    The presentation should reflect a '{theme}' theme and be '{slide_length}' in length.
    
    Return a JSON structure with the following format exactly:
    {{
        "title": "Main Presentation Title",
        "slides": [
            {{
                "layout_type": "standard", // options: "standard", "split_image", "three_column"
                "title": "Slide Title",
                "bullets": ["Point 1", "Point 2", "Point 3"], // Only used for standard/split_image
                "columns": [ // Only used if layout_type is "three_column"
                     {{"header": "Col 1", "text": "Details..."}},
                     {{"header": "Col 2", "text": "Details..."}},
                     {{"header": "Col 3", "text": "Details..."}}
                ],
                "image_prompt": "A modern, minimalist vector illustration representing neural networks, solid pastel background", // Only if layout_type is "split_image"
                "notes": "Presenter notes for this slide",
                "contains_metrics": false,
                "chart_data": {{"labels": ["A", "B"], "values": [0.9, 0.8], "title": "Chart Title"}} // Only if contains_metrics=true
            }}
        ]
    }}
    
    Rules for Layouts:
    1. Introduction/Conclusions should often be 'standard'.
    2. Architecture, Workflow, or Complex mechanisms MUST be 'split_image' and include a detailed 'image_prompt'. You MUST generate at least 1-2 'split_image' layouts per presentation.
    3. Comparisons, Limitations, or 3-step methodologies should be 'three_column'.
    4. You MUST set contains_metrics=true for at least 1 slide if numerical data exists, and populate chart_data with actual data from text!
    
    Document Text:
    {primary_text}
    """
    
    try:
        response = model.generate_content(prompt)
        # response should be proper JSON due to response_mime_type
        return json.loads(response.text)
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        # Fallback empty structure
        return {"title": "Error generating presentation", "slides": []}
