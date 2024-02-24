export const studentFields = [
  {
    type: "text",
    value: "uid",
  },
  {
    type: "text",
    value: "name",
  },
  {
    type: "text",
    value: "roll",
  },
  {
    type: "text",
    value: "major",
  },
  {
    type: "email",
    value: "email",
  },
  {
    type: "dropdown",
    value: "course",
  },
  {
    type: "dropdown",
    value: "year",
  },
];

export const teacherFields = [
  {
    type: "text",
    value: "name",
  },
  {
    type: "email",
    value: "email",
  },
  {
    type: "password",
    value: "password",
  },
  {
    type: "dropdown",
    value: "course",
    isMulti: true,
  },
];

export const courseFields = [
  {
    type: "text",
    value: "name",
  },
];

export const subjectFields = [
  {
    type: "text",
    value: "name",
  },
  {
    type: "dropdown",
    value: "teacher",
    isMulti: true,
  },
  {
    type: "dropdown",
    value: "course",
  },
  {
    type: "dropdown",
    value: "year",
  },
  {
    type: "dropdown",
    value: "sem",
  },
];

export const adminFields = [
  {
    type: "text",
    value: "name",
  },
  {
    type: "email",
    value: "email",
  },
  {
    type: "password",
    value: "password",
  },
  {
    type: "dropdown",
    value: "department",
  },
];

export const departmentFields = [
  {
    type: "text",
    value: "name",
  },
];

export const defaultFilter = {
  value: "All",
  label: "All",
};

export const selectDefaultFilter = {
  value: "Select",
  label: "Select",
};
