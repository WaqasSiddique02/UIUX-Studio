import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ScreenFrame from "./ScreenFrame";
import { ProjectType, ScreenConfig } from "@/type/types";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  projectDetail: ProjectType | undefined;
  screenConfig: ScreenConfig[];
  loading?: boolean;
};

function Canvas({ projectDetail, screenConfig, loading }: Props) {
  const [panningEnabled, setPanningEnabled] = useState(true);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = projectDetail?.device === "mobile";
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
  }, [projectDetail?.device]);

  const isMobile = projectDetail?.device === "mobile";
  const SCREEN_WIDTH = screenWidth || (isMobile ? 400 : 1200);
  const SCREEN_HEIGHT = isMobile ? 800 : 800;
  const gap = isMobile ? 10 : 70;
  return (
    <div
      className="w-full h-screen bg-gray-200"
      style={{
        backgroundImage: "radial-gradient(rgba(0,0,0,0.15)1px,transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <TransformWrapper
        initialScale={0.7}
        minScale={0.1}
        maxScale={3}
        initialPositionX={50}
        initialPositionY={50}
        limitToBounds={false}
        wheel={{ step: 0.8 }}
        doubleClick={{ disabled: false }}
        panning={{ disabled: !panningEnabled }}
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          {screenConfig?.map((screen, index) => (
            <div key={index}>
              {screen?.code ? (
                <ScreenFrame
                  x={index * (SCREEN_WIDTH + gap)}
                  width={SCREEN_WIDTH}
                  height={SCREEN_HEIGHT}
                  y={0}
                  setPanningEnabled={setPanningEnabled}
                  htmlCode={screen?.code}
                  projectDetail={projectDetail}
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
      </TransformWrapper>
    </div>
  );
}

export default Canvas;
