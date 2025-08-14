import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HelpBotService } from '../../services/help-bot.service';

type ChatMsg = { from: 'bot' | 'user'; text: string; thinking?: boolean };

@Component({
  selector: 'app-help-bot',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './help-bot.component.html',
  styleUrl: './help-bot.component.css'
})
export class HelpBotComponent {
  private bot = inject(HelpBotService);

  isOpen = signal(false);
  input = signal('');
  messages = signal<ChatMsg[]>([{
    from: 'bot',
    text: 'Hola, soy tu asistente. ¿En qué puedo ayudarte?'
  }]);

  suggestions = this.bot.getSuggestions();
  // Controla si deben mostrarse las sugerencias (se ocultan cuando el usuario escribe y pulsa Enter)
  showSuggestions = signal(true);
  // Última pregunta del usuario para sugerencias contextuales
  lastUserQuestion = signal<string>('');
  showFollowups = signal(false);
  followups = signal<string[]>([]);

  @ViewChild('messagesRef') private messagesRef?: ElementRef<HTMLDivElement>;

  private scrollToBottom() {
    // ejecutar tras el próximo ciclo de render
    setTimeout(() => {
      const el = this.messagesRef?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 0);
  }

  toggle() { this.isOpen.update(v => !v); }

  send(text?: string) {
    const content = (text ?? this.input()).trim();
    if (!content) return;

    this.messages.update(m => [...m, { from: 'user', text: content }]);
  this.lastUserQuestion.set(content);
  this.showFollowups.set(false);
  this.scrollToBottom();
    // Mostrar animación de pensamiento
    const thinkingMessage: ChatMsg = { from: 'bot', text: '', thinking: true };
    const thinkingIndex = this.messages().length; // índice donde se añadirá
    this.messages.update(m => [...m, thinkingMessage]);
  this.scrollToBottom();

    const ans = this.bot.ask(content);

    // Simular tiempo de "pensando" para que la animación se vea
    const delay = Math.max(350, Math.min(900, Math.floor(content.length * 20)));
    setTimeout(() => {
      this.messages.update(m => {
        const copy = [...m];
        // Si el mensaje en thinkingIndex sigue siendo "thinking", reemplazarlo
        if (copy[thinkingIndex] && copy[thinkingIndex].thinking) {
          copy.splice(thinkingIndex, 1, { from: 'bot', text: ans.answer });
        } else {
          // fallback: añadir al final
          copy.push({ from: 'bot', text: ans.answer });
        }
        return copy;
      });
  this.scrollToBottom();
      // Tras responder, ofrecer sugerencias contextuales (follow-ups)
      const related = this.bot.suggestFollowUps(content).slice(0, 4);
      this.followups.set(related);
      this.showFollowups.set(related.length > 0);
      // Mantener ocultas las sugerencias iniciales; se reabrirán al enfocar si no hay follow-ups
      if (related.length === 0) {
        // no activar showSuggestions aquí; onInputFocus decidirá
        this.showSuggestions.set(false);
      }
    }, delay);
    this.input.set('');
  // Ocultar sugerencias tanto si se envía por Enter como seleccionando una sugerencia
  this.showSuggestions.set(false);
  }

  onInputFocus() {
    // Si el usuario ya está escribiendo, no mostrar sugerencias
    if (this.input().trim().length > 0) {
      this.showFollowups.set(false);
      this.showSuggestions.set(false);
      return;
    }
    const base = this.lastUserQuestion();
    // Si no hay última pregunta, mostrar sugerencias iniciales
    if (!base) {
      this.showFollowups.set(false);
      this.followups.set([]);
      this.showSuggestions.set(true);
      return;
    }
    // Si hay última pregunta, intentar mostrar follow-ups; si no hay, volver a sugerencias iniciales
    const list = this.bot.suggestFollowUps(base).slice(0, 4);
    this.followups.set(list);
    const hasFollowups = list.length > 0;
    this.showFollowups.set(hasFollowups);
    this.showSuggestions.set(!hasFollowups);
  }

  onInputChange(value: string) {
    this.input.set(value);
    const hasText = value.trim().length > 0;
    if (hasText) {
      // Ocultar cualquier sugerencia mientras se escribe
      this.showFollowups.set(false);
      this.showSuggestions.set(false);
    } else {
      // Al limpiar, volver a mostrar las sugerencias adecuadas al contexto
      const base = this.lastUserQuestion();
      if (!base) {
        this.followups.set([]);
        this.showFollowups.set(false);
        this.showSuggestions.set(true);
      } else {
        const list = this.bot.suggestFollowUps(base).slice(0, 4);
        this.followups.set(list);
        const hasFollowups = list.length > 0;
        this.showFollowups.set(hasFollowups);
        this.showSuggestions.set(!hasFollowups);
      }
    }
  }

  pickFollowup(f: string) {
    this.input.set(f);
    this.showFollowups.set(false);
    this.send();
  }
}
