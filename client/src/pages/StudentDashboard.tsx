import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Progress } from "@/components/ui/progress";
import { LogOut, Upload, BookOpen, BarChart3 } from "lucide-react";

export default function StudentDashboard() {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (!id) {
      setLocation("/login");
      return;
    }
    setStudentId(parseInt(id, 10));
  }, [setLocation]);

  const { data: student } = trpc.student.getProfile.useQuery(
    { studentId: studentId || 0 },
    { enabled: !!studentId }
  );

  const { data: progressLogs } = trpc.student.getProgressLogs.useQuery(
    { studentId: studentId || 0 },
    { enabled: !!studentId }
  );

  const { data: quizAttempts } = trpc.student.getQuizAttempts.useQuery(
    { studentId: studentId || 0 },
    { enabled: !!studentId }
  );

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentRole");
    setLocation("/login");
  };

  const calculateOverallProgress = () => {
    if (!progressLogs || progressLogs.length === 0) return 0;
    const latest = progressLogs[progressLogs.length - 1];
    return latest?.percentageComplete || 0;
  };

  const calculateUnderstanding = () => {
    if (!quizAttempts || quizAttempts.length === 0) return 0;
    const avgScore = quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length;
    return Math.round(avgScore);
  };

  const overallProgress = calculateOverallProgress();
  const understanding = calculateUnderstanding();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/30 sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-accent">Exo</h1>
            <p className="text-sm text-muted-foreground">لوحة تحكم الطالب</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{student?.name}</p>
              <p className="text-xs text-muted-foreground">{student?.jobTitle}</p>
              <p className="text-xs text-muted-foreground">الرقم: {studentId}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              تسجيل خروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">التقدم الكلي</h3>
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{overallProgress.toFixed(1)}%</p>
            <Progress value={overallProgress} className="h-2" />
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">نسبة الفهم</h3>
              <BarChart3 className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{understanding}%</p>
            <Progress value={understanding} className="h-2" />
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">عدد الاختبارات</h3>
              <BarChart3 className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">{quizAttempts?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-2">اختبار مكتمل</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-border/30">
            <h2 className="text-lg font-semibold text-foreground mb-4">رفع لقطة شاشة</h2>
            <p className="text-sm text-muted-foreground mb-4">
              قم برفع لقطة شاشة من آخر جزء انتهيت منه في الكورس
            </p>
            <Button className="w-full gap-2" onClick={() => setLocation("/upload")}>
              <Upload className="h-4 w-4" />
              رفع الآن
            </Button>
          </Card>

          <Card className="p-6 border-border/30">
            <h2 className="text-lg font-semibold text-foreground mb-4">رابط الكورس</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {student?.courseLink || "لم يتم تعيين رابط كورس بعد"}
            </p>
            <Button variant="outline" className="w-full" disabled={!student?.courseLink}>
              فتح الكورس
            </Button>
          </Card>
        </div>

        {/* Progress History */}
        <Card className="p-6 border-border/30">
          <h2 className="text-lg font-semibold text-foreground mb-4">سجل التقدم</h2>
          <div className="space-y-3">
            {progressLogs && progressLogs.length > 0 ? (
              progressLogs.slice().reverse().map((log, idx) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/20 hover:border-border/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      الجلسة {progressLogs.length - idx}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-accent">
                      {log.percentageComplete.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.sectionReached || "قسم غير محدد"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">لا توجد جلسات بعد</p>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
