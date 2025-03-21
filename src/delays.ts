import { AnyMachine, type DelayKeysFrom, type MoF } from '@bemedev/app-ts';
import { NotUndefined, type Fn } from '@bemedev/types';
import { createTests } from '@bemedev/vitest-extended';

export const createDelayFnTests = <T extends AnyMachine>(
  machine: T,
  name: DelayKeysFrom<T>,
) => {
  type Req = Required<NotUndefined<MoF<T>['delays']>>;

  type Out = Extract<Req[keyof Req], Fn>;
  const _delay = machine.delays[name];
  const delay: Out = typeof _delay === 'number' ? () => _delay : _delay;

  return createTests(delay);
};

export const cdt = createDelayFnTests;
