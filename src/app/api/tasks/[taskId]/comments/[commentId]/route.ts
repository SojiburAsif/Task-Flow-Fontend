import { NextRequest, NextResponse } from "next/server";

import { requestCommentsDetailed } from "@/services/comment.service";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ taskId: string; commentId: string }> }) {
	const { taskId, commentId } = await params;
	const deleted = await requestCommentsDetailed<null>(`/tasks/${taskId}/comments/${commentId}`, {
		method: "DELETE",
	});

	if (!deleted) {
		return NextResponse.json({ success: false, message: "Failed to delete comment" }, { status: 500 });
	}

	return NextResponse.json(
		deleted.ok
			? { success: true, data: null }
			: { success: false, message: deleted.message ?? "Failed to delete comment" },
		{ status: deleted.status },
	);
}