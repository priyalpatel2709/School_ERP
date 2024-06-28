const createError = require("http-errors");
const { validationResult } = require("express-validator");

const crudOperations = (models) => {
  const { mainModel, populateModels = [] } = models;

  const populateFields = async (document) => {
    const populatedDocument = { ...document };

    // Iterate through each populate model and populate the field in the document
    for (const populateModel of populateModels) {
      const field = populateModel.field;
      const model = populateModel.model;

      if (document[field]) {
        const populatedField = await model.findById(document[field]).lean();
        populatedDocument[field] = populatedField || null;
      }
    }

    return populatedDocument;
  };

  return {
    getAll: async (req, res, next) => {
      try {
        const documents = await mainModel.find({}).lean();
        const populatedDocuments = await Promise.all(
          documents.map(populateFields)
        );
        res.status(200).json(populatedDocuments);
      } catch (err) {
        console.error("Error in getAll:", err); // Log the error for debugging
        next(createError(500, "Error fetching data", { error: err.message }));
      }
    },

    getById: async (req, res, next) => {
      try {
        const document = await mainModel.findById(req.params.id).lean();
        if (document) {
          const populatedDocument = await populateFields(document);
          res.status(200).json(populatedDocument);
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
        const newDocument = new mainModel(req.body);
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
        const updatedDocument = await mainModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
        );
        if (updatedDocument) {
          const populatedDocument = await populateFields(
            updatedDocument.toObject()
          );
          res.status(200).json(populatedDocument);
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
        const deletedDocument = await mainModel.findByIdAndDelete(
          req.params.id
        );
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
        await mainModel.deleteMany({});
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
