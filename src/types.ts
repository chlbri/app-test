import type {
  AlwaysEvent,
  InitEvent,
  MaxExceededEvent,
} from '@bemedev/app-ts/lib/events';

export type EventStrings = InitEvent | AlwaysEvent | MaxExceededEvent;
