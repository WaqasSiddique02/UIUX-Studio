import { SettingContext } from "@/context/SettingContext";
import { THEMES, themeToCssVars } from "@/data/themes";
import { ProjectType, ScreenConfig } from "@/type/types";
import { GripVertical } from "lucide-react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Rnd } from "react-rnd";
import ScreenHandler from "./ScreenHandler";

type Props = {
  x: number;
  y: number;
  setPanningEnabled: (enabled: boolean) => void;
  width: number;
  height: number;
  htmlCode: string | undefined;
  projectDetail?: ProjectType | undefined;
  screen: ScreenConfig;
  onDelete: () => void;
  projectId: string;
  onUpdate?: (updatedScreen: ScreenConfig) => void;
};

function ScreenFrame({
  x,
  y,
  setPanningEnabled,
  width,
  height,
  htmlCode,
  projectDetail,
  screen,
  onDelete,
  projectId,
  onUpdate,
}: Props) {
  const { settingsDetail, setSettingsDetail } = useContext(SettingContext);
  const theme =
    THEMES[
      (settingsDetail?.theme ?? projectDetail?.theme) as keyof typeof THEMES
    ];
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [size, setSize] = useState({ width, height });
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    setSize({ width, height });
  }, [height, width]);

  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Google Font -->
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">


<!-- Tailwind + Iconify -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>
  <style >
    ${themeToCssVars(theme)}
    body, html {
      overflow: hidden !important;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body class="bg-[var(--background)] text-[var(--foreground)] w-full">
  ${htmlCode ?? ""}
</body>
</html>
`;

  const measureIframeHeight = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const headerH = 40; // drag bar height
      const spacer = 12; // spacer div height
      const htmlEl = doc.documentElement;
      const body = doc.body;

      // ✅ choose the largest plausible height
      const contentH = Math.max(
        htmlEl?.scrollHeight ?? 0,
        body?.scrollHeight ?? 0,
        htmlEl?.offsetHeight ?? 0,
        body?.offsetHeight ?? 0,
      );

      // Add buffer for padding/margins and remove max clamp to show full content
      const buffer = 20; // extra padding buffer
      const next = Math.max(contentH + headerH + spacer + buffer, 160);

      // Only update if height actually changed
      setSize((s) =>
        Math.abs(s.height - next) > 2 ? { ...s, height: next } : s,
      );
    } catch {
      // if sandbox/origin blocks access, we can't measure
    }
  }, [htmlCode]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let cleanupFn: (() => void) | undefined;

    const onLoad = () => {
      // Always measure on first load
      if (isFirstLoadRef.current) {
        isFirstLoadRef.current = false;
        measureIframeHeight();

        // ✅ observe DOM changes inside iframe
        const doc = iframe.contentDocument;
        if (!doc) return;

        const observer = new MutationObserver(() => measureIframeHeight());
        observer.observe(doc.documentElement, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        });

        // ✅ re-check a few times for fonts/images/tailwind async layout
        const t1 = window.setTimeout(measureIframeHeight, 50);
        const t2 = window.setTimeout(measureIframeHeight, 200);
        const t3 = window.setTimeout(measureIframeHeight, 600);
        const t4 = window.setTimeout(measureIframeHeight, 1200);

        cleanupFn = () => {
          observer.disconnect();
          window.clearTimeout(t1);
          window.clearTimeout(t2);
          window.clearTimeout(t3);
          window.clearTimeout(t4);
        };
      }
    };

    iframe.addEventListener("load", onLoad);
    window.addEventListener("resize", measureIframeHeight);

    return () => {
      iframe.removeEventListener("load", onLoad);
      window.removeEventListener("resize", measureIframeHeight);
      cleanupFn?.();
    };
  }, [measureIframeHeight, htmlCode]);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        width: "fit-content",
      }}
    >
      <Rnd
        default={{ x, y, width: width, height: height }}
        size={size}
        dragHandleClassName="drag-handle"
        enableResizing={{ bottomRight: true, bottomLeft: true }}
        onDragStart={() => {
          setPanningEnabled(false);
        }}
        onDragStop={() => setPanningEnabled(true)}
        onResizeStart={() => setPanningEnabled(false)}
        onResizeStop={(_, __, ref, ___, position) => {
          setPanningEnabled(true);
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          });
        }}
      >
        <div className="drag-handle flex gap-2 items-center cursor-move bg-white p-4 border-b border-gray-200 rounded-lg">
          <ScreenHandler 
            screen={screen} 
            iframeRef={iframeRef} 
            onDelete={onDelete} 
            projectId={projectId}
            onUpdate={onUpdate}
          />
        </div>
        <div style={{ height: "12px" }}></div>
        <iframe
          ref={iframeRef}
          className="w-full bg-white block"
          style={{ height: `calc(100% - 52px)` }}
          sandbox="allow-same-origin allow-scripts"
          srcDoc={html}
        />
      </Rnd>
    </div>
  );
}

export default ScreenFrame;
