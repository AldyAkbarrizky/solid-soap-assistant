import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob) => void;
  isProcessing: boolean;
}

const AudioRecorder = ({ onAudioReady, isProcessing }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        onAudioReady(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast("Silakan berbicara dengan jelas");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Tidak dapat mengakses mikrofon");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      toast("Memproses audio...");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("audio/")) {
        onAudioReady(file);
        toast("Memproses audio...");
      } else {
        toast.error("Silakan pilih file audio yang valid");
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={startRecording}
          disabled={isRecording || isProcessing}
          variant="medical"
          size="lg"
          className={cn(
            "h-12 px-6",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Mic className="w-5 h-5 mr-2" />
          Mulai Merekam
        </Button>

        <Button
          onClick={stopRecording}
          disabled={!isRecording}
          variant="danger"
          size="lg"
          className={cn(
            "h-12 px-6",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isRecording && "animate-recording-pulse"
          )}
        >
          <Square className="w-5 h-5 mr-2" />
          Berhenti
        </Button>

        <div className="relative">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording || isProcessing}
            variant="success"
            size="lg"
            className={cn(
              "h-12 px-6",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Upload className="w-5 h-5 mr-2" />
            Unggah File Audio
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {isRecording && (
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-medical-red">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-muted-foreground">Sedang merekam...</div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
