"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Search,
  MapPin,
  Star,
  Filter,
  RefreshCw,
  GitCompare,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface CollegeItem {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  image: string;
  overview: string;
  courses?: unknown[];
  placements?: unknown[];
}

function CollegesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { compareIds, addToCompare, removeFromCompare, toggleSaveCollege, user } = useApp();

  // URL Initial State
  const initialSearch = searchParams.get("search") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  // States
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [feesRange, setFeesRange] = useState<number>(1500000); // Max fee slider
  const [minRating, setMinRating] = useState<number>(0);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(6);

  const [colleges, setColleges] = useState<CollegeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Locations for dropdown (from mock dataset areas)
  const locationsList = [
    { value: "", label: "All Locations" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Pilani", label: "Pilani" },
    { value: "Trichy", label: "Trichy" },
    { value: "Ahmedabad", label: "Ahmedabad" },
    { value: "Bengaluru", label: "Bengaluru" }
  ];

  // Fetch API
  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (location) query.append("location", location);
      if (feesRange < 1500000) query.append("maxFees", feesRange.toString());
      if (minRating > 0) query.append("minRating", minRating.toString());
      query.append("page", page.toString());
      query.append("limit", limit.toString());

      const res = await fetch(`/api/colleges?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setColleges(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
    } finally {
      setLoading(false);
    }
  }, [search, location, feesRange, minRating, page, limit]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchColleges();
    });
    
    // Update URL query parameters
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (page > 1) params.set("page", page.toString());
    
    const newQuery = params.toString();
    router.replace(`/colleges${newQuery ? "?" + newQuery : ""}`, { scroll: false });
  }, [fetchColleges, router, search, location, page]);

  const handleResetFilters = () => {
    setSearch("");
    setLocation("");
    setFeesRange(1500000);
    setMinRating(0);
    setPage(1);
  };

  const handleCompareCheckbox = (id: string, checked: boolean) => {
    if (checked) {
      addToCompare(id);
    } else {
      removeFromCompare(id);
    }
  };

  const isSaved = (collegeId: string) => {
    return user?.savedColleges?.includes(collegeId) || false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">College Directory</h1>
          <p className="text-slate-400 text-sm mt-1">
            Showing {loading ? "..." : total} institutes matching your search filters.
          </p>
        </div>

        {compareIds.length > 0 && (
          <Link
            href="/compare"
            className="mt-4 md:mt-0 flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm text-white shadow-lg shadow-indigo-600/20 transition-all self-start animate-bounce"
          >
            <GitCompare className="h-4.5 w-4.5" />
            <span>Compare Selected ({compareIds.length})</span>
          </Link>
        )}
      </div>

      {/* Main Search Panel */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Desktop Filters */}
        <aside className="hidden lg:block w-72 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit sticky top-20">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <h2 className="font-bold text-white flex items-center space-x-2 text-base">
              <Filter className="h-4.5 w-4.5 text-indigo-400" />
              <span>Filters</span>
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-450 hover:text-indigo-400 transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* Location Select */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Location
              </label>
              <select
                value={location}
                onChange={e => { setLocation(e.target.value); setPage(1); }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-350 focus:border-indigo-500 focus:outline-none"
              >
                {locationsList.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>

            {/* Annual Fees Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Max Annual Fee
                </label>
                <span className="text-xs font-bold text-indigo-400">
                  {feesRange >= 1500000 ? "No limit" : `₹${(feesRange / 100000).toFixed(1)}L`}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={1500000}
                step={50000}
                value={feesRange}
                onChange={e => { setFeesRange(parseInt(e.target.value)); setPage(1); }}
                className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>₹50K</span>
                <span>₹7.5L</span>
                <span>₹15L+</span>
              </div>
            </div>

            {/* Rating Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Minimum Rating
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[0, 3, 4, 4.5, 4.8].map(val => (
                  <button
                    key={val}
                    onClick={() => { setMinRating(val); setPage(1); }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      minRating === val
                        ? "bg-indigo-600 text-white border-indigo-500"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {val === 0 ? "All" : `${val}★`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Search and Listings */}
        <div className="flex-grow">
          {/* Main Search Bar */}
          <div className="mb-6">
            <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl focus-within:border-indigo-500 transition-all">
              <div className="flex-grow flex items-center px-3 py-2">
                <Search className="h-5 w-5 text-slate-450 mr-3 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by college name, overview, city..."
                  className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder-slate-500"
                />
              </div>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-350 rounded-xl mr-1 text-sm font-medium flex items-center space-x-1"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="lg:hidden p-5 bg-slate-900 border border-slate-800 rounded-2xl mb-6 space-y-4 animate-in slide-in-from-top-3 duration-250">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-sm">Filter Options</h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-indigo-400"
                >
                  Clear All
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Location</label>
                <select
                  value={location}
                  onChange={e => { setLocation(e.target.value); setPage(1); }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-350"
                >
                  {locationsList.map(loc => (
                    <option key={loc.value} value={loc.value}>{loc.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400">Max Annual Fee</label>
                  <span className="text-xs text-indigo-400">
                    {feesRange >= 1500000 ? "No limit" : `₹${(feesRange / 100000).toFixed(1)}L`}
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={1500000}
                  step={50000}
                  value={feesRange}
                  onChange={e => { setFeesRange(parseInt(e.target.value)); setPage(1); }}
                  className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Min Rating</label>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 3, 4, 4.5, 4.8].map(val => (
                    <button
                      key={val}
                      onClick={() => { setMinRating(val); setPage(1); }}
                      className={`py-1.5 rounded-lg text-xs font-bold border ${
                        minRating === val
                          ? "bg-indigo-600 text-white border-indigo-500"
                          : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      {val === 0 ? "All" : `${val}★`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Listings Section */}
          {loading ? (
            // Loading Skeletons
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="rounded-2xl border border-slate-850 bg-slate-900/60 p-6 space-y-4 animate-pulse">
                  <div className="h-44 w-full bg-slate-800 rounded-xl"></div>
                  <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
                  <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                  <div className="h-10 w-full bg-slate-800 rounded-xl mt-4"></div>
                </div>
              ))}
            </div>
          ) : colleges.length === 0 ? (
            // No Results
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-850">
              <RefreshCw className="h-10 w-10 text-slate-500 mx-auto mb-4 animate-spin-slow" />
              <h3 className="text-lg font-bold text-white mb-1">No Colleges Found</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any colleges matching your active filters. Try broadening your keywords or resetting constraints.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-sm text-indigo-400 font-semibold transition-all border border-slate-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            // College Card Grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colleges.map(college => {
                const isCompared = compareIds.includes(college.id);
                const isCollegeSavedItem = isSaved(college.id);

                return (
                  <div
                    key={college.id}
                    className={`group rounded-2xl bg-slate-900 border overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-all duration-200 ${
                      isCompared ? "border-indigo-500/50 shadow-lg shadow-indigo-600/5" : "border-slate-850 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                        <img
                          src={college.image}
                          alt={college.name}
                          className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />

                        {/* Top controls: Checkbox and Save */}
                        <div className="absolute top-3 left-3 flex space-x-2">
                          <label className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-slate-850/60 backdrop-blur-md cursor-pointer select-none text-[11px] font-bold text-slate-200">
                            <input
                              type="checkbox"
                              checked={isCompared}
                              onChange={e => handleCompareCheckbox(college.id, e.target.checked)}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500/30 h-3.5 w-3.5 bg-slate-800 focus:ring-0"
                            />
                            <span>Compare</span>
                          </label>
                        </div>

                        <div className="absolute top-3 right-3 flex space-x-1">
                          {/* Save toggle */}
                          <button
                            onClick={() => toggleSaveCollege(college.id)}
                            className="p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-850 hover:bg-slate-900 transition-colors"
                          >
                            <Heart
                              className={`h-4 w-4 transition-all ${
                                isCollegeSavedItem ? "fill-rose-500 text-rose-500" : "text-slate-400 hover:text-white"
                              }`}
                            />
                          </button>
                          
                          {/* Rating display */}
                          <div className="px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-850 flex items-center space-x-1 text-amber-400 text-xs font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-400 shrink-0" />
                            <span>{college.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5">
                        <Link href={`/colleges/${college.id}`}>
                          <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-indigo-400 transition-colors">
                            {college.name}
                          </h3>
                        </Link>

                        <div className="flex items-center text-slate-400 text-xs mb-3">
                          <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-slate-500" />
                          <span>{college.location}</span>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                          {college.overview}
                        </p>
                      </div>
                    </div>

                    {/* Footer Info Row */}
                    <div className="px-5 pb-5 pt-3 border-t border-slate-800/60 bg-slate-900/40 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Average Fees</span>
                        <span className="text-slate-200 font-bold text-sm">
                          {college.fees === 1628 ? "₹1,628 / yr" : `₹${(college.fees / 100000).toFixed(2)} Lakh / yr`}
                        </span>
                      </div>
                      <Link
                        href={`/colleges/${college.id}`}
                        className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 font-bold text-slate-200 hover:text-white transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-bold border transition-all ${
                    page === pageNum
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10"
                      : "bg-slate-900 text-slate-400 border-slate-850 hover:border-slate-800 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-lg bg-slate-900 border border-slate-850 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <React.Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading colleges list...</div>}>
      <CollegesContent />
    </React.Suspense>
  );
}
