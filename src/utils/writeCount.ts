export const writeCount = (count: number) =>
  `${count < 10 ? '0' : ''}${count}`;
