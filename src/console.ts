import { t } from '@bemedev/types';
import type { VitestUtils } from 'vitest';
import { writeCount } from './utils';

export const createConsole = (vi: VitestUtils) => {
  const strings: (string | string[])[] = [];
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});

  const useConsole = (
    index: number,
    ..._strings: (string | string[])[]
  ) => {
    const inviteStrict = `#02 => Check strict string`;

    const strict = () => {
      const calls = strings.map(data => [data].flat());
      expect(log.mock.calls).toStrictEqual(calls);
    };

    const inviteLength = `#01 => Length of calls is : ${_strings.length}`;

    const length = () => {
      strings.push(..._strings);
      expect(log.mock.calls.length).toBe(strings.length);
    };

    const count = writeCount(index);
    const invite = `#${count} => Check the console`;
    const func = () => {
      test(inviteLength, length);
      test(inviteStrict, strict);
    };

    return t.tuple(invite, func);
  };

  afterAll(() => {
    log.mockRestore();
  });

  return useConsole;
};
