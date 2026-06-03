"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Compass,
  Award,
  MessageSquare,
  GitCompare,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Heart,
  ChevronDown
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, compareIds, addToast, setUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        addToast("Logged out successfully", "success");
        router.push("/");
      } else {
        addToast("Failed to log out", "error");
      }
    } catch (error) {
      console.error("Logout error:", error);
      addToast("Failed to log out", "error");
    }
  };

  const navLinks = [
    { href: "/colleges", label: "Colleges", icon: Compass },
    { href: "/compare", label: "Compare", icon: GitCompare, badge: compareIds.length },
    { href: "/predictor", label: "Predictor", icon: Award },
    { href: "/forum", label: "Discussions", icon: MessageSquare }
  ];

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-all">
                C
              </span>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                CollegeDiscover
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-750 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard?tab=saved"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                      <span>Saved Colleges</span>
                    </Link>
                    <hr className="border-slate-700 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-white text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth?mode=login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/20 text-white transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 animate-in slide-in-from-top-5 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                    active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <hr className="border-slate-800 my-2" />
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Dashboard ({user.name})</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-red-400 hover:bg-slate-800 hover:text-white text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link
                  href="/auth?mode=login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth?mode=signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
