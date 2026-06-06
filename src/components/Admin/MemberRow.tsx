/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useActionState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "@/services/user.service";
import { updateUserByAdminAction_fromState, deleteUserByAdminAction_fromState } from "@/services/user.actions";
import { Save, Trash2, UserCheck, Loader2, AlertTriangle, X } from "lucide-react";

type Props = {
  user: UserProfile;
};

export default function MemberRow({ user }: Props) {
  const [updateState, updateAction, updatePending] = useActionState(updateUserByAdminAction_fromState as any, { success: false, message: "" });
  const [deleteState, deleteAction, deletePending] = useActionState(deleteUserByAdminAction_fromState as any, { success: false, message: "" });

  const deleteFormRef = useRef<HTMLFormElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const canDelete = user.role === "TeamMember" || user.role === "TEAM_MEMBER";

  // স্ট্যাটাস বা রোল আপডেটের টোস্ট ট্রিগার
  useEffect(() => {
    if (updateState) {
      if (updateState.success) toast.success(updateState.message || "User updated successfully");
      else if (updateState.message) toast.error(updateState.message);
    }
  }, [updateState]);

  // ডিলিট অ্যাকশনের সাকসেস/এরর টোস্ট ট্রিগার (setState সরানো হয়েছে)
  useEffect(() => {
    if (deleteState) {
      if (deleteState.success) {
        toast.success(deleteState.message || "User removed from workspace");
      } else if (deleteState.message) {
        toast.error(deleteState.message);
      }
    }
  }, [deleteState]);

  // কনফার্মেশন হ্যান্ডলার (সরাসরি ইন্টারঅ্যাকশনের সাথে মডাল স্টেট ম্যানেজ করা)
  const handleDeleteSubmit = () => {
    // ক্যাসকেডিং রেন্ডার এড়াতে সাবমিট করার আগেই মডাল বন্ধ করা হলো
    setConfirmOpen(false);
    
    startTransition(async () => {
      try {
        if (deleteFormRef.current?.requestSubmit) {
          deleteFormRef.current.requestSubmit();
        } else if (deleteFormRef.current) {
          // Fallback for older browsers: create a temporary submit button and click it
          const btn = document.createElement("button");
          btn.type = "submit";
          btn.style.display = "none";
          deleteFormRef.current.appendChild(btn);
          try {
            btn.click();
          } finally {
            btn.remove();
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 border-t pt-4 md:border-t-0 md:pt-0 border-zinc-100 dark:border-zinc-800 w-full md:w-auto justify-end">
      
      {/* Update Form (Sharp Elements) */}
      <form action={updateAction} className="flex items-center gap-2 flex-1 sm:flex-none w-full sm:w-auto">
        <input type="hidden" name="id" value={user.id} />
        <input type="hidden" name="role" value={user.role} />

        <div className="relative flex-1 sm:flex-none">
          <select
            name="status"
            defaultValue={user.status}
            disabled={updatePending || deletePending || isPending}
            className="appearance-none w-full sm:w-auto bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-none px-3 py-2 text-[10px] font-black uppercase tracking-wider outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-zinc-900 dark:text-zinc-100 cursor-pointer disabled:opacity-50"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <UserCheck size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        </div>

        <button 
          type="submit" 
          disabled={updatePending || deletePending || isPending} 
          className="inline-flex items-center justify-center gap-1.5 bg-purple-600 text-white border border-purple-700 px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-none hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 h-[34px]"
        >
          {updatePending ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          <span>Save</span>
        </button>
      </form>

      {/* Delete Action Form */}
      <form ref={(el) => { deleteFormRef.current = el; }} action={deleteAction} className="shrink-0">
        <input type="hidden" name="id" value={user.id} />
        <button
          type="button"
          onClick={() => {
            if (!canDelete) {
              toast.error("Cannot delete Admins or Project Managers from here.");
              return;
            }
            setConfirmOpen(true);
          }}
          disabled={updatePending || deletePending || isPending || !canDelete}
          title={canDelete ? "Delete user from workspace" : "Deletion disabled for this user"}
          className="inline-flex h-[34px] w-[34px] items-center justify-center border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:border-rose-600 dark:hover:text-white transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deletePending || isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </form>

      {/* =========================================
          CONFIRMATION MODAL (Sharp Brutalist)
      ============================================= */}
      {confirmOpen && createPortal(
        <div className="fixed inset-0 z-60 grid place-items-center px-4 py-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          
          <div className="relative z-10 w-full max-w-md rounded-none border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-500">
                <AlertTriangle size={18} strokeWidth={2.5} />
                <h3 className="text-[11px] font-black uppercase tracking-widest">Confirm Deletion</h3>
              </div>
              <button onClick={() => setConfirmOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-center">
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Are you sure you want to remove <span className="font-bold text-zinc-900 dark:text-white">{user.name || user.email}</span> from the workspace?
              </p>
              <p className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                This action is permanent and cannot be undone.
              </p>
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-900 dark:bg-zinc-900/20">
              <button 
                type="button" 
                onClick={() => setConfirmOpen(false)} 
                disabled={deletePending || isPending}
                className="border border-zinc-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 rounded-none disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button
                type="button"
                disabled={deletePending || isPending}
                onClick={handleDeleteSubmit}
                className="inline-flex items-center gap-2 border border-rose-700 bg-rose-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-rose-700 rounded-none disabled:opacity-50"
              >
                {deletePending || isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deletePending || isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}