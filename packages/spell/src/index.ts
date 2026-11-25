import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const SPELL_MIME_TYPE = 'application/vnd.arcanewizards.spell+json';
export const SPELL_FILE_EXTENSION = 'arcane';

/**
 * The base schema common across all spells,
 * in particular the version field.
 */
export const ARCANE_SPELL_BASE_SCHEMA = z.object({
  version: z.number(),
});

export const ARCANE_SPELL_ENVELOPE_LAYER_KINDS = Object.freeze({
  percussion: null,
  melody: null,
  bass: null,
  vocals: null,
  other: null,
});

export type ArcaneSpellEnvelopeLayerKind =
  keyof typeof ARCANE_SPELL_ENVELOPE_LAYER_KINDS;

export const ARCANE_SPELL_ENVELOPE_LAYER_KIND = z
  .string()
  .refine<ArcaneSpellEnvelopeLayerKind>(
    (value): value is ArcaneSpellEnvelopeLayerKind =>
      value in ARCANE_SPELL_ENVELOPE_LAYER_KINDS,
  );

const ARCANE_SPELL_ENVELOPE = z.object({
  /**
   * Timestamp in milliseconds from the start of the track.
   */
  t: z.number(),
  /**
   * states for this event, an array of [timestamp, amplitude] pairs.
   *
   * - `timestamp` is the time in milliseconds from the start of the event.
   * - `amplitude` is the value of the state at that time (between 0-1).
   *
   * When calculating the values between timestamps,
   * linear interpolation should be used.
   */
  s: z.array(z.tuple([z.number(), z.number()])),
});

export type ArcaneSpellEnvelope = z.infer<typeof ARCANE_SPELL_ENVELOPE>;

export const ARCANE_SPELL_COLORS = z.enum([
  'purple',
  'blue',
  'teal',
  'red',
  'green',
  'yellow',
  'orange',
  'brown',
  'gray',
]);

export const ARCANE_SPELL_COLOR_OPTIONS = ARCANE_SPELL_COLORS.options;

export type ArcaneSpellColor = z.infer<typeof ARCANE_SPELL_COLORS>;

const ARCANE_SPELL_CUE = z.object({
  /**
   * Timestamp in milliseconds from the start of the track.
   */
  t: z.number(),
  /**
   * An optional label for this cue point.
   */
  label: z.string().optional(),
  color: ARCANE_SPELL_COLORS.optional(),
});

export type ArcaneSpellCue = z.infer<typeof ARCANE_SPELL_CUE>;

const ARCANE_SPELL_LAYER_V1 = z.object({
  kind: ARCANE_SPELL_ENVELOPE_LAYER_KIND,
  /**
   * An optional name for this layer.
   */
  name: z.string().optional(),
  events: z
    .array(ARCANE_SPELL_ENVELOPE)
    .transform((events) =>
      events.filter(
        (event) =>
          event.s.length > 0 &&
          Math.min(...event.s.map((s) => s[0])) === 0 &&
          Math.max(...event.s.map((s) => s[0])) > 0,
      ),
    ),
});

const ARCANE_SPELL_ENVELOPE_LAYER = ARCANE_SPELL_LAYER_V1.extend({
  uuid: z.string().uuid(),
  /**
   * If set, this is the recommended number of segments to divide this layer
   * into.
   */
  recommendedSegments: z.number().optional(),
});

export type ArcaneSpellEnvelopeLayer = z.infer<
  typeof ARCANE_SPELL_ENVELOPE_LAYER
>;

const ARCANE_SPELL_CUE_LAYER = z.object({
  uuid: z.string().uuid(),
  kind: z.literal('cue'),
  /**
   * An optional name for this layer.
   */
  name: z.string().optional(),
  events: z.array(ARCANE_SPELL_CUE),
});

export type ArcaneSpellCueLayer = z.infer<typeof ARCANE_SPELL_CUE_LAYER>;

const ARCANE_SPELL_LAYER = z.union([
  ARCANE_SPELL_ENVELOPE_LAYER,
  ARCANE_SPELL_CUE_LAYER,
]);

/**
 * All spell layer kinds,
 * ordered by default priority when displaying in output mapper.
 */
export const ARCANE_SPELL_LAYER_KINDS = [
  ARCANE_SPELL_CUE_LAYER.shape.kind._def.value,
  ...(Object.keys(
    ARCANE_SPELL_ENVELOPE_LAYER_KINDS,
  ) as ArcaneSpellEnvelopeLayerKind[]),
] as const;

export type ArcaneSpellLayer = z.infer<typeof ARCANE_SPELL_LAYER>;

export type ArcaneSpellLayerKind = ArcaneSpellLayer['kind'];

const ARCANE_SPELL_BEAT_GRID = z.object({
  firstDownBeat: z.number(),
  lastDownBeat: z.number(),
  barCount: z.number(),
  beatsPerBar: z.number(),
});

export type ArcaneSpellBeatGrid = z.infer<typeof ARCANE_SPELL_BEAT_GRID>;

