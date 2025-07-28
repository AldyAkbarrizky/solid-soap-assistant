import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Stethoscope } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  speaker: "doctor" | "patient";
  timestamp?: string;
}

const ChatBubble = ({ message, speaker, timestamp }: ChatBubbleProps) => {
  const isDoctor = speaker === "doctor";

  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        isDoctor ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar
          className={cn(
            "w-8 h-8",
            isDoctor ? "bg-primary" : "bg-medical-green"
          )}
        >
          <AvatarFallback
            className={cn(
              "text-white text-xs",
              isDoctor ? "bg-primary" : "bg-medical-green"
            )}
          >
            {isDoctor ? (
              <Stethoscope className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col max-w-[75%]",
          isDoctor ? "items-start" : "items-end"
        )}
      >
        {/* Speaker Label */}
        <div
          className={cn(
            "text-xs font-medium mb-1",
            isDoctor ? "text-primary" : "text-medical-green"
          )}
        >
          {isDoctor ? "Dokter" : "Pasien"}
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm max-w-full",
            "transition-all duration-200 hover:shadow-md",
            isDoctor
              ? "bg-primary text-primary-foreground rounded-bl-md"
              : "bg-card border border-border text-card-foreground rounded-br-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>

        {/* Timestamp */}
        {timestamp && (
          <div className="text-xs text-muted-foreground mt-1">{timestamp}</div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
