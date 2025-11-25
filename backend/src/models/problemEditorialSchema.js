import mongoose from "mongoose";
import { Schema } from "mongoose";

// Sub-schema for video solutions
const videoSolutionSchema = new Schema({
    publicId: {
        type: String,
        required: true
    },
    secureUrl: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 0
    },
    thumbnailUrl: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: 'Video Solution'
    },
    description: {
        type: String,
        default: ''
    }
}, { _id: true });

// Sub-schema for code solutions in different languages
const codeSolutionSchema = new Schema({
    language: {
        type: String,
        enum: ["c", "cpp", "java", "javascript", "python"],
        required: true
    },
    code: {
        type: String,
        required: true
    }
}, { _id: false });

// Sub-schema for each approach
const approachSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    },
    complexity: {
        time: {
            type: String,
            default: ''
        },
        space: {
            type: String,
            default: ''
        }
    },
    explanation: {
        type: String,
        default: ''
    },
    solutions: [codeSolutionSchema]
}, { _id: true });

// Main editorial schema - one document per problem
const problemEditorialSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true,
        unique: true // Only one editorial per problem
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    
    // Video solutions (can have multiple)
    videos: [videoSolutionSchema],
    
    // Multiple approaches (Brute Force, Optimal, etc.)
    approaches: [approachSchema],
    
    // Metadata
    isOfficial: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    }
}, {
    timestamps: true
});

// Indexes for better query performance
problemEditorialSchema.index({ authorId: 1, problemId: 1 }); 

const Editorial = mongoose.model('editorial', problemEditorialSchema);
export default Editorial;
