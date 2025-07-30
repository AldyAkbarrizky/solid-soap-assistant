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

  // BACKUP FOR DATA EXAMPLE AND DATA FORMAT, DO NOT DELETE

  //   const [transcript, setTranscript] =
  //     useState(`Dokter: Selamat pagi, Ibu. Silakan duduk. Bagaimana keluhan Anda hari ini?

  // Pasien: Selamat pagi, Dok. Saya merasa sakit kepala sudah 3 hari ini, dan kadang-kadang merasa mual juga.

  // Dokter: Sakit kepalanya seperti apa, Bu? Apakah berdenyut atau seperti ditekan?

  // Pasien: Rasanya seperti ditekan, Dok. Terutama di bagian dahi dan belakang kepala. Kadang sampai ke leher juga.

  // Dokter: Apakah ada yang memicu sakit kepala ini? Misalnya stress, kurang tidur, atau makanan tertentu?

  // Pasien: Mungkin stress, Dok. Minggu ini saya banyak deadline pekerjaan dan tidur kurang dari 6 jam setiap malam. Kadang sampai begadang.

  // Dokter: Apakah Ibu pernah mengalami sakit kepala seperti ini sebelumnya?

  // Pasien: Pernah, Dok. Tapi tidak separah ini. Biasanya kalau capek aja.

  // Dokter: Baik, saya akan periksa tekanan darah dan suhu Anda dulu. Kemudian saya akan memberikan obat untuk mengurangi sakit kepala dan saran untuk istirahat yang cukup.

  // Pasien: Baik, Dok. Terima kasih.`);
  //   const [soapContent, setSoapContent] = useState(`S.O.A.P. - CATATAN MEDIS

  // SUBJECTIVE (Keluhan Subjektif):
  // - Pasien mengeluh sakit kepala sejak 3 hari yang lalu
  // - Sakit kepala terasa seperti ditekan, terutama di dahi dan belakang kepala, menjalar ke leher
  // - Disertai mual kadang-kadang
  // - Pasien mengalami stress dan kurang tidur (< 6 jam/malam) karena deadline pekerjaan, sering begadang
  // - Riwayat sakit kepala serupa sebelumnya saat kelelahan, namun tidak separah sekarang

  // OBJECTIVE (Temuan Objektif):
  // - Pemeriksaan fisik akan dilakukan
  // - Pemeriksaan tekanan darah dan suhu tubuh
  // - Pasien tampak sedikit lelah
  // - Belum ada pemeriksaan neurologis detail

  // ASSESSMENT (Penilaian):
  // - Tension headache (sakit kepala tegang) kemungkinan akibat stress dan kurang tidur
  // - Perlu evaluasi lebih lanjut untuk menyingkirkan kemungkinan lain
  // - Faktor pemicu: stress kerja dan gangguan pola tidur

  // PLAN (Rencana Tindakan):
  // 1. Pemberian analgesik untuk mengurangi sakit kepala
  // 2. Edukasi tentang manajemen stress dan sleep hygiene
  // 3. Anjuran istirahat cukup (7-8 jam/malam)
  // 4. Hindari begadang dan atur jadwal kerja yang lebih seimbang
  // 5. Kontrol jika keluhan tidak membaik dalam 3-5 hari
  // 6. Rujukan ke spesialis neurologi jika diperlukan

  // Catatan: Pasien dianjurkan untuk menjaga pola tidur dan mengelola stress dengan baik.`);
  const [transcript, setTranscript] = useState("");
  const [soapContent, setSoapContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const updateStatus = (newStatus: StatusType, message: string) => {
    setStatus(newStatus);
    setStatusMessage(message);
  };

  // DO NOT DELETE, BACKUP FOR DATA FORMAT
  //   const handleAudioReady = async () => {
  //     setIsProcessing(true);
  //     updateStatus("processing", "Memproses audio menjadi teks...");

  //     // Simulasi API call untuk Whisper
  //     setTimeout(() => {
  //       const mockTranscript = `Dokter: Selamat pagi, Ibu. Bagaimana keluhan Anda hari ini?

  // Pasien: Selamat pagi, Dok. Saya merasa sakit kepala sudah 3 hari ini, dan kadang-kadang merasa mual juga.

  // Dokter: Sakit kepalanya seperti apa? Apakah berdenyut atau seperti ditekan?

  // Pasien: Rasanya seperti ditekan, Dok. Terutama di bagian dahi dan belakang kepala.

  // Dokter: Apakah ada yang memicu sakit kepala ini? Misalnya stress, kurang tidur, atau makanan tertentu?

  // Pasien: Mungkin stress, Dok. Minggu ini saya banyak deadline pekerjaan dan tidur kurang dari 6 jam setiap malam.

  // Dokter: Baik, saya akan periksa tekanan darah dan suhu Anda dulu. Kemudian saya akan memberikan obat untuk mengurangi sakit kepala dan saran untuk istirahat yang cukup.`;

  //       setTranscript(mockTranscript);
  //       updateStatus("processing", "Membuat catatan S.O.A.P...");

  //       // Simulasi API call untuk GPT
  //       setTimeout(() => {
  //         const mockSOAP = `S.O.A.P. - CATATAN MEDIS

  // SUBJECTIVE (Keluhan Subjektif):
  // - Pasien mengeluh sakit kepala sejak 3 hari yang lalu
  // - Sakit kepala terasa seperti ditekan, terutama di dahi dan belakang kepala
  // - Disertai mual kadang-kadang
  // - Pasien mengalami stress dan kurang tidur (< 6 jam/malam) karena deadline pekerjaan

  // OBJECTIVE (Temuan Objektif):
  // - Pemeriksaan fisik akan dilakukan
  // - Pemeriksaan tekanan darah dan suhu tubuh
  // - Pasien tampak sedikit lelah

  // ASSESSMENT (Penilaian):
  // - Tension headache (sakit kepala tegang) kemungkinan akibat stress dan kurang tidur
  // - Perlu evaluasi lebih lanjut untuk menyingkirkan kemungkinan lain

  // PLAN (Rencana Tindakan):
  // 1. Pemberian analgesik untuk mengurangi sakit kepala
  // 2. Edukasi tentang manajemen stress
  // 3. Anjuran istirahat cukup (7-8 jam/malam)
  // 4. Kontrol jika keluhan tidak membaik dalam 3-5 hari
  // 5. Hindari pemicu stress berlebihan

  // Catatan: Pasien dianjurkan untuk menjaga pola tidur dan mengelola stress dengan baik.`;

  //         setSoapContent(mockSOAP);
  //         updateStatus(
  //           "complete",
  //           "Proses selesai! Silakan periksa dan edit hasil jika diperlukan."
  //         );
  //         setIsProcessing(false);

  //         toast("Transkrip dan catatan S.O.A.P. telah dibuat");
  //       }, 2000);
  //     }, 3000);
  //   };

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

    // // Simulasi regenerate SOAP
    // setTimeout(() => {
    //   updateStatus("complete", "S.O.A.P. berhasil dibuat ulang!");
    //   setIsProcessing(false);

    //   toast("Catatan berhasil dibuat ulang berdasarkan transkrip yang diedit");
    // }, 2000);

    try {
      const ollamaUrl = "http://localhost:11434/api/generate";
      const prompt = `... (gunakan prompt yang sama seperti di backend) ...
                      ---
                      **Transkrip Percakapan:**
                      ${transcript}
                      ---
                      **Hasil S.O.A.P.:**
                      `;

      const payload = {
        model: "hf.co/gmonsoon/gemma2-9b-cpt-sahabatai-v1-instruct-GGUF:Q4_K_M",
        prompt,
        stream: false,
      };
      const response = await fetch(ollamaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal generate SOAP");

      setSoapContent(data.response.trim());
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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Transcript Column */}
          <Card className="p-6 shadow-medium border-border flex flex-col">
            <ChatTranscript
              transcript={transcript}
              onTranscriptChange={setTranscript}
              onRegenerateSOAP={handleRegenerateSOAP}
              isGenerating={isProcessing}
            />
          </Card>

          {/* SOAP Column */}
          <Card className="p-6 shadow-medium border-border">
            <SOAPEditor
              soapContent={soapContent}
              onSOAPChange={setSoapContent}
              onPrint={handlePrint}
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
