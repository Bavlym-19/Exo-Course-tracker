import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  
  const loginMutation = trpc.auth.loginWithCode.useMutation({
    onSuccess: (data) => {
      // Store student info in localStorage
      localStorage.setItem("studentId", data.student.id.toString());
      localStorage.setItem("studentName", data.student.name);
      localStorage.setItem("studentRole", data.student.role);
      setLocation("/dashboard");
    },
    onError: (err) => {
      setError(err.message || "فشل تسجيل الدخول");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!code.trim()) {
      setError("الرجاء إدخال كود الدخول");
      return;
    }

    // القفزة السحرية لتخطي السيرفر والداتا بيز لـ بافلي
    if (code.trim() === "990" || code.trim() === "1") {
      localStorage.setItem("studentId", "990");
      localStorage.setItem("studentName", "Bavly Medhat (Admin)");
      localStorage.setItem("studentRole", "admin");
      
      // التوجيه فوراً للوحة التحكم
      setLocation("/dashboard");
      return;
    }

    const numCode = parseInt(code, 10);
    if (isNaN(numCode)) {
      setError("كود الدخول يجب أن يكون رقماً");
      return;
    }

    loginMutation.mutate({ code: numCode });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border-border/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent mb-2">Exo</h1>
          <p className="text-muted-foreground text-lg">منصة تتبع التقدم التعليمي</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-foreground">
              كود الدخول
            </label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              placeholder="أدخل كود الدخول الخاص بك"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loginMutation.isPending}
              className="text-lg text-center"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full h-11 text-base font-semibold"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              "دخول"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/30 text-center text-xs text-muted-foreground">
          <p>منصة تعليمية آمنة للموظفين والمتدربين</p>
        </div>
      </Card>
    </div>
  );
}
