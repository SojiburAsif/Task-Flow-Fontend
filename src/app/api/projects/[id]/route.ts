import { NextResponse } from "next/server";
import { updateProject } from "@/services/project.service";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
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
  } catch (err: any) {
    const message = err?.message || String(err);
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
