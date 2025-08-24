import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, CheckCircle, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoId: string;
  videoUrl?: string;
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
    <div className="space-y-1">
      {lessons.map((lesson, index) => (
        <div 
          key={lesson.id}
          className={cn(
            "cursor-pointer rounded-lg p-3 transition-all duration-200 group hover:shadow-sm",
            currentLessonId === lesson.id 
              ? "bg-primary/10 border border-primary/20 shadow-sm" 
              : "hover:bg-muted/70 border border-transparent"
          )}
          onClick={() => onLessonSelect(lesson)}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {lesson.completed ? (
                <div className="relative">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-75"></div>
                </div>
              ) : currentLessonId === lesson.id ? (
                <div className="relative">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary">
                    {index + 1}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-medium text-sm leading-tight mb-1",
                currentLessonId === lesson.id ? "text-primary" : "text-foreground group-hover:text-primary"
              )}>
                {lesson.title}
              </h4>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{lesson.duration}</span>
                </div>
                {lesson.completed && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 border-green-200">
                    Completado
                  </Badge>
                )}
                {currentLessonId === lesson.id && !lesson.completed && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 border-blue-200">
                    Reproduciendo
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};