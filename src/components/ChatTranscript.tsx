import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RefreshCw, MessageSquare, Edit3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatBubble from "./ChatBubble";

interface ChatTranscriptProps {
  transcript: string;
  onTranscriptChange: (value: string) => void;
  onRegenerateSOAP: () => void;
  isGenerating: boolean;
  originalTranscript?: string;
  onOriginalTranscriptChange?: (value: string) => void;
}

const ChatTranscript = ({
  transcript,
  onTranscriptChange,
  onRegenerateSOAP,
  isGenerating,
  originalTranscript = "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onOriginalTranscriptChange,
}: ChatTranscriptProps) => {
  const [viewMode, setViewMode] = useState<"chat" | "text" | "refined">("chat");
  const [aiRefinementEnabled, setAiRefinementEnabled] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refinedTranscript, setRefinedTranscript] = useState("");

  // Parse transcript into chat messages
  const parseTranscript = (text: string) => {
    if (!text.trim()) return [];

    const lines = text.split("\n").filter((line) => line.trim());
    const messages: { speaker: "doctor" | "patient"; message: string }[] = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.toLowerCase().startsWith("dokter:")) {
        messages.push({
          speaker: "doctor",
          message: trimmedLine.substring(7).trim(),
        });
      } else if (trimmedLine.toLowerCase().startsWith("pasien:")) {
        messages.push({
          speaker: "patient",
          message: trimmedLine.substring(7).trim(),
        });
      } else if (messages.length > 0) {
        // Continuation of previous message
        messages[messages.length - 1].message += "\n" + trimmedLine;
      }
    });

    return messages;
  };

  const chatMessages = parseTranscript(transcript);

  // Function to refine transcript with AI
  const refineTranscriptWithAI = async () => {
    if (!originalTranscript.trim()) return;

    setIsRefining(true);

    // Simulate AI refinement API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock AI refinement - in real app this would call AI API
    const refined = originalTranscript
      .replace(/um\.\.\./g, "")
      .replace(/eh\.\.\./g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");

    setRefinedTranscript(refined);
    if (aiRefinementEnabled) {
      onTranscriptChange(refined);
    }
    setIsRefining(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* AI Refinement Checkbox */}
      <div className="flex items-center space-x-2 mb-3 p-3 bg-muted/30 rounded-lg border border-border">
        <Checkbox
          id="ai-refinement"
          checked={aiRefinementEnabled}
          onCheckedChange={(checked) =>
            setAiRefinementEnabled(checked as boolean)
          }
        />
        <Label
          htmlFor="ai-refinement"
          className="text-sm font-medium cursor-pointer"
        >
          Gunakan AI untuk memperbaiki kualitas transkrip
        </Label>
        {aiRefinementEnabled && originalTranscript && (
          <Button
            onClick={refineTranscriptWithAI}
            disabled={isRefining}
            variant="outline"
            size="sm"
            className="ml-auto h-7 px-2 text-xs"
          >
            <Sparkles
              className={cn("w-3 h-3 mr-1", isRefining && "animate-spin")}
            />
            {isRefining ? "Processing..." : "Refine"}
          </Button>
        )}
      </div>

      {/* Header - Fixed */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-foreground">
          Transkrip Percakapan
        </h2>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {transcript.length} karakter
          </div>
          <div className="flex bg-background rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("chat")}
              className={cn(
                "h-8 px-3 text-xs cursor-pointer",
                viewMode === "chat" && "bg-card shadow-sm"
              )}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("text")}
              className={cn(
                "h-8 px-3 text-xs cursor-pointer",
                viewMode === "text" && "bg-card shadow-sm"
              )}
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("refined")}
              className={cn(
                "h-8 px-3 text-xs cursor-pointer",
                viewMode === "refined" && "bg-card shadow-sm"
              )}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Refined
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area - Flexible */}
      <div className="flex-1 min-h-0 flex flex-col h-full">
        {viewMode === "chat" ? (
          <div className="flex-1 overflow-y-auto p-4 bg-muted/30 rounded-lg border border-border">
            {chatMessages.length > 0 ? (
              <div className="space-y-2">
                {chatMessages.map((msg, index) => (
                  <ChatBubble
                    key={index}
                    message={msg.message}
                    speaker={msg.speaker}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Transkrip percakapan akan muncul di sini</p>
                  <p className="text-xs mt-1">dalam format chat bubble</p>
                </div>
              </div>
            )}
          </div>
        ) : viewMode === "text" ? (
          <Textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Transkrip percakapan akan muncul di sini. Format:
Dokter: Selamat pagi, bagaimana kabar Anda?
Pasien: Saya merasa sakit kepala, Dok.
Dokter: Sudah berapa lama sakit kepalanya?"
            className={cn(
              "flex-1 resize-none font-mono text-sm",
              "border-border focus:border-primary focus:ring-primary",
              "transition-all duration-300"
            )}
          />
        ) : (
          <Textarea
            value={
              isRefining
                ? "Sedang memproses dan memperbaiki transkrip dengan AI, harap tunggu..."
                : refinedTranscript
            }
            onChange={(e) =>
              !isRefining && setRefinedTranscript(e.target.value)
            }
            placeholder="Transkrip yang telah diperbaiki oleh AI akan muncul di sini..."
            className={cn(
              "flex-1 resize-none font-mono text-sm",
              "border-green-600/20 focus:border-green-600 focus:ring-green-600/20",
              "transition-all duration-300",
              isRefining && "text-muted-foreground"
            )}
            disabled={isRefining}
          />
        )}

        {/* Button - Fixed at bottom */}
        <Button
          onClick={onRegenerateSOAP}
          disabled={!transcript.trim() || isGenerating}
          variant="medical"
          className={cn(
            "w-full h-12 mt-4 flex-shrink-0",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <RefreshCw
            className={cn("w-5 h-5 mr-2", isGenerating && "animate-spin")}
          />
          {isGenerating ? "Sedang Memproses..." : "Generate Ulang S.O.A.P."}
        </Button>
      </div>
    </div>
  );
};

export default ChatTranscript;
