"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@iconify/react";
import { toastApiErrors, toastValidationErrors } from "@/lib/apiErrorToast";
import { validateLoginForm, validateOtpInput } from "@/lib/formValidation";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading, login, verifyOtp } = useAuth();

  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [user, loading, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validationErrors = validateLoginForm(email, password);
    if (validationErrors.length > 0) {
      toastValidationErrors(validationErrors);
      setError(validationErrors[0]);
      return;
    }

    setPending(true);
    try {
      const result = await login(email, password);
      if (result.requiresOtp) {
        setStep("otp");
      } else {
        router.replace("/admin");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid credentials.";
      setError(msg);
      toastApiErrors(err, msg);
    } finally {
      setPending(false);
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const validationErrors = validateOtpInput(otp);
    if (validationErrors.length > 0) {
      toastValidationErrors(validationErrors);
      setError(validationErrors[0]);
      return;
    }

    setPending(true);
    try {
      await verifyOtp(email, otp);
      router.replace("/admin");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Invalid OTP.";
      setError(msg);
      toastApiErrors(err, msg);
    } finally {
      setPending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <Icon icon="mdi:loading" className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FDFCFB]">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 flex-col items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt="NEEZA"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-neutral-900/70" />
        <div className="relative z-10 text-center px-12">
          <h1 className="font-heading text-5xl font-bold text-white mb-4">NEEZA</h1>
          <p className="text-white/70 text-lg font-light max-w-md">
            Building sustainable futures through architecture, engineering, and design excellence.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-10">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-6">
              <Icon icon="mdi:office-building" className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-1">
              {step === "login" ? "Admin Login" : "Verify OTP"}
            </h2>
            <p className="text-sm text-neutral-500">
              {step === "login"
                ? "Sign in to your admin dashboard."
                : `Enter the 6-digit code sent to ${email}.`}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              <Icon icon="mdi:alert-circle-outline" className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Login form */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="admin@neeza.rw"
                value={email}
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                required
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
                >
                  <Icon icon={showPwd ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={18} />
                </button>
              </div>
              <Button type="submit" className="w-full h-12" disabled={pending}>
                {pending ? (
                  <Icon icon="mdi:loading" className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          {/* OTP form */}
          {step === "otp" && (
            <form onSubmit={handleOtp} className="space-y-5">
              <Input
                label="One-Time Password"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp((e.target as HTMLInputElement).value)}
                required
              />
              <Button type="submit" className="w-full h-12" disabled={pending}>
                {pending ? (
                  <Icon icon="mdi:loading" className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Verify"
                )}
              </Button>
              <button
                type="button"
                className="text-sm text-neutral-500 hover:text-primary transition-colors w-full text-center"
                onClick={() => { setStep("login"); setOtp(""); setError(""); }}
              >
                ← Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
