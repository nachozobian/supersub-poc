import { useState } from 'react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { LessonList, type Lesson } from '@/components/LessonList';
import { ChatInterface } from '@/components/ChatInterface';
import { CourseHeader } from '@/components/CourseHeader';
import { Clock, PlayCircle, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced course data with more personality
const courseData = {
  title: "Desarrollo Frontend Moderno con React",
  instructor: "María González",
  totalDuration: "12h 30min",
  rating: 4.8,
  enrolledStudents: 2847,
};

// Enhanced lesson data with better descriptions and personality
const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'Fundamentos de React: Tu primer componente',
    duration: '15:30',
    videoId: 'dQw4w9WgXcQ',
    completed: true,
    description: 'Aprende los conceptos básicos de React, cómo crear componentes y entender JSX desde cero'
  },
  {
    id: '2',
    title: 'Estado y Props: La comunicación en React',
    duration: '22:15',
    videoId: 'dQw4w9WgXcQ',
    completed: true,
    description: 'Domina el manejo del estado de componentes y la comunicación entre ellos usando props'
  },
  {
    id: '3',
    title: 'Hooks de React: useState y useEffect en profundidad',
    duration: '28:45',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Descubre el poder de los hooks más importantes de React y cómo revolucionan el desarrollo'
  },
  {
    id: '4',
    title: 'Enrutamiento con React Router: Navegación moderna',
    duration: '18:20',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Crea aplicaciones de múltiples páginas con navegación fluida y profesional'
  },
  {
    id: '5',
    title: 'Context API: Gestión de estado global simplificada',
    duration: '25:40',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Maneja el estado compartido entre componentes sin complicaciones usando Context API'
  },
  {
    id: '6',
    title: 'Optimización y Performance: React en producción',
    duration: '31:15',
    videoId: 'dQw4w9WgXcQ',
    completed: false,
    description: 'Técnicas avanzadas para optimizar tu aplicación React y mejorar la experiencia del usuario'
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
    <div className="min-h-screen bg-gradient-background">
      {/* Enhanced course header with better hierarchy */}
      <CourseHeader
        {...courseData}
        totalLessons={sampleLessons.length}
        completedLessons={completedLessons}
      />
      
      {/* Enhanced main content with better spacing and layout */}
      <div className="max-w-7xl mx-auto px-xl pb-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2xl">
          {/* Main content area */}
          <div className="lg:col-span-2 space-cozy">
            {/* Enhanced video player with better visual hierarchy */}
            <div className="relative group animate-slide-up">
              <div className="aspect-video bg-gradient-card rounded-4xl shadow-hero overflow-hidden border border-border/50 transform hover:scale-[1.01] transition-organic">
                <YouTubePlayer
                  key={`${currentLesson.videoId}-${startTime}`}
                  videoId={currentLesson.videoId}
                  startTime={startTime}
                />
              </div>
              
              {/* Enhanced decorative elements with personality */}
              <div className="absolute -top-sm -right-sm w-8 h-8 bg-gradient-primary rounded-2xl animate-subtle-pulse opacity-80 shadow-handmade" />
              <div className="absolute -bottom-lg -left-lg w-6 h-6 bg-accent/60 rounded-[60%_40%_70%_30%] animate-gentle-float" />
              <div className="absolute top-1/2 -right-xs w-4 h-4 bg-teal/40 rounded-full animate-gentle-float" style={{ animationDelay: '2s' }} />
            </div>
            
            {/* Enhanced current lesson info with clear hierarchy */}
            <div className="relative bg-gradient-card rounded-4xl p-2xl shadow-handmade border border-border/50 transform hover:shadow-float transition-organic animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {/* Decorative corner element with personality */}
              <div className="absolute top-lg right-lg w-4 h-4 bg-gradient-secondary rounded-full animate-subtle-pulse" />
              
              <div className="space-cozy">
                {/* Enhanced lesson metadata */}
                <div className="flex items-center gap-md mb-lg">
                  <div className="flex items-center gap-sm">
                    <div className="p-sm bg-primary/10 rounded-xl">
                      <PlayCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-primary">Lección Actual</span>
                  </div>
                  <div className="flex items-center gap-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{currentLesson.duration}</span>
                  </div>
                </div>
                
                {/* Enhanced title with better typography */}
                <h2 className="text-heading font-heading text-foreground mb-md leading-tight">
                  {currentLesson.title}
                </h2>
                
                {/* Enhanced description with better readability */}
                <p className="text-body-large text-muted-foreground mb-lg leading-relaxed">
                  {currentLesson.description}
                </p>
                
                {/* Enhanced status indicators with personality */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-md">
                    <div className="flex items-center gap-sm">
                      <div className={cn(
                        "w-4 h-4 rounded-full shadow-handmade",
                        currentLesson.completed ? "bg-success animate-subtle-pulse" : "bg-teal animate-subtle-pulse"
                      )} />
                      <span className="font-semibold text-foreground text-base">
                        {currentLesson.completed ? 'Completada' : 'En progreso'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-sm text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>Lección {sampleLessons.findIndex(l => l.id === currentLesson.id) + 1} de {sampleLessons.length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced lesson list for mobile with better spacing */}
            <div className="lg:hidden bg-gradient-card rounded-4xl p-xl shadow-handmade border border-border/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <LessonList
                lessons={sampleLessons}
                currentLessonId={currentLesson.id}
                onLessonSelect={handleLessonSelect}
              />
            </div>
          </div>
          
          {/* Chat area - prominente a la derecha del video */}
          <div className="lg:col-span-1 space-cozy">
            {/* Chat interface principal */}
            <div className="h-[70vh] min-h-[600px] animate-slide-up">
              <ChatInterface onTimestampClick={handleTimestampClick} />
            </div>
            
            {/* Lista de lecciones compacta para desktop */}
            <div className="hidden lg:block bg-gradient-card rounded-4xl p-xl shadow-handmade border border-border/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
