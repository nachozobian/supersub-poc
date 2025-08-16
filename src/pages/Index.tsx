import { useState } from 'react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { LessonList, type Lesson } from '@/components/LessonList';
import { ChatInterface } from '@/components/ChatInterface';
import { CourseHeader } from '@/components/CourseHeader';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample course data
const courseData = {
  title: "Desarrollo Frontend Moderno",
  instructor: "María González",
  totalDuration: "12h 30min",
  rating: 4.8,
  enrolledStudents: 2847,
};

const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introducción a React y conceptos fundamentales',
    duration: '15:30',
    videoId: 'dQw4w9WgXcQ',
    completed: true,
    description: 'Aprende los conceptos básicos de React, componentes y JSX'
  },
  {
    id: '2',
    title: 'Estado y Props en React',
    duration: '22:15',
    videoId: 'dQw4w9WgXcQ',
    completed: true,
    description: 'Manejo del estado de componentes y comunicación entre ellos'
  },
  {
    id: '3',
    title: 'Hooks de React: useState y useEffect',
    duration: '28:45',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Introducción a los hooks más importantes de React'
  },
  {
    id: '4',
    title: 'Enrutamiento con React Router',
    duration: '18:20',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Creación de aplicaciones de múltiples páginas'
  },
  {
    id: '5',
    title: 'Gestión de estado global con Context API',
    duration: '25:40',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Manejo del estado compartido entre componentes'
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
    // Find the lesson with this video ID
    const lesson = sampleLessons.find(l => l.videoId === videoId);
    if (lesson) {
      setCurrentLesson(lesson);
      setStartTime(timestamp);
      
      // Use the global seekTo function if available
      setTimeout(() => {
        if ((window as any).seekToTime) {
          (window as any).seekToTime(timestamp);
        }
      }, 1000);
    }
  };

  const completedLessons = sampleLessons.filter(l => l.completed).length;

  return (
    <div className="min-h-screen bg-gradient-background">
      <CourseHeader
        {...courseData}
        totalLessons={sampleLessons.length}
        completedLessons={completedLessons}
      />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          {/* Main content area - now taking 2 columns */}
          <div className="xl:col-span-2 space-y-6">
            {/* Video player with organic styling */}
            <div className="relative group">
              <div className="aspect-video bg-gradient-card rounded-3xl shadow-float overflow-hidden border border-border/50 transform hover:scale-[1.02] transition-organic">
                <YouTubePlayer
                  key={`${currentLesson.videoId}-${startTime}`}
                  videoId={currentLesson.videoId}
                  startTime={startTime}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full animate-handmade-pulse opacity-60" />
              <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-accent/60 rounded-[60%_40%_70%_30%] animate-float" />
            </div>
            
            {/* Current lesson info with handmade styling */}
            <div className="relative bg-gradient-card rounded-3xl p-6 shadow-handmade border border-border/50 transform hover:shadow-float transition-organic">
              {/* Decorative corner element */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-secondary rounded-full animate-handmade-pulse" />
              
              <h2 className="text-2xl font-bold mb-3 text-foreground">{currentLesson.title}</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">{currentLesson.description}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{currentLesson.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    currentLesson.completed ? "bg-accent animate-handmade-pulse" : "bg-coral animate-handmade-pulse"
                  )} />
                  <span className="font-medium text-foreground">
                    {currentLesson.completed ? 'Completada' : 'En progreso'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Lesson list - shown on mobile with handmade styling */}
            <div className="xl:hidden bg-gradient-card rounded-3xl p-6 shadow-handmade border border-border/50">
              <LessonList
                lessons={sampleLessons}
                currentLessonId={currentLesson.id}
                onLessonSelect={handleLessonSelect}
              />
            </div>
          </div>
          
          {/* Sidebar - NOW ON THE RIGHT */}
          <div className="xl:col-span-1 space-y-6">
            {/* Chat interface - now prominently on the right */}
            <div className="h-[calc(100vh-240px)] min-h-[600px]">
              <ChatInterface onTimestampClick={handleTimestampClick} />
            </div>
            
            {/* Lesson list - compact version for desktop, hidden on mobile */}
            <div className="hidden xl:block bg-gradient-card rounded-3xl p-6 shadow-handmade border border-border/50">
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
