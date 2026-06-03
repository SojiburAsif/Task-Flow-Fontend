"use client";

import React from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Upload, ChevronDown, Eye, EyeOff } from 'lucide-react';
import Logo from '@/components/shared/logo/logo';
import { useTheme } from '@/components/provider/theme-provider';
import { registerAction } from '@/services/auth.service';
import { Role } from '@/app/constants/role';
import { uploadToImgbb } from '@/lib/imageUpload.utils';

const initialAuthState = {
  success: false,
  message: '',
};


export default function RegisterPage() {
  const [mounted, setMounted] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = React.useState<string | null>(null);
  const [imageUploadState, setImageUploadState] = React.useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const previewUrlRef = React.useRef<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === 'dark';
  const [state, formAction, isPending] = React.useActionState(registerAction, initialAuthState);
  const authState = state ?? initialAuthState;

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  React.useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden px-4 pb-6 pt-24 text-zinc-950 transition-colors duration-300 sm:pt-28 ${isDark ? 'bg-black text-zinc-100' : 'bg-zinc-50 text-zinc-950'}`}>
      <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_42%)]' : 'bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.08),transparent_42%)]'}`} />
      <div className={`relative mx-auto grid w-full max-w-4xl overflow-hidden border backdrop-blur-xl transition-colors duration-300 lg:grid-cols-[0.92fr_1.08fr] ${isDark ? 'border-zinc-800 bg-zinc-950/90 shadow-black/30' : 'border-zinc-200 bg-white/90 shadow-[0_24px_80px_rgba(0,0,0,0.08)]'}`}>
        <aside className="relative flex flex-col justify-between border-b border-zinc-200 bg-zinc-950 px-5 py-7 text-white dark:border-zinc-800 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="absolute inset-0 bg-zinc-950 opacity-100" />
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-purple-200 backdrop-blur-sm">
              Register Portal
            </div>
            <Logo />
            <div className="max-w-sm space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-300">
                Get started
              </p>
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">
                Create your account.
              </h1>
              <p className="text-xs leading-6 text-zinc-300 sm:text-sm">
                Register to manage projects, track progress, and keep every task in sync.
              </p>
            </div>
          </div>
        </aside>

        <section className={`flex items-center justify-center px-5 py-8 sm:px-8 ${isDark ? 'bg-zinc-950/40' : 'bg-white/40'}`}>
          <div className="w-full max-w-sm space-y-5">
            <div className="space-y-2">
              <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                Create account
              </p>
              <h2 className={`text-2xl font-black tracking-tight sm:text-[2rem] ${isDark ? 'text-zinc-50' : 'text-zinc-950'}`}>
                Join the system
              </h2>
              <p className={`text-sm leading-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Add your profile details to get started.
              </p>
            </div>

            <form action={formAction} className="space-y-3">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4.5 w-4.5 text-zinc-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  className={`block w-full border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500/20 ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-purple-500 dark:placeholder:text-zinc-500' : 'border-zinc-300 bg-white text-zinc-950 focus:border-purple-500'}`}
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4.5 w-4.5 text-zinc-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  className={`block w-full border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500/20 ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-purple-500 dark:placeholder:text-zinc-500' : 'border-zinc-300 bg-white text-zinc-950 focus:border-purple-500'}`}
                  placeholder="Email Address"
                  required
                />
              </div>

              <div>
                <label className={`mb-1.5 block text-xs font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Role
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <ChevronDown className="h-4.5 w-4.5 text-zinc-400" />
                  </div>
                  <select
                    name="role"
                    defaultValue={Role.TeamMember}
                    className={`block w-full appearance-none border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-purple-500/20 ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-purple-500 dark:placeholder:text-zinc-500' : 'border-zinc-300 bg-white text-zinc-950 focus:border-purple-500'}`}
                  >
                    <option value={Role.TeamMember}>Team Member</option>
                    <option value={Role.ProjectManager}>Project Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`mb-1.5 block text-xs font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Profile image
                </label>
                <div className={`space-y-3 border px-3 py-2.5 ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-300 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <Upload className="h-4.5 w-4.5 shrink-0 text-zinc-400" />
                    <input
                      type="file"
                      accept="image/*"
                      className={`block w-full text-sm file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-semibold ${isDark ? 'text-zinc-300 file:text-purple-400' : 'text-zinc-700 file:text-purple-600'}`}
                      onChange={async (event) => {
                        const file = event.currentTarget.files?.[0];

                        if (!file) {
                          if (previewUrlRef.current) {
                            URL.revokeObjectURL(previewUrlRef.current);
                            previewUrlRef.current = null;
                          }
                          setImagePreview(null);
                          setUploadedImageUrl(null);
                          setImageUploadState('');
                          return;
                        }

                        const nextUrl = URL.createObjectURL(file);
                        if (previewUrlRef.current) {
                          URL.revokeObjectURL(previewUrlRef.current);
                        }
                        previewUrlRef.current = nextUrl;
                        setImagePreview(nextUrl);

                        setIsUploadingImage(true);
                        setImageUploadState('Uploading image...');

                        try {
                          const uploadedUrl = await uploadToImgbb(file);
                          setUploadedImageUrl(uploadedUrl);
                          setImageUploadState('Image uploaded and ready to submit.');
                        } catch (error) {
                          setUploadedImageUrl(null);
                          setImageUploadState(error instanceof Error ? error.message : 'Image upload failed');
                        } finally {
                          setIsUploadingImage(false);
                        }
                      }}
                    />
                  </div>

                  <input type="hidden" name="image" value={uploadedImageUrl ?? ''} />

                  {imagePreview ? (
                    <div className={`flex items-center gap-3 border p-2 ${isDark ? 'border-zinc-700 bg-zinc-950/50' : 'border-zinc-200 bg-zinc-50'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Selected preview" className="h-14 w-14 object-cover" />
                      <div className="min-w-0">
                        <p className={`truncate text-sm font-semibold ${isDark ? 'text-zinc-100' : 'text-zinc-950'}`}>Selected image</p>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>This will upload to ImgBB on signup.</p>
                      </div>
                    </div>
                  ) : null}

                  {imageUploadState ? (
                    <p className={`text-xs ${imageUploadState.includes('failed') || imageUploadState.includes('Failed') ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {imageUploadState}
                    </p>
                  ) : null}
                </div>
                <p className={`mt-1.5 text-xs leading-5 ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  {isUploadingImage ? 'Uploading image to ImgBB...' : 'Upload an image now and we will send it to ImgBB during registration.'}
                </p>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4.5 w-4.5 text-zinc-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500/20 ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-purple-500 dark:placeholder:text-zinc-500' : 'border-zinc-300 bg-white text-zinc-950 focus:border-purple-500'}`}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className={`absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 transition-colors hover:text-purple-500 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4.5 w-4.5 text-zinc-400" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`block w-full border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 focus:ring-purple-500/20 ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-purple-500 dark:placeholder:text-zinc-500' : 'border-zinc-300 bg-white text-zinc-950 focus:border-purple-500'}`}
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className={`absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 transition-colors hover:text-purple-500 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className={`w-full border px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 focus:ring-2 focus:ring-purple-500/30 disabled:cursor-not-allowed disabled:opacity-70 ${isDark ? 'border-purple-500 bg-purple-500 text-zinc-950 hover:bg-purple-400' : 'border-purple-600 bg-purple-600 text-white hover:bg-purple-700'}`}
              >
                {isPending ? 'Creating account...' : 'Sign Up'}
              </button>

              {authState.message ? (
                <p className={`text-sm ${authState.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {authState.message}
                </p>
              ) : null}
            </form>

            <p className={`text-center text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Already have an account?{' '}
              <Link href="/login" className={`font-semibold transition-colors ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'}`}>
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}