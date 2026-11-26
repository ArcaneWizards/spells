import { describe, expect, it } from '@jest/globals';
import { ArcaneSpell, parseSpell } from './index.js';
import { ZodError } from 'zod';

describe('parseSpell', () => {
  describe('invalid spells', () => {
    it('not an object', () => {
      expect(parseSpell(null)).toEqual({
        version: 'unknown',
        error: {
          message:
            'Unrecognized spell format, please make sure your software is up to date.',
        },
      });
    });
    it('invalid version type', () => {
      expect(parseSpell({ version: 'foo' })).toEqual({
        version: 'unknown',
        error: {
          message:
            'Unrecognized spell format, please make sure your software is up to date.',
        },
      });
    });
    it('invalid v1 spell', () => {
      expect(parseSpell({ version: 1 })).toEqual({
        version: 'unknown',
        error: {
          message: 'Failed to parse spell, invalid data provided',
          details: expect.any(ZodError),
        },
      });
    });
    it('version is too new (newer than supported version)', () => {
      expect(parseSpell({ version: 54321 })).toEqual({
        version: 'unknown',
        error: {
          message:
            'Unknown spell version: 54321, please make sure your software is up to date.',
        },
      });
    });
  });

  describe('valid spells', () => {
    const matchers: ArcaneSpell['matchers'] = [
      {
        lengthMillis: 10_000,
        offsetMillis: 0,
        title: ['Some Track'],
        artist: ['Some Artist'],
        album: ['Some Album'],
      },
    ];

    const beatGrids: ArcaneSpell['data']['beatGrids'] = [
      {
        firstDownBeat: 0,
        lastDownBeat: 10_000,
        barCount: 4,
        beatsPerBar: 4,
      },
    ];

    it('empty spell', () => {
      const validSpell: ArcaneSpell = {
        version: 2,
        matchers: [],
        data: {
          layers: [],
        },
      };
      expect(parseSpell(validSpell)).toEqual(validSpell);
    });
    it('v1', () => {
      const validSpell = {
        version: 1,
        matchers,
        data: {
          beatGrids,
          layers: [
            {
              name: 'Layer 1',
              kind: 'bass',
              events: [
                {
                  t: 0,
                  s: [
                    [0, 1],
                    [1, 0],
                  ],
                },
                // Invalid - Should be filtered out
                {
                  t: 1000,
                  s: [[1, 0]],
                },
                // Invalid - Should be filtered out
                {
                  t: 2000,
                  s: [
                    [0, 0],
                    [0, 1],
                  ],
                },
              ],
            },
          ],
        },
      };
      expect(parseSpell(validSpell)).toEqual({
        version: 2,
        matchers,
        data: {
          beatGrids,
          layers: [
            {
              name: 'Layer 1',
              kind: 'bass',
              events: [
                {
                  t: 0,
                  s: [
                    [0, 1],
                    [1, 0],
                  ],
                },
              ],
              uuid: expect.any(String),
            },
          ],
        },
      });
    });
    it('v2', () => {
      const validSpell: ArcaneSpell = {
        version: 2,
        matchers,
        data: {
          beatGrids,
          layers: [
            {
              name: 'Layer 1',
              kind: 'bass',
              events: [
                {
                  t: 0,
                  s: [
                    [0, 1],
                    [1, 0],
                  ],
                },
              ],
              uuid: '3DBB878A-7BFA-4D9D-B9AB-601E82E5A217',
              recommendedSegments: 4,
            },
          ],
        },
      };
      expect(parseSpell(validSpell)).toEqual(validSpell);
    });
  });
});
