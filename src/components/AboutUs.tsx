import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Info } from 'lucide-react';

export default function AboutUs() {
  return (
    <section id="quienes-somos" className="flex flex-col gap-12 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="editorial-serif text-4xl text-agro-secondary border-b-4 border-agro-accent inline-block pb-2 mb-6">
          Quienes Somos
        </h2>
        <p className="text-lg leading-relaxed text-agro-dark/80">
          Somos una plataforma salvadoreña dedicada a empoderar a los agricultores locales mediante tecnología de vanguardia y asesoramiento técnico especializado.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-2xl border border-[#e0e0d6] shadow-sm">
          <h3 className="text-sm uppercase font-bold text-agro-primary mb-4 tracking-widest">Nuestra Misión</h3>
          <p className="text-base text-[#555] leading-relaxed">
            Optimizar la producción agrícola nacional a través de inteligencia artificial accesible para todos, fomentando el desarrollo sostenible del campo salvadoreño.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-[#e0e0d6] shadow-sm">
          <h3 className="text-sm uppercase font-bold text-agro-primary mb-4 tracking-widest">Nuestra Visión</h3>
          <p className="text-base text-[#555] leading-relaxed">
            Ser el aliado número uno del sector agropecuario en Centroamérica para el año 2030, liderando la transformación digital de la agricultura.
          </p>
        </div>
      </div>
    </section>
  );
}
