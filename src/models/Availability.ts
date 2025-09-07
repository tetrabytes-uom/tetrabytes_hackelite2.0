import mongoose, { Schema, model, models } from "mongoose";

const SlotSchema = new Schema(
  { startMin: { type: Number, required: true }, endMin: { type: Number, required: true } },
  { _id: false }
);

const DaySchema = new Schema(
  { day: { type: Number, required: true, min: 0, max: 6 }, slots: { type: [SlotSchema], default: [] } },
  { _id: false }
);

// During dev, delete the old compiled model so schema changes (ObjectId -> String) apply
if (process.env.NODE_ENV !== "production" && mongoose.models.Availability) {
  delete mongoose.models.Availability;
}

const AvailabilitySchema = new Schema(
  {
    // ← STRING, not ObjectId
    userId:   { type: String, required: true, index: true, unique: true, set: (v: any) => String(v) },
    timezone: { type: String, required: true, default: "Asia/Colombo" },
    week:     { type: [DaySchema], default: () => [...Array(7)].map((_, i) => ({ day: i, slots: [] })) },
    updatedAt:{ type: Date, default: Date.now },
  },
  { collection: "availabilities" }
);

export const Availability = models.Availability || model("Availability", AvailabilitySchema);
export default Availability;
