"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";
import { SettingContext } from "@/context/SettingContext";

function Provider({ children }: any) {
  const [userDetail, setUserDetail] = useState();
  const [settingsDetail, setSettingsDetail] = useState();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      CreateNewUser();
    }
  }, [isLoaded, isSignedIn]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/user", {});
      console.log("User created/fetched:", result.data);
      setUserDetail(result?.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <SettingContext.Provider value={{ settingsDetail, setSettingsDetail }}>
        <div>{children}</div>
      </SettingContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default Provider;
