import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Star, Sparkles } from "lucide-react";

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
    <div className="relative overflow-hidden">
      {/* Background with organic shapes */}
      <div className="absolute inset-0 bg-gradient-background">
        <div className="absolute top-10 left-20 w-32 h-32 bg-primary/3 rounded-[60%_40%_70%_30%] animate-float" />
        <div className="absolute top-32 right-16 w-24 h-24 bg-accent/5 rounded-[40%_60%_30%_70%] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-purple/4 rounded-[70%_30%_40%_60%] animate-float" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex-1">
            {/* Handmade-style badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge 
                variant="secondary" 
                className="bg-gradient-primary text-white border-0 shadow-handmade transform hover:scale-105 transition-organic px-4 py-2 rounded-full"
              >
                <Sparkles className="h-3 w-3 mr-2" />
                Curso Interactivo
              </Badge>
              <Badge 
                variant="outline" 
                className="border-accent/30 text-accent bg-accent/5 hover:bg-accent/10 transition-organic rounded-full px-4 py-2"
              >
                React & JavaScript
              </Badge>
            </div>
            
            {/* Creative title with handmade feel */}
            <div className="relative mb-6">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 leading-tight">
                {title}
              </h1>
              {/* Handmade underline effect */}
              <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-secondary rounded-full transform -rotate-1" />
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-handmade">
                <span className="text-white font-bold text-sm">{instructor.charAt(0)}</span>
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  {instructor}
                </p>
                <p className="text-sm text-muted-foreground">Instructor Experto</p>
              </div>
            </div>
            
            {/* Organic stats layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-gradient-card p-4 rounded-2xl shadow-organic border border-border/50 hover:shadow-float transition-organic">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Duración</span>
                </div>
                <p className="font-bold text-foreground">{totalDuration}</p>
              </div>
              
              <div className="bg-gradient-card p-4 rounded-2xl shadow-organic border border-border/50 hover:shadow-float transition-organic">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">Lecciones</span>
                </div>
                <p className="font-bold text-foreground">{totalLessons} videos</p>
              </div>
              
              <div className="bg-gradient-card p-4 rounded-2xl shadow-organic border border-border/50 hover:shadow-float transition-organic">
                <div className="flex items-center gap-2 text-purple mb-1">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Estudiantes</span>
                </div>
                <p className="font-bold text-foreground">{enrolledStudents.toLocaleString()}</p>
              </div>
              
              <div className="bg-gradient-card p-4 rounded-2xl shadow-organic border border-border/50 hover:shadow-float transition-organic">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">Rating</span>
                </div>
                <p className="font-bold text-foreground">{rating} / 5.0</p>
              </div>
            </div>
          </div>
          
          {/* Progress card with handmade style */}
          <div className="lg:w-80">
            <div className="bg-gradient-card p-6 rounded-3xl shadow-float border border-border/50 transform hover:scale-105 transition-organic">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-foreground">Tu Progreso</span>
                <div className="bg-gradient-secondary text-white px-3 py-1 rounded-full text-sm font-medium shadow-handmade">
                  {completedLessons}/{totalLessons}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <Progress value={progress} className="h-3 bg-muted" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full shadow-handmade animate-handmade-pulse" />
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{Math.round(progress)}% completado</span>
                  <span>{totalLessons - completedLessons} restantes</span>
                </div>
              </div>
              
              <Button className="w-full mt-6 bg-gradient-primary hover:opacity-90 shadow-handmade transition-bounce text-white rounded-2xl py-3 font-semibold">
                Continuar Aprendiendo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};