"use client";

import React from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined" || !document) return null;
  return createPortal(<>{children}</>, document.body);
}
