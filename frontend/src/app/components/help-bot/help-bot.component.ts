import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HelpBotService } from '../../services/help-bot.service';

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
  messages = signal<{ from: 'bot' | 'user'; text: string }[]>([{
    from: 'bot',
    text: 'Hola, soy tu asistente. ¿En qué puedo ayudarte?'
  }]);

  suggestions = this.bot.getSuggestions();

  toggle() { this.isOpen.update(v => !v); }

  send(text?: string) {
    const content = (text ?? this.input()).trim();
    if (!content) return;

    this.messages.update(m => [...m, { from: 'user', text: content }]);
    const ans = this.bot.ask(content);
    this.messages.update(m => [...m, { from: 'bot', text: ans.answer }]);
    this.input.set('');
  }
}
