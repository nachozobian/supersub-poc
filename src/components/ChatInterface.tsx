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
    <div className="h-full flex flex-col bg-card rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-primary border-b">
        <h3 className="text-sm font-semibold text-white">Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col p-3">
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "rounded-lg px-3 py-2 max-w-[80%]",
                message.sender === 'user'
                  ? "bg-primary text-white"
                  : "bg-muted"
              )}>
                <div className="text-sm">
                  {parseMessageContent(message.content).map((part, partIndex) => (
                    <span key={partIndex}>
                      {part.type === 'link' ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-accent hover:text-accent/80 underline inline-flex items-center gap-1 text-xs"
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
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">Thinking...</span>
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

        {/* Input */}
        <div className="mt-3 flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};