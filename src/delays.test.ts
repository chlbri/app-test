import { typings } from '@bemedev/app-ts/lib/utils';
import { cdt } from './delays';
import { DELAY, machine2 } from './fixtures/data';

describe('testAction', () => {
  describe('#01 => Delay "DELAY"', () => {
    const { acceptation, success } = cdt(machine2, 'DELAY');

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        {
          invite: 'from 0',
          parameters: [
            { iterator: 0 },
            { data: [], input: '', iterator: 0 },
            typings.object,
          ],
          expected: DELAY,
        },
        {
          invite: 'from 10',
          parameters: [
            { iterator: 0 },
            { data: [], input: 'full', iterator: 10 },
            typings.object,
          ],
          expected: DELAY,
        },
      ),
    );
  });

  describe('#02 => Predicate "isInputNotEmpty"', () => {
    const { acceptation, success } = cdt(machine2, 'DELAY2');

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        {
          invite: 'from 0',
          parameters: [
            { iterator: 0 },
            { data: [], input: '', iterator: 0 },
            typings.object,
          ],
          expected: DELAY * 2,
        },
        {
          invite: 'from 10',
          parameters: [
            { iterator: 0 },
            { data: [], input: 'full', iterator: 10 },
            typings.object,
          ],
          expected: DELAY * 2,
        },
      ),
    );
  });
});
