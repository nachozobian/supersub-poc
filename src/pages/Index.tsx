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
    title: 'The Value of a Project Manager',
    duration: '18:30',
    videoId: 'rck3MnC7OXA',
    completed: true,
    description: 'Explore the impact and value that project managers bring to organizations and teams'
  },
  {
    id: '3',
    title: 'Project Life Cycle and Methodologies',
    duration: '22:15',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Understanding different project management approaches: Waterfall, Agile, and hybrid methodologies'
  },
  {
    id: '4',
    title: 'Organizational Structure and Culture',
    duration: '16:20',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'How organizational structure impacts project management and team dynamics'
  },
  {
    id: '5',
    title: 'Project Initiation: Defining Goals',
    duration: '24:10',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Setting clear project goals, defining scope, and creating project charters'
  },
  {
    id: '6',
    title: 'Stakeholder Analysis and Management',
    duration: '19:35',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Identifying stakeholders, understanding their needs, and managing expectations'
  },
  {
    id: '7',
    title: 'Project Planning: Creating the Roadmap',
    duration: '21:50',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Developing comprehensive project plans, timelines, and resource allocation'
  },
  {
    id: '8',
    title: 'Budget Management and Cost Control',
    duration: '17:25',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Creating budgets, tracking expenses, and managing project costs effectively'
  },
  {
    id: '9',
    title: 'Risk Management Strategies',
    duration: '15:40',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Identifying, assessing, and mitigating project risks throughout the lifecycle'
  },
  {
    id: '10',
    title: 'Team Dynamics and Leadership',
    duration: '26:15',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Building effective teams, managing conflicts, and leading project teams'
  },
  {
    id: '11',
    title: 'Communication and Documentation',
    duration: '20:30',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Effective communication strategies and maintaining proper project documentation'
  },
  {
    id: '12',
    title: 'Project Closure and Lessons Learned',
    duration: '14:55',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Successfully closing projects and capturing valuable insights for future projects'
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
