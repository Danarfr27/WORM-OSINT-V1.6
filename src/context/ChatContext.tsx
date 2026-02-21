import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Bot personality and knowledge base
const BOT_NAME = 'WORM AI V1.5';
const WELCOME_MESSAGE = `Hello! I'm ${BOT_NAME}, your intelligent investigative assistant. I can help you with:

• **OSINT Research** - Finding information about individuals
• **Data Analysis** - Interpreting search results
• **Security Insights** - Risk assessment guidance
• **General Queries** - Answering questions about the platform

How can I assist you today?`;

// Mock AI responses for demo (replace with actual API call)
const generateAIResponse = async (userMessage: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
  
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return `Greetings! Welcome to WORM AI. I'm here to help you navigate through investigative searches and provide insights. What would you like to explore today?`;
  }
  
  if (lowerMsg.includes('search') || lowerMsg.includes('find') || lowerMsg.includes('lookup')) {
    return `To perform a search, simply enter a name, alias, or identifier in the search field on the main page. I'll scan through multiple data sources including public records, social media, and breach databases to compile a comprehensive profile.`;
  }
  
  if (lowerMsg.includes('risk') || lowerMsg.includes('danger')) {
    return `Our risk assessment algorithm analyzes multiple factors including digital footprint, association networks, and historical data patterns. Risk levels range from LOW (green) to CRITICAL (red). Each assessment includes confidence scores from our data sources.`;
  }
  
  if (lowerMsg.includes('api') || lowerMsg.includes('key') || lowerMsg.includes('setting')) {
    return `You can configure your API settings by clicking the Settings button in the navigation bar. There you can update your API key and select your preferred AI model for enhanced search capabilities.`;
  }
  
  if (lowerMsg.includes('data') || lowerMsg.includes('source')) {
    return `WORM AI aggregates data from multiple sources including: Public Records (92% confidence), Social Graph Analysis (87%), Breach Correlation (74%), Open Web Sources (81%), and Dark Web Monitoring (63%).`;
  }
  
  if (lowerMsg.includes('help') || lowerMsg.includes('how')) {
    return `I'm here to help! You can:\n\n1. **Search** - Enter a name to start investigating\n2. **Review Results** - Check the Intelligence Deck for findings\n3. **Assess Risk** - Review the risk level indicator\n4. **Configure** - Update API settings as needed\n\nWhat specific aspect would you like help with?`;
  }
  
  return `I understand you're asking about "${userMessage}". As ${BOT_NAME}, I'm designed to assist with investigative research and data analysis. Could you provide more context or try asking about search functionality, risk assessment, or data sources?`;
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = useCallback(() => setIsOpen(prev => !prev), []);
  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Scroll after user message
    setTimeout(scrollToBottom, 100);

    try {
      // Add typing indicator
      const typingId = `typing-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: typingId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isTyping: true,
      }]);

      // Get AI response
      const response = await generateAIResponse(content.trim());

      // Remove typing indicator and add response
      setMessages(prev => [
        ...prev.filter(m => m.id !== typingId),
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [isLoading, scrollToBottom]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome-new',
        role: 'assistant',
        content: WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        inputValue,
        setInputValue,
        toggleChat,
        openChat,
        closeChat,
        sendMessage,
        clearMessages,
        messagesEndRef,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
