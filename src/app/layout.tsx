import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Toasts from "@/components/Toasts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollegeDiscover | Modern College Discovery, Prediction & Comparison Platform",
  description: "Discover the best engineering, MBA, medical and arts colleges. Compare fees, placements, rankings, and use our cutoff predictor tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <AppProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                      C
                    </span>
                    <span className="font-bold text-lg text-white">CollegeDiscover</span>
                  </div>
                  <p className="text-sm">
                    Making higher education choices simple, transparent, and data-driven for students nationwide.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/colleges" className="hover:text-indigo-400 transition-colors">College Directory</Link></li>
                    <li><Link href="/compare" className="hover:text-indigo-400 transition-colors">Side-by-Side Compare</Link></li>
                    <li><Link href="/predictor" className="hover:text-indigo-400 transition-colors">Cutoff Rank Predictor</Link></li>
                    <li><Link href="/forum" className="hover:text-indigo-400 transition-colors">Q&A Discussions</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Top Exams</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="text-slate-400">JEE Main / Advanced</span></li>
                    <li><span className="text-slate-400">BITSAT Entrance</span></li>
                    <li><span className="text-slate-400">CAT Management</span></li>
                    <li><span className="text-slate-400">NEET Medical</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Disclaimer</h3>
                  <p className="text-xs leading-relaxed">
                    Cutoffs and placement metrics are based on historical datasets. Actual cutoffs may vary year-by-year depending on exams authority criteria.
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs">
                <p>&copy; {new Date().getFullYear()} CollegeDiscover. Built as a Premium AI Internship Demo Task.</p>
              </div>
            </div>
          </footer>
          <Toasts />
        </AppProvider>
      </body>
    </html>
  );
}
