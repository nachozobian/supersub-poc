import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Send } from "lucide-react";
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
  /** Overall fixed height in px (defaults to 320 for a smaller footprint) */
  height?: number;
}

const generateSessionId = (): string =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

export const ChatInterface = ({ onTimestampClick, height = 320 }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content:
        "Hello! I'm your AI learning assistant. I have access to all course transcripts and can take you to specific moments in the videos. How can I help you?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const WEBHOOK_URL = 'https://juanjogamez2.app.n8n.cloud/webhook/d69fdf7e-3f27-414c-abb2-bf9ffda43d78';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractContentFromData = (data: unknown): string | undefined => {
    const pick = (obj: any) =>
      obj?.output ??
      obj?.response ??
      obj?.message ??
      obj?.chatInput ??
      obj?.text ??
      obj?.content ??
      obj?.answer;

    if (Array.isArray(data)) {
      const first = data[0];
      const picked = pick(first);
      return picked ?? (first ? JSON.stringify(first, null, 2) : undefined);
    }

    if (data && typeof data === 'object') {
      const picked = pick(data as any);
      return picked ?? JSON.stringify(data, null, 2);
    }

    if (data == null) return undefined;
    return String(data);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

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
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: currentInput, sessionId }),
      });

      if (response.ok) {
        let responseContent: string | undefined;

        try {
          const responseText = await response.text();
          if (!responseText.trim()) {
            responseContent = 'Empty response received from server';
          } else {
            try {
              const data = JSON.parse(responseText);
              responseContent = extractContentFromData(data);
            } catch {
              responseContent = responseText;
            }
          }
        } catch {
          responseContent = 'Error: Unable to read server response';
        }

        if (!responseContent) {
          responseContent = 'Error: No response received from server';
        }

        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: responseContent,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);

        // Auto-play first YouTube link from bot response
        const autoPlayFirstLink = (content: string) => {
          const timestampLinkRegex = /\[([^\]]+)\]\(video:([^:]+):(\d+)\)/;
          const youtubeUrlRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(?:[&?]t=(\d+))?/;

          const timestampMatch = timestampLinkRegex.exec(content);
          if (timestampMatch) {
            const videoId = timestampMatch[2];
            const timestamp = parseInt(timestampMatch[3], 10);
            onTimestampClick?.(videoId, timestamp);
            return;
          }

          const youtubeMatch = youtubeUrlRegex.exec(content);
          if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            const timestamp = youtubeMatch[2] ? parseInt(youtubeMatch[2], 10) : 0;
            onTimestampClick?.(videoId, timestamp);
          }
        };

        autoPlayFirstLink(responseContent);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          'Sorry, I encountered an error connecting to the chat service. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: 'Connection Error',
        description: 'Failed to connect to chat service. Please try again later.',
        variant: 'destructive',
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
    const timestampLinkRegex = /\[([^\]]+)\]\(video:([^:]+):(\d+)\)/g;
    const youtubeUrlRegex =
      /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(?:[&?]t=(\d+))?/g;

    const parts: Array<
      | { type: 'text'; content: string }
      | { type: 'link'; content: string; videoId: string; timestamp: number }
    > = [];

    const allMatches: Array<{
      index: number;
      length: number;
      content: string;
      videoId: string;
      timestamp: number;
    }> = [];

    let match: RegExpExecArray | null;
    while ((match = timestampLinkRegex.exec(content)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        content: match[1],
        videoId: match[2],
        timestamp: parseInt(match[3], 10),
      });
    }

    while ((match = youtubeUrlRegex.exec(content)) !== null) {
      const videoId = match[1];
      const timestamp = match[2] ? parseInt(match[2], 10) : 0;
      allMatches.push({
        index: match.index,
        length: match[0].length,
        content: match[0],
        videoId,
        timestamp,
      });
    }

    allMatches.sort((a, b) => a.index - b.index);

    let lastIndex = 0;
    for (const m of allMatches) {
      if (m.index > lastIndex) {
        parts.push({ type: 'text', content: content.slice(lastIndex, m.index) });
      }
      parts.push({
        type: 'link',
        content: m.content,
        videoId: m.videoId,
        timestamp: m.timestamp,
      });
      lastIndex = m.index + m.length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.slice(lastIndex) });
    }

    return (parts.length > 0 ? parts : [{ type: 'text', content }]) as typeof parts;
  };

  return (
    <div
      className="flex flex-col bg-card rounded-lg border overflow-hidden"
      style={{ height }} // smaller by default, easily adjustable
    >
      {/* Header (made tighter) */}
      <div className="px-3 py-2 bg-primary border-b flex justify-between items-center">
        <h3 className="text-xs font-semibold text-white">Chat</h3>
        <div className="text-[10px] text-white/70">
          Session: {sessionId.substring(0, 8)}...
        </div>
      </div>

      {/* Messages (the only scrollable area) */}
      <div className="flex-1 flex flex-col px-2 py-2">
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'rounded-md px-2 py-1.5 max-w-[85%] text-xs leading-relaxed',
                  message.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground'
                )}
              >
                {parseMessageContent(message.content).map((part, i) => (
                  <span key={i}>
                    {part.type === 'link' ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto underline inline-flex items-center gap-1 text-[11px] align-baseline"
                        onClick={() => onTimestampClick?.(part.videoId, part.timestamp)}
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
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-md px-2 py-1.5">
                <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                  <span>Thinking...</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                    <div
                      className="w-1 h-1 bg-accent rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-1 h-1 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input (compact) */}
        <div className="mt-2 flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything..."
            className="flex-1 h-8 text-xs"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="h-8 px-2"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
