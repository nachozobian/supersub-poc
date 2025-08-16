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
    <div className="space-y-2">
      {lessons.map((lesson, index) => (
        <div 
          key={lesson.id}
          className={cn(
            "cursor-pointer rounded-lg p-3 transition-colors",
            currentLessonId === lesson.id 
              ? "bg-primary/10 border border-primary/20" 
              : "hover:bg-muted/50"
          )}
          onClick={() => onLessonSelect(lesson)}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {lesson.completed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : currentLessonId === lesson.id ? (
                <PlayCircle className="h-4 w-4 text-primary" />
              ) : (
                <Play className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-medium text-sm",
                currentLessonId === lesson.id ? "text-primary" : "text-foreground"
              )}>
                {lesson.title}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};