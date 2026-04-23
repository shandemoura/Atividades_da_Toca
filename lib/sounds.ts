// Sons gerados via Web Audio API - sem arquivos externos.
// Funcões seguras: tudo dentro de try/catch para nunca quebrar.

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
      const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
      const AC = W.AudioContext ?? W.webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15, startOffset = 0) {
  const c = getCtx()
  if (!c) return
  try {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = 0
    osc.connect(gain)
    gain.connect(c.destination)
    const t0 = c.currentTime + startOffset
    gain.gain.linearRampToValueAtTime(volume, t0 + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
    osc.start(t0)
    osc.stop(t0 + duration + 0.05)
  } catch {
    /* ignore */
  }
}

export const sounds = {
  flip() {
    tone(520, 0.08, 'triangle', 0.12)
  },
  match() {
    tone(660, 0.12, 'sine', 0.18, 0)
    tone(880, 0.14, 'sine', 0.18, 0.08)
    tone(1100, 0.18, 'sine', 0.18, 0.16)
  },
  miss() {
    tone(220, 0.12, 'sawtooth', 0.08)
  },
  correct() {
    tone(523, 0.12, 'sine', 0.18, 0)
    tone(659, 0.12, 'sine', 0.18, 0.1)
    tone(784, 0.2, 'sine', 0.18, 0.2)
  },
  wrong() {
    tone(200, 0.2, 'square', 0.1)
  },
  win() {
    tone(523, 0.14, 'triangle', 0.2, 0)
    tone(659, 0.14, 'triangle', 0.2, 0.14)
    tone(784, 0.14, 'triangle', 0.2, 0.28)
    tone(1046, 0.3, 'triangle', 0.22, 0.42)
  },
  click() {
    tone(440, 0.05, 'triangle', 0.1)
  },
  pop() {
    tone(700, 0.08, 'sine', 0.14)
  },
}
