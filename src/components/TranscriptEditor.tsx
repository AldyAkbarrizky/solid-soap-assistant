import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptEditorProps {
  transcript: string;
  onTranscriptChange: (value: string) => void;
  onRegenerateSOAP: () => void;
  isGenerating: boolean;
}

const TranscriptEditor = ({
  transcript,
  onTranscriptChange,
  onRegenerateSOAP,
  isGenerating,
}: TranscriptEditorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Transkrip Percakapan
        </h2>
        <div className="text-sm text-muted-foreground">
          {transcript.length} karakter
        </div>
      </div>

      <Textarea
        value={transcript}
        onChange={(e) => onTranscriptChange(e.target.value)}
        placeholder="Transkrip percakapan akan muncul di sini. Anda dapat mengeditnya untuk memperbaiki kesalahan sebelum membuat catatan S.O.A.P."
        className={cn(
          "min-h-[400px] resize-none font-mono text-sm",
          "border-border focus:border-primary focus:ring-primary",
          "transition-all duration-300"
        )}
      />

      <Button
        onClick={onRegenerateSOAP}
        disabled={!transcript.trim() || isGenerating}
        variant="medical"
        className={cn(
          "w-full h-12",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <RefreshCw
          className={cn("w-5 h-5 mr-2", isGenerating && "animate-spin")}
        />
        {isGenerating ? "Sedang Memproses..." : "Generate Ulang S.O.A.P."}
      </Button>
    </div>
  );
};

export default TranscriptEditor;
