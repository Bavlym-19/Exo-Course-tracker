import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Upload, Loader2 } from "lucide-react";

export default function UploadPage() {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (!id) {
      setLocation("/login");
      return;
    }
    setStudentId(parseInt(id, 10));
  }, [setLocation]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Implement file upload to storage
      // For now, just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLocation("/quiz");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/30">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            العودة
          </Button>
          <h1 className="text-2xl font-bold text-accent">رفع لقطة شاشة</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 border-border/30">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                رفع لقطة شاشة من الكورس
              </h2>
              <p className="text-muted-foreground">
                قم برفع لقطة شاشة تظهر آخر جزء انتهيت منه في الكورس. سيتم تحليل الصورة باستخدام الذكاء الاصطناعي لتحديد نسبة التقدم.
              </p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-border/50 rounded-lg p-12 text-center hover:border-accent/50 transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="screenshot-input"
              />
              <label
                htmlFor="screenshot-input"
                className="flex flex-col items-center gap-4 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-12 w-12 text-accent animate-spin" />
                    <p className="text-foreground font-medium">جاري رفع الملف...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground group-hover:text-accent transition-colors" />
                    <div>
                      <p className="text-foreground font-medium">اسحب الصورة هنا أو انقر للاختيار</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG, GIF (حتى 10MB)</p>
                    </div>
                  </>
                )}
              </label>
            </div>

            {/* Instructions */}
            <div className="bg-card/50 border border-border/30 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-foreground">نصائح للحصول على أفضل النتائج:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>تأكد من وضوح الصورة والنص مقروء</li>
                <li>اشمل معلومات التقدم (النسبة المئوية أو الفصل الحالي)</li>
                <li>تجنب الظلال والانعكاسات على الشاشة</li>
                <li>استخدم صورة بدقة عالية إن أمكن</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
