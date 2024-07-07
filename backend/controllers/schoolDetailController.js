const asyncHandler = require("express-async-handler"); // Ensure asyncHandler is required
const { getSchoolDetailModel } = require("../models");
const crudOperations = require("../utils/crudOperations");

const addSchoolDetail = asyncHandler(async (req, res, next) => {
  const School = getSchoolDetailModel(req.schoolDb);
  const schoolDetailOperations = crudOperations({
    mainModel: School,
    populateModels: [],
  });
  schoolDetailOperations.create(req, res, next);
});

const getSchoolDetail = asyncHandler(async (req, res, next) => {
  const School = getSchoolDetailModel(req.schoolDb);
  const schoolDetailOperations = crudOperations({
    mainModel: School,
    populateModels: [],
  });
  schoolDetailOperations.getAll(req, res, next);
});

const updateSchoolDetail = asyncHandler(async (req, res, next) => {
  const School = getSchoolDetailModel(req.schoolDb);
  const schoolDetailOperations = crudOperations({
    mainModel: School,
    populateModels: [],
  });
  schoolDetailOperations.updateById(req, res, next);
});

module.exports = {
  addSchoolDetail,
  getSchoolDetail,
  updateSchoolDetail,
};
