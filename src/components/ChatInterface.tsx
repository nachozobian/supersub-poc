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
}

// Función para generar un sessionId único
const generateSessionId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

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
    const [sessionId] = useState(() => generateSessionId()); // Generar sessionId único al inicializar
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // URL del endpoint
    const WEBHOOK_URL = 'https://juanjogamez2.app.n8n.cloud/webhook/d69fdf7e-3f27-414c-abb2-bf9ffda43d78';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Extrae un texto legible tanto si la respuesta es objeto como array
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
            // Toma el primer elemento útil del array
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
            console.log('Sending message to webhook, waiting for response...');
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatInput: currentInput,
                    sessionId: sessionId
                }),
            });

            if (response.ok) {
                let responseContent: string | undefined;

                try {
                    // Leer como texto primero
                    const responseText = await response.text();
                    console.log('Raw webhook response:', responseText);

                    if (!responseText.trim()) {
                        responseContent = 'Empty response received from server';
                    } else {
                        // Intentar parsear JSON
                        try {
                            const data = JSON.parse(responseText);
                            console.log('Parsed JSON response:', data);
                            responseContent = extractContentFromData(data);
                        } catch {
                            // No era JSON, usar texto plano
                            console.log('Response is not JSON, using as text');
                            responseContent = responseText;
                        }
                    }
                } catch (error) {
                    console.error('Error reading webhook response:', error);
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
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error sending message to webhook:', error);

            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: 'Sorry, I encountered an error connecting to the chat service. Please try again later.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);

            toast({
                title: "Connection Error",
                description: "Failed to connect to chat service. Please try again later.",
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

    // Parsea mensajes para detectar enlaces tipo [texto](video:VIDEOID:SEGUNDOS) y URLs de YouTube
    const parseMessageContent = (content: string) => {
        const timestampLinkRegex = /\[([^\]]+)\]\(video:([^:]+):(\d+)\)/g;
        const youtubeUrlRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(?:[&?]t=(\d+))?/g;
        
        const parts: Array<
            | { type: 'text'; content: string }
            | { type: 'link'; content: string; videoId: string; timestamp: number }
        > = [];
        
        // Crear una lista de todas las coincidencias con sus posiciones
        const allMatches: Array<{
            index: number;
            length: number;
            content: string;
            videoId: string;
            timestamp: number;
        }> = [];

        // Buscar enlaces de timestamp personalizados
        let match: RegExpExecArray | null;
        while ((match = timestampLinkRegex.exec(content)) !== null) {
            allMatches.push({
                index: match.index,
                length: match[0].length,
                content: match[1],
                videoId: match[2],
                timestamp: parseInt(match[3], 10)
            });
        }

        // Buscar URLs de YouTube
        while ((match = youtubeUrlRegex.exec(content)) !== null) {
            const videoId = match[1];
            const timestamp = match[2] ? parseInt(match[2], 10) : 0;
            allMatches.push({
                index: match.index,
                length: match[0].length,
                content: match[0], // Usar la URL completa como texto del enlace
                videoId: videoId,
                timestamp: timestamp
            });
        }

        // Ordenar matches por posición
        allMatches.sort((a, b) => a.index - b.index);

        let lastIndex = 0;
        for (const match of allMatches) {
            // Agregar texto antes del match
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: content.slice(lastIndex, match.index)
                });
            }

            // Agregar el link
            parts.push({
                type: 'link',
                content: match.content,
                videoId: match.videoId,
                timestamp: match.timestamp
            });

            lastIndex = match.index + match.length;
        }

        // Agregar texto restante
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
                <div className="text-xs text-white/70">Session: {sessionId.substring(0, 8)}...</div>
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