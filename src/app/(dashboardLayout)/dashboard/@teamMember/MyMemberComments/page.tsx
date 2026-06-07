import React from "react";

import CommentCenter from "@/components/Dashboard/CommentCenter";
import { getCurrentUser } from "@/lib/currentUser";
import { getAllTaskComments } from "@/services/comment.service";

export default async function MyMemberComments() {
  const [comments, user] = await Promise.all([getAllTaskComments({ page: 1, limit: 100 }), getCurrentUser()]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CommentCenter
        mode="feed"
        title="My Task Comments"
        description="Review the comments attached to your assigned work and open any comment in a modal for the full context."
        initialComments={comments?.items ?? []}
        currentUser={user}
        allowCompose={false}
      />
    </div>
  );
}
