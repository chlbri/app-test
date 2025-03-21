import { createTests } from '@bemedev/vitest-extended';
import { areDefineds } from './defined';
import { machine2 } from './fixtures/data';

describe('AreDefineds', () => {
  const { acceptation, success } = createTests(areDefineds);

  describe('#00 => Acceptation', acceptation);

  describe(
    '#01 => Success',
    success(
      {
        invite: 'defineds',
        parameters: [
          machine2,
          'inc',
          'sendPanelToUser',
          'isInputEmpty',
          'fetch',
          'DELAY',
          'machine1',
        ],
        expected: true,
      },
      {
        invite: 'notDefineds',
        parameters: [
          machine2,
          'inc',
          'sendPanelToUser',
          'notDefined',
          'DELAY2',
        ],
        expected: false,
      },
    ),
  );
});
