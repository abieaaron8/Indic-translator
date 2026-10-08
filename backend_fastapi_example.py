"""
Indic Translator — Universal Backend Example (FastAPI + WebSocket)
Works out of the box with any Speech-to-Speech / Speech-to-Text translation models:
- IndicTrans2 (AI4Bharat)
- Whisper (OpenAI / HuggingFace)
- Bhashini (Government of India ULCA API)
- SeamlessM4T (Meta)
- Azure / Google Cloud Speech

Run with:
    pip install fastapi uvicorn
    python backend_fastapi_example.py
"""

import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn

app = FastAPI(title="Indic Translator Stream Backend")

@app.websocket("/v1/stream")
async def websocket_translation_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected to Indic Translator stream")
    
    try:
        # Send connection confirmation
        await websocket.send_json({
            "type": "mic_status",
            "payload": {"status": "Connected"}
        })

        while True:
            # Receive client audio chunk or action
            message = await websocket.receive()
            
            if "text" in message:
                data = json.loads(message["text"])
                action = data.get("action")
                
                if action == "start_session":
                    src = data.get("source_language", "ta")
                    tgt = data.get("target_language", "en")
                    print(f"Session started: {src} -> {tgt}")
                    
                    # Example of streaming responses sent back to the frontend:
                    # 1. Speech detected
                    await websocket.send_json({
                        "type": "speech_interim",
                        "payload": {"text": "வணக்கம்..."}
                    })
                    await asyncio.sleep(0.4)
                    
                    # 2. Complete speech
                    await websocket.send_json({
                        "type": "speech_final",
                        "payload": {"text": "வணக்கம், நீங்கள் சொல்வது எனக்கு தெளிவாக கேட்கிறது."}
                    })
                    await asyncio.sleep(0.3)
                    
                    # 3. Translating interim
                    await websocket.send_json({
                        "type": "translation_interim",
                        "payload": {"text": "Hello..."}
                    })
                    await asyncio.sleep(0.4)
                    
                    # 4. Final translated text
                    await websocket.send_json({
                        "type": "translation_final",
                        "payload": {"text": "Hello, I can hear you clearly. When would you like us to begin?"}
                    })

            elif "bytes" in message:
                # Raw PCM/WAV/WebM audio buffer from microphone
                audio_bytes = message["bytes"]
                # Pass audio_bytes to your model (e.g. model.transcribe(audio_bytes))
                pass

    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
