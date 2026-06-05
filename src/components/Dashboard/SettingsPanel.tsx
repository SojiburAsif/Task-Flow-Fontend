"use client";

import { useActionState, useEffect, useState } from "react";
import { Camera, ImagePlus, KeyRound, Save, ShieldCheck, UserRound, Mail, Link2, Lock, X } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CurrentUser } from "@/lib/currentUser";
import { createLocalImagePreview, formatFileSize, isImageFile } from "@/lib/avatar.utils";
import {
  changeSettingsPasswordAction,
  updateSettingsProfileAction,
  type SettingsActionState,
} from "@/services/settings.actions";

type SettingsPanelProps = {
  user: CurrentUser;
  title: string;
  description: string;
  roleLabel: string;
};

const initialState: SettingsActionState = { success: false, message: "" };

export function SettingsPanel({ user, title, description, roleLabel }: SettingsPanelProps) {
  const [profileState, profileAction, profilePending] = useActionState(updateSettingsProfileAction, initialState);
  const [passwordState, passwordAction, passwordPending] = useActionState(changeSettingsPasswordAction, initialState);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(user.image ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image ?? null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }
    };
  }, [previewObjectUrl]);

  useEffect(() => {
    if (!profileState.message) return;
    if (profileState.success) toast.success(profileState.message);
    else toast.error(profileState.message);
  }, [profileState]);

  useEffect(() => {
    if (!passwordState.message) return;
    if (passwordState.success) toast.success(passwordState.message);
    else toast.error(passwordState.message);
  }, [passwordState]);

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Border Glow Effect (Fixed Line-to gradient to standard Tailwind CSS) */}
      <div className="absolute inset-x-4 top-0 h-0.5 bg-linear-to-r from-transparent via-purple-500/80 to-transparent" />

      {/* Header Info Section */}
      <div className="space-y-2 border-b border-zinc-100 pb-6 dark:border-zinc-800/60">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-600 dark:text-purple-400">
          {roleLabel}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        {/* Card 1: Profile Settings */}
        <Card className="overflow-hidden border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/20 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-950/40">
          <CardHeader className="border-b border-zinc-100 bg-linear-to-r from-purple-50 via-white to-zinc-50 p-6 sm:p-8 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900/60">
            <CardTitle className="flex items-center gap-2.5 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              <UserRound className="h-5 w-5 text-purple-500" />
              Profile Settings
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mt-1.5">
              Update your display details used across dashboard cards and audit records.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form action={profileAction} className="space-y-5">
              <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    {avatarPreview ? (
                      <div
                        role="img"
                        aria-label="Avatar preview"
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${avatarPreview})` }}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-linear-to-br from-purple-500 to-fuchsia-500 text-white">
                        <Camera className="h-7 w-7" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Upload a new avatar</p>
                    <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">Choose an image file to upload directly to ImgBB. A URL is still supported as fallback.</p>
                    {selectedAvatar ? (
                      <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
                        <ImagePlus className="h-3.5 w-3.5" />
                        <span className="max-w-48 truncate">{selectedAvatar.name}</span>
                        <span className="opacity-70">{formatFileSize(selectedAvatar.size)}</span>
                        <button type="button" onClick={() => setSelectedAvatar(null)} className="ml-1 inline-flex items-center rounded-full p-0.5 hover:bg-purple-200/70 dark:hover:bg-purple-500/20" aria-label="Clear selected avatar">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-name" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Name</Label>
                <div className="relative">
                  <UserRound className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-400" />
                  <Input 
                    id="settings-name" 
                    name="name" 
                    defaultValue={user.name} 
                    placeholder="Your full name" 
                    required 
                    className="pl-10 h-11 rounded-xl border-zinc-200/80 bg-zinc-50/30 focus:bg-white transition-all dark:border-zinc-800 dark:bg-zinc-900/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-email" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-400" />
                  <Input 
                    id="settings-email" 
                    value={user.email} 
                    disabled 
                    readOnly 
                    className="pl-10 h-11 rounded-xl bg-zinc-100/80 border-zinc-200 text-zinc-500 cursor-not-allowed dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-avatar" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Avatar file</Label>
                <div className="relative rounded-2xl border border-zinc-200/80 bg-zinc-50/30 p-3 transition-all hover:border-purple-300 dark:border-zinc-800 dark:bg-zinc-900/30">
                  <Input
                    id="settings-avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="h-auto border-0 bg-transparent p-0 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-purple-700"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      if (previewObjectUrl) {
                        URL.revokeObjectURL(previewObjectUrl);
                      }

                      setSelectedAvatar(file);
                      if (file && isImageFile(file)) {
                        const url = createLocalImagePreview(file);
                        setPreviewObjectUrl(url);
                        setAvatarPreview(url);
                      } else {
                        setPreviewObjectUrl(null);
                        setAvatarPreview(user.image ?? null);
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">PNG, JPG, WEBP supported. File upload will be sent to ImgBB automatically.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-image" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Avatar URL fallback</Label>
                <div className="relative">
                  <Link2 className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-400" />
                  <Input
                    id="settings-image"
                    name="image"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="pl-10 h-11 rounded-xl border-zinc-200/80 bg-zinc-50/30 focus:bg-white transition-all dark:border-zinc-800 dark:bg-zinc-900/30"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl bg-purple-600 font-bold text-white hover:bg-purple-700 shadow-sm transition-all focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-950 mt-2" 
                disabled={profilePending}
              >
                <Save className="mr-2 h-4 w-4" />
                {profilePending ? "Uploading..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Card 2: Security Settings */}
        <Card className="overflow-hidden border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/20 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-950/40">
          <CardHeader className="border-b border-zinc-100 bg-linear-to-r from-zinc-50 via-white to-purple-50 p-6 sm:p-8 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900/60">
            <CardTitle className="flex items-center gap-2.5 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              <KeyRound className="h-5 w-5 text-purple-500" />
              Security Settings
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mt-1.5">
              Rotate password and optionally revoke active sessions on other devices.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form action={passwordAction} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-400" />
                  <Input 
                    id="current-password" 
                    name="currentPassword" 
                    type="password" 
                    required 
                    className="pl-10 h-11 rounded-xl border-zinc-200/80 bg-zinc-50/30 transition-all dark:border-zinc-800 dark:bg-zinc-900/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-400" />
                  <Input 
                    id="new-password" 
                    name="newPassword" 
                    type="password" 
                    required 
                    className="pl-10 h-11 rounded-xl border-zinc-200/80 bg-zinc-50/30 transition-all dark:border-zinc-800 dark:bg-zinc-900/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-400" />
                  <Input 
                    id="confirm-password" 
                    name="confirmPassword" 
                    type="password" 
                    required 
                    className="pl-10 h-11 rounded-xl border-zinc-200/80 bg-zinc-50/30 transition-all dark:border-zinc-800 dark:bg-zinc-900/30"
                  />
                </div>
              </div>

              {/* Revoke Sessions Checkbox Container */}
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/20">
                <label className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    name="revokeOtherSessions" 
                    className="h-4 w-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-900" 
                  />
                  <div>
                    <span className="block font-semibold">Revoke other active sessions</span>
                    <span className="block text-xs font-normal text-zinc-400 mt-0.5">Logs you out from all other browsers and active devices.</span>
                  </div>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl bg-zinc-900 font-bold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm transition-all mt-2" 
                disabled={passwordPending}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                {passwordPending ? "Updating security..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}