import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contactanos" className="h-[80px] bg-agro-dark text-white px-10 flex items-center justify-between">
      <div className="editorial-serif text-xl italic">Contáctanos</div>
      
      <div className="flex gap-8 text-[12px] opacity-90">
        <div className="flex flex-col gap-0.5">
          <span className="text-agro-accent uppercase font-bold text-[10px]">Teléfono</span>
          <span>+503 2222-1234</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-agro-accent uppercase font-bold text-[10px]">Email</span>
          <span>contacto@agroayudasv.com</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-agro-accent uppercase font-bold text-[10px]">Ubicación</span>
          <span>San Salvador, El Salvador</span>
        </div>
      </div>
    </footer>
  );
}
