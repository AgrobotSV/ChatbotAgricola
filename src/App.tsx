/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Chatbot from './components/Chatbot';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-agro-bg text-agro-dark">
      <Navbar />
      
      <main className="flex-grow flex flex-col">
        {/* Carousel Section */}
        <Carousel />

        {/* Hero Section */}
        <header className="px-10 py-16 text-center">
          <h1 className="text-[56px] font-medium text-agro-dark mb-4 tracking-tight">
            Asistente Agrícola Inteligente
          </h1>
          <p className="text-xl text-agro-dark/60 max-w-3xl mx-auto leading-relaxed">
            Recibe consejos sobre el cultivo de pepino, tomate, arroz, papa, cebolla, frijol y maíz en nuestras tierras salvadoreñas.
          </p>
        </header>

        {/* Main Content Stack */}
        <div className="max-w-5xl mx-auto w-full px-10 py-12 space-y-24">
          <Chatbot />
          <AboutUs />
        </div>
      </main>

      <Footer />
    </div>
  );
}
