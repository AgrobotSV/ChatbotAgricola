import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#e0e0d6]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-agro-primary transition-colors"
      >
        <span className="font-medium text-lg text-agro-dark">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="text-agro-primary" size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-agro-dark/70 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const faqs = [
    {
      question: "¿Cuál es la temperatura ideal para el cultivo de tomate?",
      answer: "El tomate se desarrolla mejor en climas cálidos moderados, con una temperatura ideal entre los 18°C y 30°C."
    },
    {
      question: "¿Qué tipo de suelo prefiere la papa en El Salvador?",
      answer: "Prefiere suelos sueltos (franco-arenosos), con buen drenaje y ricos en materia orgánica, con un pH entre 5.0 y 6.5."
    },
    {
      question: "¿Con qué frecuencia se debe regar el pepino?",
      answer: "El riego debe ser frecuente y moderado. Es vital evitar encharcamientos, ya que el pepino necesita agua constante pero no en exceso."
    },
    {
      question: "¿Cuál es la densidad de siembra recomendada para el maíz?",
      answer: "Se recomienda mantener una densidad de entre 50,000 a 70,000 plantas por hectárea para evitar la competencia por nutrientes."
    },
    {
      question: "¿Qué plagas son las más comunes en el cultivo de frijol?",
      answer: "Las plagas más frecuentes que afectan al frijol en nuestro país son la mosca blanca, los pulgones y los trips."
    },
    {
      question: "¿En qué época se recomienda sembrar arroz en El Salvador?",
      answer: "Se recomienda sembrar al inicio de la temporada de lluvias, generalmente entre los meses de mayo y junio."
    },
    {
      question: "¿Qué sucede si el cultivo de cebolla recibe un exceso de agua al final?",
      answer: "Mucha agua al final del ciclo puede dañar el bulbo. Se recomienda reducir el riego a medida que el cultivo se acerca a la cosecha."
    },
    {
      question: "¿Qué es el aporque y por qué es importante en la papa?",
      answer: "El aporque consiste en amontonar tierra en la base de la planta. Es muy importante porque protege a las papas del sol y mejora significativamente la producción."
    },
    {
      question: "¿Cuál es el pH ideal para el desarrollo del tomate?",
      answer: "Para un buen desarrollo, el suelo debe tener un pH neutro o ligeramente ácido, idealmente entre 5.5 y 7.0."
    },
    {
      question: "¿Cuánto tiempo después del trasplante se cosecha el tomate?",
      answer: "La cosecha del tomate suele realizarse entre los 60 y 90 días después de haber realizado el trasplante al terreno definitivo."
    }
  ];

  return (
    <section id="faq" className="flex flex-col gap-10">
      <div className="text-center">
        <h2 className="editorial-serif text-4xl text-agro-secondary border-b-4 border-agro-accent inline-block pb-2 mb-6">
          Preguntas Frecuentes
        </h2>
        <p className="text-lg text-agro-dark/60 max-w-2xl mx-auto">
          Encuentra respuestas rápidas basadas en las guías técnicas de MAG y CENTA para tus cultivos.
          ¿Tienes dudas? Nuestro <a href="#chatbot" className="text-agro-primary underline hover:text-agro-primary/80 transition-colors">asistente</a> puede ayudarte
        </p>
      </div>

      <div className="max-w-4xl mx-auto w-full bg-white p-8 rounded-2xl border border-[#e0e0d6] shadow-sm">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}
