import React from "react";

import CommentCenter from "@/components/Dashboard/CommentCenter";
import { getCurrentUser } from "@/lib/currentUser";
import { getAllTaskComments } from "@/services/comment.service";

export default async function AllComments() {
    const [comments, user] = await Promise.all([getAllTaskComments({ page: 1, limit: 100 }), getCurrentUser()]);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <CommentCenter
                mode="feed"
                title="All Comments"
                description="Review every task comment in the system, open a single comment in a modal, and delete anything that needs moderation."
                initialComments={comments?.items ?? []}
                currentUser={user}
                allowCompose={false}
                allowDeleteAny
            />
        </div>
    );
}
