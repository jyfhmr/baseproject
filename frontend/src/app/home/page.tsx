// src/app/home/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import './home.css';

export default function Home() {
  const router = useRouter();

  const handleScrollToDescription = () => {
    document.getElementById("description")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGoToLogin = () => {
    router.push("/dashboard");
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">JUDIS MAIL
            REVOLUCIONANDO EL ACCESO LEGAL
          </h1>
          <p className="hero-description">
            Tu solución para mantenerte informado sobre todas la leyes nuevas
          </p>
          <Button className="learn-more-button" onClick={handleScrollToDescription}>
            Más Información
          </Button>
        </div>
        <div className="hero-image">
          <img src="/img/abogado.png" alt="Imagen ilustrativa" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </div>

      {/* Description Section */}
      <div id="description" className="description-section">
        <img className="description-image" src="/img/pngwing.com (7).png" alt="Imagen descriptiva" />
        <h2 className="description-title">Acerca del Proyecto</h2>
        <p className="description-text">
          JudisMail es un proyecto innovador que tiene como objetivo principal automatizar el proceso de
          seguimiento de nuevas sentencias publicadas por el Tribunal Supremo de Justicia (TSJ). Este proyecto no solo proporcionará un servicio eficiente para mantener
          actualizados a los profesionales del derecho con notificaciones directas a su correo electrónico, sino
          que también les ofrecerá una interfaz amigable y accesible para acceder a esta información de
          manera rápida y conveniente.
        </p>
        <Button className="go-to-login-button" onClick={handleGoToLogin}>
          Registrate
        </Button>
      </div>
    </div>
  );
}
