"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Compass,
  Award,
  GitCompare,
  MessageSquare,
  TrendingUp,
  MapPin,
  Star,
  BookOpen
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  const categories = [
    { name: "Engineering", count: "4 Colleges", icon: Compass, color: "from-blue-500 to-cyan-500", desc: "IITs, NITs, BITS, and top tech institutes.", href: "/colleges?search=IIT" },
    { name: "Management", count: "2 Colleges", icon: TrendingUp, color: "from-indigo-500 to-purple-500", desc: "IIMs, FMS, and top business schools.", href: "/colleges?search=IIM" },
    { name: "Medical", count: "2 Colleges", icon: BookOpen, color: "from-emerald-500 to-teal-500", desc: "AIIMS, MAMC, and leading medical institutions.", href: "/colleges?search=Medical" },
    { name: "Arts & Sciences", count: "2 Colleges", icon: Star, color: "from-rose-500 to-pink-500", desc: "St. Stephen's, LSR, and premium liberal arts.", href: "/colleges?search=Delhi" }
  ];

  const featuredColleges = [
    {
      id: "col-iit-bombay",
      name: "IIT Bombay",
      location: "Mumbai, MH",
      fees: "₹2.2 Lakh/yr",
      rating: 4.8,
      avgPackage: "23.5 LPA",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "col-iim-ahmedabad",
      name: "IIM Ahmedabad",
      location: "Ahmedabad, GJ",
      fees: "₹12.5 Lakh/yr",
      rating: 4.9,
      avgPackage: "34.2 LPA",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=60"
    },
    {
      id: "col-aiims-delhi",
      name: "AIIMS New Delhi",
      location: "New Delhi, DL",
      fees: "₹1.6K/yr",
      rating: 4.9,
      avgPackage: "18.0 LPA",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-955 min-h-screen">
      {/* Background blobs for visual polish */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold mb-6 animate-pulse">
          <span>✨ New: Predictor Tool updated for JEE/NEET 2026</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          Find Your Dream College, <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Plan Your Future Academics.
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-slate-350 mb-10 leading-relaxed">
          Search, filter, and compare the nation&apos;s premier institutes. Predict admission chances using historical closing ranks, and ask the student community.
        </p>

        {/* Hero Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <div className="flex-grow flex items-center px-3 py-2">
              <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by college name, city, course..."
                className="w-full bg-transparent border-none text-white text-base focus:outline-none placeholder-slate-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <span>Explore Directory</span>
            </button>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-slate-400">
            <span>Popular:</span>
            <Link href="/colleges?search=IIT" className="hover:text-indigo-400 transition-colors">IITs</Link>
            <span>•</span>
            <Link href="/colleges?search=IIM" className="hover:text-indigo-400 transition-colors">IIMs</Link>
            <span>•</span>
            <Link href="/colleges?search=Delhi" className="hover:text-indigo-400 transition-colors">Delhi Universities</Link>
          </div>
        </form>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Comparison */}
          <Link href="/compare" className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-indigo-500/30 hover:bg-slate-900 hover:scale-[1.02] transition-all duration-200 text-left flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                <GitCompare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Compare Colleges</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Compare fees, placements packages, ratings, and courses side-by-side to make the perfect academic match.
              </p>
            </div>
            <span className="text-indigo-400 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
              Compare Now &rarr;
            </span>
          </Link>

          {/* Predictor */}
          <Link href="/predictor" className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-purple-500/30 hover:bg-slate-900 hover:scale-[1.02] transition-all duration-200 text-left flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">College Predictor</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Input your exam rank (JEE, NEET, CAT, BITSAT) to predict target, reach, and safety colleges based on historical closing cutoffs.
              </p>
            </div>
            <span className="text-purple-400 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
              Predict Admission &rarr;
            </span>
          </Link>

          {/* Discussion */}
          <Link href="/forum" className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-850 hover:border-pink-500/30 hover:bg-slate-900 hover:scale-[1.02] transition-all duration-200 text-left flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-xl bg-pink-600/10 flex items-center justify-center text-pink-400 mb-5 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Community Forum</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Ask questions about campus life, placements, preparation tips, and get answers from alumni and other students.
              </p>
            </div>
            <span className="text-pink-400 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
              Join discussions &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Stream / Category Section */}
      <section className="bg-slate-900/40 border-y border-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Browse by Stream</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Quickly discover premium institutes matching your educational interest. Filter, view courses, and placement stats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={cat.href}
                  className="group relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:scale-[1.03] transition-all duration-300"
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-115 transition-all`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 mb-3">
                    {cat.count}
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed">{cat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured / Trending Colleges Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Featured Institutes</h2>
            <p className="text-slate-400 text-sm">
              Discover top engineering, management, and medical campuses with high rating indices.
            </p>
          </div>
          <Link
            href="/colleges"
            className="mt-4 md:mt-0 text-sm font-semibold text-indigo-400 hover:text-indigo-350 flex items-center"
          >
            <span>View All Colleges</span>
            <span className="ml-1">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredColleges.map((college, idx) => (
            <div
              key={idx}
              className="group rounded-2xl bg-slate-900 border border-slate-850 overflow-hidden hover:border-slate-700 hover:scale-[1.02] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={college.image}
                    alt={college.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-850 flex items-center space-x-1 text-amber-400 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 shrink-0" />
                    <span>{college.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {college.name}
                  </h3>
                  
                  <div className="flex items-center text-slate-400 text-xs mb-4">
                    <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-slate-500" />
                    <span>{college.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-800/60 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Average Fees</span>
                      <span className="text-slate-200 font-semibold">{college.fees}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Avg Placement</span>
                      <span className="text-emerald-400 font-semibold">{college.avgPackage}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  href={`/colleges/${college.id}`}
                  className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-slate-750 hover:bg-slate-850 text-center font-medium text-sm text-slate-200 hover:text-white transition-all block"
                >
                  View Campus details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
