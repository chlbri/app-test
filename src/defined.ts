import type { ActionKeysFrom, AnyMachine } from '@bemedev/app-ts';

export const areDefineds = <T extends AnyMachine>(
  machine: T,
  ...names: ActionKeysFrom<T>[]
) => {
  const fns = names.map(name => machine.actions[name]);

  const out = fns.every(fn => fn !== undefined);

  return out;
};
