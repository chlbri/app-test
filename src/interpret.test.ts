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
    eventRaised,
    lastRaised,
    eventsSequenced,
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
  describe(...eventsSequenced(1, 'machine$$init'));
  test(...subscribe(2));
  test(...pSelect('iterator', 0, 3));
  test(...waiter(4, 6));

  describe('#05 => Check the service', () => {
    test(...pSelect('iterator', 6, 1));
    test(...select('iterator', 6, 2));
    describe(...useConsole(3));
  });

  test(...send('NEXT', 6));
  test(...eventRaised('NEXT', 7));

  describe('#08 => Check the service', () => {
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

  test(...waiter(9, 6));

  describe('#10 => Check the service', () => {
    test(...select('iterator', 18, 1));
    test(...pSelect('iterator', 12, 2));
    describe(...useConsole(3, ...Array(6).fill('sendPanelToUser')));
  });

  test('#11 => Length of calls of "dumbFn" is "33"', () => {
    expect(dumbFn).toBeCalledTimes(9);
  });

  test(...pause(12));

  describe('#13 => Check the service', () => {
    test(...select('iterator', 18, 1));
    test(...pSelect('iterator', 12, 2));
    describe(...useConsole(3));
  });

  test(...waiter(14, 9));

  describe('#15 => Check the service', () => {
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

  test('#16 => Length of calls of "dumbFn" is "33"', () => {
    expect(dumbFn).toBeCalledTimes(9);
  });

  test(...resume(17));
  test(...waiter(18, 12));

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

    test(...select('iterator', 42, 2));
    test(...pSelect('iterator', 24, 3));

    describe(...useConsole(4, ...Array(12).fill('sendPanelToUser')));
  });

  test('#20 => Length of calls of "dumbFn" is "33"', () => {
    expect(dumbFn).toBeCalledTimes(15);
  });

  test(...write('', 21));
  test(...eventRaised({ type: 'WRITE', payload: { value: '' } }, 22));

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

    test(...select('iterator', 42, 2));
    test(...pSelect('iterator', 24, 3));

    describe(...useConsole(4));
    test(...select('input', '', 5));
  });

  test(...waiter(24, 12));

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

  test(...write(INPUT, 26));
  test(...eventRaised({ type: 'WRITE', payload: { value: INPUT } }, 27));

  describe('#28 => Check the service', () => {
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

  test(...waiter(29, 12));

  describe('#30 => Check the service', () => {
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

  test(...write(INPUT, 31));
  test(...lastRaised({ type: 'WRITE', payload: { value: INPUT } }, 32));
  test(...eventRaised({ type: 'WRITE', payload: { value: '' } }, 33));

  describe('#34 => Check the service', () => {
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

  test(...waiter(35, 6));

  describe('#36 => Check the service', () => {
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

  test(...eventRaised.not('FETCH', 37));
  test(...send('FETCH', 38));
  test(...eventRaised('FETCH', 39));

  describe('#40 => Check the service', () => {
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

  test('#41 => Length of calls of "dumbFn" is "33"', () => {
    expect(dumbFn).toBeCalledTimes(33);
  });

  test(...unsubscribe(42));
  test(...waiter(43, 6));

  test('#44 => Length of calls of "dumbFn" is "33"', () => {
    expect(dumbFn).toBeCalledTimes(33);
  });

  describe('#45 => Check the service', () => {
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

  describe('#46 => Close the service', async () => {
    describe(
      ...eventsSequenced(
        1,
        'machine$$init',
        'NEXT',
        {
          type: 'WRITE',
          payload: {
            value: '',
          },
        },
        {
          type: 'WRITE',
          payload: {
            value: INPUT,
          },
        },
        'FETCH',
        {
          type: 'fetch::then',
          payload: FAKES,
        },
      ),
    );

    test(...stop(2));

    test('#03 => Log the time of all tests', () => {
      console.timeEnd(TEXT);
    });

    test(...dispose(4));
  });
});
