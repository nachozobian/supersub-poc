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
    title: 'Project Life Cycle and Methodologies',
    duration: '18:30',
    videoId: 'rck3MnC7OXA',
    completed: true,
    description: 'Explore different project management methodologies including Waterfall and Agile'
  },
  {
    id: '3',
    title: 'Project Planning and Goal Setting',
    duration: '22:15',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Master the art of setting SMART goals and creating comprehensive project plans'
  },
  {
    id: '4',
    title: 'Risk Management and Mitigation',
    duration: '16:20',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Identify, assess, and develop strategies to manage project risks effectively'
  },
  {
    id: '5',
    title: 'Team Management and Communication',
    duration: '24:10',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Build and lead high-performing teams with effective communication strategies'
  },
  {
    id: '6',
    title: 'Project Scheduling and Time Management',
    duration: '19:35',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Create realistic project schedules and manage time effectively across all phases'
  },
  {
    id: '7',
    title: 'Budget Management and Resource Allocation',
    duration: '21:50',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Learn to create and manage project budgets and allocate resources efficiently'
  },
  {
    id: '8',
    title: 'Quality Management and Control',
    duration: '17:25',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Implement quality assurance processes and control measures for project success'
  },
  {
    id: '9',
    title: 'Stakeholder Management',
    duration: '15:40',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Identify, engage, and manage stakeholders throughout the project lifecycle'
  },
  {
    id: '10',
    title: 'Agile Project Management',
    duration: '26:15',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Deep dive into Agile methodologies, Scrum, and iterative project management'
  },
  {
    id: '11',
    title: 'Project Monitoring and Performance',
    duration: '20:30',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Track project progress, measure performance, and implement corrective actions'
  },
  {
    id: '12',
    title: 'Project Closure and Lessons Learned',
    duration: '14:55',
    videoId: 'rck3MnC7OXA',
    completed: false,
    description: 'Successfully close projects and capture valuable lessons for future initiatives'
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
