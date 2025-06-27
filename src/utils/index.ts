export const createIdFromName = (name: string) => {
  return name.toLowerCase().split(' ').join('-');
};
