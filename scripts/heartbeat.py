"""Cut the finale heartbeat from a heartbeat recording and place it on the pulse animation.

Usage:
  afconvert -f WAVE -d LEI16@44100 -c 1 media-src/soundreality-heart-beat-137135.mp3 /tmp/src.wav
  python3 scripts/heartbeat.py /tmp/src.wav /tmp/heartbeat.wav
  afconvert -f m4af -d aac -b 160000 /tmp/heartbeat.wav public/media/heartbeat.m4a

Timing matches `pulseTimeline` in src/features/quiz/berlin.ts: four beats at 1.8 / 3.6 / 5.1 / 6.3 s,
getting louder; the full glitch starts at 7.2 s. The lub of each beat lands on its flash. Beat 3
stutters, beat 4 stutters harder and is bit-crushed (the signal "breaks"), then echoes into the
glitch, where a slowed, deeper copy hits as the impact.
"""
import math, struct, sys, wave

src_path, out_path = sys.argv[1], sys.argv[2]
SOURCE_LUB = 9.73          # peak of a clean lub-dub pair in the recording (seconds)
PRE, POST = 0.09, 0.62     # cut window around that peak
BEATS = [(1.8, 0.55, 0), (3.6, 0.7, 0), (5.1, 0.85, 1), (6.3, 1.0, 2)]  # (time, gain, glitch level)
GLITCH = 7.2
LENGTH = 9.2

with wave.open(src_path) as w:
    sr = w.getframerate()
    raw = struct.unpack('<%dh' % w.getnframes(), w.readframes(w.getnframes()))
src = [v / 32768 for v in raw]

# Cut one lub-dub with short raised-cosine fades so no clicks or room noise leak in.
a, b = int((SOURCE_LUB - PRE) * sr), int((SOURCE_LUB + POST) * sr)
beat = src[a:b]
fade_in, fade_out = int(0.012 * sr), int(0.18 * sr)
for i in range(len(beat)):
    g = 1.0
    if i < fade_in: g = 0.5 - 0.5 * math.cos(math.pi * i / fade_in)
    if i > len(beat) - fade_out: g *= 0.5 - 0.5 * math.cos(math.pi * (len(beat) - i) / fade_out)
    beat[i] *= g
peak_offset = int(PRE * sr)

out = [0.0] * int(LENGTH * sr)


def place(samples, at_peak, gain):
    start = int(at_peak * sr) - peak_offset
    for i, v in enumerate(samples):
        if 0 <= start + i < len(out): out[start + i] += v * gain


def lowpass(samples, cutoff):
    k = 1 - math.exp(-2 * math.pi * cutoff / sr)
    y = 0.0; res = []
    for v in samples:
        y += k * (v - y); res.append(y)
    return res


def slowed(samples, rate):
    """Play back slower (rate < 1): longer and deeper, like a tape slowing down."""
    n = int(len(samples) / rate); res = []
    for i in range(n):
        x = i * rate; j = int(x); f = x - j
        res.append(samples[j] * (1 - f) + (samples[j + 1] if j + 1 < len(samples) else 0) * f)
    return res


def crushed(samples, hold=7):
    """Sample-and-hold "bit crusher": the heartbeat sounds like a failing digital signal."""
    res = []; held = 0.0
    for i, v in enumerate(samples):
        if i % hold == 0: held = round(v * 10) / 10
        res.append(held)
    return res


# The attack of a beat, re-triggered just before it: a stutter like a skipping signal.
fragment = beat[:peak_offset + int(0.06 * sr)]
for t, gain, level in BEATS:
    place(beat, t, gain)
    if level >= 1:
        place(fragment, t - 0.085, gain * 0.38)
    if level >= 2:
        place(fragment, t - 0.17, gain * 0.28)
        place(crushed(beat), t, gain * 0.42)
        place(crushed(fragment, 11), t + 0.05, gain * 0.3)

# Echo on the last beat: each repeat darker and quieter, trailing into the glitch.
last_t = BEATS[-1][0]
echo = beat
for n, (delay, gain) in enumerate([(0.19, 0.5), (0.38, 0.32), (0.57, 0.2)]):
    echo = lowpass(echo, 1400 - n * 350)
    place(echo, last_t + delay, gain)

# Impact on the switch: the same beat slowed to 70 %, plus its own darker echoes.
impact = lowpass(slowed(beat, 0.7), 900)
peak_offset = int(PRE / 0.7 * sr)
place(impact, GLITCH, 1.25)
for delay, gain in [(0.26, 0.42), (0.52, 0.24), (0.78, 0.13)]:
    impact = lowpass(impact, 700)
    place(impact, GLITCH + delay, gain)

# Gentle saturation for weight on phone speakers, normalise to -1 dBFS, fade the tail.
out = [math.tanh(1.3 * v) for v in out]
peak = max(abs(v) for v in out) or 1
gain = 10 ** (-1 / 20) / peak
tail = int(0.4 * sr)
for i in range(len(out)):
    out[i] *= gain * min(1, (len(out) - 1 - i) / tail)

with wave.open(out_path, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, v)) * 32767)) for v in out))
print('beats at', [t for t, _, _ in BEATS], 'impact at', GLITCH)
