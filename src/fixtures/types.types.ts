import type { KeyU } from '@bemedev/app-ts/lib/types';
import type { Fn } from '@bemedev/types';

export type ActionParamsFrom<T extends KeyU<'__actionFn'>> = Parameters<
  Extract<T['__actionFn'], Fn>
>;

export type ContextsFrom<T extends KeyU<'context' | 'pContext'>> = {
  context: T['context'];
  pContext: T['pContext'];
};
