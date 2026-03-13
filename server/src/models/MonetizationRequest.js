import mongoose from "mongoose";

const monetizationRequestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["support_lead", "consultation", "pdf_report", "subscription"],
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    companyName: {
      type: String,
      trim: true,
      default: ""
    },
    message: {
      type: String,
      trim: true,
      default: ""
    },
    taxUseCase: {
      type: String,
      trim: true,
      default: ""
    },
    selectedPlan: {
      type: String,
      trim: true,
      default: ""
    },
    consultationType: {
      type: String,
      trim: true,
      default: ""
    },
    preferredDate: {
      type: String,
      trim: true,
      default: ""
    },
    preferredTime: {
      type: String,
      trim: true,
      default: ""
    },
    calculationType: {
      type: String,
      trim: true,
      default: ""
    },
    reportScope: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "booked", "paid", "closed"],
      default: "new"
    },
    context: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
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

export const MonetizationRequest =
  mongoose.models.MonetizationRequest ||
  mongoose.model("MonetizationRequest", monetizationRequestSchema);
