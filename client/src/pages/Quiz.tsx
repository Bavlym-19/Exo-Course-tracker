import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function QuizPage() {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    if (!id) {
      setLocation("/login");
      return;
    }
    setStudentId(parseInt(id, 10));
    loadMockQuestions();
  }, [setLocation]);

  const loadMockQuestions = () => {
    const mockQuestions: Question[] = [
      {
        id: "1",
        question: "ما هو الموضوع الرئيسي للدرس الأخير؟",
        options: ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
        correctAnswer: "الخيار الثاني",
      },
      {
        id: "2",
        question: "أي من التالي يعتبر صحيحاً؟",
        options: ["البيان الأول", "البيان الثاني", "البيان الثالث", "البيان الرابع"],
        correctAnswer: "البيان الثالث",
      },
      {
        id: "3",
        question: "ما الفرق بين المفهومين؟",
        options: ["لا يوجد فرق", "الفرق الأول", "الفرق الثاني", "الفرق الثالث"],
        correctAnswer: "الفرق الثاني",
      },
    ];
    setQuestions(mockQuestions);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isAnswered = answers[currentQuestion?.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectAnswer = (option: string) => {
    if (!submitted) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: option,
      });
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">جاري تحميل الاختبار...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    const passed = score >= 50;
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border/30">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-accent">نتائج الاختبار</h1>
          </div>
        </header>

        <main className="container max-w-4xl mx-auto px-4 py-12">
          <Card className="p-8 text-center border-border/30">
            {passed ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-2">ممتاز!</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  لقد نجحت في الاختبار
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-2">لم تنجح</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  يجب أن تحصل على 50% على الأقل
                </p>
              </>
            )}

            <div className="bg-card/50 border border-border/30 rounded-lg p-6 mb-6">
              <p className="text-5xl font-bold text-accent">{score}%</p>
              <p className="text-muted-foreground mt-2">درجتك النهائية</p>
            </div>

            <Button
              onClick={() => setLocation("/dashboard")}
              className="w-full gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              العودة إلى لوحة التحكم
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border/30 sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-accent">الاختبار</h1>
            <p className="text-sm text-muted-foreground">
              السؤال {currentQuestionIndex + 1} من {questions.length}
            </p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 border-border/30">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {currentQuestion.question}
            </h2>

            <RadioGroup value={answers[currentQuestion.id] || ""} onValueChange={handleSelectAnswer}>
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-3 space-x-reverse">
                    <RadioGroupItem value={option} id={`option-${idx}`} />
                    <Label
                      htmlFor={`option-${idx}`}
                      className="flex-1 cursor-pointer p-3 rounded-lg border border-border/30 hover:border-accent/50 transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              السابق
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className="flex-1"
              >
                إرسال الاختبار
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!isAnswered} className="flex-1">
                التالي
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
