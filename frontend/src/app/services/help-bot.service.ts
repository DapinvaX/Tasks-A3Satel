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
    // Principales (ordenadas para sugerencias iniciales)
    {
      q: '¿Cómo creo una tarea?',
      keywords: ['crear', 'nueva', 'tarea', 'fecha', 'sin fecha', 'titulo', 'descripción'],
      a: [
        'Para crear una tarea:',
        '1) Ve a Nueva tarea (ruta /nueva-tarea).',
        '2) Rellena Título (obligatorio, 3–100 caracteres).',
        '3) La Descripción es opcional (máx. 500).',
        '4) Puedes elegir Fecha límite o marcar "Sin fecha límite" (deshabilita el selector).',
  '5) Pulsa Crear tarea. Debes haber iniciado sesión.',
  '- Tras crearla, la verás en /home.'
      ].join('\n')
    },
    {
      q: '¿Cómo edito, completo o elimino una tarea?',
      keywords: ['editar', 'completar', 'eliminar', 'marcar', 'guardar', 'tarea', 'sin fecha límite'],
      a: [
  'En /home, en la tarjeta de cada tarea:',
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

    // Follow-ups de creación
    {
      q: '¿Puedo crear una tarea sin fecha límite?',
      keywords: ['crear','tarea','sin fecha','fecha límite','opcional','fecha'],
      a: [
  'Sí. En /nueva-tarea marca la casilla "Sin fecha límite".',
        '- Al hacerlo, el selector de fecha se deshabilita y se enviará sin fecha.',
        '- En las tarjetas aparecerá "Sin fecha límite" cuando no haya fecha definida.'
      ].join('\n')
    },
    {
      q: '¿Qué requisitos tiene el título y la descripción?',
      keywords: ['título','descripcion','longitud','requisitos','validación'],
      a: [
  'Requisitos del formulario de tarea (en /nueva-tarea):',
        '- Título: obligatorio, 3–75 caracteres.',
        '- Descripción: opcional, hasta 200 caracteres.',
        '- Fecha límite: opcional; o marca "Sin fecha límite".'
      ].join('\n')
    },
    {
      q: '¿Dónde veo mis tareas creadas?',
      keywords: ['ver','tareas','lista','home','dashboard'],
      a: [
  'Puedes ver tus tareas en /home (dashboard) tras iniciar sesión.',
        '- Solo verás tus propias tareas.',
        '- Desde allí puedes editarlas, completarlas o eliminarlas.'
      ].join('\n')
    },

    // Follow-ups de edición/completado/eliminación
    {
      q: '¿Cómo marcar una tarea como completada?',
      keywords: ['marcar','completada','completar','estado'],
      a: [
  'En /home, en la tarjeta de la tarea, usa la casilla de "Marcar como completada".',
        'También puedes revertirla desmarcando la casilla.'
      ].join('\n')
    },
    {
      q: '¿Puedo quitar la fecha límite al editar?',
      keywords: ['quitar','fecha límite','editar','sin fecha'],
      a: [
  'Sí. En /home, en modo edición, marca "Sin fecha límite" para eliminar la fecha asignada.',
        'Guarda los cambios y se actualizará la tarea sin fecha.'
      ].join('\n')
    },
    {
      q: '¿Cómo elimino una tarea?',
      keywords: ['eliminar','borrar','tarea','papelera'],
      a: [
  'En /home, en la tarjeta de la tarea pulsa el icono de papelera.',
        'Confirma la eliminación para borrarla de forma permanente.'
      ].join('\n')
    },

    // Follow-ups de tema
    {
      q: '¿Dónde está el botón de tema?',
      keywords: ['tema','botón','navbar','sol','luna','oscuro','claro'],
      a: 'En la barra superior (navbar), a la derecha: el icono de sol/luna alterna el tema.'
    },
    {
      q: '¿Se guarda mi preferencia de tema?',
      keywords: ['tema','preferencia','guardar','persistencia','localstorage'],
      a: 'Sí, la selección de tema se guarda en localStorage y se restaura automáticamente.'
    },
    {
      q: '¿Puedo cambiar el tema sin iniciar sesión?',
      keywords: ['tema','sin iniciar sesión','anónimo','guest'],
      a: 'Sí, el cambio de tema es local al navegador y no requiere iniciar sesión.'
    },

    // Follow-ups de autenticación
    {
      q: '¿Qué hago si mi token expira?',
      keywords: ['token','expira','expirado','sesión','401','no autorizado'],
      a: [
        'Si tu token expira serás redirigido a iniciar sesión de nuevo.',
        '- Vuelve a loguearte desde /login para obtener un nuevo token.'
      ].join('\n')
    },
    {
      q: '¿Cómo restablecer la contraseña?',
      keywords: ['restablecer','contraseña','reset','forgot password'],
      a: [
  'Usa /forgot-password y sigue los 3 pasos: identificación, respuesta de seguridad y nueva contraseña.'
      ].join('\n')
    },
    {
      q: '¿Puedo registrarme con usuario o email?',
      keywords: ['registrarme','usuario','email','registro'],
      a: 'Sí. Regístrate en /register con email y nombre de usuario; luego podrás iniciar con cualquiera de los dos.'
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

    // Coincidencia exacta por título de FAQ (case-insensitive)
    const exact = this.faqs.find(f => f.q.toLowerCase().trim() === q);
    if (exact) {
      return { question: exact.q, answer: exact.a, confidence: 1 };
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
