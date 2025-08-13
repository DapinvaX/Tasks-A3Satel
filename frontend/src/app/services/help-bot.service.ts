import { Injectable } from '@angular/core';

export interface FaqItem {
  q: string;
  a: string;
  keywords: string[];
}

export interface BotAnswer {
  question: string;
  answer: string;
  confidence: number; // 0..1
}

@Injectable({ providedIn: 'root' })
export class HelpBotService {
  // FAQs elaboradas revisando frontend y backend (rutas, servicios y controladores)
  private faqs: FaqItem[] = [
    {
      q: '¿Cómo creo una tarea?',
      keywords: ['crear', 'nueva', 'tarea', 'fecha', 'sin fecha', 'titulo', 'descripción'],
      a: [
        'Para crear una tarea:',
        '1) Ve a Nueva tarea (ruta /nueva-tarea).',
        '2) Rellena Título (obligatorio, 3–100 caracteres).',
        '3) La Descripción es opcional (máx. 500).',
        '4) Puedes elegir Fecha límite o marcar "Sin fecha límite" (deshabilita el selector).',
        '5) Pulsa Crear tarea. Debes haber iniciado sesión.'
      ].join('\n')
    },
    {
      q: '¿Cómo edito, completo o elimino una tarea?',
      keywords: ['editar', 'completar', 'eliminar', 'marcar', 'guardar', 'tarea', 'sin fecha límite'],
      a: [
        'En la tarjeta de cada tarea:',
        '- Editar: pulsa el icono del lápiz, actualiza título/descr./fecha o marca "Sin fecha límite" y Guarda.',
        '- Completar: usa la casilla "Marcar como completada" (parte inferior de la tarjeta en modo lectura).',
        '- Eliminar: icono de papelera.',
        'Los cambios se guardan mediante PATCH al backend.'
      ].join('\n')
    },
    {
      q: '¿Cómo inicio sesión, me registro o recupero la contraseña?',
      keywords: ['login', 'iniciar', 'sesión', 'registro', 'recuperar', 'contraseña', 'forgot', 'password'],
      a: [
        'Autenticación:',
        '- Iniciar sesión: /login. Registro: /register.',
        '- Recuperar contraseña: /forgot-password. Indica tu email/usuario, responde la pregunta de seguridad y restablece.',
        'La app valida el token y protege el acceso a Home/Nueva tarea con AuthGuard.'
      ].join('\n')
    }
  ];

  /** Preguntas sugeridas (máx. 3) */
  getSuggestions(): string[] {
    return this.faqs.slice(0, 3).map(f => f.q);
  }

  /** Devuelve la mejor respuesta por coincidencia de palabras clave. */
  ask(query: string): BotAnswer {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { question: query, answer: 'Escribe una pregunta sobre el uso de la aplicación.', confidence: 0 };
    }

    let best: { item: FaqItem; score: number } | null = null;
    for (const item of this.faqs) {
      const score = this.score(item, q);
      if (!best || score > best.score) best = { item, score };
    }

    if (best && best.score > 0) {
      // normalizar confianza 0..1 aproximada
      const confidence = Math.min(1, best.score / 5);
      return { question: best.item.q, answer: best.item.a, confidence };
    }

    return {
      question: query,
      answer: 'No encontré una respuesta exacta. Prueba con: "¿Cómo creo una tarea?", "¿Cómo edito o completo una tarea?" o "¿Cómo inicio sesión o recupero la contraseña?"',
      confidence: 0
    };
  }

  private score(item: FaqItem, text: string): number {
    let s = 0;
    for (const k of item.keywords) {
      if (text.includes(k.toLowerCase())) s += 1;
    }
    // pequeño bonus si el título de la FAQ aparece
    if (text.includes(item.q.split(' ')[1]?.toLowerCase() || '')) s += 0.5;
    return s;
  }
}
