import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BookOpen, BarChart3, Zap } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Navigation */}
      <nav className="bg-card/50 border-b border-border/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-accent">Exo</h1>
          <Button onClick={() => setLocation("/login")} className="gap-2">
            تسجيل الدخول
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          منصة تتبع التقدم التعليمي
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          تابع تقدمك في الكورسات الأونلاين باستخدام الذكاء الاصطناعي. احصل على تقييمات فورية واختبارات ذكية.
        </p>
        <Button
          size="lg"
          onClick={() => setLocation("/login")}
          className="gap-2 text-lg h-12"
        >
          ابدأ الآن
        </Button>
      </section>

      {/* Features Section */}
      <section className="bg-card/50 py-20 border-y border-border/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">
            المميزات الرئيسية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-accent/10 rounded-lg p-4 w-fit mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                رفع لقطات الشاشة
              </h4>
              <p className="text-muted-foreground">
                قم برفع لقطات شاشة من الكورس وسيتم تحليلها تلقائياً باستخدام الذكاء الاصطناعي
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-accent/10 rounded-lg p-4 w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                اختبارات ذكية
              </h4>
              <p className="text-muted-foreground">
                احصل على اختبارات مخصصة تقيس فهمك للمحتوى الذي درسته
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-accent/10 rounded-lg p-4 w-fit mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-accent" />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">
                تحليلات شاملة
              </h4>
              <p className="text-muted-foreground">
                تابع تقدمك مع رسوم بيانية وإحصائيات تفصيلية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            هل أنت مستعد للبدء؟
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            ادخل باستخدام كود الدخول الخاص بك وابدأ رحلتك التعليمية
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/login")}
            className="gap-2 text-lg h-12"
          >
            تسجيل الدخول الآن
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border/30 py-8">
        <div className="container max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 Exo - منصة تتبع التقدم التعليمي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
