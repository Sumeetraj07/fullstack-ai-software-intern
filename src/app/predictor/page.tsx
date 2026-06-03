"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Award,
  AlertCircle,
  MapPin,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

interface Recommendation {
  college: {
    id: string;
    name: string;
    location: string;
    fees: number;
    rating: number;
    image: string;
    overview: string;
  };
  branch: string;
  closingRank: number;
  exam: string;
  category: string;
  matchChance: "High" | "Medium" | "Low";
  matchPercent: number;
}

export default function PredictorPage() {
  const { addToast } = useApp();

  // Inputs
  const [exam, setExam] = useState("JEE Advanced");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");

  // Output
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const examsList = [
    { value: "JEE Advanced", label: "JEE Advanced (IITs)" },
    { value: "JEE Main", label: "JEE Main (NITs/IIITs)" },
    { value: "BITSAT", label: "BITSAT (BITS Pilani)" },
    { value: "NEET", label: "NEET (Medical Colleges)" },
    { value: "CAT", label: "CAT (IIMs Percentile)" },
    { value: "CUET", label: "CUET (Delhi Universities)" }
  ];

  const categoriesList = ["General", "OBC", "SC", "ST"];

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    const rankNum = parseInt(rank, 10);

    if (isNaN(rankNum) || rankNum <= 0) {
      addToast("Please enter a valid positive rank/score", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/predictor?exam=${encodeURIComponent(exam)}&rank=${rankNum}&category=${category}`
      );
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations);
        setHasSearched(true);
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to calculate predictions", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Failed to calculate predictions", "error");
    } finally {
      setLoading(false);
    }
  };

  // Group recommendations
  const safeties = recommendations.filter(r => r.matchChance === "High");
  const targets = recommendations.filter(r => r.matchChance === "Medium");
  const reaches = recommendations.filter(r => r.matchChance === "Low");

  const [activeResultsTab, setActiveResultsTab] = useState<"all" | "high" | "medium" | "low">("all");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
          <Award className="h-8 w-8 text-indigo-400" />
          <span>Cutoff Predictor Tool</span>
        </h1>
        <p className="text-slate-450 text-sm mt-1">
          Predict your admission chances based on historical closing cutoff ranks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Form Input */}
        <div className="bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl h-fit">
          <h2 className="text-lg font-bold text-white mb-6">Enter Your Score Details</h2>
          <form onSubmit={handlePredict} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Exam Type
              </label>
              <select
                value={exam}
                onChange={e => {
                  setExam(e.target.value);
                  // Default helper text
                  if (e.target.value === "CAT") setRank("99");
                  else if (e.target.value === "CUET") setRank("780");
                  else setRank("");
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none"
              >
                {examsList.map(item => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                {exam === "CAT" ? "CAT Percentile" : exam === "CUET" ? "CUET Score (out of 800)" : "Closing Rank"}
              </label>
              <input
                type="number"
                value={rank}
                onChange={e => setRank(e.target.value)}
                placeholder={exam === "CAT" ? "E.g. 99" : exam === "CUET" ? "E.g. 785" : "E.g. 150"}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none placeholder-slate-600"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {exam === "CAT"
                  ? "Enter your expected or actual CAT percentile (1-100)."
                  : exam === "CUET"
                  ? "Enter your combined CUET score (max 800)."
                  : "Enter your overall Category Rank."}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-350 focus:border-indigo-500 focus:outline-none"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span>Calculating probabilities...</span>
                </>
              ) : (
                <span>Predict Admission List</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Results Display */}
        <div className="lg:col-span-2 space-y-6">
          {!hasSearched ? (
            // Form placeholder before search
            <div className="border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-400 bg-slate-900/10 h-full flex flex-col justify-center items-center py-20">
              <Award className="h-12 w-12 text-slate-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">Calculation Results</h3>
              <p className="text-slate-450 text-sm max-w-sm leading-relaxed">
                Enter your exam, rank details, and category on the left panel, and click &quot;Predict Admission List&quot; to analyze your admission probability.
              </p>
            </div>
          ) : recommendations.length === 0 ? (
            // No results matching rank
            <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-850">
              <AlertCircle className="h-10 w-10 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No Matches Found</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Unfortunately, your rank is above the historical closing ranks for {exam} under the {category} category in our database. Try entering a lower rank number to test matching.
              </p>
            </div>
          ) : (
            // Results List
            <div className="space-y-6">
              {/* Category Probability breakdown */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <button
                  onClick={() => setActiveResultsTab("all")}
                  className={`p-4 rounded-xl border text-sm transition-all ${
                    activeResultsTab === "all"
                      ? "bg-slate-900 border-indigo-500/35 text-white"
                      : "bg-slate-900/40 border-slate-850 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-base font-extrabold block text-white">{recommendations.length}</span>
                  <span className="text-xs">Total Matches</span>
                </button>
                <button
                  onClick={() => setActiveResultsTab("high")}
                  className={`p-4 rounded-xl border text-sm transition-all ${
                    activeResultsTab === "high"
                      ? "bg-slate-900 border-emerald-500/35 text-white"
                      : "bg-slate-900/40 border-slate-850 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-base font-extrabold block text-emerald-450">{safeties.length}</span>
                  <span className="text-xs">Safeties (High)</span>
                </button>
                <button
                  onClick={() => setActiveResultsTab("medium")}
                  className={`p-4 rounded-xl border text-sm transition-all ${
                    activeResultsTab === "medium"
                      ? "bg-slate-900 border-indigo-500/35 text-white"
                      : "bg-slate-900/40 border-slate-850 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-base font-extrabold block text-indigo-400">{targets.length}</span>
                  <span className="text-xs">Targets (Medium)</span>
                </button>
              </div>

              {/* Recommendations Card List */}
              <div className="space-y-4">
                {(activeResultsTab === "all"
                  ? recommendations
                  : activeResultsTab === "high"
                  ? safeties
                  : activeResultsTab === "medium"
                  ? targets
                  : reaches
                ).map((rec, idx) => {
                  let badgeColor = "bg-rose-500/10 text-rose-450 border-rose-500/20";
                  let badgeText = "Reach (Low)";
                  if (rec.matchChance === "High") {
                    badgeColor = "bg-emerald-500/10 text-emerald-450 border-emerald-500/20";
                    badgeText = "Safety (High)";
                  } else if (rec.matchChance === "Medium") {
                    badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
                    badgeText = "Target (Medium)";
                  }

                  return (
                    <div
                      key={idx}
                      className="p-5 bg-slate-900 border border-slate-850 rounded-2xl hover:border-slate-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                          <img src={rec.college.image} alt={rec.college.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <Link href={`/colleges/${rec.college.id}`}>
                            <h3 className="font-bold text-white hover:text-indigo-400 transition-colors text-base leading-tight">
                              {rec.college.name}
                            </h3>
                          </Link>
                          <div className="flex items-center text-xs text-slate-450">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{rec.college.location}</span>
                          </div>
                          <div className="pt-2 text-xs">
                            <span className="text-slate-500">Predicted Branch: </span>
                            <span className="font-semibold text-slate-200">{rec.branch}</span>
                          </div>
                        </div>
                      </div>

                      {/* Probabilities gauge */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-slate-800/60 pt-4 md:pt-0 shrink-0">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-500 block mb-0.5">Historical Cutoff</span>
                          <span className="font-bold text-xs text-slate-300">
                            Closing rank: {rec.closingRank}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                            <div
                              style={{ width: `${rec.matchPercent}%` }}
                              className={`h-full ${
                                rec.matchChance === "High"
                                  ? "bg-emerald-500"
                                  : rec.matchChance === "Medium"
                                  ? "bg-indigo-500"
                                  : "bg-rose-500"
                              }`}
                            ></div>
                          </div>
                          
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${badgeColor}`}>
                            {badgeText} ({rec.matchPercent}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
