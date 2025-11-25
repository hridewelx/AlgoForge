import mongoose from "mongoose";
import { Schema } from "mongoose";

const submissionSchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        trim: true,
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "problem",
        required: true,
        trim: true
    },
    language: {
        type: String,
        required: true,
        trim: true,
        enum: ["c", "cpp", "java", "javascript", "python"]
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true,
        enum: ["Pending", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Compilation Error", "Runtime Error (SIGSEGV)", "Runtime Error (SIGXFSZ)", "Runtime Error (SIGFPE)", "Runtime Error (SIGABRT)", "Runtime Error (NZEC)", "Runtime Error (Other)", "Internal Error", "Exec Format Error"]
    },
    runTime: {
        type: Number,
        trim: true,
        default: 0
    },
    memory: {
        type: Number,
        trim: true,
        default: 0
    },
    errorMessage: {
        type: String,
        default: null,
        trim: true
    },
    testCasePassed: {
        type: Number,
        trim: true,
        default: 0
    },
    totalTestCases: {
        type: Number,
        required: true, 
        trim: true,
        default: 0
    }, 
    upvote: {
        type: Number,
        trim: true,
        default: 0
    },
    votes: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        type: {
            type: String,
            enum: ["up", "down"],
            required: true
        }
    }]

}, {timestamps: true});

submissionSchema.index({userId: 1, problemId: 1});

const Submission = mongoose.model("submission", submissionSchema);
export default Submission;