import { typings } from '@bemedev/app-ts/lib/utils';
import { cat } from './actions';
import { machine2 } from './fixtures/data';

describe('testAction', () => {
  describe('#01 => Action "inc2"', () => {
    const { acceptation, success } = cat(machine2, 'inc');

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        {
          invite: 'inc from 0',
          parameters: [
            { iterator: 0 },
            { data: [], input: '', iterator: 0 },
            typings.object,
          ],
          expected: {
            context: {
              data: [],
              input: '',
              iterator: 1,
            },
            pContext: {
              iterator: 0,
            },
          },
        },
        {
          invite: 'inc from 10',
          parameters: [
            { iterator: 0 },
            { data: [], input: '', iterator: 10 },
            typings.object,
          ],
          expected: {
            context: {
              data: [],
              input: '',
              iterator: 11,
            },
            pContext: {
              iterator: 0,
            },
          },
        },
      ),
    );
  });

  describe('#02 => Void action', () => {
    const { acceptation, success } = cat(machine2, 'sendPanelToUser');

    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    describe('#00 => Acceptation', acceptation);

    describe(
      '#01 => Success',
      success(
        {
          invite: 'inc from 0',
          parameters: [
            { iterator: 0 },
            { data: [], input: '', iterator: 0 },
            typings.object,
          ],
          expected: {
            context: {
              data: [],
              input: '',
              iterator: 0,
            },
            pContext: {
              iterator: 0,
            },
          },
        },
        {
          invite: 'inc from 10',
          parameters: [
            { iterator: 0 },
            { data: [], input: '', iterator: 10 },
            typings.object,
          ],
          expected: {
            context: {
              data: [],
              input: '',
              iterator: 10,
            },
            pContext: {
              iterator: 0,
            },
          },
        },
      ),
    );

    describe('#02 => Check log', () => {
      test('01 => Call twice', () => {
        expect(log).toBeCalledTimes(2);
      });

      test('#02 => Call with correct value', () => {
        expect(log).toHaveBeenNthCalledWith(2, 'sendPanelToUser');
        expect(log).not.toHaveBeenNthCalledWith(3, 'sendPanelToUser');
      });
    });

    afterAll(() => {
      log.mockClear();
    });
  });
});
