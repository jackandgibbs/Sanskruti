import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles, User, MessageCircle } from "lucide-react";
import StylistAvatar from "./StylistAvatar";

export default function StylistChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! 🙏 I'm your personal Sanskruti stylist. Are you looking for something specific today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), text: input, sender: "user" }]);
    setInput("");
    
    // Fake typing reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "That sounds beautiful! Let me check our exclusive collection for you. Would you prefer a silk or cotton blend?", 
        sender: "bot" 
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gold/20 flex flex-col origin-bottom-right"
          >
            {/* Header */}
            <div className="bg-[#2a513d] text-ivory p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/50 bg-[#2a513d]">
                  <StylistAvatar className="w-full h-full scale-[1.2] translate-y-1" />
                </div>
                <div>
                  <h3 className="font-heading text-lg leading-tight flex items-center gap-1">
                    Your Stylist <Sparkles className="w-3 h-3 text-gold" />
                  </h3>
                  <p className="text-xs text-gold/80">Typically replies instantly</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-ivory/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-80 p-4 overflow-y-auto flex flex-col gap-3 bg-[#fbf9f4]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-[#2a513d] flex-shrink-0 mr-2 flex items-center justify-center overflow-hidden border border-gold/30 mt-1">
                       <StylistAvatar className="w-full h-full scale-[1.3] translate-y-0.5" />
                    </div>
                  )}
                  <div 
                    className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow-sm
                      ${msg.sender === 'user' 
                        ? 'bg-gold text-charcoal rounded-br-none' 
                        : 'bg-white border border-[#2a513d]/10 text-charcoal rounded-bl-none'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gold/20 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about sizing, fabrics..."
                className="flex-1 bg-[#fbf9f4] border border-gold/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-[#2a513d] text-ivory p-2 rounded-full hover:bg-[#1a3326] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#2a513d] rounded-full shadow-lg shadow-[#2a513d]/30 flex items-center justify-center border-2 border-gold relative overflow-hidden group"
      >
        <StylistAvatar className="w-full h-full scale-[1.25] translate-y-1.5 transition-transform duration-300 group-hover:scale-[1.35]" />
        
        {/* Notification dot */}
        {!isOpen && messages.length === 1 && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </motion.button>
    </div>
  );
}
