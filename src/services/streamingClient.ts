import { StreamEvent } from '../types';

export type StreamEventHandler = (event: StreamEvent) => void;

/**
 * Universal Backend-Agnostic Streaming Client
 * Works with ANY backend:
 * - Python / FastAPI (Whisper, IndicTrans2, Bhashini, SeamlessM4T)
 * - Node.js / Express WebSocket servers
 * - Go / Rust audio streaming daemons
 * - Commercial Speech Services (Azure, Google Cloud Speech, OpenAI Realtime API)
 */
export class StreamingClient {
  private socket: WebSocket | null = null;
  private listeners: Set<StreamEventHandler> = new Set();
  public isConnected: boolean = false;
  private reconnectTimer: number | null = null;
  private endpoint: string;

  constructor(endpoint: string = 'ws://localhost:8000/v1/stream') {
    this.endpoint = endpoint;
  }

  public setEndpoint(newEndpoint: string): void {
    if (this.endpoint !== newEndpoint) {
      this.endpoint = newEndpoint;
      if (this.isConnected) {
        this.disconnect();
        this.connect();
      }
    }
  }

  public getEndpoint(): string {
    return this.endpoint;
  }

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.socket = new WebSocket(this.endpoint);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.notify({ type: 'mic_status', payload: { status: 'Connected' } });
      };

      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.handleIncomingMessage(parsed);
        } catch {
          // In case backend sends plain text
          this.handleIncomingMessage({ type: 'speech_interim', payload: { text: event.data } });
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.notify({ type: 'mic_status', payload: { status: 'Offline' } });
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        this.isConnected = false;
        this.notify({ type: 'mic_status', payload: { status: 'Offline' } });
      };
    } catch {
      this.isConnected = false;
      this.notify({ type: 'mic_status', payload: { status: 'Offline' } });
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.isConnected) {
        this.connect();
      }
    }, 5000);
  }

  /**
   * Adapts diverse backend payloads into standard internal events
   */
  private handleIncomingMessage(raw: any): void {
    // Standard format
    if (raw.type) {
      this.notify({ type: raw.type, payload: raw.payload || raw });
      return;
    }

    // OpenAI Realtime / Whisper format adaptation
    if (raw.response?.status) {
      this.notify({ type: 'mic_status', payload: { status: raw.response.status } });
    } else if (raw.transcript) {
      this.notify({
        type: raw.is_final ? 'speech_final' : 'speech_interim',
        payload: { text: raw.transcript },
      });
    } else if (raw.translation) {
      this.notify({
        type: raw.is_final ? 'translation_final' : 'translation_interim',
        payload: { text: raw.translation },
      });
    }
  }

  public subscribe(handler: StreamEventHandler): () => void {
    this.listeners.add(handler);
    return () => this.listeners.delete(handler);
  }

  public notify(event: StreamEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  public startSession(fromLang: string, toLang: string): void {
    this.send({
      action: 'start_session',
      source_language: fromLang,
      target_language: toLang,
      sample_rate: 16000,
      timestamp: Date.now(),
    });
  }

  public stopSession(): void {
    this.send({ action: 'stop_session', timestamp: Date.now() });
  }

  public sendAudioChunk(data: ArrayBuffer | Blob | string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data);
    }
  }

  public send(payload: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(typeof payload === 'string' ? payload : JSON.stringify(payload));
    }
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
  }
}

export const streamClient = new StreamingClient();
