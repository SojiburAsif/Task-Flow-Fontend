import React from "react";
import { getUsers } from "@/services/user.service";
import type { UserProfile } from "@/services/user.service";
import { updateUserByAdminAction, deleteUserByAdminAction } from "@/services/user.actions";

export default async function AllMemberPage() {
  const users = (await getUsers()) || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">All Members</h1>
      <div className="space-y-3">
        {users.length === 0 && <div>No users found.</div>}
        {users.map((u: UserProfile) => (
          <div key={u.id} className="p-3 border rounded-md flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name || u.email}</div>
              <div className="text-sm text-muted-foreground">{u.email} • {u.role} • {u.status}</div>
            </div>

            <div className="flex items-center gap-2">
              <form action={updateUserByAdminAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={u.id} />
                <select name="role" defaultValue={u.role} className="border rounded px-2 py-1">
                  <option value="ADMIN">Admin</option>
                  <option value="ProjectManager">ProjectManager</option>
                  <option value="TeamMember">TeamMember</option>
                </select>

                <select name="status" defaultValue={u.status} className="border rounded px-2 py-1">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>

                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
              </form>

              <form action={deleteUserByAdminAction} method="post">
                <input type="hidden" name="id" value={u.id} />
                <button type="submit" className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
