<h1 align="center">
  The Arcane Spell File Format
</h1>

<p align="center">
  <img src="./packages/spell-assets/assets/icon.svg" height="150" width="150" alt="Timecode Toolbox Icon"/>
</p>

Arcane Spell Files are an open-source file-format that details precise timing
information of musical tracks,
for usage in lighting & visual applications for live events,
video rendering, pyrotechnics, etc...

They are the primary file format of the
[Arcane Desktop](https://arcanewizards.com/arcane) application,
and allow for quick exchange and sharing of timing information,
without the need to share full showfiles.

## Why?

Spell files are a core part of Arcane's alternative approach to timecode programming.

Instead of preparing a timeline of **what you want to happen**
for a specific track,
(e.g. what cues / macros / triggers to fire,
when to modulate the values of faders etc...),
you prepare a timeline of
**which audio elements in a track _might_ be cool to sync with visuals**.
This completely separates timeline preparation from Front-of-House showfiles,
which means a few different things:

- You can prepare spell files independently of the show itself,
  as you don't need to know what fixtures and other visual elements are
  available to use.

- Other people in production can prepare spell files
  (including DJs and audio producers),
  as all you need is the audio track itself.

- Spell files for the same tracks can be reused across different shows.

- During the live show, you can combine busking with the timing information from
  the Spell files, (e.g. using the
  [Arcane Desktop Spell Casting interface](https://arcanewizards.com/docs/arcane/getting-started/casting))
  to choose what outputs to link to what elements of the spell.
  You get the precision of timecoding,
  with the flexibility and creative freedom of busking.

## Spell Data

### Matchers

### Layers

## Comparison with other formats / techniques

### Reaper CSV

### Audio Analysis / FFT

### Live MIDI Output from DAWs / Ableton / etc...

## Usage

## Supported Applications

- [Arcane Desktop](https://arcanewizards.com/arcane)

## License

MIT License

Copyright (c) 2026 Arcane Wizards Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

<p align="center">
  <a href="https://madebyhuman.iamjarl.com/">
    <img src="https://arcanewizards.com/static/made-white.svg" alt="Made by Human" height="70">
  </a>
</p>
