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
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Lecciones del Curso</h3>
        <Badge variant="secondary" className="bg-gradient-primary text-white">
          {lessons.filter(l => l.completed).length}/{lessons.length} completadas
        </Badge>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {lessons.map((lesson, index) => (
          <Card 
            key={lesson.id}
            className={cn(
              "transition-all duration-300 cursor-pointer hover:shadow-md",
              currentLessonId === lesson.id && "ring-2 ring-primary shadow-glow"
            )}
          >
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start p-0 h-auto text-left"
                onClick={() => onLessonSelect(lesson)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-accent" />
                    ) : (
                      <div className="relative">
                        <Play className="h-5 w-5 text-muted-foreground" />
                        {currentLessonId === lesson.id && (
                          <div className="absolute -inset-1 bg-primary rounded-full animate-pulse opacity-20" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {lesson.duration}
                      </Badge>
                    </div>
                    
                    <h4 className={cn(
                      "font-medium text-sm leading-5 mb-1",
                      currentLessonId === lesson.id && "text-primary"
                    )}>
                      {lesson.title}
                    </h4>
                    
                    {lesson.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};