"use client";
import React, { useContext, useEffect, useState } from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import SettingSection from "./_shared/SettingSection";
import { useParams } from "next/navigation";
import axios from "axios";
import { ProjectType, ScreenConfig } from "@/type/types";
import { Loader2Icon } from "lucide-react";
import Canvas from "./_shared/Canvas";
import { SettingContext } from "@/context/SettingContext";

function ProjectCanvasPlayGround() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<ProjectType>();
  const [screenConfigOriginal, setScreenConfigOriginal] = useState<
    ScreenConfig[]
  >([]);
  const [screenConfig, setScreenConfig] = useState<ScreenConfig[]>([]);
  const { settingsDetail, setSettingsDetail } = useContext(SettingContext);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Loading");
  const [hasGeneratedConfig, setHasGeneratedConfig] = useState(false);

  // Reset hasGeneratedConfig when projectId changes (new project)
  useEffect(() => {
    setHasGeneratedConfig(false);
  }, [projectId]);

  useEffect(() => {
    projectId && GetProjectDetail();
  }, [projectId]);

  const GetProjectDetail = async () => {
    setLoading(true);
    setLoadingMsg("Loading..");
    const result = await axios.get(`/api/project?projectId=${projectId}`);
    console.log(result.data);
    setProjectDetail(result?.data?.projectDetail);
    setScreenConfigOriginal(result?.data?.screenConfig);
    setScreenConfig(result?.data?.screenConfig);
    setSettingsDetail(result?.data?.projectDetail);

    // if (result.data?.screenConfig?.length == 0) {
    //   generateScreenConfig();
    // }
    setLoading(false);
  };

  useEffect(() => {
    if (
      projectDetail &&
      screenConfigOriginal &&
      screenConfigOriginal?.length == 0 &&
      !hasGeneratedConfig
    ) {
      generateScreenConfig();
    } else if (
      projectDetail &&
      screenConfigOriginal &&
      screenConfigOriginal?.length > 0
    ) {
      // Check if there are any screens without code
      const hasScreensWithoutCode = screenConfigOriginal.some(screen => !screen?.code);
      if (hasScreensWithoutCode) {
        setHasGeneratedConfig(true);
        GenerateScreenUIUX();
      }
    }
  }, [screenConfigOriginal, projectDetail]);

  const generateScreenConfig = async () => {
    setLoading(true);
    setLoadingMsg("Generating Screen Config...");
    const result = await axios.post("/api/generate-config", {
      projectId: projectId,
      deviceType: projectDetail?.device,
      userInput: projectDetail?.userInput,
    });
    console.log(result.data);
    // Fetch updated project details
    await GetProjectDetail();
    setLoading(false);
  };

  const GenerateScreenUIUX = async () => {
    setLoading(true);
    try {
      for (let index = 0; index < screenConfig?.length; index++) {
        const screen = screenConfig[index];
        if (screen?.code) continue;

        setLoadingMsg("Generating Screen " + (index + 1));
        const result = await axios.post("/api/generate-screen-ui", {
          projectId,
          screenId: screen?.screenId,
          screenName: screen?.screenName,
          purpose: screen?.purpose,
          screenDescription: screen?.screenDescription,
        });

        console.log(result.data);
        setScreenConfig((prev) =>
          prev.map((item, i) => (i === index ? result.data : item)),
        );
      }
    } catch (error) {
      console.error("Failed to generate screen UI:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScreenDelete = (screenId: string) => {
    // Immediately update both state arrays to remove the deleted screen
    setScreenConfig((prev) =>
      prev.filter((screen) => screen.screenId !== screenId),
    );
    setScreenConfigOriginal((prev) =>
      prev.filter((screen) => screen.screenId !== screenId),
    );
  };

  const handleScreenUpdate = (
    screenId: string,
    updatedScreen: ScreenConfig,
  ) => {
    // Immediately update the screen in both state arrays
    setScreenConfig((prev) =>
      prev.map((screen) =>
        screen.screenId === screenId ? updatedScreen : screen,
      ),
    );
    setScreenConfigOriginal((prev) =>
      prev.map((screen) =>
        screen.screenId === screenId ? updatedScreen : screen,
      ),
    );
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <ProjectHeader />
      <div className="flex flex-1 overflow-hidden">
        {loading && (
          <div className="p-3 fixed bg-blue-300/20 border border-blue-400 rounded-xl left-1/2 top-30 z-50 transform -translate-x-1/2">
            <h2 className="flex gap-2 items-center">
              <Loader2Icon className="animate-spin" />
              {loadingMsg}
            </h2>
          </div>
        )}
        {/* Settings */}
        <SettingSection 
          projectDetail={projectDetail} 
          screenDescription={screenConfig[0]?.screenDescription} 
          onScreenGenerated={GetProjectDetail}
          loading={loading}
          setLoading={setLoading}
          setLoadingMsg={setLoadingMsg}
        />
        {/* Canvas */}
        <Canvas
          projectDetail={projectDetail}
          screenConfig={screenConfig}
          onDelete={handleScreenDelete}
          projectId={projectId as string}
          onUpdate={handleScreenUpdate}
        />
      </div>
    </div>
  );
}

export default ProjectCanvasPlayGround;
