import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET as getMe } from "@/app/api/v1/me/route";
import { GET as getTodaySchedule } from "@/app/api/v1/schedule/today/route";
import { PATCH as updateStatus } from "@/app/api/v1/services/[id]/status/route";

describe("API v1 Route Handlers", () => {
  it("GET /api/v1/me returns 401 for unauthenticated requests", async () => {
    const res = await getMe();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("GET /api/v1/schedule/today returns 401 for unauthenticated requests", async () => {
    const res = await getTodaySchedule();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("PATCH /api/v1/services/:id/status rejects unauthorized calls or invalid status", async () => {
    const req = new NextRequest(
      "http://localhost:3001/api/v1/services/ord_123/status",
      {
        method: "PATCH",
        body: JSON.stringify({ status: "invalid_status" }),
      },
    );
    const res = await updateStatus(req, {
      params: Promise.resolve({ id: "ord_123" }),
    });
    // Either 401 (not logged in) or 400 (bad status payload)
    expect([400, 401]).toContain(res.status);
  });
});
