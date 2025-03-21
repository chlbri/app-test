import type {
  ActionKeysFrom,
  AnyMachine,
  DelayKeysFrom,
  GuardKeysFrom,
  MachineKeysFrom,
  PromisesFrom,
} from '@bemedev/app-ts';

export const areDefineds = <T extends AnyMachine>(
  machine: T,
  ...names: (
    | GuardKeysFrom<T>
    | ActionKeysFrom<T>
    | DelayKeysFrom<T>
    | PromisesFrom<T>
    | MachineKeysFrom<T>
  )[]
) => {
  const fns = names.map(name => {
    const out =
      machine.actions[name] ??
      machine.predicates[name] ??
      machine.promises[name] ??
      machine.delays[name] ??
      machine.machines[name];

    return out;
  });

  const out = fns.every(fn => fn !== undefined);

  return out;
};
