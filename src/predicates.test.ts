import { typings } from '@bemedev/app-ts/lib/utils';
import { machine2 } from './fixtures/data';
import { cpret } from './predicates';

describe('testAction', () => {
  describe('#01 => Predicate "isInputEmpty"', () => {
    const { acceptation, success } = cpret(machine2, 'isInputEmpty');

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
          expected: true,
        },
        {
          invite: 'input : "full"',
          parameters: [
            { iterator: 0 },
            { data: [], input: 'full', iterator: 10 },
            typings.object,
          ],
          expected: false,
        },
      ),
    );
  });

  describe('#02 => Predicate "isInputNotEmpty"', () => {
    const { acceptation, success } = cpret(machine2, 'isInputNotEmpty');

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
          expected: false,
        },
        {
          invite: 'input : "full"',
          parameters: [
            { iterator: 0 },
            { data: [], input: 'full', iterator: 10 },
            typings.object,
          ],
          expected: true,
        },
      ),
    );
  });
});
