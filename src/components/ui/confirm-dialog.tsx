"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  loading = false,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div initial={{ scale: 0.98, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 8 }} className="w-full max-w-md rounded-none bg-white shadow-2xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
            <div className="p-5">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{title}</h3>
              {description ? <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p> : null}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 p-4 dark:border-zinc-800">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-zinc-200 bg-white rounded-none dark:border-zinc-700 dark:bg-zinc-900">{cancelLabel}</button>
              <button onClick={onConfirm} disabled={loading} className="px-4 py-2 text-sm font-bold bg-rose-600 text-white rounded-none disabled:opacity-60">{loading ? 'Processing...' : confirmLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
