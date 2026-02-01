"use client";

import { useEffect, useState } from "react";
import MobileView from "@/components/MobileView";

export default function MobileViewWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      // Check if screen width is less than 1024px (typical tablet breakpoint)
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  // Show mobile view for screens smaller than 1024px
  if (isMobile) {
    return <MobileView />;
  }

  return <>{children}</>;
}
