"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Layers,
  Wallet,
  LineChart,
  FileSpreadsheet,
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Home() {
  // Feature data for the carousel
  const platformFeatures = [
    {
      title: "Real-Time Ledger Auditing",
      description:
        "Automatically reconcile your historical transaction records with high-fidelity internal auditing matrices.",
      icon: <FileSpreadsheet className="h-6 w-6 text-blue-500" />,
      tag: "Core Engine",
    },
    {
      title: "Advanced Profit Calculations",
      description:
        "Dynamic tracking of realized and unrealized gains across multi-broker portfolios and asset classes.",
      icon: <BarChart3 className="h-6 w-6 text-emerald-500" />,
      tag: "Analytics",
    },
    {
      title: "Institutional Security",
      description:
        "AES-256 GCM encrypted architecture ensuring your financial data remains completely private and immutable.",
      icon: <ShieldCheck className="h-6 w-6 text-indigo-500" />,
      tag: "Compliance",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#020817] transition-colors duration-300">
      {/* 1. HERO SECTION: Brand Introduction */}
      <main className="flex-grow flex flex-col items-center justify-start pt-20 pb-12 px-4 md:px-8">
        {/* Hero Header */}
        <section className="text-center max-w-4xl mx-auto space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide uppercase mb-4">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            ShareTrack Platform v2.4 Live
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Institutional-Grade Share <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Ledger & Portfolio Tracking
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ShareTrack by Softwarence LTD provides absolute precision for your
            asset information. Organize, calculate, and audit your multi-broker
            data in one unified dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 w-full sm:w-auto"
              >
                Open Free Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-xl transition-all w-full sm:w-auto"
              >
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* 2. USER MANUAL: Step-by-Step Guide */}
        <section className="w-full max-w-6xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              How ShareTrack Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Your streamlined manual to getting started in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 -z-10"></div>

            {/* Step 1 */}
            <Card className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle className="text-lg">Initialize Account</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-slate-600 dark:text-slate-400">
                Create your secure institutional profile and configure your base
                currency and localized timezone settings.
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle className="text-lg">Deposit & Allocate</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-slate-600 dark:text-slate-400">
                Log your initial capital deposits into your virtual wallet to
                establish your purchasing power baseline.
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle className="text-lg">Execute & Track</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-slate-600 dark:text-slate-400">
                Record your buy/sell orders. The engine automatically calculates
                commissions, average costs, and realized profits.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 3. PLATFORM CAPABILITIES: Auto-Playing Carousel */}
        <section className="w-full max-w-5xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-6 px-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Platform Capabilities
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enterprise-grade tools at your fingertips.
              </p>
            </div>
            <Layers className="h-6 w-6 text-slate-300 dark:text-slate-700" />
          </div>

          <Carousel
            plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
            className="w-full cursor-grab active:cursor-grabbing"
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent className="-ml-4">
              {platformFeatures.map((feature, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors group">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                          {feature.icon}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">
                          {feature.tag}
                        </span>
                      </div>
                      <CardTitle className="text-base text-slate-900 dark:text-white">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </main>
    </div>
  );
}
