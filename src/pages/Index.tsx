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

// Simple lesson data - Updated with real YouTube video titles
const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'Intro to Project Management',
    duration: '15:30',
    videoId: 'ZKOWOZBvAzl',
    completed: false,
    description: 'Primera lección del curso con transcripción disponible'
  },
  {
    id: '2',
    title: 'Professional Project Management Skills',
    duration: '18:45',
    videoId: 'y7LDaaFeNn4',
    completed: false,
    description: 'Professional Project Management Skills'
  },
  {
    id: '3',
    title: 'Project Structures & Life Cycles',
    duration: '22:15',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Project Structures & Life Cycles'
  },
  {
    id: '4',
    title: 'Finding Project Manager Jobs',
    duration: '19:20',
    videoId: 'kXkVV7PFWgE',
    completed: false,
    description: 'Finding Project Manager Jobs'
  },
  {
    id: '5',
    title: 'How Company Culture Affects Project Management',
    duration: '25:10',
    videoId: 'KH-qoTqtMXE',
    completed: false,
    description: 'How Company Culture Affects Project Management'
  },
  {
    id: '6',
    title: 'How to Run a Successful Meeting',
    duration: '16:35',
    videoId: 'jz7tPVDwb50',
    completed: false,
    description: 'How to Run a Successful Meeting'
  },
  {
    id: '7',
    title: 'Communicate Effectively as a Project Manager',
    duration: '21:45',
    videoId: 'f0VcIWJNDAI',
    completed: false,
    description: 'Communicate Effectively as a Project Manager'
  },
  {
    id: '8',
    title: 'Key Parts of Project Initiation',
    duration: '28:30',
    videoId: 'bQ1fWZBRILo',
    completed: false,
    description: 'Key Parts of Project Initiation'
  },
  {
    id: '9',
    title: 'Communicating and Working with Stakeholders',
    duration: '17:55',
    videoId: '28vZa0qOHkg',
    completed: false,
    description: 'Communicating and Working with Stakeholders'
  },
  {
    id: '10',
    title: 'How to Set SMART Goals and Get Results',
    duration: '24:20',
    videoId: '8unOyycCpFs',
    completed: false,
    description: 'How to Set SMART Goals and Get Results'
  },
  {
    id: '11',
    title: 'The Best Resources and Tools to Manage Your Project',
    duration: '20:15',
    videoId: '1eiTXSkKFtE',
    completed: false,
    description: 'Undécima lección del curso con transcripción disponible'
  },
  {
    id: '12',
    title: 'Risk Management Basics',
    duration: '26:40',
    videoId: '_mxovBWI9mO',
    completed: false,
    description: 'Risk Management Basics'
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
              key={currentLesson.videoId}
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
