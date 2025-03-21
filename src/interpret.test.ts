import { t } from '@bemedev/types';
import { createFakeWaiter } from '@bemedev/vitest-extended';
import { createConsole } from './console';
import { DELAY, fakeDB } from './fixtures/data';
import { machine2 } from './fixtures/data/machine2';
import { interpret } from './interpret';
import { writeCount } from './utils';

const TEXT = 'Activities Integration Test';

describe('interpret', () => {
  const {
    start,
    send,
    pSelect,
    select,
    pause,
    value,
    resume,
    createSubscribe,
    dispose,
    service,
    stop,
  } = interpret(machine2, {
    pContext: {
      iterator: 0,
    },
    context: { iterator: 0, input: '', data: [] },
    exact: true,
  });

  // #region Config
  beforeAll(() => vi.useFakeTimers());
  beforeAll(() => console.time(TEXT));

  const dumbFn = vi.fn();
  const [subscribe, unsubscribe] = createSubscribe(dumbFn);

  const INPUT = 'a';
  const FAKES = fakeDB
    .filter(({ name }) => name.includes(INPUT))
    .map(({ name }) => name);

  const waiter = createFakeWaiter.withDefaultDelay(vi, DELAY);
  const useConsole = createConsole(vi);

  const write = (value: string, index: number) => {
    const count = writeCount(index);
    const invite = `#${count} => Write "${value}"`;

    const fn = () => service.send({ type: 'WRITE', payload: { value } });
    return t.tuple(invite, fn);
  };
  // #endregion

  test(...start());
  test(...subscribe);
  test(...pSelect('iterator', 0, 1));
  test(...waiter(2, 6));

  describe('#03 => Check the service', () => {
    test(...pSelect('iterator', 6, 1));
    test(...select('iterator', 6, 2));
    describe(...useConsole(3));
  });

  test(...send('NEXT', 6));

  describe('#04 => Check the service', () => {
    test(...pSelect('iterator', 6, 1));
    test(...select('iterator', 6, 2));
    describe(...useConsole(3));
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'idle',
          },
        },
        4,
      ),
    );
  });

  test(...waiter(5, 6));

  describe('#06 => Check the service', () => {
    test(...select('iterator', 18, 1));
    test(...pSelect('iterator', 12, 2));
    describe(...useConsole(3, ...Array(6).fill('sendPanelToUser')));
  });

  test(...pause(7));

  describe('#08 => Check the service', () => {
    test(...select('iterator', 18, 1));
    test(...pSelect('iterator', 12, 2));
    describe(...useConsole(3));
  });

  test(...waiter(5, 9));

  describe('#10 => Check the service', () => {
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'idle',
          },
        },
        1,
      ),
    );

    test(...select('iterator', 18, 2));
    test(...pSelect('iterator', 12, 3));

    describe(...useConsole(4));
  });

  test(...resume(11));
  test(...waiter(5, 12));

  describe('#13 => Check the service', () => {
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'idle',
          },
        },
        1,
      ),
    );

    test(...select('iterator', 42, 2));
    test(...pSelect('iterator', 24, 3));

    describe(...useConsole(4, ...Array(12).fill('sendPanelToUser')));
  });

  test(...write('', 14));

  describe('#15 => Check the service', () => {
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'input',
          },
        },
        1,
      ),
    );

    test(...select('iterator', 42, 2));
    test(...pSelect('iterator', 24, 3));

    describe(...useConsole(4));
    test(...select('input', '', 5));
  });

  test(...waiter(16, 12));

  describe('#17 => Check the service', () => {
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'input',
          },
        },
        1,
      ),
    );

    test(...select('iterator', 66, 2));
    test(...pSelect('iterator', 36, 3));

    describe(
      ...useConsole(
        4,
        ...Array(24)
          .fill(0)
          .map((_, index) => {
            const isEven = index % 2 === 0;
            return isEven ? 'sendPanelToUser' : 'Input, please !!';
          }),
      ),
    );

    test(...select('input', '', 5));
  });

  test(...write(INPUT, 18));

  describe('#19 => Check the service', () => {
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'idle',
          },
        },
        1,
      ),
    );

    test(...select('iterator', 66, 2));
    test(...pSelect('iterator', 36, 3));
    describe(...useConsole(4));
    test(...select('input', '', 5));
  });

  test(...waiter(20, 12));

  describe('#21 => Check the service', () => {
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'idle',
          },
        },
        1,
      ),
    );

    test(...select('iterator', 90, 2));
    test(...pSelect('iterator', 48, 3));
    describe(...useConsole(4, ...Array(12).fill('sendPanelToUser')));
    test(...select('input', '', 5));
  });

  test(...write(INPUT, 22));

  describe('#23 => Check the service', () => {
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'input',
          },
        },
        1,
      ),
    );

    test(...select('iterator', 90, 2));
    test(...pSelect('iterator', 48, 3));
    describe(...useConsole(4));
    test(...select('input', INPUT, 5));
  });

  test(...waiter(24, 6));

  describe('#25 => Check the service', () => {
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'input',
          },
        },
        1,
      ),
    );

    test(...select('iterator', 102, 2));
    test(...pSelect('iterator', 54, 3));
    describe(...useConsole(4, ...Array(6).fill('sendPanelToUser')));
    test(...select('input', INPUT, 5));
  });

  test(...send('FETCH', 26));

  describe('#27 => Check the service', () => {
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'input',
          },
        },
        1,
      ),
    );

    test(...select('iterator', 102, 2));
    test(...pSelect('iterator', 54, 3));
    describe(...useConsole(4));
    test(...select('input', INPUT, 5));
    test(...select('data', FAKES, 6));
  });

  test('#28 => Length of calls of "dumbFn" is "86"', () => {
    expect(dumbFn).toBeCalledTimes(86);
  });

  test(...unsubscribe);
  test(...waiter(30, 6));

  test('#31 => Length of calls of "dumbFn" is "86"', () => {
    expect(dumbFn).toBeCalledTimes(86);
  });

  describe('#32 => Check the service', () => {
    test(
      ...value(
        {
          working: {
            fetch: 'idle',
            ui: 'input',
          },
        },
        1,
      ),
    );

    test(...select('iterator', 114, 2));
    test(...pSelect('iterator', 60, 3));
    describe(...useConsole(4, ...Array(6).fill('sendPanelToUser')));
    test(...select('input', INPUT, 5));
    test(...select('data', FAKES, 6));
  });

  describe('#33 => Close the service', async () => {
    

    test(...stop(2));

    test('#03 => Log the time of all tests', () => {
      console.timeEnd(TEXT);
    });

    test(...dispose(4));
  });
});
