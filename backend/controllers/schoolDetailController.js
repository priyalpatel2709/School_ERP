const asyncHandler = require("express-async-handler"); // Ensure asyncHandler is required
const { getSchoolDetailModel } = require("../models");
const crudOperations = require("../utils/crudOperations");

const addSchoolDetail = asyncHandler(async (req, res, next) => {
  const School = getSchoolDetailModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: School,
    populateModels: [],
  });
  roleOperations.create(req, res, next);
});

const getSchoolDetail = asyncHandler(async (req, res, next) => {
  const School = getSchoolDetailModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: School,
    populateModels: [],
  });
  roleOperations.getAll(req, res, next);
});

const updateSchoolDetail = asyncHandler(async (req, res, next) => {
  const School = getSchoolDetailModel(req.schoolDb);
  const roleOperations = crudOperations({
    mainModel: School,
    populateModels: [],
  });
  roleOperations.updateById(req, res, next);
});

module.exports = {
  addSchoolDetail,
  getSchoolDetail,
  updateSchoolDetail,
};
