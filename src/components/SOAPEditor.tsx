import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Printer, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SOAPEditorProps {
  soapContent: string;
  onSOAPChange: (value: string) => void;
  onPrint: () => void;
  isGenerating?: boolean;
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
  onPrint,
  // NOT USED NOW, USED LATER
  // isGenerating = false,
}: SOAPEditorProps) => {
  const [isDiagnosisGenerating, setIsDiagnosisGenerating] = useState(false);
  // Parse SOAP content into 4 sections
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

  // Generate diagnosis and ICD-10 based on SOAP content
  const generateDiagnosisAndICD = async () => {
    setIsDiagnosisGenerating(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock data - in real app this would call AI API
    const mockDiagnoses = [
      {
        diagnosis: "Infeksi Saluran Pernapasan Atas (ISPA) - Common Cold",
        icd10: "J00 - Acute nasopharyngitis [common cold]",
      },
      {
        diagnosis: "Gastritis Akut",
        icd10: "K29.0 - Acute gastritis",
      },
      {
        diagnosis: "Hipertensi Esensial",
        icd10: "I10 - Essential hypertension",
      },
      {
        diagnosis: "Diabetes Mellitus Type 2",
        icd10: "E11.9 - Type 2 diabetes mellitus without complications",
      },
    ];

    // Simple logic based on SOAP content keywords
    const combinedText = (
      soapData.subjective +
      " " +
      soapData.objective +
      " " +
      soapData.assessment
    ).toLowerCase();

    let selectedDiagnosis = mockDiagnoses[0]; // default

    if (
      combinedText.includes("sakit perut") ||
      combinedText.includes("mual") ||
      combinedText.includes("gastritis")
    ) {
      selectedDiagnosis = mockDiagnoses[1];
    } else if (
      combinedText.includes("tekanan darah") ||
      combinedText.includes("hipertensi") ||
      combinedText.includes("tensi")
    ) {
      selectedDiagnosis = mockDiagnoses[2];
    } else if (
      combinedText.includes("diabetes") ||
      combinedText.includes("gula darah") ||
      combinedText.includes("dm")
    ) {
      selectedDiagnosis = mockDiagnoses[3];
    }

    const newData = {
      ...soapData,
      diagnosis: selectedDiagnosis.diagnosis,
      icd10: selectedDiagnosis.icd10,
    };
    onSOAPChange(combineSOAP(newData));
    setIsDiagnosisGenerating(false);
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
            "min-h-[100px] resize-none text-sm",
            "border-primary/20 focus:border-primary focus:ring-primary/20",
            "transition-all duration-300"
          )}
        />
      </div>

      {/* Objective Section */}
      <div className="space-y-2">
        <Label
          htmlFor="objective"
          className="text-sm font-medium text-medical-blue"
        >
          O - OBJECTIVE (Temuan Objektif)
        </Label>
        <Textarea
          id="objective"
          value={soapData.objective}
          onChange={(e) => updateSOAPSection("objective", e.target.value)}
          placeholder="Hasil pemeriksaan fisik, vital signs, hasil lab..."
          className={cn(
            "min-h-[100px] resize-none text-sm",
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
            "min-h-[100px] resize-none text-sm",
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
            "min-h-[100px] resize-none text-sm",
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
            onClick={generateDiagnosisAndICD}
            disabled={
              (!soapData.subjective.trim() &&
                !soapData.objective.trim() &&
                !soapData.assessment.trim()) ||
              isDiagnosisGenerating
            }
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs border-purple-600/20 text-purple-600 hover:bg-purple-600/10"
          >
            <Sparkles
              className={cn(
                "w-3 h-3 mr-1",
                isDiagnosisGenerating && "animate-spin"
              )}
            />
            {isDiagnosisGenerating ? "Loading..." : "Generate"}
          </Button>
        </div>
        <Textarea
          id="diagnosis"
          value={
            isDiagnosisGenerating
              ? "Mengenerate ulang diagnosa, harap tunggu..."
              : soapData.diagnosis
          }
          onChange={(e) =>
            !isDiagnosisGenerating &&
            updateSOAPSection("diagnosis", e.target.value)
          }
          placeholder="Kesimpulan diagnosis berdasarkan S.O.A.P..."
          className={cn(
            "min-h-[80px] resize-none text-sm",
            "border-purple-600/20 focus:border-purple-600 focus:ring-purple-600/20",
            "transition-all duration-300",
            isDiagnosisGenerating && "text-muted-foreground"
          )}
          disabled={isDiagnosisGenerating}
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
            onClick={generateDiagnosisAndICD}
            disabled={
              (!soapData.subjective.trim() &&
                !soapData.objective.trim() &&
                !soapData.assessment.trim()) ||
              isDiagnosisGenerating
            }
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs border-orange-600/20 text-orange-600 hover:bg-orange-600/10"
          >
            <Sparkles
              className={cn(
                "w-3 h-3 mr-1",
                isDiagnosisGenerating && "animate-spin"
              )}
            />
            {isDiagnosisGenerating ? "Loading..." : "Generate"}
          </Button>
        </div>
        <Textarea
          id="icd10"
          value={
            isDiagnosisGenerating
              ? "Mengenerate ulang kode ICD-10, harap tunggu..."
              : soapData.icd10
          }
          onChange={(e) =>
            !isDiagnosisGenerating && updateSOAPSection("icd10", e.target.value)
          }
          placeholder="Kode ICD-10 sesuai diagnosis (misal: J00 - Common cold)"
          className={cn(
            "min-h-[60px] resize-none text-sm",
            "border-orange-600/20 focus:border-orange-600 focus:ring-orange-600/20",
            "transition-all duration-300",
            isDiagnosisGenerating && "text-muted-foreground"
          )}
          disabled={isDiagnosisGenerating}
        />
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
        <Printer className="w-5 h-5 mr-2" />
        Cetak / Simpan sebagai PDF
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
