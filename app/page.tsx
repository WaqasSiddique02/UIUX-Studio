import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Header from "./_shared/Header";
import Hero from "./_shared/Hero";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <div className="fixed -top-40 -left-40 h-125 w-125 bg-purple-400/20 blur-[120px] rounded-full" />
      <div className="fixed top-20 -right-50 h-125 w-125 bg-pink-400/20 blur-[120px] rounded-full" />
      <div className="fixed -bottom-50 left-1/3 h-125 w-125 bg-blue-400/20 blur-[120px] rounded-full" />
      <div className="fixed top-50 left-1/2 h-125 w-125 bg-sky-400/20 blur-[120px] rounded-full" />
    </div>
  );
}
