export const getRandom = (list: string[]) =>
  list[Math.floor(Math.random() * Math.floor(list.length))]
