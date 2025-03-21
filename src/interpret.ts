import {
  AnyMachine,
  ContextFrom,
  Mode,
  PrivateContextFrom,
  interpret as _interpret,
  type Decompose2,
  type EventsMapFrom,
  type PromiseesMapFrom,
  type State as _State,
} from '@bemedev/app-ts';
import { eventToType, type EventArg } from '@bemedev/app-ts/lib/events';
import type { StateValue } from '@bemedev/app-ts/lib/states';
import type { PrimitiveObject } from '@bemedev/app-ts/lib/types';
import { typings } from '@bemedev/app-ts/lib/utils';
import { t, type Fn } from '@bemedev/types';
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

  const service = _interpret(machine, config);

  const start = (index = 0) => {
    const count = writeCount(index);
    const invite = `#${count} => Start`;
    const fn = service.start.bind(service);

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
  const createSubscribe = (fn: StateFn, index = 0) => {
    const count = writeCount(index);
    const inviteS = `#${count} => Subscribe to service`;
    const inviteU = `#${count} => Unsubcribe to service`;
    let unsubscribe = typings.function(typings.boolean());
    const fnS = () => {
      unsubscribe = service.subscribe(fn);
    };
    const fnU = () => unsubscribe();

    return t.tuple(t.tuple(inviteS, fnS), t.tuple(inviteU, fnU));
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
  };
};
