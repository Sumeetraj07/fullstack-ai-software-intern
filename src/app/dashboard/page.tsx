"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Heart,
  GitCompare,
  MapPin,
  Star,
  Trash2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface SavedCollege {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  image: string;
}

interface SavedComparison {
  id: string;
  collegeIds: string; // JSON string of string[]
  name: string;
  savedAt: string;
}

type TabType = "colleges" | "comparisons";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, toggleSaveCollege, addToast, fetchUser } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>("colleges");
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  
  const [loadingItems, setLoadingItems] = useState(true);

  // Fetch Dashboard Items
  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoadingItems(true);
    try {
      // 1. Fetch saved colleges
      const colRes = await fetch("/api/user/saved");
      let colsData: SavedCollege[] = [];
      if (colRes.ok) {
        colsData = await colRes.json();
        setSavedColleges(colsData);
      }

      // 2. Fetch saved comparisons
      const compRes = await fetch("/api/user/saved-comparisons");
      let compsData: SavedComparison[] = [];
      if (compRes.ok) {
        compsData = await compRes.json();
        setSavedComparisons(compsData);
      }
    } catch (e) {
      console.error(e);
      addToast("Failed to fetch dashboard items", "error");
    } finally {
      setLoadingItems(false);
    }
  }, [user, addToast]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?mode=login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      Promise.resolve().then(() => {
        fetchDashboardData();
      });
    }
  }, [user, fetchDashboardData]);

  const handleRemoveCollege = async (id: string) => {
    const success = await toggleSaveCollege(id);
    if (success) {
      setSavedColleges(prev => prev.filter(c => c.id !== id));
      // Refresh user context saved items
      fetchUser();
    }
  };

  const handleDeleteComparison = async (id: string) => {
    try {
      const res = await fetch(`/api/user/saved-comparisons?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        addToast("Comparison deleted successfully", "success");
        setSavedComparisons(prev => prev.filter(c => c.id !== id));
        fetchUser(); // Sync
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to delete comparison", "error");
      }
    } catch {
      addToast("An error occurred", "error");
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-10 w-1/3 bg-slate-900 rounded"></div>
        <div className="h-44 w-full bg-slate-900 rounded-2xl"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirects in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile summary banner */}
      <div className="bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-3xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-650 flex items-center justify-center font-black text-2xl text-white shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{user.name}</h1>
            <p className="text-slate-450 text-sm mt-0.5">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-center shrink-0">
          <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">Saved Colleges</span>
            <span className="font-extrabold text-white text-lg">{savedColleges.length}</span>
          </div>
          <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-850">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">Comparisons</span>
            <span className="font-extrabold text-white text-lg">{savedComparisons.length}</span>
          </div>
        </div>
      </div>

      {/* Tab select bar */}
      <div className="border-b border-slate-900 mb-8 flex space-x-6">
        <button
          onClick={() => setActiveTab("colleges")}
          className={`pb-4 border-b-2 font-bold text-sm uppercase tracking-wider transition-all flex items-center space-x-2 ${
            activeTab === "colleges"
              ? "border-indigo-500 text-white"
              : "border-transparent text-slate-450 hover:text-slate-200"
          }`}
        >
          <Heart className="h-4.5 w-4.5" />
          <span>Saved Colleges</span>
        </button>
        <button
          onClick={() => setActiveTab("comparisons")}
          className={`pb-4 border-b-2 font-bold text-sm uppercase tracking-wider transition-all flex items-center space-x-2 ${
            activeTab === "comparisons"
              ? "border-indigo-500 text-white"
              : "border-transparent text-slate-450 hover:text-slate-200"
          }`}
        >
          <GitCompare className="h-4.5 w-4.5" />
          <span>Saved Comparisons</span>
        </button>
      </div>

      {/* Lists */}
      {loadingItems ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map(idx => (
            <div key={idx} className="h-48 rounded-2xl bg-slate-900 border border-slate-850"></div>
          ))}
        </div>
      ) : activeTab === "colleges" ? (
        // Tab: Saved Colleges
        savedColleges.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 border border-slate-900 rounded-3xl">
            <Heart className="h-10 w-10 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No Saved Colleges</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
              You haven&apos;t saved any colleges to your dashboard yet. Browse the catalog to bookmark institutes.
            </p>
            <Link
              href="/colleges"
              className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 rounded-xl text-sm font-semibold text-white transition-all inline-block"
            >
              Browse Directory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedColleges.map(college => (
              <div
                key={college.id}
                className="group rounded-2xl bg-slate-900 border border-slate-850 overflow-hidden hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 w-full bg-slate-800 overflow-hidden">
                    <img src={college.image} alt={college.name} className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300" />
                    
                    {/* Delete bookmark button */}
                    <button
                      onClick={() => handleRemoveCollege(college.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-850 text-rose-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Rating */}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-850 flex items-center space-x-1 text-amber-400 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 shrink-0" />
                      <span>{college.rating}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <Link href={`/colleges/${college.id}`}>
                      <h3 className="font-bold text-white hover:text-indigo-400 transition-colors leading-tight mb-2">
                        {college.name}
                      </h3>
                    </Link>
                    <div className="flex items-center text-xs text-slate-450">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{college.location}</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-800/60 text-xs bg-slate-900/40">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Average Fees</span>
                    <span className="text-slate-200 font-bold">
                      {college.fees === 1628 ? "₹1.6K / yr" : `₹${(college.fees / 100000).toFixed(1)} Lakh / yr`}
                    </span>
                  </div>
                  <Link
                    href={`/colleges/${college.id}`}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 font-bold text-slate-200 hover:text-white transition-all"
                  >
                    View Campus
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Tab: Saved Comparisons
        savedComparisons.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 border border-slate-900 rounded-3xl">
            <GitCompare className="h-10 w-10 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No Saved Comparisons</h3>
            <p className="text-slate-450 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
              Compare 2-3 colleges side-by-side in the Compare sheet and save them here for quick access.
            </p>
            <Link
              href="/compare"
              className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 rounded-xl text-sm font-semibold text-white transition-all inline-block"
            >
              Start Comparing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedComparisons.map(comp => {
              const compIds = JSON.parse(comp.collegeIds) as string[];
              return (
                <div
                  key={comp.id}
                  className="p-6 bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-2xl flex items-center justify-between gap-6 transition-all duration-200"
                >
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-white text-base leading-snug">{comp.name}</h3>
                    <p className="text-xs text-slate-500">
                      Saved on: {new Date(comp.savedAt).toLocaleDateString()} • {compIds.length} Colleges
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Link
                      href={`/compare?ids=${compIds.join(",")}`}
                      className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-indigo-400 hover:text-white transition-colors"
                      title="Open Comparison Matrix"
                    >
                      <ExternalLink className="h-4.5 w-4.5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteComparison(comp.id)}
                      className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-rose-500 hover:bg-rose-950/20 hover:border-rose-900/30 transition-colors"
                      title="Delete saved comparison"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
