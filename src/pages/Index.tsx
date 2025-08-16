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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video area */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <YouTubePlayer
                key={`${currentLesson.videoId}-${startTime}`}
                videoId={currentLesson.videoId}
                startTime={startTime}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Video Titles */}
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-semibold mb-4">Videos</h3>
              <LessonList
                lessons={sampleLessons}
                currentLessonId={currentLesson.id}
                onLessonSelect={handleLessonSelect}
              />
            </div>
            
            {/* Chat */}
            <div className="h-[500px]">
              <ChatInterface onTimestampClick={handleTimestampClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
