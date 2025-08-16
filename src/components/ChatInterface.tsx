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
    <Card className="h-full flex flex-col bg-gradient-to-b from-card to-secondary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-full bg-gradient-primary">
            <Bot className="h-5 w-5 text-white" />
          </div>
          Asistente de Aprendizaje
          <Badge variant="secondary" className="ml-auto">
            RAG Enabled
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 pt-0">
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
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                  message.sender === 'user' 
                    ? "bg-gradient-primary" 
                    : "bg-gradient-to-r from-accent to-primary"
                )}>
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 max-w-full transition-all duration-300",
                    message.sender === 'user'
                      ? "bg-primary text-primary-foreground shadow-elegant"
                      : "bg-muted border border-border hover:shadow-md"
                  )}
                >
                  <div className="text-sm leading-relaxed">
                    {parseMessageContent(message.content).map((part, index) => (
                      <span key={index}>
                        {part.type === 'link' ? (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-accent hover:text-accent/80 underline inline-flex items-center gap-1"
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
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted border border-border rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta sobre el curso..."
            className="flex-1 transition-all duration-300 focus:shadow-glow"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-elegant"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};