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
      content: 'Hola. Soy tu asistente agrícola. Puedo darte información sobre el cultivo de pepino, tomate, arroz, papa, cebolla, frijol y maíz en El Salvador. ¿En qué puedo ayudarte?',
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

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = newMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model' as const,
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history,
        config: {
          systemInstruction: `Eres un asistente de agricultura experto en El Salvador. Tu base técnica proviene de MAG, CENTA y FAO.
REGLAS CRÍTICAS:
1. Solo das información sobre: pepino, tomate, arroz, papa, cebolla, frijol y maíz. Si preguntan por otro, di: "Lo siento, no tengo información sobre ese cultivo."
2. Máximo 50 palabras por respuesta.
3. NO uses negrita.
4. Usa lenguaje sencillo (ej: "fertilización" -> "abono", "nutrientes" -> "alimento", "msnm" -> "altura sobre el mar").
5. Tono amigable y cercano ("Vamos a ver qué le pasa a tu planta").
6. Si la pregunta es vaga, haz preguntas de diagnóstico.

DATOS TÉCNICOS:
- Tomate: 18-30°C, pH 5.5-7. Riego cada 2-3 días. Distancia: 40-60cm entre plantas. Plagas: mosca blanca, trips.
- Pepino: 20-30°C, clima cálido. Riego frecuente sin encharcar. Siembra directa. Plagas: pulgones, trips.
- Papa: 15-25°C (zonas altas como Chalatenango). pH 5-6.5. Aporque es vital. Plagas: polilla, gusano de suelo.
- Frijol: 18-28°C. Sensible a mucha humedad. Fija nitrógeno natural. Plagas: mosca blanca, pulgones.
- Cebolla: 15-25°C. Riego frecuente al inicio, poco al final. pH 6-7. Plagas: trips, mosca de cebolla.
- Arroz: 20-35°C (costa/valles). Suelo arcilloso. Necesita mucha agua (5-10cm inundado).
- Maíz: Suelo fértil. Aporque y monitoreo constante. 50k-70k plantas por hectárea. Plagas: gusanos, barrenadores.
- Suelos: Volcánicos (muy fértiles), Aluviales (cerca de ríos, buenos para granos), Arcillosos (retienen mucha agua), Arenosos (drenan rápido).`
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
    <div id="chatbot" className="bg-white border border-[#e0e0d6] rounded-xl flex flex-col h-[550px] shadow-lg shadow-black/5 overflow-hidden">
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
