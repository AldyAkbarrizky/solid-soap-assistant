import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface SOAPViewerProps {
  soapContent: string;
  onSOAPChange: (value: string) => void;
  onPrint: () => void;
}

const SOAPViewer = ({
  soapContent,
  onSOAPChange,
  onPrint,
}: SOAPViewerProps) => {
  const wordCount = soapContent
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Hasil S.O.A.P.
        </h2>
        <div className="text-sm text-muted-foreground">{wordCount} kata</div>
      </div>

      <Textarea
        value={soapContent}
        onChange={(e) => onSOAPChange(e.target.value)}
        placeholder="Catatan S.O.A.P. akan muncul di sini setelah audio diproses. Anda dapat mengedit hasilnya sesuai kebutuhan."
        className={cn(
          "min-h-[400px] resize-none text-sm",
          "border-border focus:border-primary focus:ring-primary",
          "transition-all duration-300"
        )}
      />

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
        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-start gap-2">
            <FileText className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Preview S.O.A.P.</h3>
              <p className="text-sm text-muted-foreground">
                Catatan medis siap untuk dicetak atau disimpan sebagai PDF.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOAPViewer;
