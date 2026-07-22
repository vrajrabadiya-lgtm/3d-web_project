import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PLANNING", "ASSET_GENERATION", "CODE_GENERATION", "ASSEMBLING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    progress: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    planning: {
      type: Object,
      default: {},
    },
    assets: {
      type: [String],
      default: [],
    },
    generatedCode: {
      type: Object,
      default: {},
    },
    logs: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
