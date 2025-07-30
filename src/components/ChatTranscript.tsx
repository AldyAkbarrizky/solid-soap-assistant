// ChatTranscript.tsx
// Area konten utama sekarang menampilkan status loading.

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
  // Prop untuk menyimpan transkrip asli sebelum di-refine
  originalTranscript?: string;
}

const ChatTranscript = ({
  transcript,
  onTranscriptChange,
  onRegenerateSOAP,
  isGenerating,
  originalTranscript = transcript, // Gunakan transkrip saat ini sebagai default
}: ChatTranscriptProps) => {
  // Mengembalikan viewMode dengan tiga opsi
  const [viewMode, setViewMode] = useState<"chat" | "text" | "refined">("chat");
  const [aiRefinementEnabled, setAiRefinementEnabled] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  // State terpisah untuk hasil refine, agar tidak mengganggu transkrip utama
  const [refinedTranscript, setRefinedTranscript] = useState("");

  // Fungsi untuk mem-parse transkrip menjadi format chat
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

  // Chat messages selalu di-generate dari prop 'transcript'
  const chatMessages = parseTranscript(transcript);

  // Fungsi untuk me-refine transkrip (simulasi)
  const refineTranscriptWithAI = async () => {
    if (!originalTranscript.trim()) return;

    setIsRefining(true);
    // Di aplikasi nyata, Anda akan memanggil backend di sini
    // await fetch('http://localhost:5001/refine-transcript', ...)
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulasi delay

    // Contoh hasil refine
    const refined = `Dokter: Selamat pagi Ibu, silakan duduk. Apa keluhan Anda hari ini?
Pasien: Selamat pagi Dok. Saya sakit kepala sudah tiga hari, kadang mual juga.
Dokter: Sakit kepalanya seperti apa? Berdenyut atau ditekan?
Pasien: Rasanya seperti ditekan, Dok. Terutama di dahi dan belakang kepala.`;

    setRefinedTranscript(refined);

    // Jika checkbox aktif, langsung update transkrip utama dengan hasil refine
    if (aiRefinementEnabled) {
      onTranscriptChange(refined);
    }
    setIsRefining(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Bagian AI Refinement */}
      <div className="flex items-center space-x-2 mb-3 p-3 bg-muted/30 rounded-lg border border-border">
        <Checkbox
          id="ai-refinement"
          checked={aiRefinementEnabled}
          onCheckedChange={(checked) =>
            setAiRefinementEnabled(checked as boolean)
          }
          disabled={isGenerating} // Dinonaktifkan selama proses utama
        />
        <Label
          htmlFor="ai-refinement"
          className={cn(
            "text-sm font-medium cursor-pointer",
            isGenerating && "text-muted-foreground"
          )}
        >
          Gunakan AI untuk memperbaiki kualitas transkrip
        </Label>
        <Button
          onClick={refineTranscriptWithAI}
          disabled={isRefining || isGenerating || !transcript} // Dinonaktifkan selama proses utama
          variant="outline"
          size="sm"
          className="ml-auto h-7 px-2 text-xs"
        >
          <Sparkles
            className={cn(
              "w-3 h-3 mr-1",
              (isRefining || isGenerating) && "animate-spin"
            )}
          />
          {isRefining || isGenerating ? "Memproses..." : "Refine"}
        </Button>
      </div>

      {/* Header dengan 3 tombol view */}
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
          <Button
            variant={viewMode === "refined" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("refined")}
            className="h-8 px-3 text-xs"
          >
            <Sparkles className="w-3 h-3 mr-1.5" /> AI Refined
          </Button>
        </div>
      </div>

      {/* Area Konten */}
      <div className="flex-1 min-h-0 relative">
        {/* --- PERBAIKAN DI SINI: Overlay Loading --- */}
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
        ) : viewMode === "text" ? (
          <Textarea
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            placeholder="Transkrip percakapan..."
            className="h-full w-full resize-none font-mono text-sm"
          />
        ) : (
          // viewMode === "refined"
          <Textarea
            value={
              isRefining
                ? "Sedang memproses dan memperbaiki transkrip dengan AI..."
                : refinedTranscript
            }
            readOnly
            placeholder="Hasil transkrip yang telah diperbaiki oleh AI akan muncul di sini..."
            className="h-full w-full resize-none font-mono text-sm bg-muted/50"
          />
        )}
      </div>

      {/* Tombol Generate Ulang */}
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
