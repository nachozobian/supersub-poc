import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, ExternalLink, MessageCircle, Zap, Brain, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!webhookUrl && !showSettings) {
      toast({
        title: "n8n Webhook Required",
        description: "Please configure your n8n webhook URL in settings",
        variant: "destructive",
      });
      setShowSettings(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            timestamp: new Date().toISOString(),
            context: {
              source: 'course-chat',
              userAgent: navigator.userAgent,
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: data.response || data.message || 'I received your message and processed it successfully.',
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error sending message to n8n:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error connecting to the chat service. Please check your n8n webhook configuration.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Connection Error",
        description: "Failed to connect to n8n webhook. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      <div className="p-3 bg-primary border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white">Chat</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="text-white hover:bg-white/10 h-6 w-6 p-0"
        >
          <Settings className="h-3 w-3" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-3 bg-muted border-b">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">n8n Webhook URL</label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
              className="text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Enter your n8n webhook URL from your chat workflow trigger
            </p>
            <Button
              onClick={() => setShowSettings(false)}
              size="sm"
              variant="outline"
              className="w-full"
            >
              Save Configuration
            </Button>
          </div>
        </div>
      )}

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