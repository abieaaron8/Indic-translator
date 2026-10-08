# Universal Backend Integration Guide

The **Indic Translator** frontend was intentionally architected to be **completely backend-agnostic and vendor-neutral**.

It does **not** rely on proprietary SDKs (no OpenAI-only SDK, no AWS-only lock-in, no Google-only libraries). Instead, it uses standard web protocols:
- **Native WebSocket API** (`WebSocket`) for real-time bidirectional audio streaming and token deltas
- **Native Web Audio API** (`AudioContext`, `AnalyserNode`) for microphone sampling
- **Standard JSON Streaming Events**

---

## Supported Backend Architectures

You can plug in **any** of the following backends without changing any frontend UI code:

| Backend Stack | Typical Pipeline | Connection Method |
| :--- | :--- | :--- |
| **Python / FastAPI** | Whisper ASR + AI4Bharat IndicTrans2 + FastSpeech2 | WebSocket (`ws://host:port/v1/stream`) |
| **Government Bhashini** | ULCA Pipeline (ASR -> NMT -> TTS) | WebSocket adapter or HTTP chunked SSE |
| **Node.js / Express** | `ws` package streaming to HuggingFace Inference Endpoints | WebSocket |
| **Go / Rust Daemon** | On-premise Whisper.cpp / GGML engine | WebSocket |
| **Commercial APIs** | Azure Speech-to-Speech / Google Cloud Speech | Server-side WebSocket proxy |
| **Zero-Server (Browser)** | Web Speech Recognition API | Client-side native (built-in fallback) |

---

## WebSocket Event Specification

### 1. Client to Server (Outbound)

#### Session Start
```json
{
  "action": "start_session",
  "source_language": "ta",
  "target_language": "en",
  "sample_rate": 16000,
  "timestamp": 1728400000000
}
```

#### Audio Stream
- Raw binary chunks (`ArrayBuffer` or PCM byte chunks) sent continuously over the WebSocket when the mic is active.

#### Session Stop
```json
{
  "action": "stop_session",
  "timestamp": 1728400000000
}
```

---

### 2. Server to Client (Inbound)

The frontend's [`StreamingClient`](file:///c:/HackNex-translator/src/services/streamingClient.ts) automatically consumes these events:

| Event Type | Payload Schema | Frontend UI Reaction |
| :--- | :--- | :--- |
| `speech_interim` | `{"text": "வணக்கம்..."}` | Displays live partial original transcription with blinking cursor |
| `speech_final` | `{"text": "வணக்கம், நீங்கள் சொல்வது தெளிவாக கேட்கிறது."}` | Stabilizes original speech card; transitions mic to `Processing` |
| `translation_interim` | `{"text": "Hello, I can..."}` | Streams partial translation tokens in real-time |
| `translation_final` | `{"text": "Hello, I can hear you clearly."}` | Commits translation card, auto-plays TTS audio, returns mic to `Listening` |
| `mic_status` | `{"status": "Connected" \| "Offline"}` | Updates top-right status chip |

---

## How to Test with Your Own Backend

1. Open the application at `http://localhost:3000`.
2. Click **Settings** in the left sidebar.
3. Under **Backend Architecture & Connectivity**, switch the Pipeline Engine to **Live WebSocket**.
4. Enter your WebSocket URL (e.g., `ws://localhost:8000/v1/stream` or `wss://your-api.domain.com/stream`).
5. Run the provided Python backend example:
   ```bash
   pip install fastapi uvicorn
   python backend_fastapi_example.py
   ```
6. The frontend will immediately connect, exchange streaming events, and render live translated dialogue!
