import type { Fn } from '@bemedev/types';

export const compare = (actual: Fn<[]>, expected: any) => () => {
  expect(actual()).toStrictEqual(expected);
};
