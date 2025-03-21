import { AnyMachine, type GuardKeysFrom, type MoF } from '@bemedev/app-ts';
import { NotUndefined, type Fn } from '@bemedev/types';
import { createTests } from '@bemedev/vitest-extended';

export const createPredicateFnTests = <T extends AnyMachine>(
  machine: T,
  name: GuardKeysFrom<T>,
) => {
  type Req = Required<NotUndefined<MoF<T>['predicates']>>;

  type Out = Extract<Req[keyof Req], Fn>;
  const predicate = machine.predicates[name] as Out;

  return createTests(predicate);
};

export const cpret = createPredicateFnTests;
