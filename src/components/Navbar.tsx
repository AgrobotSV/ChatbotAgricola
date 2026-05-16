import React from 'react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const navItems = [
    { name: 'INICIO', href: '#inicio' },
    { name: 'FAQ', href: '#faq' },
    { name: 'ASISTENTE IA', href: '#chatbot' },
    { name: 'CONTACTO', href: '#contactanos' },
  ];

  return (
    <nav className="h-20 bg-white px-10 flex items-center justify-between sticky top-0 z-50 border-b border-black/5">
      <div className="flex items-center gap-3">
        <img 
          src="https://lh3.googleusercontent.com/d/1oQHlGVGOSaT6nQwIUA0CfJrFtc6-lVap" 
          alt="AgroAyuda SV Logo" 
          className="w-22 h-22 object-contain"
          referrerPolicy="no-referrer"
        />
        <div className="text-2xl font-medium text-agro-dark flex items-center">
          AgroAyuda <span className="text-agro-primary italic ml-1 font-bold">SV</span>
        </div>
      </div>
      
      <div className="flex items-center gap-10">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-agro-dark text-[13px] font-bold uppercase tracking-wider hover:text-agro-primary transition-colors"
          >
            {item.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
