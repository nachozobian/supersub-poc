import { useState } from 'react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { LessonList, type Lesson } from '@/components/LessonList';
import { ChatInterface } from '@/components/ChatInterface';
import { cn } from '@/lib/utils';

// Simple course data
const courseData = {
  title: "Google Project Management Certificate",
  instructor: "Google Career Certificates",
  totalDuration: "18h 45min",
  rating: 4.9,
  enrolledStudents: 125847,
};

// Simple lesson data - Updated to match Drive transcript files
const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'Video 1 - ZKOWOZBvAzl',
    duration: '15:30',
    videoId: 'ZKOWOZBvAzl',
    completed: false,
    description: 'Primera lección del curso con transcripción disponible'
  },
  {
    id: '2',
    title: 'Video 2 - y7LDaaFeNn4',
    duration: '18:45',
    videoId: 'y7LDaaFeNn4',
    completed: false,
    description: 'Segunda lección del curso con transcripción disponible'
  },
  {
    id: '3',
    title: 'Video 3 - rck3MnC7OXA',
    duration: '22:15',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Tercera lección del curso con transcripción disponible'
  },
  {
    id: '4',
    title: 'Video 4 - kXkVV7PFWgE',
    duration: '19:20',
    videoId: 'kXkVV7PFWgE',
    completed: false,
    description: 'Cuarta lección del curso con transcripción disponible'
  },
  {
    id: '5',
    title: 'Video 5 - KH-qoTqtMXE',
    duration: '25:10',
    videoId: 'KH-qoTqtMXE',
    completed: false,
    description: 'Quinta lección del curso con transcripción disponible'
  },
  {
    id: '6',
    title: 'Video 6 - jz7tPVDwb50',
    duration: '16:35',
    videoId: 'jz7tPVDwb50',
    completed: false,
    description: 'Sexta lección del curso con transcripción disponible'
  },
  {
    id: '7',
    title: 'Video 7 - f0VcIWJNDAI',
    duration: '21:45',
    videoId: 'f0VcIWJNDAI',
    completed: false,
    description: 'Séptima lección del curso con transcripción disponible'
  },
  {
    id: '8',
    title: 'Video 8 - bQ1fWZBRILo',
    duration: '28:30',
    videoId: 'bQ1fWZBRILo',
    completed: false,
    description: 'Octava lección del curso con transcripción disponible'
  },
  {
    id: '9',
    title: 'Video 9 - 28vZa0qOHkg',
    duration: '17:55',
    videoId: '28vZa0qOHkg',
    completed: false,
    description: 'Novena lección del curso con transcripción disponible'
  },
  {
    id: '10',
    title: 'Video 10 - 8unOyycCpFs',
    duration: '24:20',
    videoId: '8unOyycCpFs',
    completed: false,
    description: 'Décima lección del curso con transcripción disponible'
  },
  {
    id: '11',
    title: 'Video 11 - 1eiTXSkKFtE',
    duration: '20:15',
    videoId: '1eiTXSkKFtE',
    completed: false,
    description: 'Undécima lección del curso con transcripción disponible'
  },
  {
    id: '12',
    title: 'Video 12 - _mxovBWI9mO',
    duration: '26:40',
    videoId: '_mxovBWI9mO',
    completed: false,
    description: 'Duodécima lección del curso con transcripción disponible'
  },
];

const Index = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(sampleLessons[2]);
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

  const completedLessons = sampleLessons.filter(lesson => lesson.completed).length;

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-1">
        {/* Video area */}
        <div className="lg:col-span-6 p-4 flex flex-col">
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <YouTubePlayer
              key={`${currentLesson.videoId}-${startTime}`}
              videoId={currentLesson.videoId}
              startTime={startTime}
            />
          </div>
          
          {/* Current Lesson Info */}
          <div className="mt-4 p-4 bg-card rounded-lg border">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {currentLesson.title}
            </h2>
            <p className="text-muted-foreground text-sm mb-3">
              {currentLesson.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Duración: {currentLesson.duration}
              </span>
              <span>Lección {currentLesson.id} de {sampleLessons.length}</span>
            </div>
          </div>
        </div>
        
        {/* Lesson List Sidebar */}
        <div className="lg:col-span-2 bg-card border-r flex flex-col">
          <div className="p-3 border-b bg-muted/50">
            <h3 className="font-semibold text-sm text-foreground">Contenido del Curso</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {completedLessons} de {sampleLessons.length} lecciones completadas
            </p>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all"
                style={{ width: `${(completedLessons / sampleLessons.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <LessonList
              lessons={sampleLessons}
              currentLessonId={currentLesson.id}
              onLessonSelect={handleLessonSelect}
            />
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="lg:col-span-2 bg-card border-l flex flex-col">
          <div className="p-3 border-b bg-muted/50">
            <h3 className="font-semibold text-sm text-foreground">Asistente IA</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Tu tutor personal para dudas y explicaciones
            </p>
          </div>
          <div className="flex-1 min-h-0">
            <ChatInterface onTimestampClick={handleTimestampClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
