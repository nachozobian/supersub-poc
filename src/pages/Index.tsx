import { useState } from 'react';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { LessonList, type Lesson } from '@/components/LessonList';
import { ChatInterface } from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Video area - takes up most space */}
        <div className="lg:col-span-7 p-4">
          <div className="h-full bg-black rounded-lg overflow-hidden">
            <YouTubePlayer
              key={`${currentLesson.videoId}-${startTime}`}
              videoId={currentLesson.videoId}
              startTime={startTime}
            />
          </div>
        </div>
        
        {/* Lesson List Sidebar */}
        <div className="lg:col-span-2 bg-card border-r p-4">
          <h3 className="font-semibold mb-4 text-sm">Videos</h3>
          <div className="h-full overflow-y-auto">
            <LessonList
              lessons={sampleLessons}
              currentLessonId={currentLesson.id}
              onLessonSelect={handleLessonSelect}
            />
          </div>
        </div>

        {/* Integrated Chat Sidebar */}
        <div className="lg:col-span-3 bg-card border-l">
          <ChatInterface onTimestampClick={handleTimestampClick} />
        </div>
      </div>
    </div>
  );
};

export default Index;
