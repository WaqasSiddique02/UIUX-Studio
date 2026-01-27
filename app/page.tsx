import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1>Welcome to UI,UX generator app</h1>
      <Button>Get Started</Button>
      <UserButton></UserButton>
    </>
  );
}
