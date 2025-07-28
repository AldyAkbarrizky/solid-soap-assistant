import { cn } from "@/lib/utils";

type StatusType = "idle" | "recording" | "processing" | "complete" | "error";

interface StatusIndicatorProps {
  status: StatusType;
  message: string;
}

const StatusIndicator = ({ status, message }: StatusIndicatorProps) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "recording":
        return "bg-medical-red animate-pulse-glow";
      case "processing":
        return "bg-warning animate-pulse-glow";
      case "complete":
        return "bg-medical-green";
      case "error":
        return "bg-destructive";
      default:
        return "bg-muted-foreground";
    }
  };

  const getTextColor = (status: StatusType) => {
    switch (status) {
      case "recording":
        return "text-medical-red";
      case "processing":
        return "text-warning";
      case "complete":
        return "text-medical-green";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border shadow-soft">
      <div
        className={cn(
          "w-3 h-3 rounded-full transition-all duration-300",
          getStatusColor(status)
        )}
      />
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-300",
          getTextColor(status)
        )}
      >
        {message}
      </span>
    </div>
  );
};

export default StatusIndicator;
