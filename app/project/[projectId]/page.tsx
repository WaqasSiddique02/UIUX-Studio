import React from "react";
import ProjectHeader from "./_shared/ProjectHeader";
import SettingSection from "./_shared/SettingSection";

function ProjectCanvasPlayGround() {
  return (
    <div>
      <ProjectHeader />
      <div>
        {/* Settings */}
        <SettingSection />
        {/* Canvas */}
      </div>
    </div>
  );
}

export default ProjectCanvasPlayGround;
