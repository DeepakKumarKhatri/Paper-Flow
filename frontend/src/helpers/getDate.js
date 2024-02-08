export const getDate = (datee) => {
  const dateObject = new Date(datee);
  let year = dateObject.getFullYear();
  let month = dateObject.getMonth() + 1;
  let date = dateObject.getDate();

  month = month < 10 ? "0" + month : month;
  date = date < 10 ? "0" + date : date;
  return date + "-" + month + "-" + year;
};
