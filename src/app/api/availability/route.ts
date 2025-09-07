import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { Availability } from "@/models/Availability";
import { z } from "zod";

export const runtime = "nodejs";

const slotSchema = z
  .object({
    startMin: z.number().int().min(0).max(1440),
    endMin: z.number().int().min(0).max(1440),
  })
  .refine(
    (s: { startMin: number; endMin: number }) => s.startMin < s.endMin,
    { message: "startMin must be < endMin" }
  );

const daySchema = z.object({
  day: z.number().int().min(0).max(6),
  slots: z.array(slotSchema),
});

const bodySchema = z.object({
  timezone: z.string().min(1),
  week: z.array(daySchema).length(7),
});

type Slot = z.infer<typeof slotSchema>;

function mergeSlots(slots: Slot[]) {
  if (!slots.length) return [] as Slot[];
  const sorted = [...slots].sort((a, b) => a.startMin - b.startMin);
  const merged: Slot[] = [{ ...sorted[0] }];
  for (let i = 1; i < sorted.length; i++) {
    const prev = merged[merged.length - 1];
    const cur = sorted[i];
    if (cur.startMin <= prev.endMin) {
      prev.endMin = Math.max(prev.endMin, cur.endMin);
    } else {
      merged.push({ ...cur });
    }
  }
  return merged;
}

function normalizeWeek(week: { day: number; slots: Slot[] }[]) {
  return week.map((d) => ({
    day: d.day,
    slots: mergeSlots(
      d.slots.filter(
        (s) => s.startMin >= 0 && s.endMin <= 1440 && s.startMin < s.endMin
      )
    ),
  }));
}

async function getUserId(req: NextRequest) {
  const id = req.headers.get("x-user-id");
  if (!id) throw new Error("Unauthorized");
  return id;
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const userId = await getUserId(req);
    let doc = await Availability.findOne({ userId });
    if (!doc) {
      doc = await Availability.create({ userId, timezone: "Asia/Colombo" });
    }
    return NextResponse.json(doc);
  } catch (e: any) {
    const status = e?.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectMongoDB();
    const userId = await getUserId(req);
    const json = await req.json();
    const parsed = bodySchema.parse(json);
    const normalizedWeek = normalizeWeek(parsed.week);

    const doc = await Availability.findOneAndUpdate(
      { userId },
      { timezone: parsed.timezone, week: normalizedWeek, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return NextResponse.json(doc);
  } catch (e: any) {
    if (e.name === "ZodError") {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    const status = e?.message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: e.message }, { status });
  }
}
