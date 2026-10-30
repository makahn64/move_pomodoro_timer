// Both boundary sounds are synthesized, so there are no audio files to license or ship.
// Work end: a referee's whistle, three blasts. Exercise end: a rising three-bell chime.

let ctx: AudioContext | null = null

function output(): { ac: AudioContext; out: AudioNode } {
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -12
  comp.ratio.value = 4
  const master = ctx.createGain()
  master.gain.value = 0.9
  comp.connect(master).connect(ctx.destination)
  return { ac: ctx, out: comp }
}

function blast(ac: AudioContext, out: AudioNode, start: number, length: number): void {
  // Two close pitches beat against each other and a fast tremolo gives the pea's rattle.
  const gain = ac.createGain()
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(0.5, start + 0.02)
  gain.gain.setValueAtTime(0.5, start + length - 0.05)
  gain.gain.linearRampToValueAtTime(0, start + length)

  const trill = ac.createGain()
  trill.gain.value = 0.6
  const lfo = ac.createOscillator()
  lfo.frequency.value = 32
  const lfoDepth = ac.createGain()
  lfoDepth.gain.value = 0.4
  lfo.connect(lfoDepth).connect(trill.gain)

  for (const freq of [2850, 3020]) {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq * 0.97, start)
    osc.frequency.exponentialRampToValueAtTime(freq, start + 0.06)
    osc.connect(trill)
    osc.start(start)
    osc.stop(start + length)
  }
  trill.connect(gain).connect(out)
  lfo.start(start)
  lfo.stop(start + length)
}

export function playWorkEnd(): void {
  const { ac, out } = output()
  const t = ac.currentTime + 0.05
  blast(ac, out, t, 0.22)
  blast(ac, out, t + 0.32, 0.22)
  blast(ac, out, t + 0.64, 0.75)
}

function bell(ac: AudioContext, out: AudioNode, start: number, freq: number): void {
  const gain = ac.createGain()
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(0.55, start + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.001, start + 1.6)
  gain.connect(out)
  // Inharmonic partials make it ring like struck metal rather than beep.
  for (const [ratio, level] of [
    [1, 1],
    [2.76, 0.35],
    [5.4, 0.15]
  ]) {
    const partial = ac.createGain()
    partial.gain.value = level
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq * ratio
    osc.connect(partial).connect(gain)
    osc.start(start)
    osc.stop(start + 1.7)
  }
}

export function playExerciseEnd(): void {
  const { ac, out } = output()
  const t = ac.currentTime + 0.05
  bell(ac, out, t, 784)
  bell(ac, out, t + 0.28, 988)
  bell(ac, out, t + 0.56, 1175)
}
