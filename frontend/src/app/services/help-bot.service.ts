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
      q: '¿Cómo cambio entre tema claro y oscuro?',
      keywords: ['tema', 'oscuro', 'claro', 'dark', 'light', 'modo', 'apariencia', 'navbar', 'sol', 'luna'],
      a: [
        'Para cambiar de tema (claro/oscuro):',
        '1) En la barra superior (navbar) pulsa el botón con el icono: sol para tema claro o luna para tema oscuro.',
        '2) La preferencia se guarda en el navegador (localStorage) y se aplicará automáticamente la próxima vez que entres.'
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

  /** Preguntas sugeridas (máx. 3). Excluye la de cambio de tema. */
  getSuggestions(): string[] {
    const excludeTitle = '¿Cómo cambio entre tema claro y oscuro?'.toLowerCase();
    const excludeKeywords = new Set(['tema','oscuro','claro','dark','light','modo','apariencia','navbar','sol','luna']);
    return this.faqs
      .filter(f => f.q.toLowerCase() !== excludeTitle && !f.keywords.some(k => excludeKeywords.has(k.toLowerCase())))
      .slice(0, 3)
      .map(f => f.q);
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

  /** Devuelve sugerencias relacionadas con la última pregunta del usuario */
  suggestFollowUps(query: string): string[] {
    const q = query.toLowerCase();
    let best: { item: FaqItem; score: number } | null = null;
    for (const item of this.faqs) {
      const score = this.score(item, q);
      if (!best || score > best.score) best = { item, score };
    }
    if (!best) return [];

    switch (best.item.q) {
      case '¿Cómo creo una tarea?':
        return [
          '¿Puedo crear una tarea sin fecha límite?',
          '¿Qué requisitos tiene el título y la descripción?',
          '¿Dónde veo mis tareas creadas?'
        ];
      case '¿Cómo edito, completo o elimino una tarea?':
        return [
          '¿Cómo marcar una tarea como completada?',
          '¿Puedo quitar la fecha límite al editar?',
          '¿Cómo elimino una tarea?'
        ];
      case '¿Cómo inicio sesión, me registro o recupero la contraseña?':
        return [
          '¿Qué hago si mi token expira?',
          '¿Cómo restablecer la contraseña?',
          '¿Puedo registrarme con usuario o email?'
        ];
      case '¿Cómo cambio entre tema claro y oscuro?':
        return [
          '¿Dónde está el botón de tema?',
          '¿Se guarda mi preferencia de tema?',
          '¿Puedo cambiar el tema sin iniciar sesión?'
        ];
      default:
        // fallback genérico basado en keywords
        return best.item.keywords.slice(0, 3).map(k => `Más sobre ${k}`);
    }
  }
}
