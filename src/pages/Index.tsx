import { useState } from "react";
import { Card } from "@/components/ui/card";
import AudioRecorder from "@/components/AudioRecorder";
import StatusIndicator from "@/components/StatusIndicator";
import ChatTranscript from "@/components/ChatTranscript";
import SOAPEditor from "@/components/SOAPEditor";
import { Stethoscope, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type StatusType = "idle" | "recording" | "processing" | "complete" | "error";

const Index = () => {
  const [status, setStatus] = useState<StatusType>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "Siap untuk merekam atau mengunggah file audio"
  );

  const [transcript, setTranscript] = useState("");
  const [soapContent, setSoapContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingDiagnose, setIsProcessingDiagnose] = useState(false);

  const updateStatus = (newStatus: StatusType, message: string) => {
    setStatus(newStatus);
    setStatusMessage(message);
  };

  const handleAudioReady = async (audioBlob: Blob) => {
    setIsProcessing(true);
    updateStatus("processing", "Mengunggah audio ke server...");

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    try {
      const response = await fetch(
        "https://solid-soap-assistant-be-production.up.railway.app/process-audio",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan pada server");
      }

      setTranscript(data.transcript);
      setSoapContent(data.soapContent);

      updateStatus(
        "complete",
        "Proses selesai! Silakan periksa dan edit hasil jika diperlukan."
      );
      toast.success("Transkrip dan catatan S.O.A.P. berhasil dibuat!");
    } catch (error) {
      console.error("Error processing audio:", error);
      const errorMessage = (error as Error).message;
      updateStatus("error", `Gagal memproses: ${errorMessage}`);
      toast.error(`Gagal memproses: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegenerateSOAP = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    updateStatus("processing", "Membuat ulang catatan S.O.A.P...");

    try {
      const response = await fetch(
        "https://solid-soap-assistant-be-production.up.railway.app/regenerate-soap-stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript: transcript }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal generate SOAP");

      setSoapContent(data.soapContent);
      updateStatus("complete", "S.O.A.P. berhasil dibuat ulang!");
      toast.success(
        "Catatan berhasil dibuat ulang berdasarkan transkrip yang diedit"
      );
    } catch (error) {
      console.error("Error regenerating SOAP:", error);
      const errorMessage = (error as Error).message;
      updateStatus("error", `Gagal generate ulang: ${errorMessage}`);
      toast.error(`Gagal generate ulang: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegenerateDiagnose = async () => {
    if (!soapContent.trim()) return;

    const soapMatch = soapContent.match(
      /SUBJECTIVE[\s\S]*?(?=DIAGNOSIS|ICD-10)/i
    );

    setIsProcessingDiagnose(true);
    toast.info("Generate ulang Diagnosa dan ICD-10");

    try {
      const response = await fetch(
        "https://solid-soap-assistant-be-production.up.railway.app/regenerate-diagnose-icd10",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ soapContent: soapMatch }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Gagal generate Diagnosis & ICD-10");

      setSoapContent(soapMatch![0].trim() + "\n\n" + data.diagnoseICD);
      updateStatus("complete", "Diagnosis berhasil dibuat ulang!");
      toast.success(
        "Catatan berhasil dibuat ulang berdasarkan S.O.A.P yang diedit"
      );
    } catch (error) {
      console.error("Error regenerating Diagnose:", error);
      const errorMessage = (error as Error).message;
      updateStatus("error", `Gagal generate ulang: ${errorMessage}`);
      toast.error(`Gagal generate ulang: ${errorMessage}`);
    } finally {
      setIsProcessingDiagnose(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Catatan Medis S.O.A.P.</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
              .content { white-space: pre-wrap; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <h1>Catatan Medis S.O.A.P.</h1>
            <div class="content">${soapContent}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Medical Transcription Assistant
              </h1>
              <p className="text-muted-foreground">
                Alat bantu transcribe audio menjadi catatan medis S.O.A.P.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Control Panel */}
        <Card className="p-6 shadow-medium border-border">
          <div className="space-y-6">
            <AudioRecorder
              onAudioReady={handleAudioReady}
              isProcessing={isProcessing}
            />
            <StatusIndicator status={status} message={statusMessage} />
          </div>
        </Card>

        {/* Main Work Area */}
        <div className="grid lg:grid-cols-2 gap-8 max-h-[1600px]">
          {/* Transcript Column */}
          <Card className="p-6 shadow-medium border-border flex flex-col max-h-[1600px]">
            <ChatTranscript
              transcript={transcript}
              onTranscriptChange={setTranscript}
              onRegenerateSOAP={handleRegenerateSOAP}
              isGenerating={isProcessing}
            />
          </Card>

          {/* SOAP Column */}
          <Card className="p-6 shadow-medium border-border max-h-[1600px]">
            <SOAPEditor
              soapContent={soapContent}
              onSOAPChange={setSoapContent}
              onRegenerateDiagnose={handleRegenerateDiagnose}
              onPrint={handlePrint}
              isGenerating={isProcessing}
              isGeneratingDiagnose={isProcessingDiagnose}
            />
          </Card>
        </div>

        {/* Footer */}
        <Card className="p-4 bg-warning/10 border-warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">
                Peringatan Keamanan
              </h3>
              <p className="text-sm text-muted-foreground">
                Aplikasi ini menggunakan demo API dan hanya cocok untuk
                prototipe. Jangan gunakan dengan data pasien sesungguhnya. Untuk
                penggunaan produksi, pastikan menggunakan API Key yang aman dan
                enkripsi data yang memadai.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
