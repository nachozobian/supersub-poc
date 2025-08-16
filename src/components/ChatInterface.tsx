import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, ExternalLink } from "lucide-react";
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
      content: '¡Hola! Soy tu asistente de aprendizaje. Puedo ayudarte con preguntas sobre el curso y llevarte a momentos específicos de los videos. ¿En qué puedo ayudarte?',
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

    // Simulate bot response (replace with n8n integration later)
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `He recibido tu pregunta: "${inputValue}". Para una respuesta completa sobre este tema, te recomiendo revisar el momento 2:35 del video "Introducción a React" donde se explica en detalle. [Ver momento específico](video:dQw4w9WgXcQ:155)`,
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
    // Parse video timestamp links: [text](video:videoId:timestamp)
    const linkRegex = /\[([^\]]+)\]\(video:([^:]+):(\d+)\)/g;
    const parts = [];
    let lastIndex = 0;

    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Add the link
      parts.push({
        type: 'link',
        content: match[1],
        videoId: match[2],
        timestamp: parseInt(match[3])
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  return (
    <div className="h-full flex flex-col bg-gradient-card rounded-3xl shadow-float border border-border/50 overflow-hidden">
      {/* Header with handmade style */}
      <div className="relative p-6 pb-4 bg-gradient-primary">
        <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-2 left-8 w-8 h-8 bg-white/5 rounded-[60%_40%_70%_30%] animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm shadow-handmade">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Asistente IA</h3>
            <p className="text-white/80 text-sm">Con tecnología RAG</p>
          </div>
          <Badge 
            variant="secondary" 
            className="ml-auto bg-white/20 text-white border-white/30 rounded-full backdrop-blur-sm"
          >
            Online
          </Badge>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col p-6 pt-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                message.sender === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
                <div
                  className={cn(
                    "flex gap-3 w-full",
                    message.sender === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-handmade",
                    message.sender === 'user' 
                      ? "bg-gradient-primary transform hover:scale-105 transition-bounce" 
                      : "bg-gradient-secondary transform hover:wiggle"
                  )}>
                    {message.sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>

                  <div
                    className={cn(
                      "rounded-3xl px-5 py-4 max-w-full transition-organic shadow-organic",
                      message.sender === 'user'
                        ? "bg-gradient-primary text-white shadow-handmade transform hover:scale-105"
                        : "bg-gradient-card border border-border/50 hover:shadow-float text-foreground"
                    )}
                >
                  <div className="text-sm leading-relaxed">
                    {parseMessageContent(message.content).map((part, index) => (
                      <span key={index}>
                        {part.type === 'link' ? (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-accent hover:text-accent/80 underline inline-flex items-center gap-1 font-medium"
                            onClick={() => onTimestampClick?.(part.videoId!, part.timestamp!)}
                          >
                            {part.content}
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        ) : (
                          part.content
                        )}
                      </span>
                    ))}
                  </div>
                  <div className={cn(
                    "text-xs mt-3 opacity-60",
                    message.sender === 'user' ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-secondary flex items-center justify-center shadow-handmade">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-gradient-card border border-border/50 rounded-3xl px-5 py-4 shadow-organic">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-3 h-3 bg-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area with handmade style */}
        <div className="flex gap-3 p-2 bg-muted/30 rounded-2xl border border-border/50">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Haz una pregunta sobre el curso..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-primary hover:opacity-90 transition-bounce shadow-handmade rounded-xl px-4 py-2"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};