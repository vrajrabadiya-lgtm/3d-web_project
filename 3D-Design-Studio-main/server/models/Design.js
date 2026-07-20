import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    designName: {
      type: String,
      required: true,
      trim: true,
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Design = mongoose.model("Design", designSchema);
export default Design;
