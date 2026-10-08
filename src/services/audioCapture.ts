/**
 * Audio Capture Service using Web Audio API and MediaDevices API
 */
export class AudioCaptureService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private dataArray: Uint8Array | null = null;
  private isCapturing: boolean = false;

  public async startCapture(): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.85;

      source.connect(this.analyser);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.isCapturing = true;
      return true;
    } catch {
      this.isCapturing = false;
      return false;
    }
  }

  public getAudioLevels(barCount: number = 24): number[] {
    if (this.isCapturing && this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray as any);
      const levels: number[] = [];
      const step = Math.floor(this.dataArray.length / barCount) || 1;

      for (let i = 0; i < barCount; i++) {
        const val = this.dataArray[i * step] || 0;
        levels.push(val / 255);
      }
      return levels;
    }

    // Organic harmonic simulation fallback (very calm, subtle, peaceful)
    const time = Date.now() * 0.003;
    const levels: number[] = [];
    for (let i = 0; i < barCount; i++) {
      const wave = Math.sin(time + i * 0.35) * 0.35 + Math.cos(time * 0.7 - i * 0.2) * 0.25;
      const normalized = Math.max(0.12, Math.min(0.85, 0.3 + wave * 0.3));
      levels.push(normalized);
    }
    return levels;
  }

  public stopCapture(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isCapturing = false;
  }
}

export const audioCapture = new AudioCaptureService();
