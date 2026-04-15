import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Info } from 'lucide-react';

export default function AboutUs() {
  return (
    <section id="quienes-somos" className="flex flex-col gap-4">
      <div>
        <h2 className="editorial-serif text-2xl text-agro-secondary border-b-2 border-agro-accent inline-block pb-1 mb-4">
          Quienes Somos
        </h2>
        <p className="text-sm leading-relaxed text-agro-dark">
          Somos una plataforma salvadoreña dedicada a empoderar a los agricultores locales mediante tecnología de vanguardia y asesoramiento técnico especializado.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-5 mt-2">
        <div className="m-v-box">
          <h3 className="text-[12px] uppercase font-bold text-agro-primary mb-1.5">Nuestra Misión</h3>
          <p className="text-[13px] text-[#555] leading-snug">
            Optimizar la producción agrícola nacional a través de inteligencia artificial accesible para todos.
          </p>
        </div>
        <div className="m-v-box">
          <h3 className="text-[12px] uppercase font-bold text-agro-primary mb-1.5">Nuestra Visión</h3>
          <p className="text-[13px] text-[#555] leading-snug">
            Ser el aliado número uno del sector agropecuario en Centroamérica para el año 2030.
          </p>
        </div>
      </div>
    </section>
  );
}
