export function sortData(obj1, obj2) {
  // Handle null values by moving them to the end of the sorted array
  const dateTimeA =
    obj1.creation_date !== undefined && obj1.creation_date !== null
      ? obj1.creation_date
      : null;
  const dateTimeB =
    obj2.creation_date !== undefined && obj2.creation_date !== null
      ? obj2.creation_date
      : null;
  console.log(dateTimeA, dateTimeB);
  if (dateTimeA === null && dateTimeB === null) {
    return 0;
  }
  if (dateTimeA === null) {
    return 1;
  }
  if (dateTimeB === null) {
    return -1;
  }

  // Parse the ISO datetime strings into Date objects for comparison
  const dateA = new Date(dateTimeA);
  const dateB = new Date(dateTimeB);

  // Compare the Date objects
  return dateB - dateA;
}

export function sortLectureData(obj1, obj2) {
  // Handle null values by moving them to the end of the sorted array
  const dateTimeA =
    obj1.time !== undefined && obj1.time !== null ? obj1.time : null;
  const dateTimeB =
    obj2.time !== undefined && obj2.time !== null ? obj2.time : null;
  console.log(dateTimeA, dateTimeB);
  if (dateTimeA === null && dateTimeB === null) {
    return 0;
  }
  if (dateTimeA === null) {
    return 1;
  }
  if (dateTimeB === null) {
    return -1;
  }

  // Parse the ISO datetime strings into Date objects for comparison
  const dateA = new Date(dateTimeA);
  const dateB = new Date(dateTimeB);

  // Compare the Date objects
  return dateB - dateA;
}

export function formatDate(inputDate) {
  const date = new Date(inputDate);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  let formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  formattedHours = formattedHours < 10 ? "0" + formattedHours : formattedHours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
}

export const formatTodayDate = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentDate = new Date();
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = currentDate.toLocaleString("default", { month: "long" });
  const day = currentDate.getDate();

  return `${dayOfWeek}, ${month} ${day}`;
};

export const getSem = (selectedYearFilter) => {
  let sem;
  const currentMonth = new Date().getMonth() + 1;
  if ([1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12].includes(currentMonth)) {
    if (selectedYearFilter.value === 1) sem = 1;
    else if (selectedYearFilter.value === 2) sem = 3;
    else sem = 5;
  } else {
    if (selectedYearFilter.value === 1) sem = 2;
    else if (selectedYearFilter.value === 2) sem = 4;
    else sem = 6;
  }
  sem = sem + "";
  return sem;
};
