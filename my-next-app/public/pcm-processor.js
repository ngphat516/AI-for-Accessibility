/**
 * PCM Audio Worklet Processor
 * Nhận raw PCM audio data từ Gemini Live API và phát ra loa.
 * File này phải được đặt trong thư mục public hoặc được tải qua URL.
 *
 * Input: AudioWorklet port nhận Float32Array chunks
 * Output: phát âm thanh qua audio context output
 */
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._bufferSize = 0;

    this.port.onmessage = (event) => {
      if (event.data && event.data.type === "audio") {
        // Nhận Int16Array (PCM 16-bit) từ main thread, chuyển sang Float32
        const int16 = new Int16Array(event.data.data);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) {
          float32[i] = int16[i] / 32768.0;
        }
        this._buffer.push(float32);
        this._bufferSize += float32.length;
      } else if (event.data && event.data.type === "clear") {
        // Xóa buffer khi bị interrupt
        this._buffer = [];
        this._bufferSize = 0;
      }
    };
  }

  process(inputs, outputs) {
    const output = outputs[0];
    if (!output || output.length === 0) return true;

    const channel = output[0];
    const numSamples = channel.length;

    let written = 0;
    while (written < numSamples && this._buffer.length > 0) {
      const chunk = this._buffer[0];
      const remaining = numSamples - written;

      if (chunk.length <= remaining) {
        // Dùng hết chunk này
        channel.set(chunk, written);
        written += chunk.length;
        this._buffer.shift();
        this._bufferSize -= chunk.length;
      } else {
        // Chỉ dùng một phần
        channel.set(chunk.subarray(0, remaining), written);
        this._buffer[0] = chunk.subarray(remaining);
        this._bufferSize -= remaining;
        written = numSamples;
      }
    }

    // Điền 0 cho phần còn lại nếu buffer trống
    if (written < numSamples) {
      channel.fill(0, written);
    }

    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
