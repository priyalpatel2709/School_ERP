const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    index: true,
    sparse: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  subtitle: String,
  authors: [{
    type: String,
    required: true,
    index: true
  }],
  publisher: {
    type: String,
    index: true
  },
  publishedDate: Date,
  edition: String,
  language: {
    type: String,
    default: "English",
    index: true
  },
  pageCount: Number,
  dimensions: {
    height: Number,
    width: Number,
    thickness: Number,
    unit: {
      type: String,
      enum: ["cm", "in"],
      default: "cm"
    }
  },
  categories: [{
    type: String,
    index: true
  }],
  subCategories: [{
    type: String,
    index: true
  }],
  tags: [{
    type: String,
    index: true
  }],
  description: {
    type: String,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 500
  },
  price: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    purchasePrice: Number
  },
  coverImage: {
    url: String,
    thumbnailUrl: String,
    uploadedAt: Date
  },
  backCoverImage: {
    url: String,
    thumbnailUrl: String,
    uploadedAt: Date
  },
  contentRating: {
    type: String,
    enum: ["everyone", "children", "youngAdult", "mature", "restricted"],
    default: "everyone"
  },
  readingLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "research"],
    default: "intermediate"
  },
  targetAudience: [{
    type: String,
    enum: ["preschool", "primarySchool", "middleSchool", "highSchool", "college", "teachers", "researchers", "general"]
  }],
  format: {
    type: String,
    enum: ["hardcover", "paperback", "ebook", "audiobook", "magazine", "journal", "reference"],
    default: "paperback"
  },
  series: {
    name: String,
    number: Number
  },
  volume: Number,
  edition: String,
  isbn10: String,
  isbn13: String,
  deweyDecimal: String,
  libraryOfCongress: String,
  bibliographicReferences: [{
    type: String
  }],
  awards: [{
    name: String,
    year: Number,
    description: String
  }],
  reviews: [{
    reviewerName: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    },
    visibility: {
      type: String,
      enum: ["public", "staff", "private"],
      default: "public"
    }
  }],
  additionalResources: [{
    type: {
      type: String,
      enum: ["teacherGuide", "workbook", "solution", "audioCompanion", "video", "website", "other"]
    },
    title: String,
    url: String,
    description: String,
    restricted: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ["available", "partiallyAvailable", "unavailable", "removed", "lost", "damaged", "cataloging"],
    default: "cataloging",
    index: true
  },
  totalCopies: {
    type: Number,
    default: 0,
    min: 0
  },
  availableCopies: {
    type: Number,
    default: 0,
    min: 0
  },
  circulation: {
    isCirculable: {
      type: Boolean,
      default: true
    },
    maxCheckoutDays: {
      type: Number,
      default: 14
    },
    maxRenewals: {
      type: Number,
      default: 2
    },
    isReservable: {
      type: Boolean,
      default: true
    },
    isReferenceOnly: {
      type: Boolean,
      default: false
    },
    finePerDay: {
      type: Number,
      default: 1
    }
  },
  location: {
    section: {
      type: String,
      index: true
    },
    shelf: String,
    row: String,
    position: String,
    notes: String
  },
  acquisition: {
    source: String,
    date: Date,
    price: Number,
    donatedBy: String,
    orderNumber: String,
    notes: String
  },
  usage: {
    checkoutCount: {
      type: Number,
      default: 0
    },
    lastCheckoutDate: Date,
    popularityIndex: {
      type: Number,
      default: 0
    }
  },
  preservation: {
    condition: {
      type: String,
      enum: ["new", "excellent", "good", "fair", "poor", "damaged"],
      default: "good"
    },
    needsRepair: {
      type: Boolean,
      default: false
    },
    lastInspectionDate: Date,
    notes: String
  },
  digitalContent: {
    hasDigitalVersion: {
      type: Boolean,
      default: false
    },
    fileUrl: String,
    fileFormat: String,
    downloadable: {
      type: Boolean,
      default: false
    },
    previewUrl: String,
    accessRestrictions: {
      type: String,
      enum: ["none", "inLibraryOnly", "registeredUsers", "staffOnly"],
      default: "registeredUsers"
    }
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SchoolDetail",
    required: true,
    index: true
  },
  metaData: [{
    key: { type: String },
    value: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Text index for search
bookSchema.index({
  title: 'text',
  subtitle: 'text',
  authors: 'text',
  description: 'text',
  publisher: 'text',
  categories: 'text',
  tags: 'text'
}, {
  weights: {
    title: 10,
    subtitle: 5,
    authors: 8,
    description: 2,
    publisher: 3,
    categories: 6,
    tags: 4
  },
  name: "BookSearchIndex"
});

// Compound indexes
bookSchema.index({ status: 1, schoolId: 1 });
bookSchema.index({ categories: 1, status: 1 });
bookSchema.index({ 'location.section': 1, schoolId: 1 });
bookSchema.index({ isbn: 1, schoolId: 1 });

// Virtual for availability percentage
bookSchema.virtual('availabilityPercentage').get(function() {
  if (!this.totalCopies) return 0;
  return (this.availableCopies / this.totalCopies) * 100;
});

// Pre-save hook to update status based on copy counts
bookSchema.pre('save', function(next) {
  if (this.totalCopies > 0) {
    if (this.availableCopies === 0) {
      this.status = 'unavailable';
    } else if (this.availableCopies < this.totalCopies) {
      this.status = 'partiallyAvailable';
    } else {
      this.status = 'available';
    }
  } else {
    this.availableCopies = 0;
    this.status = 'unavailable';
  }
  next();
});

// Static method to find similar books
bookSchema.statics.findSimilarBooks = function(bookId, limit = 5) {
  return this.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(bookId) }
    },
    {
      $project: {
        categories: 1,
        authors: 1
      }
    },
    {
      $lookup: {
        from: 'librarybooks',
        let: { bookCategories: '$categories', bookAuthors: '$authors', currentBookId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $ne: ['$_id', '$$currentBookId'] },
                  {
                    $or: [
                      { $gt: [{ $size: { $setIntersection: ['$categories', '$$bookCategories'] } }, 0] },
                      { $gt: [{ $size: { $setIntersection: ['$authors', '$$bookAuthors'] } }, 0] }
                    ]
                  }
                ]
              }
            }
          },
          {
            $project: {
              title: 1,
              authors: 1,
              categories: 1,
              coverImage: 1,
              status: 1,
              commonCategories: { $size: { $setIntersection: ['$categories', '$$bookCategories'] } },
              commonAuthors: { $size: { $setIntersection: ['$authors', '$$bookAuthors'] } },
              score: {
                $add: [
                  { $multiply: [{ $size: { $setIntersection: ['$categories', '$$bookCategories'] } }, 2] },
                  { $multiply: [{ $size: { $setIntersection: ['$authors', '$$bookAuthors'] } }, 3] }
                ]
              }
            }
          },
          { $sort: { score: -1 } },
          { $limit: limit }
        ],
        as: 'similarBooks'
      }
    },
    {
      $project: {
        similarBooks: 1
      }
    }
  ]);
};

const LibraryBook = mongoose.model('LibraryBook', bookSchema);

module.exports = LibraryBook; 