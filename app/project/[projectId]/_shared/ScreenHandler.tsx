import { Button } from "@/components/ui/button";
import { ScreenConfig } from "@/type/types";
import {
  Check,
  Code2Icon,
  Copy,
  Download,
  GripVertical,
  Sparkle,
  SparkleIcon,
  Trash2,
} from "lucide-react";
import React, { RefObject, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import axios from "axios";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  screen: ScreenConfig | undefined;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  onDelete: () => void;
  projectId: string;
  onUpdate?: (updatedScreen: ScreenConfig) => void;
};

function ScreenHandler({ screen, iframeRef, onDelete, projectId, onUpdate }: Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [edituserInput,setEditUserInput]=useState<string>();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleCopy = () => {
    if (screen?.code) {
      navigator.clipboard.writeText(screen.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!screen?.screenId) return;

    try {
      setDeleting(true);
      await axios.delete(`/api/screen?screenId=${screen.screenId}`);
      toast.success("Screen deleted successfully!");
      // Call onDelete immediately to update UI without full reload
      onDelete();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete screen");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    if (!iframeRef.current) return;

    try {
      setDownloading(true);
      const iframe = iframeRef.current;
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;

      if (!iframeDoc) {
        toast.error("Unable to access iframe content");
        return;
      }

      const body = iframeDoc.body;

      const canvas = await html2canvas(body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${screen?.screenName || "screen"}.png`;
          link.click();
          URL.revokeObjectURL(url);
          toast.success("Screen downloaded successfully!");
        }
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download screen");
    } finally {
      setDownloading(false);
    }
  };

  const editScreen = async () => {
    if (!edituserInput?.trim()) {
      toast.error('Please enter what changes you want to make');
      return;
    }

    try {
      setRegenerating(true);
      toast.info('Regenerating screen...', {
        duration: Infinity,
        id: 'regenerate-screen'
      });
      
      const result = await axios.post('/api/edit-screen', {
        projectId: projectId,
        screenId: screen?.screenId,
        userInput: edituserInput,
        oldCode: screen?.code,
      });
      
      toast.dismiss('regenerate-screen');
      toast.success('Screen regenerated successfully!');
      setPopoverOpen(false);
      setEditUserInput('');
      
      if (onUpdate && result.data) {
        onUpdate(result.data);
      }
    } catch (error) {
      console.error('Edit screen error:', error);
      toast.dismiss('regenerate-screen');
      toast.error('Failed to regenerate screen');
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-2">
        <GripVertical className="text-gray-500 h-4 w-3 " />
        <h2>{screen?.screenName}</h2>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size={"icon-sm"}
          onClick={handleDownload}
          disabled={downloading}
          className="cursor-pointer"
        >
          <Download className={downloading ? "animate-pulse" : ""} />
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size={"icon-sm"}>
              <Code2Icon />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>HTML + TailwindCSS Code</DialogTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="ml-4 mr-3 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 " />
                    </>
                  )}
                </Button>
              </div>
            </DialogHeader>
            <DialogDescription asChild>
              <div className="overflow-x-auto overflow-y-auto flex-1 pr-2">
                {/*@ts-ignore*/}
                <SyntaxHighlighter
                  language="html"
                  style={docco}
                  customStyle={{
                    margin: 0,
                    fontSize: "14px",
                    minWidth: "max-content",
                  }}
                  wrapLongLines={false}
                >
                  {screen?.code}
                </SyntaxHighlighter>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size={"icon-sm"}>
              <SparkleIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Regenerate Screen</h4>
              <Textarea 
                placeholder="What changes you want to make..." 
                className="min-h-[100px]"
                value={edituserInput}
                onChange={(e)=>setEditUserInput(e.target.value)}
                disabled={regenerating}
              />
              <Button 
                size={'sm'} 
                className="mt-2 w-full" 
                onClick={editScreen}
                disabled={regenerating || !edituserInput?.trim()}
              >
                {regenerating ? (
                  <>
                    <Sparkle className="mr-2 h-4 w-4 animate-pulse"/>
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkle className="mr-2 h-4 w-4"/>
                    Regenerate
                  </>
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size={"icon-sm"}
              disabled={deleting}
              className="cursor-pointer text-destructive hover:text-destructive"
            >
              <Trash2 className={deleting ? "animate-pulse" : ""} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Screen?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{screen?.screenName}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ScreenHandler;
