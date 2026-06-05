"use client";

import { useActionState, useEffect, useState } from "react";
import { Camera, ImagePlus, KeyRound, Save, ShieldCheck, UserRound, Mail, Lock, X, Eye, EyeOff } from "lucide-react";
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image ?? null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <section className="relative mx-auto w-full max-w-7xl space-y-8 overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-x-4 top-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/80 to-transparent" />
      <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-24 left-0 h-64 w-64 bg-zinc-500/10 blur-3xl dark:bg-purple-500/10" />

      {/* Header Section (Sharp Edges) */}
      <div className="relative overflow-hidden border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur rounded-none dark:border-zinc-800 dark:bg-zinc-950/90 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-zinc-500/5 dark:from-purple-500/10 dark:to-transparent" />
        <div className="relative flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="inline-flex border border-purple-500/30 bg-purple-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-purple-700 rounded-none dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-400">
              {roleLabel}
            </p>
            <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>

          <div className="inline-flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-700 rounded-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-purple-500" />
            Account settings and security controls
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        {/* Card 1: Profile Settings */}
        <Card className="overflow-hidden border border-zinc-200 bg-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/30 hover:shadow-lg rounded-none dark:border-zinc-800 dark:bg-zinc-950">
          <CardHeader className="border-b border-zinc-200 bg-zinc-50 p-6 sm:p-8 rounded-none dark:border-zinc-800 dark:bg-zinc-900/50">
            <CardTitle className="flex items-center gap-2.5 text-xl font-bold text-zinc-900 dark:text-white">
              <UserRound className="h-5 w-5 text-purple-500" />
              Profile Settings
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mt-1.5">
              Update your display details used across dashboard cards and audit records.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form action={profileAction} className="space-y-5">
              <div className="border border-dashed border-zinc-300 bg-zinc-50/60 p-4 rounded-none dark:border-zinc-700 dark:bg-zinc-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-zinc-300 bg-white shadow-sm rounded-none dark:border-zinc-700 dark:bg-zinc-900">
                    {avatarPreview ? (
                      <div
                        role="img"
                        aria-label="Avatar preview"
                        className="h-full w-full bg-cover bg-center rounded-none"
                        style={{ backgroundImage: `url(${avatarPreview})` }}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white rounded-none">
                        <Camera className="h-7 w-7" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Upload a new avatar</p>
                      <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400 mt-1">PNG, JPG, WEBP supported. Your uploaded image will be previewed here automatically.</p>
                    </div>
                    
                    {/* Fixed File Input (Screenshot Fix) */}
                    <input
                      id="settings-avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-zinc-500 dark:text-zinc-400 cursor-pointer focus:outline-none
                        file:mr-4 file:py-2 file:px-4 file:border-0
                        file:bg-purple-600 file:text-white file:font-bold file:rounded-none
                        hover:file:bg-purple-700 dark:file:bg-purple-600 dark:hover:file:bg-purple-700
                        transition-colors"
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

                    {selectedAvatar ? (
                      <div className="inline-flex items-center gap-2 border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 rounded-none dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300">
                        <ImagePlus className="h-3.5 w-3.5 shrink-0" />
                        <span className="max-w-[120px] sm:max-w-48 truncate">{selectedAvatar.name}</span>
                        <span className="opacity-70 shrink-0">{formatFileSize(selectedAvatar.size)}</span>
                        <button type="button" onClick={() => setSelectedAvatar(null)} className="ml-1 inline-flex items-center p-0.5 hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors" aria-label="Clear selected avatar">
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
                    className="h-11 border border-zinc-300 bg-zinc-50/50 pl-10 text-zinc-950 transition-all placeholder:text-zinc-400 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-none dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white"
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
                    className="h-11 border border-zinc-200 bg-zinc-100 pl-10 text-zinc-500 cursor-not-allowed rounded-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-purple-600 font-bold text-white hover:bg-purple-700 shadow-none transition-all rounded-none mt-2" 
                disabled={profilePending}
              >
                <Save className="mr-2 h-4 w-4" />
                {profilePending ? "Uploading..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Card 2: Security Settings */}
        <Card className="overflow-hidden border border-zinc-200 bg-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/30 hover:shadow-lg rounded-none dark:border-zinc-800 dark:bg-zinc-950">
          <CardHeader className="border-b border-zinc-200 bg-zinc-50 p-6 sm:p-8 rounded-none dark:border-zinc-800 dark:bg-zinc-900/50">
            <CardTitle className="flex items-center gap-2.5 text-xl font-bold text-zinc-900 dark:text-white">
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
                <Label htmlFor="current-password" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-400" />
                  <Input 
                    id="current-password" 
                    name="currentPassword" 
                    type={showCurrentPassword ? "text" : "password"} 
                    required 
                    className="h-11 border border-zinc-300 bg-zinc-50/50 pl-10 pr-10 text-zinc-950 transition-all placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-none dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white"
                  />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-3 my-auto text-zinc-400 hover:text-zinc-600 transition-colors dark:hover:text-zinc-300" aria-label="Toggle visibility">
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">New Password</Label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-400" />
                  <Input 
                    id="new-password" 
                    name="newPassword" 
                    type={showNewPassword ? "text" : "password"} 
                    required 
                    className="h-11 border border-zinc-300 bg-zinc-50/50 pl-10 pr-10 text-zinc-950 transition-all placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-none dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white"
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-3 my-auto text-zinc-400 hover:text-zinc-600 transition-colors dark:hover:text-zinc-300" aria-label="Toggle visibility">
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-400" />
                  <Input 
                    id="confirm-password" 
                    name="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    required 
                    className="h-11 border border-zinc-300 bg-zinc-50/50 pl-10 pr-10 text-zinc-950 transition-all placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-none dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-white"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 my-auto text-zinc-400 hover:text-zinc-600 transition-colors dark:hover:text-zinc-300" aria-label="Toggle visibility">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Revoke Sessions Checkbox Container */}
              <div className="border border-zinc-300 bg-zinc-50 p-4 rounded-none dark:border-zinc-700 dark:bg-zinc-900/50">
                <label className="flex cursor-pointer select-none items-start sm:items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <input 
                    type="checkbox" 
                    name="revokeOtherSessions" 
                    className="mt-0.5 sm:mt-0 h-4 w-4 shrink-0 rounded-none border-zinc-300 text-purple-600 focus:ring-purple-500 dark:border-zinc-600 dark:bg-zinc-900 dark:checked:bg-purple-500" 
                  />
                  <div>
                    <span className="block font-bold text-zinc-900 dark:text-zinc-100">Revoke other active sessions</span>
                    <span className="block text-xs font-normal text-zinc-500 dark:text-zinc-400 mt-1">Logs you out from all other browsers and active devices.</span>
                  </div>
                </label>
              </div>

              <Button 
                type="submit" 
                className="mt-2 h-11 w-full bg-zinc-900 font-bold text-white shadow-none transition-all hover:bg-zinc-800 rounded-none dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200" 
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