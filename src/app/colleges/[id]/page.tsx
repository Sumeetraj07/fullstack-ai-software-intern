"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import {
  MapPin,
  Star,
  Award,
  Heart,
  ChevronRight,
  PlusCircle,
  MessageCircle,
  CornerDownRight,
  ShieldAlert,
  GitCompare
} from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  durationYears: number;
  fees: number;
  seats: number;
}

interface Placement {
  id: string;
  year: number;
  highestPackage: number;
  averagePackage: number;
  medianPackage: number;
  placementPercentage: number;
  recruiters: string; // JSON string of string[]
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface Answer {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface Question {
  id: string;
  userName: string;
  title: string;
  content: string;
  createdAt: string;
  answers: Answer[];
}

interface CollegeDetails {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  image: string;
  overview: string;
  courses: Course[];
  placements: Placement[];
  reviews: Review[];
  questions: Question[];
}

type TabType = "overview" | "courses" | "placements" | "reviews" | "qa";

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, toggleSaveCollege, addToast } = useApp();

  // Detail state
  const [college, setCollege] = useState<CollegeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Question Form state
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Answer Forms state
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const fetchCollegeDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/colleges/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCollege(data);
      } else {
        addToast("Failed to fetch college details", "error");
      }
    } catch (error) {
      console.error("Fetch college details error:", error);
      addToast("Failed to fetch college details", "error");
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchCollegeDetails();
    });
  }, [fetchCollegeDetails]);

  // Actions
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("Please login to submit a review", "error");
      return;
    }
    if (reviewContent.trim().length < 10) {
      addToast("Review must be at least 10 characters", "error");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/colleges/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, content: reviewContent.trim() })
      });

      if (res.ok) {
        addToast("Review submitted successfully!", "success");
        setReviewContent("");
        fetchCollegeDetails(); // Refresh
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to submit review", "error");
      }
    } catch {
      addToast("An error occurred", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("Please login to ask a question", "error");
      return;
    }
    if (questionTitle.trim().length < 5 || questionContent.trim().length < 15) {
      addToast("Title (min 5 chars) & Details (min 15 chars) are required", "error");
      return;
    }

    setSubmittingQuestion(true);
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: questionTitle.trim(),
          content: questionContent.trim(),
          collegeId: id
        })
      });

      if (res.ok) {
        addToast("Question posted successfully!", "success");
        setQuestionTitle("");
        setQuestionContent("");
        fetchCollegeDetails(); // Refresh
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to post question", "error");
      }
    } catch {
      addToast("An error occurred", "error");
    } finally {
      setSubmittingQuestion(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (!user) {
      addToast("Please login to answer", "error");
      return;
    }
    if (answerContent.trim().length < 10) {
      addToast("Answer must be at least 10 characters", "error");
      return;
    }

    setSubmittingAnswer(true);
    try {
      const res = await fetch(`/api/qa/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerContent.trim() })
      });

      if (res.ok) {
        addToast("Answer posted successfully!", "success");
        setAnswerContent("");
        setAnsweringQuestionId(null);
        fetchCollegeDetails(); // Refresh
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to submit answer", "error");
      }
    } catch {
      addToast("An error occurred", "error");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const isSaved = () => {
    return user?.savedColleges?.includes(id) || false;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-64 w-full bg-slate-900 rounded-3xl"></div>
        <div className="h-10 w-2/3 bg-slate-900 rounded"></div>
        <div className="h-6 w-1/3 bg-slate-900 rounded"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">College Not Found</h2>
        <p className="text-slate-450 mb-6">The requested college detail could not be loaded or doesn&apos;t exist.</p>
        <Link href="/colleges" className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 rounded-xl font-semibold text-sm text-white transition-all">
          Browse College Directory
        </Link>
      </div>
    );
  }

  // Helper values
  const latestPlacement = college.placements[0] || null;

  return (
    <div className="relative pb-16">
      {/* College Banner Hero */}
      <div className="relative h-72 md:h-96 w-full bg-slate-900">
        <img src={college.image} alt={college.name} className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        {/* Banner Details */}
        <div className="absolute bottom-0 inset-x-0 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
              <Link href="/colleges" className="hover:underline">Colleges</Link>
              <ChevronRight className="h-3 w-3" />
              <span>Details</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{college.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-slate-400 shrink-0" />
                <span>{college.location}</span>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-slate-600 hidden sm:block"></div>
              <div className="flex items-center space-x-1.5 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-100">{college.rating}</span>
                <span className="text-slate-500 text-xs">({college.reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => toggleSaveCollege(college.id)}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-850 font-semibold text-sm transition-all text-slate-200"
            >
              <Heart className={`h-4.5 w-4.5 ${isSaved() ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
              <span>{isSaved() ? "Saved" : "Save College"}</span>
            </button>
            <Link
              href={`/compare?ids=${college.id}`}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm transition-all text-white shadow-lg shadow-indigo-600/10"
            >
              <GitCompare className="h-4.5 w-4.5" />
              <span>Compare</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-900 bg-slate-900/20 backdrop-blur sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-none py-1">
            {(["overview", "courses", "placements", "reviews", "qa"] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 font-bold text-sm uppercase tracking-wider shrink-0 transition-all ${
                  activeTab === tab
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab === "qa" ? "Q&A Forum" : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">About</h2>
                  <p className="text-slate-350 text-base leading-relaxed whitespace-pre-line">{college.overview}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/60">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Average Fee</span>
                    <span className="text-lg font-extrabold text-slate-200">
                      {college.fees === 1628 ? "₹1.6K / yr" : `₹${(college.fees / 100000).toFixed(2)} Lakh / yr`}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Courses Offered</span>
                    <span className="text-lg font-extrabold text-slate-200">{college.courses.length} Streams</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1 font-semibold">Highest Package</span>
                    <span className="text-lg font-extrabold text-emerald-400">
                      {latestPlacement ? `₹${latestPlacement.highestPackage} LPA` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Courses */}
            {activeTab === "courses" && (
              <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6">Courses & Seat Capacities</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-xs">
                        <th className="pb-4 pr-4">Course Name</th>
                        <th className="pb-4 px-4 text-center">Duration</th>
                        <th className="pb-4 px-4 text-center">Seats</th>
                        <th className="pb-4 pl-4 text-right">Annual Fees</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-350">
                      {college.courses.map(course => (
                        <tr key={course.id} className="hover:bg-slate-950/20 transition-colors">
                          <td className="py-4 pr-4 font-semibold text-white">{course.name}</td>
                          <td className="py-4 px-4 text-center">{course.durationYears} Years</td>
                          <td className="py-4 px-4 text-center">{course.seats}</td>
                          <td className="py-4 pl-4 text-right font-bold text-slate-200">
                            {course.fees === 1628 ? "₹1,628" : `₹${course.fees.toLocaleString()}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Placements */}
            {activeTab === "placements" && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl">
                  <h2 className="text-xl font-bold text-white mb-6">Placement Packages</h2>
                  {college.placements.length === 0 ? (
                    <p className="text-slate-400 text-sm">No placement data available.</p>
                  ) : (
                    <div className="space-y-8">
                      {college.placements.map(p => (
                        <div key={p.id} className="p-5 rounded-xl bg-slate-950 border border-slate-850 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
                              Placement Year: {p.year}
                            </span>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                              Placed: {p.placementPercentage}%
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="py-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">Highest</span>
                              <span className="text-base font-extrabold text-slate-200">₹{p.highestPackage} LPA</span>
                            </div>
                            <div className="py-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">Average</span>
                              <span className="text-base font-extrabold text-slate-200">₹{p.averagePackage} LPA</span>
                            </div>
                            <div className="py-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">Median</span>
                              <span className="text-base font-extrabold text-slate-200">₹{p.medianPackage} LPA</span>
                            </div>
                          </div>

                          {p.recruiters && (
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2 font-bold">Top Corporate Recruiters</span>
                              <div className="flex flex-wrap gap-1.5">
                                {(JSON.parse(p.recruiters) as string[]).map((r, i) => (
                                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Submit review */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl">
                  <h2 className="text-lg font-bold text-white mb-4">Post a Campus Review</h2>
                  {user ? (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">Select Rating</span>
                        <div className="flex space-x-1.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="text-amber-400 hover:scale-110 transition-transform"
                            >
                              <Star className={`h-6 w-6 ${reviewRating >= star ? "fill-amber-400" : ""}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <textarea
                          rows={4}
                          value={reviewContent}
                          onChange={e => setReviewContent(e.target.value)}
                          placeholder="Tell us about the courses, campus life, mess, placements, sports, etc..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-550 focus:border-indigo-500 focus:outline-none"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/10"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-center text-sm text-slate-400">
                      <span>Please </span>
                      <Link href="/auth?mode=login" className="text-indigo-400 hover:underline font-bold">login</Link>
                      <span> to leave a review.</span>
                    </div>
                  )}
                </div>

                {/* Display Reviews */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-6">
                  <h2 className="text-lg font-bold text-white">Student Reviews ({college.reviews.length})</h2>
                  {college.reviews.length === 0 ? (
                    <p className="text-slate-400 text-sm">No reviews yet. Be the first to share your experience!</p>
                  ) : (
                    <div className="divide-y divide-slate-800 space-y-6">
                      {college.reviews.map(review => (
                        <div key={review.id} className="pt-6 first:pt-0 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{review.userName}</span>
                            <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-400 font-bold text-xs">
                              <Star className="h-3.5 w-3.5 fill-amber-400 shrink-0" />
                              <span>{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-slate-350 leading-relaxed">{review.content}</p>
                          <span className="text-[10px] text-slate-500 block pt-1">
                            Posted on: {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Q&A Forum */}
            {activeTab === "qa" && (
              <div className="space-y-6">
                {/* Ask a Question */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl">
                  <h2 className="text-lg font-bold text-white mb-4">Ask the Community</h2>
                  {user ? (
                    <form onSubmit={handleQuestionSubmit} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          value={questionTitle}
                          onChange={e => setQuestionTitle(e.target.value)}
                          placeholder="Brief title for your question (e.g. Cutoff for OBC CSE?)"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-550 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={4}
                          value={questionContent}
                          onChange={e => setQuestionContent(e.target.value)}
                          placeholder="Provide details about your query..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-550 focus:border-indigo-500 focus:outline-none"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={submittingQuestion}
                        className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all"
                      >
                        {submittingQuestion ? "Posting..." : "Post Question"}
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-center text-sm text-slate-400">
                      <span>Please </span>
                      <Link href="/auth?mode=login" className="text-indigo-400 hover:underline font-bold">login</Link>
                      <span> to ask questions.</span>
                    </div>
                  )}
                </div>

                {/* Questions List */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-6">
                  <h2 className="text-lg font-bold text-white">Discussions ({college.questions.length})</h2>
                  {college.questions.length === 0 ? (
                    <p className="text-slate-400 text-sm">No discussions started for this college yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-800 space-y-6">
                      {college.questions.map(q => (
                        <div key={q.id} className="pt-6 first:pt-0 space-y-3">
                          <div className="space-y-1">
                            <h3 className="text-base font-bold text-white flex items-center space-x-2">
                              <MessageCircle className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                              <span>{q.title}</span>
                            </h3>
                            <p className="text-xs text-slate-500">
                              Asked by <span className="font-semibold">{q.userName}</span> • {new Date(q.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <p className="text-sm text-slate-350 pl-6 leading-relaxed border-l-2 border-slate-800">
                            {q.content}
                          </p>

                          {/* Answers */}
                          {q.answers.length > 0 && (
                            <div className="pl-6 space-y-3 pt-2">
                              {q.answers.map(ans => (
                                <div key={ans.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5">
                                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
                                    <CornerDownRight className="h-3.5 w-3.5 text-slate-500" />
                                    <span>{ans.userName}</span>
                                    <span className="text-[10px] text-slate-500 font-normal">
                                      • {new Date(ans.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-300 pl-5">{ans.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Inline Reply Form */}
                          <div className="pl-6 pt-2">
                            {answeringQuestionId === q.id ? (
                              <form onSubmit={e => handleAnswerSubmit(e, q.id)} className="space-y-2">
                                <textarea
                                  rows={2}
                                  value={answerContent}
                                  onChange={e => setAnswerContent(e.target.value)}
                                  placeholder="Write your answer..."
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-550 focus:border-indigo-500 focus:outline-none"
                                ></textarea>
                                <div className="flex space-x-2">
                                  <button
                                    type="submit"
                                    disabled={submittingAnswer}
                                    className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-[11px] font-semibold text-white rounded-lg transition-all"
                                  >
                                    Submit Answer
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setAnsweringQuestionId(null)}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-[11px] font-semibold text-slate-300 rounded-lg transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : user ? (
                              <button
                                onClick={() => {
                                  setAnsweringQuestionId(q.id);
                                  setAnswerContent("");
                                }}
                                className="text-xs text-indigo-400 hover:text-indigo-350 font-bold flex items-center space-x-1.5 hover:underline"
                              >
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span>Answer this question</span>
                              </button>
                            ) : (
                              <span className="text-xs text-slate-500">
                                Login to answer.
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Side Sidebar (Quick info) */}
          <aside className="space-y-6">
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl">
              <h3 className="font-bold text-white mb-4 text-base">Key Highlights</h3>
              <div className="space-y-4 text-sm text-slate-350">
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-500">Avg Placement</span>
                  <span className="font-bold text-slate-200">{latestPlacement ? `₹${latestPlacement.averagePackage} LPA` : "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-500">Placement Record</span>
                  <span className="font-bold text-slate-200">{latestPlacement ? `${latestPlacement.placementPercentage}%` : "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-500">Reviews Rating</span>
                  <span className="font-bold text-slate-200 flex items-center text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400 mr-1 shrink-0" />
                    <span>{college.rating} / 5.0</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Cutoffs view */}
            {college.courses.some(c => c.name.toLowerCase().includes("b.tech")) && (
              <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-4 text-base flex items-center space-x-2">
                  <Award className="h-4.5 w-4.5 text-indigo-400" />
                  <span>Cutoff Ranks</span>
                </h3>
                <div className="space-y-3">
                  {college.id === "col-iit-bombay" && (
                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold text-white">
                        <span>JEE Advanced</span>
                        <span className="text-indigo-400">OBC / Gen</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Computer Science</span>
                        <span>25 / 67</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Electrical Engineering</span>
                        <span>- / 290</span>
                      </div>
                    </div>
                  )}
                  {college.id === "col-iit-delhi" && (
                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold text-white">
                        <span>JEE Advanced</span>
                        <span className="text-indigo-400">Gen Closing</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Computer Science</span>
                        <span>110</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Math & Computing</span>
                        <span>320</span>
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 text-center">
                    Use our <Link href="/predictor" className="text-indigo-400 hover:underline">Predictor Tool</Link> to check target eligibility matching your rank.
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
