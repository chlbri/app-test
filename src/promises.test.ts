import { typings } from '@bemedev/app-ts/lib/utils';
import { fakeDB, machine2 } from './fixtures/data';
import { cprot } from './promises';

describe('Promises', () => {
  describe('#01 => Predicate "fetch"', () => {
    const { acceptation, success } = cprot(machine2, 'fetch');

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        {
          invite: 'input : ""',
          parameters: [
            { iterator: 0 },
            { data: [], input: '', iterator: 0 },
            typings.object,
          ],
          expected: fakeDB.map(({ name }) => name),
        },
        {
          invite: 'input : "a"',
          parameters: [
            { iterator: 0 },
            { data: [], input: 'full', iterator: 10 },
            typings.object,
          ],
          expected: fakeDB
            .filter(({ name }) => name === 'a')
            .map(({ name }) => name),
        },
        {
          invite: 'input : "Pa"',
          parameters: [
            { iterator: 0 },
            { data: [], input: 'full', iterator: 10 },
            typings.object,
          ],
          expected: fakeDB
            .filter(({ name }) => name === 'Pa')
            .map(({ name }) => name),
        },
      ),
    );
  });
});
