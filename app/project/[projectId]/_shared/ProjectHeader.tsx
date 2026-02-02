import React, { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Save } from "lucide-react";
import { SettingContext } from "@/context/SettingContext";
import axios from "axios";
import { toast } from "sonner";
import router from "next/router";

function ProjectHeader() {
  const { settingsDetail, setSettingsDetail } = useContext(SettingContext);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    if (!settingsDetail?.projectId) {
      toast.error('Project ID is missing');
      return;
    }
    try {
      setLoading(true);
      const result = await axios.put("/api/project/", {
        theme: settingsDetail?.theme,
        projectId: settingsDetail?.projectId,
        projectName: settingsDetail?.projectName,
      });
      toast.success('Setting Saved');
    } catch (err) {
      toast.error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-between p-3 shadow">
      <div className="flex items-center gap-2" onClick={() => {router.push('/')}}>
        <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
        <h2 className="text-xl font-semibold">
          <span className="text-primary">UIUX</span> Studio
        </h2>
      </div>
      <Button onClick={onSave} disabled={loading}>
        {loading ? (
          <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
        ) : (
          <Save />
        )}
        Save
      </Button>
    </div>
  );
}

export default ProjectHeader;
