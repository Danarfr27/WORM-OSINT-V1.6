import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Sparkles,
  Cpu
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

export function ChatBot() {
  const {
    messages,
    isOpen,
    isLoading,
    inputValue,
    setInputValue,
    toggleChat,
    closeChat,
    sendMessage,
    clearMessages,
    messagesEndRef,
  } = useChat();

  const chatWindowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  // Parallax effect for orb
  useEffect(() => {
    if (!isOpen || !orbRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      
      gsap.to(orbRef.current, {
        x: xPercent * 30,
        y: yPercent * 30,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen]);

  // Open animation
  useEffect(() => {
    if (isOpen && chatWindowRef.current) {
      gsap.fromTo(
        chatWindowRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  // Auto-resize textarea
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [setInputValue]);

  // Handle send
  const handleSend = useCallback(() => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  }, [inputValue, isLoading, sendMessage]);

  // Handle key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Floating button animation
  useEffect(() => {
    if (!isOpen) {
      const floatAnimation = gsap.to('.chat-float-btn', {
        y: -8,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      return () => {
        floatAnimation.kill();
      };
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="chat-float-btn fixed bottom-6 right-6 z-[100] group"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-worm-accent/30 blur-xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-500" />
        
        {/* Button */}
        <div className="relative flex items-center gap-3 px-5 py-4 bg-worm-bg-secondary border border-worm-accent/50 rounded-2xl shadow-glow-intense hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all duration-300 hover:scale-105">
          <div className="relative">
            <Bot className="w-6 h-6 text-worm-accent" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="text-left">
            <p className="text-sm font-heading font-semibold text-worm-text-primary">
              WORM AI V1.5
            </p>
            <p className="text-xs text-worm-accent font-mono">Online</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-end p-4 sm:p-6 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        onClick={closeChat}
      />

      {/* Parallax Orb Background */}
      <div
        ref={orbRef}
        className="absolute pointer-events-none opacity-30"
        style={{
          width: '600px',
          height: '600px',
          right: '-100px',
          bottom: '-100px',
          background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className="relative w-full max-w-lg h-[70vh] sm:h-[600px] bg-worm-bg-secondary/95 backdrop-blur-2xl border border-worm-accent/30 rounded-3xl shadow-[0_0_60px_rgba(0,240,255,0.15)] pointer-events-auto overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(11,14,20,0.98) 0%, rgba(5,6,11,0.98) 100%)',
        }}
      >
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(0,240,255,0.3), transparent, rgba(0,240,255,0.3), transparent)',
              animation: 'spin 8s linear infinite',
            }}
          />
          <div className="absolute inset-[1px] bg-worm-bg-secondary rounded-3xl" />
        </div>

        {/* Header */}
        <div
          ref={headerRef}
          className="relative flex items-center justify-between px-5 py-4 border-b border-worm-accent/20 bg-gradient-to-r from-worm-accent/5 to-transparent"
        >
          <div className="flex items-center gap-3">
            {/* Bot Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-worm-accent/30 to-worm-accent/10 border border-worm-accent/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-worm-accent" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-worm-bg-secondary" />
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-worm-text-primary flex items-center gap-2">
                WORM AI V1.5
                <Sparkles className="w-3.5 h-3.5 text-worm-accent animate-pulse" />
              </h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-worm-accent/80 font-mono">
                  <Cpu className="w-3 h-3" />
                  Neural Engine Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearMessages}
              className="p-2 text-worm-text-secondary hover:text-worm-accent hover:bg-worm-accent/10 rounded-lg transition-all"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeChat}
              className="p-2 text-worm-text-secondary hover:text-worm-accent hover:bg-worm-accent/10 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesRef}
          className="relative flex-1 overflow-y-auto p-5 space-y-4"
          style={{ height: 'calc(100% - 140px)' }}
        >
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-worm-accent/20 border border-worm-accent/40'
                    : 'bg-gradient-to-br from-worm-accent/30 to-worm-accent/10 border border-worm-accent/40'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-worm-accent" />
                ) : (
                  <Bot className="w-4 h-4 text-worm-accent" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-worm-accent/20 border border-worm-accent/30 text-worm-text-primary rounded-br-md'
                    : 'bg-worm-bg-primary/80 border border-worm-accent/20 text-worm-text-primary rounded-bl-md'
                }`}
              >
                {message.isTyping ? (
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-worm-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-worm-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-worm-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-worm-text-secondary font-mono">Thinking...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="m-0 leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="text-worm-accent font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="m-0 pl-4 space-y-1">{children}</ul>,
                        li: ({ children }) => <li className="text-worm-text-secondary">{children}</li>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
                
                {/* Timestamp */}
                <span className="block mt-1.5 text-[10px] text-worm-text-secondary/60 font-mono">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-worm-accent/20 bg-worm-bg-secondary/95 backdrop-blur-xl">
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask WORM AI anything..."
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 pr-12 bg-worm-bg-primary border border-worm-accent/30 rounded-xl text-worm-text-primary placeholder:text-worm-text-secondary/50 resize-none focus:outline-none focus:border-worm-accent/60 focus:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all disabled:opacity-50"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              
              {/* Character count */}
              <span className="absolute bottom-2 right-3 text-[10px] text-worm-text-secondary/40 font-mono">
                {inputValue.length}/500
              </span>
            </div>

            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0 w-12 h-12 p-0 bg-worm-accent/20 text-worm-accent border border-worm-accent/50 hover:bg-worm-accent/30 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-worm-accent/30 border-t-worm-accent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {['How to search?', 'What is risk level?', 'Data sources', 'API Settings'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                disabled={isLoading}
                className="flex-shrink-0 px-3 py-1.5 text-xs text-worm-text-secondary bg-worm-bg-primary border border-worm-accent/20 rounded-full hover:border-worm-accent/50 hover:text-worm-accent transition-all whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add spin animation for border
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
