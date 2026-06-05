/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useActionState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "@/services/user.service";
import { updateUserByAdminAction_fromState, deleteUserByAdminAction_fromState } from "@/services/user.actions";
import { Save, Trash2, UserCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  user: UserProfile;
};

export default function MemberRow({ user }: Props) {
  const [updateState, updateAction, updatePending] = useActionState(updateUserByAdminAction_fromState as any, { success: false, message: "" });
  const [deleteState, deleteAction, deletePending] = useActionState(deleteUserByAdminAction_fromState as any, { success: false, message: "" });

  const deleteFormRef = useRef<HTMLFormElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);


  const canDelete = user.role === "TeamMember";

  useEffect(() => {
    if (updateState) {
      if (updateState.success) toast.success(updateState.message || "User updated successfully");
      else if (updateState.message) toast.error(updateState.message);
    }
  }, [updateState]);

  useEffect(() => {
    if (deleteState) {
      if (deleteState.success) toast.success(deleteState.message || "User removed from workspace");
      else if (deleteState.message) toast.error(deleteState.message);
    }
  }, [deleteState]);

  return (
    <div className="flex flex-wrap items-center gap-3 border-t pt-3.5 md:border-t-0 md:pt-0 border-zinc-100 dark:border-zinc-900 w-full md:w-auto justify-end">
      {/* Update form */}
      <form action={updateAction} className="flex items-center gap-3 flex-1 sm:flex-none w-full sm:w-auto">
        <input type="hidden" name="id" value={user.id} />
        <input type="hidden" name="role" value={user.role} />

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              name="status"
              defaultValue={user.status}
              disabled={updatePending || deletePending}
              className="appearance-none bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-purple-500"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <UserCheck size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" disabled={updatePending || deletePending} className="inline-flex items-center gap-2">
            {updatePending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>Save</span>
          </Button>
        </div>
      </form>

      {/* Delete */}
      <form ref={el => { deleteFormRef.current = el }} action={deleteAction} className="shrink-0">
        <input type="hidden" name="id" value={user.id} />
        <Button
          asChild={false}
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => {
            if (!canDelete) {
              toast.error("Cannot delete Admins or Project Managers from here.");
              return;
            }
            setConfirmOpen(true);
          }}
          disabled={updatePending || deletePending || !canDelete}
          title={canDelete ? "Delete user from workspace" : "Deletion disabled for this user"}
        >
          {deletePending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </Button>
      </form>

      {confirmOpen && createPortal(
        <div className="fixed inset-0 z-60 grid place-items-center px-4 py-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border bg-white p-6 dark:bg-zinc-950 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-center">Confirm delete</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Are you sure you want to remove <span className="font-semibold">{user.name || user.email}</span> from the workspace? This action cannot be undone.</p>

            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button
                type="button"
                onClick={() => {
                  // submit the existing form which has the server action
                  try {
                    // prefer requestSubmit if available to honor form validation
                    if (deleteFormRef.current?.requestSubmit) {
                      deleteFormRef.current.requestSubmit();
                    } else {
                      deleteFormRef.current?.submit();
                    }
                    setConfirmOpen(false);
                  } catch (err) {
                    console.error(err);
                    setConfirmOpen(false);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white"
              >
                {deletePending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}