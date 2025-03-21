import {
  AnyMachine,
  type MoF,
  type PromiseKeysFrom,
} from '@bemedev/app-ts';
import { NotUndefined, type Fn } from '@bemedev/types';
import { createTests } from '@bemedev/vitest-extended';

export const createPromiseFnTests = <T extends AnyMachine>(
  machine: T,
  name: PromiseKeysFrom<T>,
) => {
  type Req = Required<NotUndefined<MoF<T>['promises']>>;

  type Out = Extract<Req[keyof Req], Fn>;
  const promise = machine.promises[name] as Out;

  return createTests(promise);
};

export const cprot = createPromiseFnTests;