const ARCANE_SPELL_V1_SCHEMA = ARCANE_SPELL_BASE_SCHEMA.extend({
  version: z.literal(1),
  /**
   * Matchers are a set of rules that can be used to determine if a spell
   * matches a given song.
   */
  matchers: z.array(
    z.object({
      title: z.array(z.string()).optional(),
      artist: z.array(z.string()).optional(),
      album: z.array(z.string()).optional(),
      /**
       * The length of the song in milliseconds.
       */
      lengthMillis: z.number(),
      /**
       * How far should this spell be offset from the start of the track actually
       * playing.
       *
       * This is useful for songs that may be included in multiple releases or
       * albums, where the padding at the start of the track may be different,
       * or for when there is just a clip of the full track you want to sync with.
       *
       * This is used for example in some of the demo tracks that come built-in
       * with Arcane Desktop.
       */
      offsetMillis: z.number(),
    }),
  ),
  /**
   * The actual spell data
   */
  data: z.object({
    beatGrids: z.array(ARCANE_SPELL_BEAT_GRID).optional(),
    layers: z.array(ARCANE_SPELL_LAYER_V1),
  }),
});

type ArcaneSpellV1 = z.infer<typeof ARCANE_SPELL_V1_SCHEMA>;

const ARCANE_SPELL_V2_SCHEMA = ARCANE_SPELL_BASE_SCHEMA.extend({
  version: z.literal(2),
  /**
   * Matchers are a set of rules that can be used to determine if a spell
   * matches a given song.
   */
  matchers: z.array(
    z.object({
      title: z.array(z.string()).optional(),
      artist: z.array(z.string()).optional(),
      album: z.array(z.string()).optional(),
      /**
       * The length of the song in milliseconds.
       */
      lengthMillis: z.number(),
      /**
       * How far should this spell be offset from the start of the track actually
       * playing.
       *
       * This is useful for songs that may be included in multiple releases or
       * albums, where the padding at the start of the track may be different.
       */
      offsetMillis: z.number(),
    }),
  ),
  /**
   * The actual spell data
   */
  data: z.object({
    beatGrids: z.array(ARCANE_SPELL_BEAT_GRID).optional(),
    layers: z.array(ARCANE_SPELL_LAYER),
  }),
});

type ArcaneSpellV2 = z.infer<typeof ARCANE_SPELL_V2_SCHEMA>;

/**
 * The complete type of an Arcane Spell file,
 * after being successfully parsed.
 *
 * If you are generating your own spells,
 * use this type for type-safety.
 */
export type ArcaneSpell = ArcaneSpellV2;

export const transformV1ToLatest = (v1: ArcaneSpellV1): ArcaneSpell => {
  return {
    version: 2,
    matchers: v1.matchers,
    data: {
      beatGrids: v1.data.beatGrids,
      layers: v1.data.layers.map((layer) => ({
        uuid: uuidv4(),
        ...layer,
      })),
    },
  };
};

const ARCANE_SPELL_V1_SCHEMA_TRANSFORMED =
  ARCANE_SPELL_V1_SCHEMA.transform(transformV1ToLatest);

export const getSpellVersion = (spell: unknown) => {
  try {
    return ARCANE_SPELL_BASE_SCHEMA.parse(spell).version;
  } catch {
    return null;
  }
};

/**
 * Schema for use in other zod schemas that need to be able to parse any spell
 * version, returning the latest spell.
 */
export const PARSED_SPELL = z.union([
  ARCANE_SPELL_V1_SCHEMA_TRANSFORMED,
  ARCANE_SPELL_V2_SCHEMA,
  z.object({
    version: z.literal('unknown'),
    error: z
      .object({
        message: z.string(),
        details: z.any().optional(),
      })
      .optional(),
  }),
]);

/**
 * Type that represents a parsed spell file,
 * either a successfully parsed spell of the latest version,
 * or an object detailing why the spell could not be parsed.
 */
export type ParsedSpell = z.infer<typeof PARSED_SPELL>;

/**
 * Automatically parse & return spells in the latest format, and:
 *
 * - Automatically upgrade spells from older versions to the latest version
 * - Provide detailed error information for spells that cannot be parsed
 * - Gracefully handle future (unsupported) spell versions,
 *   and provide a clear error message.
 */
export const parseSpell = (spell: unknown): ParsedSpell => {
  const version = getSpellVersion(spell);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parser: z.ZodType<ParsedSpell, any, any>;
  switch (version) {
    case 1:
      parser = ARCANE_SPELL_V1_SCHEMA.transform(transformV1ToLatest);
      break;
    case 2:
      parser = ARCANE_SPELL_V2_SCHEMA;
      break;
    default:
      return {
        version: 'unknown',
        error: {
          message: `Unknown spell version: ${version}, please make sure arcane is up to date.`,
        },
      };
  }

  const parsed = parser.safeParse(spell);
  if (parsed.success) {
    return parsed.data;
  }
  return {
    version: 'unknown',
    error: {
      message: 'Failed to parse spell, invalid data provided',
      details: parsed.error,
    },
  };
};
