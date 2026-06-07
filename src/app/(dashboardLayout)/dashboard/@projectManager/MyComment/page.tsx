import React from "react";

import CommentCenter from "@/components/Dashboard/CommentCenter";
import { getCurrentUser } from "@/lib/currentUser";
import { getAllTaskComments } from "@/services/comment.service";

export default async function MyComments() {
  const [comments, user] = await Promise.all([getAllTaskComments({ page: 1, limit: 100 }), getCurrentUser()]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CommentCenter
        mode="feed"
        title="My Comments"
        description="Read the comments linked to the projects you manage, open each one in a modal, and remove your own entries when needed."
        initialComments={comments?.items ?? []}
        currentUser={user}
        allowCompose={false}
      />
    </div>
  );
}
