import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Star, Sparkles, TrendingUp, Award } from "lucide-react";

interface CourseHeaderProps {
  title: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  totalDuration: string;
  rating: number;
  enrolledStudents: number;
}

export const CourseHeader = ({
  title,
  instructor,
  totalLessons,
  completedLessons,
  totalDuration,
  rating,
  enrolledStudents
}: CourseHeaderProps) => {
  const progress = (completedLessons / totalLessons) * 100;

  return (
    <div className="relative overflow-hidden py-4xl">
      {/* Enhanced background with personality */}
      <div className="absolute inset-0 bg-gradient-background">
        <div className="absolute top-20 left-20 w-40 h-40 bg-accent/10 rounded-[60%_40%_70%_30%] animate-gentle-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-teal/8 rounded-[40%_60%_30%_70%] animate-gentle-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/3 w-24 h-24 bg-primary/6 rounded-[70%_30%_40%_60%] animate-gentle-float" style={{ animationDelay: '4s' }} />
        
        {/* Additional organic shapes for richness */}
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent/5 rounded-[50%_80%_30%_70%] animate-gentle-float" style={{ animationDelay: '6s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-teal/6 rounded-[80%_20%_60%_40%] animate-gentle-float" style={{ animationDelay: '8s' }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4xl items-start">
          {/* Main content with enhanced hierarchy */}
          <div className="lg:col-span-2 space-cozy">
            {/* Enhanced badges with clear personality */}
            <div className="flex flex-wrap items-center gap-md mb-xl animate-slide-up">
              <Badge 
                variant="secondary" 
                className="bg-gradient-hero text-white border-0 shadow-hero px-lg py-sm rounded-full text-base font-semibold interactive-hover focus-ring"
              >
                <Sparkles className="h-4 w-4 mr-sm" />
                Curso Premium
              </Badge>
              <Badge 
                variant="outline" 
                className="border-accent/30 text-accent bg-accent/5 hover:bg-accent/10 transition-gentle rounded-full px-lg py-sm text-base font-medium interactive-hover focus-ring"
              >
                <TrendingUp className="h-4 w-4 mr-sm" />
                React & JavaScript
              </Badge>
              <Badge 
                variant="outline" 
                className="border-success/30 text-success bg-success/5 hover:bg-success/10 transition-gentle rounded-full px-lg py-sm text-base font-medium interactive-hover focus-ring"
              >
                <Award className="h-4 w-4 mr-sm" />
                Certificado Incluido
              </Badge>
            </div>
            
            {/* Enhanced title with clear hierarchy */}
            <div className="relative mb-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-hero font-heading bg-gradient-hero bg-clip-text text-transparent leading-tight mb-lg">
                {title}
              </h1>
              {/* Enhanced decorative underline */}
              <div className="absolute -bottom-sm left-0 w-48 h-1 bg-gradient-secondary rounded-full transform -rotate-1 shadow-handmade" />
              <div className="absolute -bottom-xs left-8 w-32 h-0.5 bg-gradient-primary rounded-full transform rotate-1 opacity-60" />
            </div>
            
            {/* Enhanced instructor section */}
            <div className="flex items-center gap-md mb-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-handmade interactive-hover">
                  <span className="text-white font-bold text-xl">{instructor.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <Star className="h-3 w-3 text-white fill-current" />
                </div>
              </div>
              <div className="space-tight">
                <h3 className="text-subheading font-heading text-foreground">
                  {instructor}
                </h3>
                <p className="text-body-large text-muted-foreground">Instructor Experto & Mentor</p>
                <div className="flex items-center gap-xs mt-xs">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-warning fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">(4.9/5 • 847 reseñas)</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced stats with better visual hierarchy */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-lg animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-gradient-card p-lg rounded-3xl shadow-organic border border-border/50 hover:shadow-float transition-organic interactive-hover group">
                <div className="flex items-center gap-sm text-primary mb-sm">
                  <div className="p-sm bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-gentle">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-base">Duración Total</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{totalDuration}</p>
                <p className="text-sm text-muted-foreground mt-xs">de contenido premium</p>
              </div>
              
              <div className="bg-gradient-card p-lg rounded-3xl shadow-organic border border-border/50 hover:shadow-float transition-organic interactive-hover group">
                <div className="flex items-center gap-sm text-teal mb-sm">
                  <div className="p-sm bg-teal/10 rounded-xl group-hover:bg-teal/20 transition-gentle">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-base">Lecciones</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{totalLessons}</p>
                <p className="text-sm text-muted-foreground mt-xs">videos estructurados</p>
              </div>
              
              <div className="bg-gradient-card p-lg rounded-3xl shadow-organic border border-border/50 hover:shadow-float transition-organic interactive-hover group">
                <div className="flex items-center gap-sm text-accent mb-sm">
                  <div className="p-sm bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-gentle">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-base">Estudiantes</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{enrolledStudents.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-xs">ya inscritos</p>
              </div>
              
              <div className="bg-gradient-card p-lg rounded-3xl shadow-organic border border-border/50 hover:shadow-float transition-organic interactive-hover group">
                <div className="flex items-center gap-sm text-warning mb-sm">
                  <div className="p-sm bg-warning/10 rounded-xl group-hover:bg-warning/20 transition-gentle">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                  <span className="font-semibold text-base">Valoración</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{rating}</p>
                <p className="text-sm text-muted-foreground mt-xs">de 5.0 estrellas</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced progress card with clear CTAs */}
          <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="sticky top-xl">
              <div className="bg-gradient-card p-2xl rounded-4xl shadow-hero border border-border/50 transform hover:scale-105 transition-organic backdrop-blur-sm">
                <div className="text-center mb-xl">
                  <div className="inline-flex items-center gap-sm bg-gradient-secondary text-white px-lg py-sm rounded-full text-base font-semibold mb-lg shadow-handmade">
                    <TrendingUp className="h-5 w-5" />
                    Tu Progreso Actual
                  </div>
                </div>
                
                <div className="space-cozy mb-xl">
                  <div className="flex justify-between items-center mb-md">
                    <span className="text-lg font-semibold text-foreground">Completado</span>
                    <div className="bg-gradient-primary text-white px-md py-xs rounded-full text-sm font-bold shadow-handmade">
                      {completedLessons}/{totalLessons}
                    </div>
                  </div>
                  
                  <div className="relative mb-md">
                    <Progress value={progress} className="h-4 bg-muted rounded-full" />
                    <div className="absolute -top-2 right-0 w-8 h-8 bg-gradient-primary rounded-full shadow-handmade animate-subtle-pulse flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-lg text-center">
                    <div className="space-tight">
                      <p className="text-2xl font-bold text-success">{completedLessons}</p>
                      <p className="text-sm text-muted-foreground">Completadas</p>
                    </div>
                    <div className="space-tight">
                      <p className="text-2xl font-bold text-accent">{totalLessons - completedLessons}</p>
                      <p className="text-sm text-muted-foreground">Restantes</p>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced CTA button */}
                <Button className="w-full bg-gradient-hero hover:opacity-95 shadow-hero transition-organic text-white rounded-2xl py-lg text-lg font-bold interactive-hover focus-ring group">
                  <span className="flex items-center gap-sm">
                    <BookOpen className="h-5 w-5 group-hover:rotate-12 transition-bounce" />
                    Continuar Aprendiendo
                    <TrendingUp className="h-5 w-5 group-hover:translate-x-1 transition-bounce" />
                  </span>
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-md">
                  Próxima lección: <span className="font-semibold text-accent">Hooks de React</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};