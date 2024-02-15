import moment from "moment";

export const formatDate = (date: any) => {
  const formats = [
    "DD/MM/YYYY",
    "DD-MM-YYYY",
    "DD.MM.YYYY",
    "DD/MMM/YYYY",
    "DD-MMM-YYYY",
    "YYYY-MM-DD",
    "DD.MMM.YYYY",
    "YYYY-MM-DD[T]HH:mm",
    "YYYY-MM-DD[T]HH:mmZ",
    "DD-MM-YYYY[T]HH:mm",
    "YYYY-MM-DD[Z]",
    "YYYY-MM-DDTHH:mm:ss.SSSZ",
    // Add more formats if needed
  ];

  let parsedDate = null;

  for (const formatStr of formats) {
    parsedDate = moment(date, formatStr, true);
    if (parsedDate.isValid()) {
      // Format the date as DD/MM/YYYY
      const formattedDate = parsedDate.format("DD/MM/YYYY");
      return formattedDate;
    }
  }

  // Return empty string if the input date couldn't be parsed
  return "";
};
