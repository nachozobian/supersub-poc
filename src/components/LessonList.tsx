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
      {/* Simple header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Course Content
        </h3>
        <Badge 
          variant="secondary" 
          className="bg-muted text-muted-foreground text-sm"
        >
          {lessons.filter(l => l.completed).length}/{lessons.length}
        </Badge>
      </div>
      
      {/* Simple lesson list */}
      <div className="space-y-2 max-h-[24rem] overflow-y-auto">
        {lessons.map((lesson, index) => (
          <div 
            key={lesson.id}
            className={cn(
              "group cursor-pointer transition-colors",
              currentLessonId === lesson.id && "bg-accent/5"
            )}
            onClick={() => onLessonSelect(lesson)}
          >
            <div className={cn(
              "bg-card rounded-lg p-4 border border-border hover:border-accent/30 transition-colors",
              currentLessonId === lesson.id && "border-accent/50 bg-accent/5"
            )}>
              <div className="flex items-start gap-3">
                {/* Status icon */}
                <div className="flex-shrink-0 mt-1">
                  {lesson.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : currentLessonId === lesson.id ? (
                    <PlayCircle className="h-5 w-5 text-accent" />
                  ) : (
                    <Play className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Duration and status */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {lesson.duration}
                    </Badge>
                    {currentLessonId === lesson.id && (
                      <Badge variant="secondary" className="text-xs bg-accent/10 text-accent">
                        Playing
                      </Badge>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h4 className={cn(
                    "font-medium text-sm leading-tight mb-1",
                    currentLessonId === lesson.id 
                      ? "text-accent" 
                      : "text-foreground"
                  )}>
                    {lesson.title}
                  </h4>
                  
                  {/* Description */}
                  {lesson.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {lesson.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};