import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Star } from "lucide-react";

interface CourseHeaderProps {
  title: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  totalDuration: string;
  rating: number;
  enrolledStudents: number;
}

export const CourseHeader = ({
  title,
  instructor,
  totalLessons,
  completedLessons,
  totalDuration,
  rating,
  enrolledStudents
}: CourseHeaderProps) => {
  const progress = (completedLessons / totalLessons) * 100;

  return (
    <div className="bg-gradient-background border-b border-border/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                <BookOpen className="h-3 w-3 mr-1" />
                Curso Online
              </Badge>
              <Badge variant="outline" className="border-primary/20 text-primary">
                React & JavaScript
              </Badge>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-4">
              Por <span className="font-semibold text-foreground">{instructor}</span>
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {totalDuration}
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {totalLessons} lecciones
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {enrolledStudents.toLocaleString()} estudiantes
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {rating} / 5.0
              </div>
            </div>
          </div>
          
          <div className="lg:w-80 space-y-4">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progreso del curso</span>
                <span className="text-sm text-muted-foreground">
                  {completedLessons}/{totalLessons}
                </span>
              </div>
              <Progress value={progress} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(progress)}% completado
              </p>
            </div>
            
            <Button className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant transition-all duration-300">
              Continuar aprendiendo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};