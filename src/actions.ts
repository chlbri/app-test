import {
  AnyMachine,
  type ActionKeysFrom,
  type MoF,
} from '@bemedev/app-ts';
import { NotUndefined, type Fn } from '@bemedev/types';
import { createTests } from '@bemedev/vitest-extended';

export const createActionFnTests = <T extends AnyMachine>(
  machine: T,
  name: ActionKeysFrom<T>,
) => {
  type Req = Required<NotUndefined<MoF<T>['actions']>>;

  type Out = Extract<Req[keyof Req], Fn>;
  const action = machine.actions[name] as Out;

  return createTests(action);
};

export const cat = createActionFnTests;
