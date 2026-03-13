import mongoose from "mongoose";

const calculationRunSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["paye", "company"],
      required: true
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    requestedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const CalculationRun =
  mongoose.models.CalculationRun || mongoose.model("CalculationRun", calculationRunSchema);
