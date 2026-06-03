"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Lock, Mail, User as UserIcon, ShieldCheck } from "lucide-react";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, setUser, addToast } = useApp();

  const isLogin = searchParams.get("mode") !== "signup";

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      addToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const payload = isLogin ? { email, password } : { email, password, name };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        addToast(data.message || "Welcome!", "success");
        // Fetch full profile details
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          setUser(meData.user);
        }
        router.push("/dashboard");
      } else {
        addToast(data.error || "Authentication failed", "error");
      }
    } catch (error) {
      console.error(error);
      addToast("An error occurred during authentication", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    router.replace(`/auth?mode=${isLogin ? "signup" : "login"}`, { scroll: false });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-md w-full bg-slate-900 border border-slate-850 p-8 rounded-3xl shadow-2xl space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-600/10 text-indigo-400 mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-slate-450 leading-relaxed">
            {isLogin
              ? "Login to access saved colleges, compare lists, and write reviews."
              : "Register to save comparisons, predict eligibility, and post in forum."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus-within:border-indigo-500 transition-all">
                <UserIcon className="h-4.5 w-4.5 text-slate-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="E.g. Jatin Sharma"
                  className="w-full bg-transparent border-none text-white focus:outline-none placeholder-slate-650"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus-within:border-indigo-500 transition-all">
              <Mail className="h-4.5 w-4.5 text-slate-500 mr-2 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E.g. demo@college.com"
                className="w-full bg-transparent border-none text-white focus:outline-none placeholder-slate-650"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus-within:border-indigo-500 transition-all">
              <Lock className="h-4.5 w-4.5 text-slate-500 mr-2 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters..."
                className="w-full bg-transparent border-none text-white focus:outline-none placeholder-slate-650"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-sm font-semibold rounded-xl text-white shadow-lg shadow-indigo-600/10 transition-all"
          >
            {loading ? "Authenticating..." : isLogin ? "Login Account" : "Sign Up"}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs text-indigo-400 hover:text-indigo-350 hover:underline font-semibold"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-white">Loading...</div>}>
      <AuthContent />
    </React.Suspense>
  );
}
