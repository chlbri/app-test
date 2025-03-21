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
        parameters: [machine2, 'inc', 'sendPanelToUser'],
        expected: true,
      },
      {
        invite: 'notDefineds',
        parameters: [machine2, 'inc', 'sendPanelToUser', 'notDefined'],
        expected: false,
      },
    ),
  );
});
