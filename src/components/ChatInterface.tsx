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
      content: 'Hello! I\'m your AI learning assistant. I have access to all course transcripts and can take you to specific moments in the videos. How can I help you?',
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
        content: `I found relevant information about "${inputValue}" in the course. I recommend checking the moment 2:35 in the video "Introduction to React" where this concept is explained with practical examples. [View specific moment](video:dQw4w9WgXcQ:155)

Would you like me to go deeper into any specific aspect?`,
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
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      {/* Compact header */}
      <div className="p-4 bg-primary border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
            <p className="text-white/80 text-xs">Powered by RAG</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 max-w-[85%]",
                message.sender === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              <div className={cn(
                "flex gap-2 w-full",
                message.sender === 'user' ? "flex-row-reverse" : ""
              )}>
                {/* Avatar */}
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs",
                  message.sender === 'user' 
                    ? "bg-primary" 
                    : "bg-accent"
                )}>
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message bubble */}
                <div className={cn(
                  "rounded-lg px-3 py-2 max-w-full",
                  message.sender === 'user'
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground"
                )}>
                  <div className="text-sm leading-relaxed">
                    {parseMessageContent(message.content).map((part, partIndex) => (
                      <span key={partIndex}>
                        {part.type === 'link' ? (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-accent hover:text-accent/80 underline inline-flex items-center gap-1 text-sm"
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
                    "text-xs mt-1 opacity-70",
                    message.sender === 'user' ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-3 w-3" />
                  <span className="text-sm">Analyzing...</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the course..."
              className="flex-1 border-0 bg-transparent text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6 px-2 bg-accent/10 hover:bg-accent/20 text-accent"
              onClick={() => setInputValue("What is useState?")}
            >
              useState?
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6 px-2 bg-primary/10 hover:bg-primary/20 text-primary"
              onClick={() => setInputValue("Explain props")}
            >
              Props
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6 px-2 bg-accent/10 hover:bg-accent/20 text-accent"
              onClick={() => setInputValue("About hooks")}
            >
              Hooks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};