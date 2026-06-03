"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  GitCompare,
  Plus,
  Trash2,
  Bookmark,
  MapPin,
  Star,
  DollarSign,
  TrendingUp,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  fees: number;
}

interface Placement {
  id: string;
  year: number;
  highestPackage: number;
  averagePackage: number;
  medianPackage: number;
  placementPercentage: number;
  recruiters: string; // JSON string
}

interface ComparedCollege {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  image: string;
  courses: Course[];
  placements: Placement[];
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { compareIds, removeFromCompare, clearCompare, addToCompare, user, addToast } = useApp();

  const [colleges, setColleges] = useState<ComparedCollege[]>([]);
  const [loading, setLoading] = useState(true);

  // Search dropdown states
  const [allCollegeList, setAllCollegeList] = useState<{ id: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Save comparison state
  const [comparisonName, setComparisonName] = useState("");
  const [submittingSave, setSubmittingSave] = useState(false);

  // 1. Fetch search list for adding colleges
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch("/api/colleges?limit=30");
        if (res.ok) {
          const data = await res.json();
          setAllCollegeList(data.items.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
        }
      } catch {
        // Ignored
      }
    };
    fetchList();
  }, []);

  // 2. Fetch compared colleges details
  const fetchComparedColleges = useCallback(async () => {
    // Determine IDs from URL param first, fallback to context compareIds
    const urlIds = searchParams.get("ids");
    const activeIds = urlIds
      ? urlIds.split(",").filter(Boolean)
      : compareIds;

    if (activeIds.length === 0) {
      setColleges([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/compare?ids=${activeIds.join(",")}`);
      if (res.ok) {
        const data = await res.json();
        setColleges(data);
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to load compared colleges", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Failed to load compared colleges", "error");
    } finally {
      setLoading(false);
    }
  }, [searchParams, compareIds, addToast]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchComparedColleges();
    });
  }, [fetchComparedColleges]);

  // Synchronize URL and Context
  const updateURLWithIds = useCallback((ids: string[]) => {
    if (ids.length === 0) {
      router.replace("/compare", { scroll: false });
    } else {
      router.replace(`/compare?ids=${ids.join(",")}`, { scroll: false });
    }
  }, [router]);

  const handleRemove = (id: string) => {
    removeFromCompare(id);
    const updatedIds = compareIds.filter(cid => cid !== id);
    updateURLWithIds(updatedIds);
  };

  const handleClear = () => {
    clearCompare();
    updateURLWithIds([]);
  };

  const handleAddCollege = (id: string) => {
    const success = addToCompare(id);
    if (success) {
      const updatedIds = [...compareIds, id];
      updateURLWithIds(updatedIds);
    }
    setShowDropdown(false);
    setSearchQuery("");
  };

  // Find competitive metrics
  const getBestFees = () => {
    if (colleges.length < 2) return null;
    return Math.min(...colleges.map(c => c.fees));
  };

  const getBestPlacement = () => {
    if (colleges.length < 2) return null;
    const packages = colleges.map(c => {
      const p = c.placements[0];
      return p ? p.averagePackage : 0;
    });
    return Math.max(...packages);
  };

  const getBestRating = () => {
    if (colleges.length < 2) return null;
    return Math.max(...colleges.map(c => c.rating));
  };

  const bestFees = getBestFees();
  const bestPlacement = getBestPlacement();
  const bestRating = getBestRating();

  // Save comparison action
  const handleSaveComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("Please login to save comparisons", "error");
      return;
    }
    if (colleges.length < 2) {
      addToast("Please select at least 2 colleges to compare before saving", "error");
      return;
    }
    if (!comparisonName.trim()) {
      addToast("Please enter a name for this comparison", "error");
      return;
    }

    setSubmittingSave(true);
    try {
      const ids = colleges.map(c => c.id);
      const res = await fetch("/api/user/saved-comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeIds: ids, name: comparisonName.trim() })
      });

      if (res.ok) {
        addToast("Comparison saved successfully!", "success");
        setComparisonName("");
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to save comparison", "error");
      }
    } catch {
      addToast("An error occurred", "error");
    } finally {
      setSubmittingSave(false);
    }
  };

  // Filter dropdown college list
  const filteredSearchList = allCollegeList.filter(
    item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !colleges.some(c => c.id === item.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-900 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <GitCompare className="h-7 w-7 text-indigo-400" />
            <span>Compare Colleges</span>
          </h1>
          <p className="text-slate-450 text-sm mt-1">
            Analyze fees structure, placement stats, and rankings side-by-side.
          </p>
        </div>

        {colleges.length > 0 && (
          <button
            onClick={handleClear}
            className="mt-4 md:mt-0 text-slate-450 hover:text-rose-400 text-sm font-semibold flex items-center space-x-1.5 transition-colors border border-slate-800 hover:border-rose-950 px-4 py-2 rounded-xl bg-slate-900"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Selection</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="space-y-10">
        {/* Selection Bar & Save Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add College Selector */}
          <div className="relative bg-slate-900 border border-slate-850 p-6 rounded-2xl">
            <label className="text-sm font-bold text-white block mb-2">
              Add College to Comparison
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search college by name to add..."
                className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-550"
              />
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-4 bg-slate-800 border border-slate-750 hover:bg-slate-750 rounded-xl text-slate-300 font-bold"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Dropdown Result list */}
            {showDropdown && searchQuery && (
              <div className="absolute left-6 right-6 mt-1 rounded-xl bg-slate-800 border border-slate-750 shadow-2xl z-55 max-h-48 overflow-y-auto">
                {filteredSearchList.length === 0 ? (
                  <div className="p-3 text-xs text-slate-500 text-center">No colleges found</div>
                ) : (
                  filteredSearchList.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleAddCollege(item.id)}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      {item.name}
                    </button>
                  ))
                )}
              </div>
            )}
            <p className="text-[10px] text-slate-500 mt-2">
              You can select a maximum of 3 colleges to compare at the same time.
            </p>
          </div>

          {/* Save comparison form */}
          {colleges.length >= 2 && (
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl">
              <label className="text-sm font-bold text-white block mb-2">
                Save Comparison List
              </label>
              {user ? (
                <form onSubmit={handleSaveComparison} className="flex gap-2">
                  <input
                    type="text"
                    value={comparisonName}
                    onChange={e => setComparisonName(e.target.value)}
                    placeholder="E.g. IIT Delhi vs BITS Pilani"
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-550"
                  />
                  <button
                    type="submit"
                    disabled={submittingSave}
                    className="px-5 bg-indigo-650 hover:bg-indigo-600 rounded-xl text-sm font-semibold text-white shadow-md shadow-indigo-600/10 transition-all flex items-center space-x-1.5 shrink-0"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>{submittingSave ? "Saving..." : "Save"}</span>
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-450 text-center leading-relaxed">
                  <span>Please </span>
                  <Link href="/auth?mode=login" className="text-indigo-400 hover:underline font-bold">login</Link>
                  <span> to save this comparison list.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comparison Sheets */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2].map(idx => (
              <div key={idx} className="h-96 rounded-2xl bg-slate-900 border border-slate-850"></div>
            ))}
          </div>
        ) : colleges.length === 0 ? (
          // Empty State
          <div className="text-center py-20 bg-slate-900/30 border border-slate-900 rounded-3xl">
            <GitCompare className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No Colleges Selected</h3>
            <p className="text-slate-455 text-sm max-w-sm mx-auto mb-6">
              Add colleges using the search dropdown above or select &quot;Compare&quot; from the search catalog to view side-by-side parameters.
            </p>
            <Link
              href="/colleges"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold text-white transition-all inline-block"
            >
              Browse Directory
            </Link>
          </div>
        ) : (
          /* Comparison Cards Table */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {colleges.map(college => {
              const latestPlacement = college.placements[0] || null;
              
              // Winner flags
              const isBestFee = bestFees !== null && college.fees === bestFees;
              const isBestPlacement = bestPlacement !== null && latestPlacement && latestPlacement.averagePackage === bestPlacement;
              const isBestRating = bestRating !== null && college.rating === bestRating;

              return (
                <div
                  key={college.id}
                  className="rounded-2xl bg-slate-900 border border-slate-850 overflow-hidden flex flex-col justify-between hover:border-slate-750 transition-all duration-200"
                >
                  <div>
                    {/* Header Image & Name */}
                    <div className="relative h-32 w-full overflow-hidden bg-slate-800">
                      <img src={college.image} alt={college.name} className="h-full w-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                      <button
                        onClick={() => handleRemove(college.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-850 hover:text-red-400 text-slate-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-6">
                      <Link href={`/colleges/${college.id}`}>
                        <h3 className="text-lg font-black text-white hover:text-indigo-400 transition-colors leading-tight mb-2">
                          {college.name}
                        </h3>
                      </Link>

                      <div className="flex items-center text-xs text-slate-450 mb-6">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{college.location}</span>
                      </div>

                      {/* Side-by-Side Parameter Matrix */}
                      <div className="space-y-6 text-sm">
                        {/* Rating Row */}
                        <div className={`p-3 rounded-xl border ${
                          isBestRating
                            ? "bg-amber-500/5 border-amber-500/20 text-amber-400"
                            : "bg-slate-950 border-slate-850 text-slate-350"
                        }`}>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Reviews Rating</span>
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-amber-400 shrink-0 text-amber-400" />
                              <span>{college.rating} / 5.0</span>
                            </span>
                            {isBestRating && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 flex items-center space-x-1 shrink-0 uppercase tracking-wider">
                                <Sparkles className="h-2.5 w-2.5" />
                                <span>Highest</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Fees Row */}
                        <div className={`p-3 rounded-xl border ${
                          isBestFee
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                            : "bg-slate-950 border-slate-850 text-slate-350"
                        }`}>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Average Fees</span>
                          <div className="flex items-center justify-between font-extrabold">
                            <span>
                              {college.fees === 1628 ? "₹1,628 / yr" : `₹${(college.fees / 100000).toFixed(2)} Lakh / yr`}
                            </span>
                            {isBestFee && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 flex items-center space-x-1 shrink-0 uppercase tracking-wider">
                                <DollarSign className="h-2.5 w-2.5" />
                                <span>Lowest</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Placements Row */}
                        <div className={`p-3 rounded-xl border ${
                          isBestPlacement
                            ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-400"
                            : "bg-slate-950 border-slate-850 text-slate-350"
                        }`}>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Avg Placement Package</span>
                          <div className="flex items-center justify-between font-extrabold">
                            <span>
                              {latestPlacement ? `₹${latestPlacement.averagePackage} LPA` : "N/A"}
                            </span>
                            {isBestPlacement && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500 text-white flex items-center space-x-1 shrink-0 uppercase tracking-wider">
                                <TrendingUp className="h-2.5 w-2.5" />
                                <span>Highest</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Recruiters snippet */}
                        {latestPlacement && (
                          <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Key Corporate Partners</span>
                            <div className="flex flex-wrap gap-1">
                              {(JSON.parse(latestPlacement.recruiters) as string[]).slice(0, 3).map((r, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-6 pt-2">
                    <Link
                      href={`/colleges/${college.id}`}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 font-bold text-sm text-slate-200 hover:text-white text-center transition-all block border border-slate-750"
                    >
                      View Full Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <React.Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading comparison details...</div>}>
      <CompareContent />
    </React.Suspense>
  );
}
