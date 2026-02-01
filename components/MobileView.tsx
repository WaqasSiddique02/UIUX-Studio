"use client";

import { Monitor, Laptop, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-6 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-300/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-300/30 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-md w-full mx-auto text-center space-y-8">
        {/* Icon Container with Animation */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Monitor className="w-12 h-12 text-purple-600 dark:text-purple-400" strokeWidth={1.5} />
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 blur-xl opacity-50 animate-pulse delay-300"></div>
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Laptop className="w-12 h-12 text-pink-600 dark:text-pink-400" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Title with Gradient */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
              UI/UX Studio
            </h1>
            <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400 animate-pulse delay-150" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
            Desktop Experience
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Awaits You
            </span>
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed px-4">
          For the best creative experience and full access to all features, please open
          <span className="font-semibold text-purple-600 dark:text-purple-400"> UI/UX Studio </span>
          on a desktop or laptop computer.
        </p>

        {/* Features List */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100 dark:border-purple-900/50">
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Canvas Tools</span> - Advanced design capabilities
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-pink-600 dark:bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">AI Generation</span> - Create stunning UI designs
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Full Workspace</span> - Optimal screen real estate
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            We appreciate your interest! Switch to a larger screen to unleash your creativity.
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 border-4 border-purple-300/30 dark:border-purple-500/20 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 border-4 border-pink-300/30 dark:border-pink-500/20 rounded-full animate-spin-reverse"></div>
    </div>
  );
}
