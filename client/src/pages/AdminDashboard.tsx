import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const id = localStorage.getItem("studentId");
    const role = localStorage.getItem("studentRole");
    
    if (!id || role !== "admin") {
      setLocation("/login");
      return;
    }
    
    setStudentId(parseInt(id, 10));
  }, [setLocation]);

  const { data: students } = trpc.admin.getAllStudents.useQuery();

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentRole");
    setLocation("/login");
  };

  const totalStudents = students?.length || 0;
  const activeStudents = students?.filter(s => s.isActive).length || 0;
  const inactiveStudents = totalStudents - activeStudents;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/30 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-accent">Exo</h1>
            <p className="text-sm text-muted-foreground">لوحة تحكم المسؤول</p>
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
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">إجمالي الطلاب</h3>
              <Users className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">الطلاب النشطين</h3>
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{activeStudents}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}% من الإجمالي
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">الطلاب غير النشطين</h3>
              <TrendingUp className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-3xl font-bold text-foreground">{inactiveStudents}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {totalStudents > 0 ? Math.round((inactiveStudents / totalStudents) * 100) : 0}% من الإجمالي
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">متوسط التقدم</h3>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">-</p>
            <p className="text-xs text-muted-foreground mt-2">قريباً</p>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="border-border/30">
          <div className="p-6 border-b border-border/30">
            <h2 className="text-lg font-semibold text-foreground">قائمة الطلاب</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30">
                  <TableHead className="text-right">الرقم</TableHead>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right">آخر دخول</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students && students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id} className="border-border/20 hover:bg-card/50 transition-colors">
                      <TableCell className="font-medium text-foreground">{student.id}</TableCell>
                      <TableCell className="text-foreground">{student.name}</TableCell>
                      <TableCell>
                        <Badge variant={student.isActive ? "default" : "outline"}>
                          {student.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(student.createdAt).toLocaleDateString("ar-EG")}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(student.updatedAt).toLocaleDateString("ar-EG")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      لا توجد بيانات طلاب
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
