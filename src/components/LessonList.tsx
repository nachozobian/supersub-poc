import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, CheckCircle } from "lucide-react";
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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground relative">
          Contenido del Curso
          <div className="absolute -bottom-1 left-0 w-16 h-0.5 bg-gradient-primary rounded-full" />
        </h3>
        <Badge 
          variant="secondary" 
          className="bg-gradient-secondary text-white rounded-full px-3 py-1 shadow-handmade"
        >
          {lessons.filter(l => l.completed).length}/{lessons.length}
        </Badge>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {lessons.map((lesson, index) => (
          <div 
            key={lesson.id}
            className={cn(
              "group relative transition-organic cursor-pointer",
              currentLessonId === lesson.id && "scale-105"
            )}
          >
            <div 
              className={cn(
                "relative bg-gradient-card rounded-2xl p-4 shadow-organic border border-border/50 hover:shadow-handmade transition-organic",
                currentLessonId === lesson.id && "ring-2 ring-primary/30 shadow-float bg-primary/5"
              )}
              onClick={() => onLessonSelect(lesson)}
            >
              {/* Lesson number circle with organic style */}
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-handmade transform group-hover:scale-110 transition-bounce">
                {String(index + 1).padStart(2, '0')}
              </div>
              
              <div className="flex items-start gap-4 w-full pl-4">
                <div className="flex-shrink-0 mt-2">
                  {lesson.completed ? (
                    <div className="relative">
                      <CheckCircle className="h-6 w-6 text-accent" />
                      <div className="absolute inset-0 bg-accent/20 rounded-full animate-handmade-pulse" />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className={cn(
                        "p-2 rounded-full transition-organic",
                        currentLessonId === lesson.id 
                          ? "bg-primary/20 text-primary" 
                          : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}>
                        <Play className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs border-accent/20 text-accent bg-accent/5 rounded-full px-2 py-1"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {lesson.duration}
                    </Badge>
                  </div>
                  
                  <h4 className={cn(
                    "font-semibold text-sm leading-5 mb-2 transition-organic",
                    currentLessonId === lesson.id 
                      ? "text-primary" 
                      : "text-foreground group-hover:text-primary"
                  )}>
                    {lesson.title}
                  </h4>
                  
                  {lesson.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {lesson.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Decorative element */}
              {currentLessonId === lesson.id && (
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-primary rounded-full animate-handmade-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};