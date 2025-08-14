import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Printer, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SOAPEditorProps {
  soapContent: string;
  onSOAPChange: (value: string) => void;
  onRegenerateDiagnose: () => void;
  onPrint: () => void;
  isGenerating?: boolean;
  isGeneratingDiagnose?: boolean;
}

interface SOAPData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosis: string;
  icd10: string;
}

const SOAPEditor = ({
  soapContent,
  onSOAPChange,
  onRegenerateDiagnose,
  onPrint,
  isGenerating = false,
  isGeneratingDiagnose = false,
}: SOAPEditorProps) => {
  const parseSOAP = (content: string): SOAPData => {
    const defaultData: SOAPData = {
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
      diagnosis: "",
      icd10: "",
    };

    if (!content.trim()) return defaultData;

    const sections = content.split(
      /(?=SUBJECTIVE|OBJECTIVE|ASSESSMENT|PLAN|DIAGNOSIS|ICD-10)/i
    );

    sections.forEach((section) => {
      const trimmed = section.trim();
      if (trimmed.toLowerCase().startsWith("subjective")) {
        defaultData.subjective = trimmed
          .replace(/^subjective[^:]*:/i, "")
          .trim();
      } else if (trimmed.toLowerCase().startsWith("objective")) {
        defaultData.objective = trimmed.replace(/^objective[^:]*:/i, "").trim();
      } else if (trimmed.toLowerCase().startsWith("assessment")) {
        defaultData.assessment = trimmed
          .replace(/^assessment[^:]*:/i, "")
          .trim();
      } else if (trimmed.toLowerCase().startsWith("plan")) {
        defaultData.plan = trimmed.replace(/^plan[^:]*:/i, "").trim();
      } else if (trimmed.toLowerCase().startsWith("diagnosis")) {
        defaultData.diagnosis = trimmed.replace(/^diagnosis[^:]*:/i, "").trim();
      } else if (trimmed.toLowerCase().startsWith("icd-10")) {
        defaultData.icd10 = trimmed.replace(/^icd-10[^:]*:/i, "").trim();
      }
    });

    return defaultData;
  };

  // Combine SOAP sections back into full content
  const combineSOAP = (data: SOAPData): string => {
    return `S.O.A.P. - CATATAN MEDIS

SUBJECTIVE (Keluhan Subjektif):
${data.subjective}

OBJECTIVE (Temuan Objektif):
${data.objective}

ASSESSMENT (Penilaian):
${data.assessment}

PLAN (Rencana Tindakan):
${data.plan}

DIAGNOSIS (Kesimpulan Diagnosa):
${data.diagnosis}

ICD-10 (Kode ICD-10):
${data.icd10}`;
  };

  const soapData = parseSOAP(soapContent);

  const updateSOAPSection = (section: keyof SOAPData, value: string) => {
    const newData = { ...soapData, [section]: value };
    onSOAPChange(combineSOAP(newData));
  };

  const getTotalWords = () => {
    const total = Object.values(soapData).join(" ").trim();
    return total.split(/\s+/).filter((word) => word.length > 0).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Hasil S.O.A.P.
        </h2>
        <div className="text-sm text-muted-foreground">
          {getTotalWords()} kata total
        </div>
      </div>
      <div className="flex-1 min-h-0 relative space-y-6">
        {isGenerating && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">
              Generate Hasil S.O.A.P & Diagnosis ICD-10...
            </p>
            <p className="text-sm text-muted-foreground">
              Harap tunggu sebentar.
            </p>
          </div>
        )}
        {/* Subjective Section */}
        <div className="space-y-2">
          <Label
            htmlFor="subjective"
            className="text-sm font-medium text-primary"
          >
            S - SUBJECTIVE (Keluhan Subjektif)
          </Label>
          <Textarea
            id="subjective"
            value={soapData.subjective}
            onChange={(e) => updateSOAPSection("subjective", e.target.value)}
            placeholder="Keluhan pasien, gejala yang dirasakan, riwayat penyakit..."
            className={cn(
              "min-h-[150px] resize-none text-sm",
              "border-primary/20 focus:border-primary focus:ring-primary/20",
              "transition-all duration-300"
            )}
          />
        </div>

        {/* Objective Section */}
        <div className="space-y-2">
          <Label
            htmlFor="objective"
            className="text-sm font-medium text-medical-red"
          >
            O - OBJECTIVE (Temuan Objektif)
          </Label>
          <Textarea
            id="objective"
            value={soapData.objective}
            onChange={(e) => updateSOAPSection("objective", e.target.value)}
            placeholder="Hasil pemeriksaan fisik, vital signs, hasil lab..."
            className={cn(
              "min-h-[150px] resize-none text-sm",
              "border-medical-blue/20 focus:border-medical-blue focus:ring-medical-blue/20",
              "transition-all duration-300"
            )}
          />
        </div>

        {/* Assessment Section */}
        <div className="space-y-2">
          <Label
            htmlFor="assessment"
            className="text-sm font-medium text-warning"
          >
            A - ASSESSMENT (Penilaian)
          </Label>
          <Textarea
            id="assessment"
            value={soapData.assessment}
            onChange={(e) => updateSOAPSection("assessment", e.target.value)}
            placeholder="Diagnosis, penilaian klinis, diagnosis banding..."
            className={cn(
              "min-h-[150px] resize-none text-sm",
              "border-warning/20 focus:border-warning focus:ring-warning/20",
              "transition-all duration-300"
            )}
          />
        </div>

        {/* Plan Section */}
        <div className="space-y-2">
          <Label
            htmlFor="plan"
            className="text-sm font-medium text-medical-green"
          >
            P - PLAN (Rencana Tindakan)
          </Label>
          <Textarea
            id="plan"
            value={soapData.plan}
            onChange={(e) => updateSOAPSection("plan", e.target.value)}
            placeholder="Rencana pengobatan, tindakan, edukasi pasien, kontrol..."
            className={cn(
              "min-h-[150px] resize-none text-sm",
              "border-medical-green/20 focus:border-medical-green focus:ring-medical-green/20",
              "transition-all duration-300"
            )}
          />
        </div>

        {/* Diagnosis Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="diagnosis"
              className="text-sm font-medium text-purple-600"
            >
              DIAGNOSIS (Kesimpulan Diagnosa)
            </Label>
            <Button
              onClick={onRegenerateDiagnose}
              disabled={
                (!soapData.subjective.trim() &&
                  !soapData.objective.trim() &&
                  !soapData.assessment.trim()) ||
                isGeneratingDiagnose
              }
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs border-purple-600/20 text-purple-600 hover:bg-purple-600/10"
            >
              <Sparkles
                className={cn(
                  "w-3 h-3 mr-1",
                  isGeneratingDiagnose && "animate-spin"
                )}
              />
              {isGeneratingDiagnose ? "Loading..." : "Generate"}
            </Button>
          </div>
          <Textarea
            id="diagnosis"
            value={
              isGeneratingDiagnose
                ? "Mengenerate ulang diagnosa, harap tunggu..."
                : soapData.diagnosis
            }
            onChange={(e) =>
              !isGeneratingDiagnose &&
              updateSOAPSection("diagnosis", e.target.value)
            }
            placeholder="Kesimpulan diagnosis berdasarkan S.O.A.P..."
            className={cn(
              "min-h-[150px] resize-none text-sm",
              "border-purple-600/20 focus:border-purple-600 focus:ring-purple-600/20",
              "transition-all duration-300",
              isGeneratingDiagnose && "text-muted-foreground"
            )}
            disabled={isGeneratingDiagnose}
          />
        </div>

        {/* ICD-10 Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="icd10"
              className="text-sm font-medium text-orange-600"
            >
              ICD-10 (Kode ICD-10)
            </Label>
            <Button
              onClick={onRegenerateDiagnose}
              disabled={
                (!soapData.subjective.trim() &&
                  !soapData.objective.trim() &&
                  !soapData.assessment.trim()) ||
                isGeneratingDiagnose
              }
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs border-orange-600/20 text-orange-600 hover:bg-orange-600/10"
            >
              <Sparkles
                className={cn(
                  "w-3 h-3 mr-1",
                  isGeneratingDiagnose && "animate-spin"
                )}
              />
              {isGeneratingDiagnose ? "Loading..." : "Generate"}
            </Button>
          </div>
          <Textarea
            id="icd10"
            value={
              isGeneratingDiagnose
                ? "Mengenerate ulang kode ICD-10, harap tunggu..."
                : soapData.icd10
            }
            onChange={(e) =>
              !isGeneratingDiagnose &&
              updateSOAPSection("icd10", e.target.value)
            }
            placeholder="Kode ICD-10 sesuai diagnosis (misal: J00 - Common cold)"
            className={cn(
              "min-h-[150px] resize-none text-sm",
              "border-orange-600/20 focus:border-orange-600 focus:ring-orange-600/20",
              "transition-all duration-300",
              isGeneratingDiagnose && "text-muted-foreground"
            )}
            disabled={isGeneratingDiagnose}
          />
        </div>
      </div>

      <Button
        onClick={onPrint}
        disabled={!soapContent.trim()}
        variant="success"
        className={cn(
          "w-full h-12",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Printer
          className={cn("w-5 h-5 mr-2", isGenerating && "animate-spin")}
        />
        {isGenerating ? "Sedang Memproses..." : "Cetak / Simpan sebagai PDF"}
      </Button>

      {soapContent.trim() && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-start gap-2">
            <FileText className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Preview S.O.A.P.</h3>
              <p className="text-sm text-muted-foreground">
                Catatan medis terstruktur siap untuk dicetak atau disimpan
                sebagai PDF.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subjective:</span>
                  <span className="font-medium">
                    {
                      soapData.subjective
                        .split(/\s+/)
                        .filter((w) => w.length > 0).length
                    }{" "}
                    kata
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Objective:</span>
                  <span className="font-medium">
                    {
                      soapData.objective
                        .split(/\s+/)
                        .filter((w) => w.length > 0).length
                    }{" "}
                    kata
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assessment:</span>
                  <span className="font-medium">
                    {
                      soapData.assessment
                        .split(/\s+/)
                        .filter((w) => w.length > 0).length
                    }{" "}
                    kata
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">
                    {
                      soapData.plan.split(/\s+/).filter((w) => w.length > 0)
                        .length
                    }{" "}
                    kata
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diagnosis:</span>
                  <span className="font-medium">
                    {
                      soapData.diagnosis
                        .split(/\s+/)
                        .filter((w) => w.length > 0).length
                    }{" "}
                    kata
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ICD-10:</span>
                  <span className="font-medium">
                    {soapData.icd10.trim() ? "Ada" : "Kosong"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOAPEditor;
