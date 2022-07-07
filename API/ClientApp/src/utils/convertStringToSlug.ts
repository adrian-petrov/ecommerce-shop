export const convertStringToSlug = (str: string) => {
  if (str === null) return '';

  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[-]+/g, '-')
    .replace(/[^\w-]+/g, '');
};
