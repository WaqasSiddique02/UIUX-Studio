import React, { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Save } from "lucide-react";
import { SettingContext } from "@/context/SettingContext";
import axios from "axios";
import { toast } from "sonner";

function ProjectHeader() {
  const { settingsDetail, setSettingsDetail } = useContext(SettingContext);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    try{
    setLoading(true);
    const result = await axios.put("/api/project/", {
      theme: settingsDetail?.theme,
      projectId: settingsDetail?.projectId,
      projectName: settingsDetail?.projectName,
    });
    setLoading(false);
    toast.success('Setting Saved');
    }catch(err){
      setLoading(false);
      toast.error('Internal Server Error');
    }

  };
  return (
    <div className="flex items-center justify-between p-3 shadow">
      <div className="flex items-center gap-2">
        <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
        <h2 className="text-xl font-semibold">
          <span className="text-primary">UIUX</span> MOCK
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
