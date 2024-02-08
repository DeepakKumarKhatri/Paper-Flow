export const filterName = (fileName) => {
  const nameWithoutNumbersAndType = fileName.replace(/^\d+|\.pdf$/g, "");
  const nameWithoutUnderscores = nameWithoutNumbersAndType.replace(/_/g, " ");
  return nameWithoutUnderscores;
};
