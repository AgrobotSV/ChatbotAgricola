import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Plus, User, Bot, Loader2, FileText, X, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  file?: {
    name: string;
    type: string;
    data?: string; // base64
  };
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
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; base64: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      file: selectedFile ? { name: selectedFile.name, type: selectedFile.type } : undefined
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input;
    const currentFile = selectedFile;
    setInput('');
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const history = newMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model' as const,
        parts: [{ text: msg.content }]
      }));

      const currentParts: any[] = [{ text: currentInput || "Analiza este archivo" }];
      if (currentFile) {
        currentParts.push({
          inlineData: {
            data: currentFile.base64,
            mimeType: currentFile.type
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          {
            role: 'user',
            parts: currentParts
          }
        ],
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("El archivo es demasiado grande. El límite es 20MB.");
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        setSelectedFile({
          name: file.name,
          type: file.type,
          base64: base64
        });
      } catch (err) {
        console.error("Error reading file:", err);
      }
    }
    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div id="chatbot" className="bg-white border border-[#e0e0d6] rounded-xl flex flex-col h-[550px] shadow-lg shadow-black/5 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.file && (
              <div className="mb-1 flex items-center gap-2 bg-black/5 border border-black/10 rounded-lg p-2 pr-4 text-xs">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white">
                  <FileText size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-agro-dark truncate max-w-[150px]">{msg.file.name}</span>
                  <span className="text-[10px] opacity-60 uppercase">{msg.file.type.split('/')[1] || 'FILE'}</span>
                </div>
              </div>
            )}
            <div className={`p-3 px-4 rounded-[18px] max-w-[85%] text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-agro-success text-white' 
                : 'bg-[#f1f1f1] text-agro-dark'
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
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex flex-col border-t border-[#eee]">
        <AnimatePresence>
          {selectedFile && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-2 bg-[#f9f9f9] border-b border-[#eee] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  <FileText size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-agro-dark truncate max-w-[200px]">{selectedFile.name}</span>
                  <span className="text-[10px] opacity-60 uppercase">{selectedFile.type.split('/')[1] || 'PDF'}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFile(null)}
                className="p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={16} className="text-agro-dark/40" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-[65px] flex items-center px-4 gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 rounded-full bg-agro-primary text-white flex items-center justify-center hover:bg-agro-primary/90 transition-colors shadow-sm"
          >
            <Plus size={20} />
          </button>
          <div className="flex-1 bg-[#f0f0f0] h-10 rounded-[20px] px-4 flex items-center border border-black/5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu consulta o adjunta un archivo..."
              className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-agro-dark placeholder:text-[#999]"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedFile) || isLoading}
            className="text-agro-primary disabled:opacity-30 transition-opacity"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
