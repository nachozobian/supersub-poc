import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, CheckCircle, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoId: string;
  completed: boolean;
  description?: string;
}

interface LessonListProps {
  lessons: Lesson[];
  currentLessonId: string;
  onLessonSelect: (lesson: Lesson) => void;
}

export const LessonList = ({ lessons, currentLessonId, onLessonSelect }: LessonListProps) => {
  return (
    <div className="space-cozy">
      {/* Enhanced header with personality */}
      <div className="flex items-center justify-between mb-xl">
        <div className="space-tight">
          <h3 className="text-subheading font-heading text-foreground relative">
            Contenido del Curso
            <div className="absolute -bottom-xs left-0 w-20 h-0.5 bg-gradient-primary rounded-full" />
          </h3>
          <p className="text-body-large text-muted-foreground">
            {lessons.length} lecciones estructuradas para tu aprendizaje
          </p>
        </div>
        <Badge 
          variant="secondary" 
          className="bg-gradient-secondary text-white rounded-full px-lg py-sm shadow-handmade text-base font-semibold"
        >
          {lessons.filter(l => l.completed).length}/{lessons.length}
        </Badge>
      </div>
      
      {/* Enhanced lesson list with better spacing and interactions */}
      <div className="space-cozy max-h-[32rem] overflow-y-auto pr-sm">
        {lessons.map((lesson, index) => (
          <div 
            key={lesson.id}
            className={cn(
              "group relative transition-organic cursor-pointer animate-slide-up",
              currentLessonId === lesson.id && "scale-[1.02] z-10"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div 
              className={cn(
                "relative bg-gradient-card rounded-3xl p-xl shadow-organic border border-border/50 hover:shadow-float transition-organic interactive-hover",
                currentLessonId === lesson.id && "ring-2 ring-accent/40 shadow-hero bg-accent/5"
              )}
              onClick={() => onLessonSelect(lesson)}
            >
              {/* Enhanced lesson number with personality */}
              <div className="absolute -top-sm -left-sm">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-handmade transform group-hover:scale-110 transition-bounce",
                  currentLessonId === lesson.id 
                    ? "bg-gradient-hero animate-subtle-pulse" 
                    : "bg-gradient-primary group-hover:bg-gradient-secondary"
                )}>
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
              
              <div className="flex items-start gap-lg w-full pl-lg">
                {/* Enhanced status icon with clear visual hierarchy */}
                <div className="flex-shrink-0 mt-sm">
                  {lesson.completed ? (
                    <div className="relative">
                      <div className="p-md bg-success/10 rounded-2xl">
                        <CheckCircle className="h-6 w-6 text-success" />
                      </div>
                      <div className="absolute inset-0 bg-success/20 rounded-2xl animate-subtle-pulse" />
                    </div>
                  ) : currentLessonId === lesson.id ? (
                    <div className="relative">
                      <div className="p-md bg-accent/10 rounded-2xl">
                        <PlayCircle className="h-6 w-6 text-accent" />
                      </div>
                      <div className="absolute inset-0 bg-accent/20 rounded-2xl animate-subtle-pulse" />
                    </div>
                  ) : (
                    <div className="p-md bg-muted rounded-2xl group-hover:bg-primary/10 transition-gentle">
                      <Play className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-gentle" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 space-tight">
                  {/* Enhanced duration badge */}
                  <div className="flex items-center gap-md mb-sm">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs border rounded-full px-sm py-xs font-medium transition-gentle",
                        currentLessonId === lesson.id
                          ? "border-accent/30 text-accent bg-accent/10"
                          : "border-teal/20 text-teal bg-teal/5 hover:bg-teal/10"
                      )}
                    >
                      <Clock className="h-3 w-3 mr-xs" />
                      {lesson.duration}
                    </Badge>
                    
                    {currentLessonId === lesson.id && (
                      <Badge 
                        variant="secondary" 
                        className="bg-accent/10 text-accent border-accent/20 text-xs px-sm py-xs rounded-full animate-subtle-pulse"
                      >
                        Reproduciendo ahora
                      </Badge>
                    )}
                  </div>
                  
                  {/* Enhanced title with clear hierarchy */}
                  <h4 className={cn(
                    "font-semibold text-lg leading-6 mb-sm transition-organic",
                    currentLessonId === lesson.id 
                      ? "text-accent" 
                      : "text-foreground group-hover:text-primary"
                  )}>
                    {lesson.title}
                  </h4>
                  
                  {/* Enhanced description with better readability */}
                  {lesson.description && (
                    <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-foreground/80 transition-gentle">
                      {lesson.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Enhanced progress indicator */}
              <div className="absolute bottom-lg right-lg">
                {lesson.completed ? (
                  <div className="w-3 h-3 bg-success rounded-full animate-subtle-pulse shadow-handmade" />
                ) : currentLessonId === lesson.id ? (
                  <div className="w-3 h-3 bg-accent rounded-full animate-subtle-pulse shadow-handmade" />
                ) : (
                  <div className="w-3 h-3 bg-muted rounded-full group-hover:bg-primary transition-gentle" />
                )}
              </div>
              
              {/* Subtle hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-gentle rounded-3xl pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Enhanced footer with helpful information */}
      <div className="mt-xl p-lg bg-gradient-background rounded-2xl border border-border/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>Completadas: {lessons.filter(l => l.completed).length}</span>
          </div>
          <div className="flex items-center gap-sm text-muted-foreground">
            <div className="w-2 h-2 bg-accent rounded-full" />
            <span>En progreso: 1</span>
          </div>
          <div className="flex items-center gap-sm text-muted-foreground">
            <div className="w-2 h-2 bg-muted rounded-full" />
            <span>Pendientes: {lessons.filter(l => !l.completed).length - 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
};