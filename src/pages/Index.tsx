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

// Simple lesson data
const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Project Management',
    duration: '12:45',
    videoId: 'rck3MnC7OXA',
    completed: true,
    description: 'Learn the fundamentals of project management and understand the role of a project manager'
  },
  {
    id: '2',
    title: 'Become a Project Manager Without a College Degree',
    duration: '8:30',
    videoId: 'DgPYRU50V7E',
    completed: true,
    description: 'Discover career paths in project management regardless of educational background'
  },
  {
    id: '3',
    title: 'Introduction to Agile Methodologies',
    duration: '15:45',
    videoId: 'BaH04m_fS1c',
    completed: false,
    description: 'Learn about Agile methodologies including Scrum, Kanban, XP, and Lean approaches'
  },
  {
    id: '4',
    title: 'Key Foundations of Agile & Scrum Project Management',
    duration: '22:30',
    videoId: 'WDAQq5vCMME',
    completed: false,
    description: 'Deep dive into Agile principles, values, and Scrum framework essentials'
  },
  {
    id: '5',
    title: 'Agile Management',
    duration: '35:20',
    videoId: 'km7n3DI5IWk',
    completed: false,
    description: 'Comprehensive guide to Agile project management and delivery frameworks'
  },
  {
    id: '6',
    title: 'Project Tracking Methods and Examples',
    duration: '28:15',
    videoId: 'oLh8akA7F3I',
    completed: false,
    description: 'Learn various methods to track project progress, risks, and dependencies'
  },
  {
    id: '7',
    title: 'How to Find Project Management Jobs',
    duration: '12:40',
    videoId: 'pjkGhNVuMHQ',
    completed: false,
    description: 'Strategies for finding and landing project management roles in various industries'
  },
  {
    id: '8',
    title: 'Project Management Full Course - Part 1',
    duration: '45:25',
    videoId: 'eZDkSNHaWh8',
    completed: false,
    description: 'Comprehensive overview covering the first three courses of the specialization'
  },
  {
    id: '9',
    title: 'Complete Google Project Management Certificate Overview',
    duration: '18:35',
    videoId: 'DRe_5cHooeo',
    completed: false,
    description: 'Overview of the complete certificate program including new AI modules'
  },
  {
    id: '10',
    title: 'Complete Course in 2 HOURS',
    duration: '120:00',
    videoId: 'SJcHiiNpUds',
    completed: false,
    description: 'Condensed version of the entire Google Project Management Certificate course'
  },
  {
    id: '11',
    title: 'Project Planning and Goal Setting',
    duration: '20:30',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Master the art of setting SMART goals and creating comprehensive project plans'
  },
  {
    id: '12',
    title: 'Advanced Project Management Techniques',
    duration: '25:55',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Advanced strategies for complex project management scenarios'
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
