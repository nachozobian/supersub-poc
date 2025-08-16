import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, ExternalLink, MessageCircle, Zap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onTimestampClick?: (videoId: string, timestamp: number) => void;
}

export const ChatInterface = ({ onTimestampClick }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hola. Soy tu asistente de aprendizaje con IA. Tengo acceso a todas las transcripciones del curso y puedo llevarte a momentos específicos de los videos. ¿En qué puedo ayudarte?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot response with enhanced personality
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `He encontrado información relevante sobre "${inputValue}" en el curso. Te recomiendo revisar el momento 2:35 del video "Introducción a React" donde se explica este concepto con ejemplos prácticos. [Ver momento específico](video:dQw4w9WgXcQ:155)

¿Te gustaría que profundice en algún aspecto específico?`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const parseMessageContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(video:([^:]+):(\d+)\)/g;
    const parts = [];
    let lastIndex = 0;

    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      parts.push({
        type: 'link',
        content: match[1],
        videoId: match[2],
        timestamp: parseInt(match[3])
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  return (
    <div className="h-full flex flex-col bg-gradient-card rounded-4xl shadow-hero border border-border/50 overflow-hidden backdrop-blur-sm">
      {/* Enhanced header with clear personality */}
      <div className="relative p-xl pb-lg bg-gradient-hero overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-lg right-lg w-16 h-16 bg-white/10 rounded-[60%_40%_70%_30%] animate-gentle-float" />
        <div className="absolute bottom-sm left-xl w-12 h-12 bg-white/5 rounded-[40%_60%_30%_70%] animate-gentle-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white/5 rounded-full animate-gentle-float" style={{ animationDelay: '4s' }} />
        
        <div className="relative flex items-center gap-md">
          <div className="p-md rounded-3xl bg-white/20 backdrop-blur-sm shadow-handmade interactive-hover">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 space-tight">
            <h3 className="text-xl font-heading text-white font-bold">Asistente Inteligente</h3>
            <p className="text-white/90 text-base">Powered by RAG Technology</p>
          </div>
          <div className="flex gap-sm">
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30 rounded-full backdrop-blur-sm text-sm font-medium px-md py-xs"
            >
              <Zap className="h-4 w-4 mr-xs" />
              Activo
            </Badge>
          </div>
        </div>
        
        {/* Enhanced feature highlights */}
        <div className="mt-lg grid grid-cols-3 gap-sm">
          <div className="text-center space-tight">
            <div className="text-white/90 text-xs font-medium">Transcripciones</div>
            <div className="text-white text-sm font-bold">Completas</div>
          </div>
          <div className="text-center space-tight">
            <div className="text-white/90 text-xs font-medium">Respuestas</div>
            <div className="text-white text-sm font-bold">Instantáneas</div>
          </div>
          <div className="text-center space-tight">
            <div className="text-white/90 text-xs font-medium">Navegación</div>
            <div className="text-white text-sm font-bold">Inteligente</div>
          </div>
        </div>
      </div>

      {/* Enhanced messages area with better spacing */}
      <div className="flex-1 flex flex-col p-xl pt-lg">
        <div className="flex-1 overflow-y-auto space-cozy pr-sm">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-md max-w-[90%] animate-slide-up",
                message.sender === 'user' ? "ml-auto" : "mr-auto"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={cn(
                  "flex gap-md w-full",
                  message.sender === 'user' ? "flex-row-reverse" : ""
                )}
              >
                {/* Enhanced avatar with personality */}
                <div className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-3xl flex items-center justify-center text-white text-sm font-bold shadow-handmade transition-organic",
                  message.sender === 'user' 
                    ? "bg-gradient-primary interactive-hover" 
                    : "bg-gradient-secondary hover:scale-105"
                )}>
                  {message.sender === 'user' ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                </div>

                {/* Enhanced message bubble with better typography */}
                <div
                  className={cn(
                    "rounded-4xl px-lg py-lg max-w-full transition-organic shadow-organic",
                    message.sender === 'user'
                      ? "bg-gradient-primary text-white shadow-handmade interactive-hover"
                      : "bg-gradient-card border border-border/50 hover:shadow-float text-foreground"
                  )}
                >
                  <div className="text-base leading-relaxed">
                    {parseMessageContent(message.content).map((part, partIndex) => (
                      <span key={partIndex}>
                        {part.type === 'link' ? (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-accent hover:text-accent/80 underline inline-flex items-center gap-xs font-semibold text-base interactive-hover focus-ring"
                            onClick={() => onTimestampClick?.(part.videoId!, part.timestamp!)}
                          >
                            {part.content}
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        ) : (
                          part.content
                        )}
                      </span>
                    ))}
                  </div>
                  <div className={cn(
                    "text-xs mt-md opacity-70 font-medium",
                    message.sender === 'user' ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Enhanced loading indicator */}
          {isLoading && (
            <div className="flex gap-md max-w-[90%] animate-slide-up">
              <div className="flex-shrink-0 w-12 h-12 rounded-3xl bg-gradient-secondary flex items-center justify-center shadow-handmade">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="bg-gradient-card border border-border/50 rounded-4xl px-lg py-lg shadow-organic">
                <div className="flex items-center gap-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4 animate-subtle-pulse" />
                  <span className="text-base font-medium">Analizando tu pregunta</span>
                  <div className="flex space-x-1 ml-sm">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced input area with clear CTAs */}
        <div className="mt-lg p-md bg-muted/30 rounded-3xl border border-border/50 backdrop-blur-sm">
          <div className="flex gap-md">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregunta sobre el curso, conceptos, o pide ir a un momento específico..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground font-medium py-lg px-lg rounded-2xl"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-primary hover:opacity-95 transition-organic shadow-handmade rounded-2xl px-lg py-lg interactive-hover focus-ring group"
            >
              <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-bounce" />
            </Button>
          </div>
          
          {/* Quick action suggestions */}
          <div className="flex flex-wrap gap-xs mt-md">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs bg-accent/5 hover:bg-accent/10 text-accent border border-accent/20 rounded-full px-sm py-xs transition-gentle"
              onClick={() => setInputValue("¿Qué es useState?")}
            >
              ¿Qué es useState?
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs bg-teal/5 hover:bg-teal/10 text-teal border border-teal/20 rounded-full px-sm py-xs transition-gentle"
              onClick={() => setInputValue("Explícame los props")}
            >
              Props
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-full px-sm py-xs transition-gentle"
              onClick={() => setInputValue("Quiero ver sobre hooks")}
            >
              Hooks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};