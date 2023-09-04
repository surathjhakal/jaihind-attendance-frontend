export const semFilterOptions = [
  {
    label: "1st Sem",
    value: "1",
  },
  {
    label: "2nd Sem",
    value: "2",
  },
  {
    label: "3rd Sem",
    value: "3",
  },
  {
    label: "4th Sem",
    value: "4",
  },
  {
    label: "5th Sem",
    value: "5",
  },
  {
    label: "6th Sem",
    value: "6",
  },
];

export const yearFilterOptions = [
  {
    label: "1st Year",
    value: "1",
  },
  {
    label: "2nd Year",
    value: "2",
  },
  {
    label: "3rd Year",
    value: "3",
  },
];

export const getFilterOptions = (data) => {
  return data.map((item) => {
    return {
      label: item.name,
      value: item,
    };
  });
};
