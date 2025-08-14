import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, MessageSquare, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatBubble from "./ChatBubble";

interface ChatTranscriptProps {
  transcript: string;
  onTranscriptChange: (value: string) => void;
  onRegenerateSOAP: () => void;
  isGenerating: boolean;
  originalTranscript?: string;
}

const ChatTranscript = ({
  transcript,
  onTranscriptChange,
  onRegenerateSOAP,
  isGenerating,
}: ChatTranscriptProps) => {
  const [viewMode, setViewMode] = useState<"chat" | "text" | "refined">("chat");

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
        messages[messages.length - 1].message += "\n" + trimmedLine;
      }
    });

    return messages;
  };

  const chatMessages = parseTranscript(transcript);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-foreground">
          Transkrip Percakapan
        </h2>
        <div className="flex bg-muted rounded-lg p-1 border">
          <Button
            variant={viewMode === "chat" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("chat")}
            className="h-8 px-3 text-xs"
          >
            <MessageSquare className="w-3 h-3 mr-1.5" /> Chat
          </Button>
          <Button
            variant={viewMode === "text" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("text")}
            className="h-8 px-3 text-xs"
          >
            <Edit3 className="w-3 h-3 mr-1.5" /> Edit
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">
              Memproses audio & transkrip...
            </p>
            <p className="text-sm text-muted-foreground">
              Harap tunggu sebentar.
            </p>
          </div>
        )}

        {viewMode === "chat" ? (
          <div className="h-full overflow-y-auto p-4 bg-muted/50 rounded-lg border">
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
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Transkrip akan muncul di sini</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Transkrip percakapan..."
            className="h-full w-full resize-none font-mono text-sm"
          />
        )}
      </div>

      <Button
        onClick={onRegenerateSOAP}
        disabled={!transcript.trim() || isGenerating}
        variant="medical"
        className="w-full h-12 mt-4 flex-shrink-0"
      >
        <RefreshCw
          className={cn("w-5 h-5 mr-2", isGenerating && "animate-spin")}
        />
        {isGenerating ? "Sedang Memproses..." : "Generate Ulang S.O.A.P."}
      </Button>
    </div>
  );
};

export default ChatTranscript;
