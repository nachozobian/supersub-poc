import { useState } from 'react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { LessonList, type Lesson } from '@/components/LessonList';
import { ChatInterface } from '@/components/ChatInterface';
import { CourseHeader } from '@/components/CourseHeader';
import { Clock, PlayCircle, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple course data
const courseData = {
  title: "Modern Frontend Development with React",
  instructor: "Maria Gonzalez",
  totalDuration: "12h 30min",
  rating: 4.8,
  enrolledStudents: 2847,
};

// Simple lesson data
const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'React Fundamentals: Your First Component',
    duration: '15:30',
    videoId: 'dQw4w9WgXcQ',
    completed: true,
    description: 'Learn the basics of React, how to create components and understand JSX from scratch'
  },
  {
    id: '2',
    title: 'State and Props: Communication in React',
    duration: '22:15',
    videoId: 'dQw4w9WgXcQ',
    completed: true,
    description: 'Master component state management and communication between them using props'
  },
  {
    id: '3',
    title: 'React Hooks: useState and useEffect in Depth',
    duration: '28:45',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Discover the power of the most important React hooks and how they revolutionize development'
  },
  {
    id: '4',
    title: 'Routing with React Router: Modern Navigation',
    duration: '18:20',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Create multi-page applications with smooth and professional navigation'
  },
  {
    id: '5',
    title: 'Context API: Simplified Global State Management',
    duration: '25:40',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Manage shared state between components without complications using Context API'
  },
  {
    id: '6',
    title: 'Optimization and Performance: React in Production',
    duration: '31:15',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Advanced techniques to optimize your React application and improve user experience'
  },
];

const Index = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(sampleLessons[2]); // Currently watching lesson 3
  const [startTime, setStartTime] = useState(0);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setStartTime(0);
  };

  const handleTimestampClick = (videoId: string, timestamp: number) => {
    const lesson = sampleLessons.find(l => l.videoId === videoId);
    if (lesson) {
      setCurrentLesson(lesson);
      setStartTime(timestamp);
      
      setTimeout(() => {
        if ((window as any).seekToTime) {
          (window as any).seekToTime(timestamp);
        }
      }, 1000);
    }
  };

  const completedLessons = sampleLessons.filter(l => l.completed).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Simple main content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video player */}
            <div className="aspect-video bg-card rounded-xl shadow-sm overflow-hidden border border-border">
              <YouTubePlayer
                key={`${currentLesson.videoId}-${startTime}`}
                videoId={currentLesson.videoId}
                startTime={startTime}
              />
            </div>
            
            {/* Current lesson info */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <PlayCircle className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-primary">Current Lesson</span>
                <div className="flex items-center gap-2 text-muted-foreground ml-auto">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{currentLesson.duration}</span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {currentLesson.title}
              </h2>
              
              <p className="text-muted-foreground leading-relaxed">
                {currentLesson.description}
              </p>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    currentLesson.completed ? "bg-green-500" : "bg-blue-500"
                  )} />
                  <span className="text-sm font-medium text-foreground">
                    {currentLesson.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>Lesson {sampleLessons.findIndex(l => l.id === currentLesson.id) + 1} of {sampleLessons.length}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat area - right of video */}
          <div className="lg:col-span-1 space-y-4">
            {/* Chat interface */}
            <div className="h-[70vh] min-h-[600px]">
              <ChatInterface onTimestampClick={handleTimestampClick} />
            </div>
            
            {/* Lesson list */}
            <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
              <LessonList
                lessons={sampleLessons}
                currentLessonId={currentLesson.id}
                onLessonSelect={handleLessonSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
