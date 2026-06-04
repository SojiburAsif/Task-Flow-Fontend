import { NextRequest, NextResponse } from "next/server";
import { updateProject } from "@/services/project.service";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const payload = {
      name: body.name,
      description: body.description,
      deadline: body.deadline,
      status: body.status,
      memberIds: body.memberIds,
    };

    const updated = await updateProject(id, payload);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
