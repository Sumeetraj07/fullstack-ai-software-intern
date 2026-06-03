"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import {
  MessageSquare,
  Search,
  MessageCircle,
  CornerDownRight,
  PlusCircle,
  HelpCircle,
  Filter
} from "lucide-react";

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
  collegeId: string | null;
  college?: { name: string } | null;
  answers: Answer[];
}

export default function ForumPage() {
  const { user, addToast } = useApp();

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");

  // Post Question form states
  const [showPostForm, setShowPostForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCollegeId, setNewCollegeId] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Answer form states
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Fetch Questions
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedCollegeId
        ? `/api/qa?collegeId=${selectedCollegeId}`
        : "/api/qa";
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCollegeId]);

  // Fetch Colleges list for dropdowns
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("/api/colleges?limit=30");
        if (res.ok) {
          const data = await res.json();
          setColleges(data.items.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchColleges();
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchQuestions();
    });
  }, [fetchQuestions]);

  // Actions
  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("Please login to post questions", "error");
      return;
    }
    if (newTitle.trim().length < 5 || newContent.trim().length < 15) {
      addToast("Title must be 5+ chars and Details 15+ chars", "error");
      return;
    }

    setSubmittingQuestion(true);
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          collegeId: newCollegeId || undefined
        })
      });

      if (res.ok) {
        addToast("Question posted successfully!", "success");
        setNewTitle("");
        setNewContent("");
        setNewCollegeId("");
        setShowPostForm(false);
        fetchQuestions(); // Refresh
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

  const handlePostAnswer = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (!user) {
      addToast("Please login to submit an answer", "error");
      return;
    }
    if (answerContent.trim().length < 10) {
      addToast("Answer must be at least 10 characters long", "error");
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
        fetchQuestions(); // Refresh
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

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCollegeId("");
  };

  // Local filter for search text query
  const filteredQuestions = questions.filter(
    q =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-900 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-indigo-400" />
            <span>Community Discussion Forum</span>
          </h1>
          <p className="text-slate-450 text-sm mt-1">
            Connect, ask questions, and share information with fellow students and alumni.
          </p>
        </div>

        {!showPostForm && (
          <button
            onClick={() => {
              if (!user) {
                addToast("Please login to ask a question", "error");
              } else {
                setShowPostForm(true);
              }
            }}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 font-semibold text-sm rounded-xl text-white shadow-lg shadow-indigo-600/15 transition-all flex items-center space-x-1.5 self-start"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            <span>Ask a Question</span>
          </button>
        )}
      </div>

      {/* Main Forum Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Area: Form to ask a question (toggled) or Threads */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post Question Card form */}
          {showPostForm && (
            <div className="bg-slate-900 border border-slate-850 p-6 md:p-8 rounded-2xl space-y-6 animate-in slide-in-from-top-3 duration-250">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">New Discussion Thread</h2>
                <button
                  onClick={() => setShowPostForm(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handlePostQuestion} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">
                    Question Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Short, descriptive title (e.g. BITS B.E. CS vs IIT Hyderabad CS?)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">
                    Associate with a College (Optional)
                  </label>
                  <select
                    value={newCollegeId}
                    onChange={e => setNewCollegeId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-350 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">General (Not specific to any college)</option>
                    {colleges.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">
                    Question Details
                  </label>
                  <textarea
                    rows={6}
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder="Describe your query in detail, including exam ranks, scores, or branches..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={submittingQuestion}
                    className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    {submittingQuestion ? "Posting..." : "Post to Board"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPostForm(false)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-sm font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Threads List */}
          <div className="space-y-6">
            {loading ? (
              // Loading skeletons
              [1, 2].map(idx => (
                <div key={idx} className="p-6 bg-slate-900 border border-slate-850 rounded-2xl animate-pulse space-y-4">
                  <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
                  <div className="h-4 w-1/4 bg-slate-800 rounded"></div>
                  <div className="h-16 w-full bg-slate-800 rounded"></div>
                </div>
              ))
            ) : filteredQuestions.length === 0 ? (
              // Empty State
              <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-850">
                <HelpCircle className="h-10 w-10 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">No Discussions Found</h3>
                <p className="text-slate-450 text-sm max-w-sm mx-auto leading-relaxed">
                  No questions match your filter query. Be the first to ask a question!
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-sm font-semibold rounded-xl text-indigo-400 transition-all"
                >
                  Reset Search Queries
                </button>
              </div>
            ) : (
              // Questions mapping
              filteredQuestions.map(q => (
                <div
                  key={q.id}
                  className="p-6 bg-slate-900 border border-slate-850 hover:border-slate-800 transition-all rounded-2xl space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                        <MessageCircle className="h-5 w-5 text-indigo-400 shrink-0" />
                        <span>{q.title}</span>
                      </h3>
                      {q.college && (
                        <span className="inline-flex items-center text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded-lg text-indigo-450 uppercase tracking-wider shrink-0">
                          {q.college.name.split("(")[0]?.trim()}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500">
                      Asked by <span className="font-semibold text-slate-350">{q.userName}</span> • {new Date(q.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-sm text-slate-300 pl-6 leading-relaxed border-l-2 border-slate-800/80">
                    {q.content}
                  </p>

                  {/* Answers Section */}
                  {q.answers.length > 0 && (
                    <div className="pl-6 space-y-3 pt-2">
                      {q.answers.map(ans => (
                        <div key={ans.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-450">
                            <CornerDownRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
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

                  {/* Reply Button / Textbox */}
                  <div className="pl-6 pt-2">
                    {answeringQuestionId === q.id ? (
                      <form onSubmit={e => handlePostAnswer(e, q.id)} className="space-y-2">
                        <textarea
                          rows={2}
                          value={answerContent}
                          onChange={e => setAnswerContent(e.target.value)}
                          placeholder="Write your answer details..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                        ></textarea>
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            disabled={submittingAnswer}
                            className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-50 text-[11px] font-semibold text-white rounded-lg transition-all"
                          >
                            {submittingAnswer ? "Posting..." : "Submit Answer"}
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
                        <span>Answer this Question</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">
                        Login to answer this thread.
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Filters & Sidebar */}
        <aside className="space-y-6">
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-5 h-fit">
            <h3 className="font-bold text-white text-base flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Filter className="h-4.5 w-4.5 text-indigo-400" />
              <span>Forum Filters</span>
            </h3>

            {/* Keyword Search */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Search Topics
              </label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus-within:border-indigo-500 transition-all">
                <Search className="h-4 w-4 text-slate-450 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Keyword search..."
                  className="w-full bg-transparent border-none text-white focus:outline-none placeholder-slate-600"
                />
              </div>
            </div>

            {/* College Specific Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Filter by College
              </label>
              <select
                value={selectedCollegeId}
                onChange={e => setSelectedCollegeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-350 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">All Discussion Threads</option>
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700"
            >
              Reset Filters
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl text-sm leading-relaxed text-slate-350">
            <h4 className="font-bold text-white mb-2">Community Guidelines</h4>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li>Keep discussions polite and respectful.</li>
              <li>Ask precise questions about cutoffs, campus reviews, or exams.</li>
              <li>Share accurate historical cutoff ranks or details where possible.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
