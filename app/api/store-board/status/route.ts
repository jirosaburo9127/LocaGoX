import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { syncStoreReliability } from "@/lib/reliability";

const schema = z.object({
  storeId: z.string().min(1),
  acceptingSameDay: z.enum(["true", "false"]),
  waitMinutes: z.coerce.number().min(0).max(480),
  nextAvailableWindow: z.string().trim().optional(),
  note: z.string().trim().optional(),
  reliabilityMode: z.enum(["auto", "manual_override"]),
  reliabilityState: z.enum(["healthy", "caution", "manual_only"]),
  replySlaSnapshot: z.string().trim().optional()
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = schema.safeParse({
    storeId: formData.get("storeId"),
    acceptingSameDay: formData.get("acceptingSameDay"),
    waitMinutes: formData.get("waitMinutes"),
    nextAvailableWindow: formData.get("nextAvailableWindow") ?? "",
    note: formData.get("note") ?? "",
    reliabilityMode: formData.get("reliabilityMode"),
    reliabilityState: formData.get("reliabilityState"),
    replySlaSnapshot: formData.get("replySlaSnapshot") ?? ""
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_store_snapshot",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  await db.$transaction([
    db.store.update({
      where: {
        id: parsed.data.storeId
      },
      data: {
        reliabilityMode: parsed.data.reliabilityMode,
        reliabilityState: parsed.data.reliabilityState,
        reliabilityReason:
          parsed.data.reliabilityMode === "manual_override" ? "manual_override_by_store_board" : null,
        reliabilityEvidence:
          parsed.data.reliabilityMode === "manual_override"
            ? {
                updatedBy: "store_board",
                mode: "manual_override"
              }
            : undefined,
        reliabilityUpdatedAt: new Date(),
        replySlaSnapshot: parsed.data.replySlaSnapshot || null
      }
    }),
    db.storeStatusSnapshot.create({
      data: {
        storeId: parsed.data.storeId,
        acceptingSameDay: parsed.data.acceptingSameDay === "true",
        waitMinutes: parsed.data.waitMinutes,
        nextAvailableWindow: parsed.data.nextAvailableWindow || null,
        note: parsed.data.note || null,
        updatedBy: "store_board"
      }
    })
  ]);

  await db.auditLog.create({
    data: {
      actorRole: "store_board",
      targetType: "store_status_snapshot",
      targetId: parsed.data.storeId,
      action: "snapshot_updated",
      afterState: {
        acceptingSameDay: parsed.data.acceptingSameDay === "true",
        waitMinutes: parsed.data.waitMinutes,
        nextAvailableWindow: parsed.data.nextAvailableWindow || null,
        note: parsed.data.note || null,
        reliabilityMode: parsed.data.reliabilityMode,
        reliabilityState: parsed.data.reliabilityState,
        replySlaSnapshot: parsed.data.replySlaSnapshot || null
      }
    }
  });

  if (parsed.data.reliabilityMode === "auto") {
    await syncStoreReliability(parsed.data.storeId, "store_board_snapshot_updated");
  }

  return NextResponse.redirect(new URL("/store-board", request.url), {
    status: 303
  });
}
