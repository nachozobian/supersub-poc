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
    <div className="space-y-3">
      {/* Compact header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Course Content</h3>
        <Badge variant="secondary" className="text-xs">
          {lessons.filter(l => l.completed).length}/{lessons.length}
        </Badge>
      </div>
      
      {/* Compact lesson list */}
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {lessons.map((lesson, index) => (
          <div 
            key={lesson.id}
            className={cn(
              "group cursor-pointer transition-colors rounded-md p-2 border",
              currentLessonId === lesson.id 
                ? "bg-accent/10 border-accent/30" 
                : "border-transparent hover:bg-muted/50"
            )}
            onClick={() => onLessonSelect(lesson)}
          >
            <div className="flex items-start gap-2">
              {/* Status icon */}
              <div className="flex-shrink-0 mt-0.5">
                {lesson.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : currentLessonId === lesson.id ? (
                  <PlayCircle className="h-4 w-4 text-accent" />
                ) : (
                  <Play className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Duration and number */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {lesson.duration}
                  </Badge>
                  {currentLessonId === lesson.id && (
                    <Badge variant="secondary" className="text-xs bg-accent/10 text-accent px-1 py-0">
                      Playing
                    </Badge>
                  )}
                </div>
                
                {/* Title - truncated */}
                <h4 className={cn(
                  "font-medium text-xs leading-tight truncate",
                  currentLessonId === lesson.id ? "text-accent" : "text-foreground"
                )}>
                  {lesson.title}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};