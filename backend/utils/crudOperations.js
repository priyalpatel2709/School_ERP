const mongoose = require("mongoose");
const createError = require("http-errors");
const { validationResult } = require("express-validator");

const crudOperations = (model) => {
  return {
    getAll: async (req, res, next) => {
      try {
        const documents = await model.find({});
        res.status(200).json(documents);
      } catch (err) {
        next(createError(500, "Error fetching data", { error: err.message }));
      }
    },

    getById: async (req, res, next) => {
      try {
        const document = await model.findById(req.params.id);
        if (document) {
          res.status(200).json(document);
        } else {
          next(createError(404, "Document not found"));
        }
      } catch (err) {
        next(createError(500, "Error fetching data", { error: err.message }));
      }
    },

    create: async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          createError(400, "Validation error", { errors: errors.array() })
        );
      }

      try {
        const newDocument = new model(req.body);
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
      } catch (err) {
        next(
          createError(500, "Error creating document", { error: err.message })
        );
      }
    },

    updateById: async (req, res, next) => {
      try {
        const updatedDocument = await model.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (updatedDocument) {
          res.status(200).json(updatedDocument);
        } else {
          next(createError(404, "Document not found"));
        }
      } catch (err) {
        next(
          createError(500, "Error updating document", { error: err.message })
        );
      }
    },

    deleteById: async (req, res, next) => {
      try {
        const deletedDocument = await model.findByIdAndDelete(req.params.id);
        if (deletedDocument) {
          res.status(200).json({ message: "Document deleted successfully" });
        } else {
          next(createError(404, "Document not found"));
        }
      } catch (err) {
        next(
          createError(500, "Error deleting document", { error: err.message })
        );
      }
    },

    deleteAll: async (req, res, next) => {
      try {
        await model.deleteMany({});
        res.status(200).json({ message: "All documents deleted successfully" });
      } catch (err) {
        next(
          createError(500, "Error deleting documents", { error: err.message })
        );
      }
    },
  };
};

module.exports = crudOperations;
