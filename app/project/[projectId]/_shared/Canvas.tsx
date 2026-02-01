import React, { useState, useEffect, useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import ScreenFrame from "./ScreenFrame";
import { ProjectType, ScreenConfig } from "@/type/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  projectDetail: ProjectType | undefined;
  screenConfig: ScreenConfig[];
  loading?: boolean;
  onDelete: (screenId: string) => void;
  projectId: string;
  onUpdate?: (screenId: string, updatedScreen: ScreenConfig) => void;
};

function Canvas({ projectDetail, screenConfig, loading, onDelete, projectId, onUpdate }: Props) {
  const [panningEnabled, setPanningEnabled] = useState(true);
  const [screenWidth, setScreenWidth] = useState(0);
  const [deviceType, setDeviceType] = useState<string>("");
  const canvasRef = useRef<HTMLDivElement>(null);

  // Persist device type to localStorage on change
  useEffect(() => {
    if (projectDetail?.device) {
      setDeviceType(projectDetail.device);
      if (typeof window !== "undefined") {
        localStorage.setItem("preferredDeviceType", projectDetail.device);
      }
    }
  }, [projectDetail?.device]);

  // Restore device type from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !projectDetail?.device) {
      const saved = localStorage.getItem("preferredDeviceType");
      if (saved) setDeviceType(saved);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = deviceType === "mobile";
      const viewportWidth = window.innerWidth;

      // Set screen width to 85% of viewport, capped at mobile/desktop max
      let newWidth = viewportWidth * 0.85;

      if (isMobile) {
        newWidth = Math.min(newWidth, 400);
      } else {
        newWidth = Math.min(newWidth, 1200);
      }

      setScreenWidth(newWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [deviceType]);

  const isMobile = deviceType === "mobile";
  const SCREEN_WIDTH = screenWidth || (isMobile ? 400 : 1200);
  const SCREEN_HEIGHT = isMobile ? 800 : 800;
  const gap = isMobile ? 10 : 70;

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
      <div className="tools absolute p-1 px-3 bg-white shadow flex gap-3 rounded-4xl bottom-10 left-1/2 z-30 text-gray-500">
        <Button variant={'ghost'} size={'sm'} onClick={() => zoomIn()}><Plus /></Button>
        <Button variant={'ghost'} size={'sm'} onClick={() => zoomOut()}><Minus/></Button>
        <Button variant={'ghost'} size={'sm'} onClick={() => resetTransform()}><X/></Button>
      </div>
    );
  };




  return (
    <div
      ref={canvasRef}
      className="w-full h-screen bg-gray-200"
      style={{
        backgroundImage: "radial-gradient(rgba(0,0,0,0.15)1px,transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <TransformWrapper
        initialScale={0.7}
        minScale={0.2}
        maxScale={3}
        initialPositionX={50}
        initialPositionY={50}
        limitToBounds={false}
        wheel={{ step: 0.8 }}
        doubleClick={{ disabled: false }}
        panning={{ disabled: !panningEnabled }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <Controls />
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
            >
              {screenConfig?.map((screen, index) => (
                <div key={`${screen?.screenId}-${index}`} style={{ position: 'absolute', left: index * (SCREEN_WIDTH + gap), top: 0 }}>
                  {screen?.code ? (
                    <ScreenFrame
                      x={0}
                      width={SCREEN_WIDTH}
                      height={SCREEN_HEIGHT}
                      y={0}
                      setPanningEnabled={setPanningEnabled}
                      htmlCode={screen?.code}
                      projectDetail={projectDetail}
                      screen={screen}
                      onDelete={() => onDelete(screen.screenId)}
                      projectId={projectId}
                      onUpdate={(updatedScreen) => onUpdate?.(screen.screenId, updatedScreen)}
                    />
                  ) : (
                    <div
                      className="bg-white rounded-2xl p-5 gap-4  flex flex-col"
                      style={{
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT,
                      }}
                    >
                      <Skeleton className="w-full rounded-lg h-10 bg-gray-200" />
                      <Skeleton className="w-[50%] rounded-lg h-20 bg-gray-200" />
                      <Skeleton className="w-[70%] rounded-lg h-30 bg-gray-200" />
                      <Skeleton className="w-[30%] rounded-lg h-10 bg-gray-200" />
                      <Skeleton className="w-full rounded-lg h-10 bg-gray-200" />
                      <Skeleton className="w-[50%] rounded-lg h-20 bg-gray-200" />
                      <Skeleton className="w-[70%] rounded-lg h-30 bg-gray-200" />
                      <Skeleton className="w-[30%] rounded-lg h-10 bg-gray-200" />
                    </div>
                  )}
                </div>
              ))}
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export default Canvas;
