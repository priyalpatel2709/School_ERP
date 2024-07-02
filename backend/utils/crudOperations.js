const createError = require("http-errors");
const { validationResult } = require("express-validator");

// Function to handle nested population of fields
const populateNestedFields = async (query, populateFields) => {
  for (const { field, model, populateFields: nestedFields } of populateFields) {
    if (nestedFields) {
      query = query.populate({
        path: field,
        model: model,
        populate: nestedFields.map((nestedField) => ({
          path: nestedField.field,
          model: nestedField.model,
        })),
      });
    } else {
      query = query.populate(field, model);
    }
  }
  return query;
};

// CRUD operations generator function
const crudOperations = (models) => {
  const { mainModel, populateModels = [] } = models;

  return {
    // Get all documents
    getAll: async (req, res, next) => {
      try {
        let query = mainModel.find({});
        query = await populateNestedFields(query, populateModels);
        const documents = await query; // Use  for performance
        res.status(200).json(documents);
      } catch (err) {
        console.error("Error in getAll:", err); // Log the error for debugging
        next(createError(500, "Error fetching data", { error: err.message }));
      }
    },

    // Get document by ID
    getById: async (req, res, next) => {
      try {
        let query = mainModel.findById(req.params.id);
        query = await populateNestedFields(query, populateModels);
        const document = await query;
        if (document) {
          res.status(200).json(document);
        } else {
          next(createError(404, "Document not found"));
        }
      } catch (err) {
        console.error("Error in getById:", err); // Log the error for debugging
        next(createError(500, "Error fetching data", { error: err.message }));
      }
    },

    // Create a new document
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
        console.error("Error in create:", err); // Log the error for debugging
        next(
          createError(500, "Error creating document", { error: err.message })
        );
      }
    },

    // Update document by ID
    updateById: async (req, res, next) => {
      try {
        const updatedDocument = await mainModel
          .findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
          })
          ;
        if (updatedDocument) {
          let query = mainModel.findById(updatedDocument._id);
          query = await populateNestedFields(query, populateModels);
          const populatedDocument = await query;
          res.status(200).json(populatedDocument);
        } else {
          next(createError(404, "Document not found"));
        }
      } catch (err) {
        console.error("Error in updateById:", err); // Log the error for debugging
        next(
          createError(500, "Error updating document", { error: err.message })
        );
      }
    },

    // Delete document by ID
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
        console.error("Error in deleteById:", err); // Log the error for debugging
        next(
          createError(500, "Error deleting document", { error: err.message })
        );
      }
    },

    // Delete all documents
    deleteAll: async (req, res, next) => {
      try {
        await mainModel.deleteMany({});
        res.status(200).json({ message: "All documents deleted successfully" });
      } catch (err) {
        console.error("Error in deleteAll:", err); // Log the error for debugging
        next(
          createError(500, "Error deleting documents", { error: err.message })
        );
      }
    },
  };
};

module.exports = crudOperations;
