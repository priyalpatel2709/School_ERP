const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const {
    getGradingSystemModel,
    getClassModel
} = require("../models");
const crudOperations = require("../utils/crudOperations");

const createGradingSystem = asyncHandler(async (req, res, next) => {
    const GradingSystem = getGradingSystemModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);

    const gradingSystemOperations = crudOperations({
        mainModel: GradingSystem,
        populateModels: [{ field: "classes", model: Class, select: "classNumber division" }],
    });
    gradingSystemOperations.create(req, res, next);
});

const getAllGradingSystems = asyncHandler(async (req, res, next) => {
    const GradingSystem = getGradingSystemModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);

    const gradingSystemOperations = crudOperations({
        mainModel: GradingSystem,
        populateModels: [{ field: "classes", model: Class, select: "classNumber division" }],
    });
    gradingSystemOperations.getAll(req, res, next);
});

const getGradingSystemById = asyncHandler(async (req, res, next) => {
    const GradingSystem = getGradingSystemModel(req.schoolDb);
    const Class = getClassModel(req.schoolDb);

    const gradingSystemOperations = crudOperations({
        mainModel: GradingSystem,
        populateModels: [{ field: "classes", model: Class, select: "classNumber division" }],
    });
    gradingSystemOperations.getById(req, res, next);
});

const updateGradingSystem = asyncHandler(async (req, res, next) => {
    const GradingSystem = getGradingSystemModel(req.schoolDb);
    const gradingSystemOperations = crudOperations({
        mainModel: GradingSystem,
    });
    gradingSystemOperations.updateById(req, res, next);
});

const deleteGradingSystem = asyncHandler(async (req, res, next) => {
    const GradingSystem = getGradingSystemModel(req.schoolDb);
    const gradingSystemOperations = crudOperations({
        mainModel: GradingSystem,
    });
    gradingSystemOperations.deleteById(req, res, next);
});

module.exports = {
    createGradingSystem,
    getAllGradingSystems,
    getGradingSystemById,
    updateGradingSystem,
    deleteGradingSystem,
};
