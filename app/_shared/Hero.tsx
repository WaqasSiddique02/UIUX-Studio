"use client";
import React, { useState, useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Send } from "lucide-react";
import { suggestions } from "@/data/constant";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

function Hero() {
  const [userInput, setUserInput] = useState<string>();
  const [device, setDevice] = useState<string>("website");
  const [isClient, setIsClient] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onCreateProject = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if(!userInput){
      return;
    }
    setLoading(true);

    const projectId = crypto.randomUUID();
    const result=await axios.post('/api/project',{
      userInput:userInput,
      device:device,
      projectId:projectId
    })

    console.log("Project Created:", result.data);
    setLoading(false);

    //navigate to project route
    router.push('/project/' + projectId);
  };

  return (
    <div className="p-10 md:px-24 lg:px-48 xl:px-60 mt-20">
      <h2 className="text-5xl font-bold text-center">
        Design High Quality{" "}
        <span className="text-primary">Website And Mobile App</span> Design
      </h2>
      <p className="text-center text-gray-600 text-lg mt-3">
        Imagine your idea and turn in to reality
      </p>
      <div className="flex mt-5 w-full gap-6 items-center justify-center">
        <InputGroup className="max-w-xl bg-white z-10 rounded-2xl">
          <InputGroupTextarea
            data-slot="input-group-control"
            className="flex field-sizing-content min-h-24 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
            placeholder="Enter what design you want to generate..."
            value={userInput}
            onChange={(event) => {
              setUserInput(event.target?.value);
            }}
          />
          <InputGroupAddon align="block-end">
            {isClient && (
              <Select
                defaultValue="website"
                onValueChange={(value) => setDevice(value)}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <InputGroupButton
              className="ml-auto"
              size="sm"
              variant="default"
              onClick={() => onCreateProject()}
              disabled={loading}
            >
              {loading?<Loader className="animate-spin"></Loader>:<Send />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex gap-3 mt-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-2 border rounded-2xl flex flex-col items-center bg-white z-10 cursor-pointer"
            onClick={() => {
              setUserInput(suggestion?.description);
            }}
          >
            <h2 className="text-lg">{suggestion.icon}</h2>
            <h2 className="text-center line-clamp-2 text-sm">
              {suggestion.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;
