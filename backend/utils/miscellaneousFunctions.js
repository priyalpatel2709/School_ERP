const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeTablePopulateModel = (User, Teacher, Subject) => {
  const populateModels = [];

  weekDays.forEach((day) => {
    populateModels.push(
      {
        field: `week.${day}.subject`,
        model: Subject,
        select: "name code",
      },
      {
        field: `week.${day}.teacher`,
        model: Teacher,
        select: "user",
        populateFields: [
          {
            field: "user",
            model: User,
            select: "name",
          },
        ],
      }
    );
  });

  return populateModels;
};

module.exports = {
  timeTablePopulateModel,
};
