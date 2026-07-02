# getUserMedia `echoCancellation: "all"` repro / test page

A tiny self-contained page that calls `getUserMedia` with different
`echoCancellation` constraints, measures the **actually captured** audio level
(peak RMS via a Web Audio `AnalyserNode`), and prints a table — so you can tell
whether the mic really captured audio or recorded silence.

**Live page:** https://billxc.github.io/getusermedia-echocancellation-all-repro/

## Why

On macOS, `getUserMedia({audio: {echoCancellation: "all"}})` uses *system-wide*
echo cancellation, which captures **system audio** (Core Audio taps, macOS 14.2+)
as the AEC reference. That capture needs the **"System Audio Recording"**
permission (declared via `NSAudioCaptureUsageDescription` in the host app's
Info.plist). If the host app hasn't declared / been granted it, the capture
fails **silently** — `getSettings()` still reports `"all"` was applied, but the
track delivers all-zero (silent) audio, with no error surfaced to JS.

Related Chromium issue: https://issues.chromium.org/issues/479234114

## How to use

1. Open the live page (or serve `index.html` over `http://localhost` / any
   secure context) inside the browser / WebView2 you want to test.
2. Click **Run All Tests** and speak into the mic for a few seconds.
3. Compare rows. The tell:
   - `echoCancellation: true` → non-zero RMS (mic works)
   - `echoCancellation: "all"` → **RMS 0.00000 / silent** on affected setups,
     non-zero once the system-audio permission is available.

## What it tests

| # | constraint |
|---|------------|
| 1 | `{audio: true}` (default) |
| 2 | `echoCancellation: false` |
| 3 | `echoCancellation: true` |
| 4 | `echoCancellation: "all"` (ideal) |
| 5 | `echoCancellation: {exact: "all"}` |
