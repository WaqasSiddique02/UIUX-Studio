"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SettingContext } from "@/context/SettingContext";
import { THEME_NAME_LIST, THEMES } from "@/data/themes";
import { ProjectType } from "@/type/types";
import axios from "axios";
import { Loader2Icon, Save, Share, SparklesIcon } from "lucide-react";

import React, { useContext, useEffect, useState } from "react";

type Props = {
  projectDetail: ProjectType | undefined;
  screenDescription?: string | undefined;
  onScreenGenerated?: () => void;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
  setLoadingMsg?: (msg: string) => void;
};

function SettingSection({ projectDetail, screenDescription, onScreenGenerated, loading, setLoading, setLoadingMsg }: Props) {
  const [selectedTheme, setSelectedTheme] = useState<string>("AURORA_INK");
  const [projectName, setProjectName] = useState<string>("");
  const [userNewScreenInput, setUserNewScreenInput] = useState<string>("");
  const { settingsDetail, setSettingsDetail } = useContext(SettingContext);

  useEffect(() => {
    if (projectDetail?.projectName) {
      setProjectName(projectDetail.projectName);
    }
    if (projectDetail?.theme) {
      setSelectedTheme(projectDetail.theme as string);
    }
  }, [projectDetail]);

  // Sync with context
  useEffect(() => {
    if (settingsDetail?.theme) {
      setSelectedTheme(settingsDetail.theme as string);
    }
  }, [settingsDetail?.theme]);

  const onThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    setSettingsDetail((prev: any) => ({
      ...prev,
      theme: theme,
    }));
  };

  const GenerateNewScreen = async () => {
    try {
      if (setLoading) setLoading(true);
      if (setLoadingMsg) setLoadingMsg('Generating Screen Config...');
      const result = await axios.post("/api/generate-config", {
        projectId: projectDetail?.projectId,
        projectName: projectDetail?.projectName,
        deviceType: projectDetail?.device,
        theme: projectDetail?.theme,
        oldScreenDescription: screenDescription,
        userInput: userNewScreenInput,
      });
      console.log(result.data);
      // Trigger parent to reload and generate UI for new screens
      if (onScreenGenerated) {
        onScreenGenerated();
      }
    } catch (err) {
      if (setLoading) setLoading(false);
    }
  };

  return (
    <div className="w-[300px] h-full p-5 border-r flex flex-col overflow-hidden">
      <h2 className="font-medium text-lg">Settings</h2>

      <div className="mt-3">
        <h2 className="text-sm mb-1">Project Name</h2>
        <Input
          placeholder="Project Name"
          value={projectName}
          onChange={(event) => {
            const newName = event.target.value;
            setProjectName(newName);
            setSettingsDetail((prev: any) => ({
              ...prev,
              projectName: newName,
            }));
          }}
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm mb-1">Generate New Screen</h2>
        <Textarea
          placeholder="Enter prompt to generate screen using AI"
          onChange={(event) => setUserNewScreenInput(event.target.value)}
        />
        <Button
          size={"sm"}
          className="mt-2 w-full"
          onClick={GenerateNewScreen}
          disabled={loading}
        >
          {loading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <SparklesIcon />
          )}
          Generate With AI
        </Button>
      </div>

      <div className="mt-5 flex-1 flex flex-col min-h-0">
        <h2 className="text-sm mb-1">Themes</h2>
        <div className="flex-1 overflow-y-auto pr-2">
          <div>
            {THEME_NAME_LIST.map((theme, index) => (
              <div
                key={theme}
                className={`p-3 border rounded-xl mb-2 cursor-pointer hover:border-primary/50 transition-colors ${theme === selectedTheme && "border-primary bg-primary/20"}`}
                onClick={() => onThemeSelect(theme)}
              >
                <h2>{theme}</h2>
                <div className="flex gap-2">
                  <div
                    className={`h-4 w-4 rounded-full`}
                    style={{ background: THEMES[theme].primary }}
                  />
                  <div
                    className={`h-4 w-4 rounded-full`}
                    style={{ background: THEMES[theme].secondary }}
                  />
                  <div
                    className={`h-4 w-4 rounded-full`}
                    style={{ background: THEMES[theme].accent }}
                  />
                  <div
                    className={`h-4 w-4 rounded-full`}
                    style={{ background: THEMES[theme].background }}
                  />

                  <div
                    className="h-4 w-4 rounded-full"
                    style={{
                      background: `linear-gradient(
                    135deg,
                    ${THEMES[theme].primary},
                    ${THEMES[theme].secondary},
                    ${THEMES[theme].accent}
                  )`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}

export default SettingSection;
