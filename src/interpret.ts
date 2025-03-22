import {
  AnyMachine,
  ContextFrom,
  Mode,
  PrivateContextFrom,
  interpret as _interpret,
  type Decompose2,
  type EventsFrom,
  type EventsMapFrom,
  type PromiseesMapFrom,
  type State as _State,
} from '@bemedev/app-ts';
import {
  eventToType,
  isStringEvent,
  transformEventArg,
  type AlwaysEvent,
  type EventArg,
  type InitEvent,
  type MaxExceededEvent,
} from '@bemedev/app-ts/lib/events';
import type { StateValue } from '@bemedev/app-ts/lib/states';
import type { PrimitiveObject } from '@bemedev/app-ts/lib/types';
import { typings } from '@bemedev/app-ts/lib/utils';
import { t, type Fn } from '@bemedev/types';
import dequal from 'fast-deep-equal';
import { compare, writeCount } from './utils';

export const interpret = <M extends AnyMachine>(
  machine: M,
  config: {
    pContext: PrivateContextFrom<M>;
    context: ContextFrom<M>;
    mode?: Mode;
    exact?: boolean;
  },
) => {
  type Tc = (typeof config)['context'];
  type Pc = (typeof config)['pContext'];
  type State = _State<Extract<M['context'], PrimitiveObject>>;
  type Em = EventsMapFrom<M>;
  type Pm = PromiseesMapFrom<M>;
  type Event = EventArg<Em, Pm>;
  type AllEvent = Event | InitEvent | AlwaysEvent | MaxExceededEvent;

  const transformAllEvent = (value: AllEvent) => {
    return isStringEvent(value) ? value : transformEventArg(value);
  };

  const service = _interpret(machine, config);

  const start = (index = 0) => {
    const count = writeCount(index);
    const invite = `#${count} => Start`;
    const fn = service.start.bind(service);

    return t.tuple(invite, fn);
  };

  const _events: EventsFrom<M>[] = [];

  service.___subscribeEvent((_, event) => {
    const last = _events.at(-1);
    const check = dequal(last, event);
    if (check) return;
    _events.push(event);
  });

  const eventRaised = (event: AllEvent, index = 0) => {
    const count = writeCount(index);
    const type = eventToType(event);
    const invite = `#${count} => Event ${type} has been raised`;

    const transformed = transformAllEvent(event);
    const fn = () => {
      expect(_events).toContainEqual(transformed);
    };

    return t.tuple(invite, fn);
  };

  eventRaised.not = (event: AllEvent, index = 0) => {
    const count = writeCount(index);
    const type = eventToType(event);
    const invite = `#${count} => Event ${type} has been raised`;

    const transformed = transformAllEvent(event);
    const fn = () => {
      expect(_events).not.toContainEqual(transformed);
    };

    return t.tuple(invite, fn);
  };

  const lastRaised = (event: Event, index = 0) => {
    const count = writeCount(index);
    const type = eventToType(event);
    const invite = `#${count} => Event ${type} has been raised`;

    const transformed = transformEventArg(event);
    const fn = () => {
      const last = _events.at(-1);
      expect(last).toStrictEqual(transformed);
    };

    return t.tuple(invite, fn);
  };

  const eventsSequenced = (index = 0, ...events: AllEvent[]) => {
    const count = writeCount(index);
    const invite = `#${count} => Check the events sequence`;

    const transformeds = events.map(transformAllEvent);

    const fn = () => {
      test('#00 => Same length', () => {
        expect(_events.length).toBe(transformeds.length);
      });

      events.forEach((_, index) => {
        const count = writeCount(index + 1);
        it(`#${count}`, () => {
          const inner = _events[index];
          const outer = transformeds[index];
          expect(inner).toStrictEqual(outer);
        });
      });
    };

    return t.tuple(invite, fn);
  };

  const pause = (index = 0) => {
    const count = writeCount(index);
    const invite = `#${count} => Pause`;
    const fn = service.pause.bind(service);

    return t.tuple(invite, fn);
  };

  const resume = (index = 0) => {
    const count = writeCount(index);
    const invite = `#${count} => Resume`;
    const fn = service.resume.bind(service);

    return t.tuple(invite, fn);
  };

  const stop = (index = 0) => {
    const count = writeCount(index);
    const invite = `#${count} => Stop`;
    const fn = service.stop.bind(service);

    return t.tuple(invite, fn);
  };

  const send = (
    event: EventArg<EventsMapFrom<M>, PromiseesMapFrom<M>>,
    index = 0,
  ) => {
    const count = writeCount(index);
    const type = eventToType(event);
    const invite = `#${count} => Send ${type}`;
    const fn = () => service.send(event);

    return t.tuple(invite, fn);
  };

  type StateFn = (state: State) => void;
  const createSubscribe = (fn: StateFn) => {
    let unsubscribe = typings.function(typings.boolean());
    const fnS = () => {
      unsubscribe = service.__subscribeState(fn);
    };
    const fnU = () => unsubscribe();

    const testS = (index = 0) => {
      const count = writeCount(index);
      const inviteS = `#${count} => Subscribe to service`;
      return t.tuple(inviteS, fnS);
    };

    const testU = (index = 0) => {
      const count = writeCount(index);
      const inviteU = `#${count} => Unsubcribe to service`;
      return t.tuple(inviteU, fnU);
    };

    return t.tuple(testS, testU);
  };

  type dPc = Decompose2<Pc>;
  const pSelect = <K extends keyof dPc>(
    selector: K,
    data: any,
    index = 0,
  ) => {
    const count = writeCount(index);
    const invite = `#${count} => Check the private context`;
    const actual = () => (service._pSelect as Fn)(selector);
    const fn = compare(actual, data);

    return t.tuple(invite, fn);
  };

  type dTc = Decompose2<Tc>;
  const select = <K extends keyof dTc>(
    selector: K,
    data: dTc[K],
    index = 0,
  ) => {
    const count = writeCount(index);
    const invite = `#${count} => Check the context`;
    const actual = () => (service.select as Fn)(selector);
    const fn = compare(actual, data);

    return t.tuple(invite, fn);
  };

  const value = (value: StateValue, index = 0) => {
    const count = writeCount(index);
    const invite = `#${count} => Check the value`;
    const actual = () => service.value;
    const fn = compare(actual, value);

    return t.tuple(invite, fn);
  };

  const dispose = (index = 0) => {
    const count = writeCount(index);
    const invite = `#${count} => Dispose`;
    const fn = service[Symbol.asyncDispose].bind(service);

    return t.tuple(invite, fn);
  };

  return {
    start,
    pause,
    resume,
    stop,
    send,
    createSubscribe,
    pSelect,
    select,
    value,
    dispose,
    service,
    eventRaised,
    lastRaised,
    eventsSequenced,
  };
};
