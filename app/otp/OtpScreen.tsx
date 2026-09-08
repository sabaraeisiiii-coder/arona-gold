"use client";
// Route screen implementation; page.tsx remains composition-only.
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StoreShell } from "../components/StoreShell";
import { Button } from "../components/ui/Button";
import { useAppStore } from "../store/AppStore";
import { authService } from "../services/auth.service";
import { ApiClientError } from "../services/api-client";
import { Input } from "../components/ui/Input";
export default function OtpPage() {
  const [code, setCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const pending = useRef(false);
  const { login, notify } = useAppStore();
  const router = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    const value = sessionStorage.getItem("pending-mobile");
    if (!value) router.replace("/login");
    else setMobile(value);
  }, [router]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending.current || !mobile || code.length !== 6) return;
    pending.current = true;
    setLoading(true);
    setError("");
    try {
      const { user } = await authService.verifyOtp(mobile, code);
      login(user);
      sessionStorage.removeItem("pending-mobile");
      sessionStorage.removeItem("debug-otp");
      const next = params.get("next");
      router.replace(
        next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
          ? next
          : "/account",
      );
    } catch (error) {
      setError(
        error instanceof ApiClientError ? error.message : "تأیید کد ناموفق بود",
      );
    } finally {
      pending.current = false;
      setLoading(false);
    }
  }
  async function resend() {
    if (pending.current || !mobile) return;
    pending.current = true;
    setResending(true);
    setError("");
    try {
      await authService.sendOtp(mobile);
      notify("کد جدید ارسال شد", "info");
    } catch (error) {
      setError(
        error instanceof ApiClientError
          ? error.message
          : "ارسال مجدد ناموفق بود",
      );
    } finally {
      pending.current = false;
      setResending(false);
    }
  }
  return (
    <StoreShell>
      <section className="auth-page">
        <form className="ds-card auth-card" onSubmit={submit}>
          <span className="brand">آرونا گلد.</span>
          <h1>کد تأیید</h1>
          <p>کد ارسال‌شده به {mobile || "شماره شما"} را وارد کنید.</p>
          <Input
            label="کد تأیید"
            error={error}
            autoComplete="one-time-code"
            name="otp"
            className="ds-input otp-field"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => { setCode(e.target.value.replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776)).replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632)).replace(/\D/g, "")); setError(""); }}
            placeholder="••••••"
          />
          <Button type="submit" loading={loading} disabled={resending || !mobile || code.length !== 6}>
            {loading ? "در حال بررسی…" : "تأیید و ورود"}
          </Button>
          <Button variant="secondary" loading={resending} disabled={loading || !mobile} onClick={resend}>
            ارسال مجدد کد
          </Button>
        </form>
      </section>
    </StoreShell>
  );
}
