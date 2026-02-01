"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

function Header() {
  const { user } = useUser();
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
        <h2 className="text-xl font-semibold">
          <span className="text-primary">UIUX</span> Studio
        </h2>
      </div>
      {!user ? (
        <SignInButton mode="modal">
          <Button>Get Started</Button>
        </SignInButton>
      ) : (
        <UserButton />
      )}
    </div>
  );
}

export default Header;