import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Plus, User, Bot, Loader2, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de AgroAyudaSV. ¿En qué puedo ayudarte con tus cultivos hoy?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: 'user',
            parts: [{ text: `Actúa como un experto agrónomo salvadoreño. Responde a la siguiente consulta sobre agricultura en el contexto de El Salvador: ${input}` }]
          }
        ],
        config: {
          systemInstruction: "Eres AgroAyudaSV, un asistente experto en agricultura salvadoreña. Conoces los climas de El Salvador (Zapotitán, Apaneca, etc.), los ciclos de lluvia, las plagas comunes de la región y las mejores prácticas locales. Eres amable, profesional y usas un lenguaje accesible para los agricultores."
        }
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text || 'Lo siento, no pude procesar tu solicitud.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Hubo un error al conectar con el asistente. Por favor, intenta de nuevo.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Archivo "${file.name}" seleccionado. (Funcionalidad de análisis de archivos en desarrollo)`);
    }
  };

  return (
    <div id="chatbot" className="bg-white border border-[#e0e0d6] rounded-xl flex flex-col h-[400px] shadow-lg shadow-black/5 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`p-3 px-4 rounded-[15px] max-w-[85%] text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-agro-success text-white self-end' 
                : 'bg-[#f1f1f1] text-agro-dark self-start'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#f1f1f1] p-3 px-4 rounded-[15px] flex items-center gap-2">
              <Loader2 className="animate-spin text-agro-primary" size={14} />
              <span className="text-xs text-agro-dark/50 italic">Analizando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="h-[60px] border-t border-[#eee] flex items-center px-4 gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-9 h-9 rounded-full bg-agro-primary text-white flex items-center justify-center text-xl hover:bg-agro-primary/90 transition-colors"
        >
          <Plus size={20} />
        </button>
        <div className="flex-1 bg-[#f8f8f8] h-9 rounded-[18px] px-4 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu consulta agrícola aquí..."
            className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-agro-dark placeholder:text-[#999]"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="text-agro-primary disabled:opacity-30"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
