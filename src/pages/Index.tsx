import { useState } from 'react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { LessonList, type Lesson } from '@/components/LessonList';
import { ChatInterface } from '@/components/ChatInterface';
import { CourseHeader } from '@/components/CourseHeader';

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
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Main content area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Video player */}
            <div className="aspect-video bg-card rounded-lg shadow-elegant overflow-hidden">
              <YouTubePlayer
                key={`${currentLesson.videoId}-${startTime}`}
                videoId={currentLesson.videoId}
                startTime={startTime}
              />
            </div>
            
            {/* Current lesson info */}
            <div className="bg-card rounded-lg p-6 shadow-elegant border border-border/50">
              <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
              <p className="text-muted-foreground mb-4">{currentLesson.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Duración: {currentLesson.duration}</span>
                <span>•</span>
                <span>{currentLesson.completed ? 'Completada' : 'En progreso'}</span>
              </div>
            </div>
            
            {/* Lesson list - shown on mobile */}
            <div className="xl:hidden">
              <LessonList
                lessons={sampleLessons}
                currentLessonId={currentLesson.id}
                onLessonSelect={handleLessonSelect}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Lesson list - hidden on mobile */}
            <div className="hidden xl:block">
              <LessonList
                lessons={sampleLessons}
                currentLessonId={currentLesson.id}
                onLessonSelect={handleLessonSelect}
              />
            </div>
            
            {/* Chat interface */}
            <div className="h-[500px] xl:h-[600px]">
              <ChatInterface onTimestampClick={handleTimestampClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
