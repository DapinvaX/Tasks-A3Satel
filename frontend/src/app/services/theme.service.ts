import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkThemeSubject.asObservable();
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setDarkTheme(savedTheme === 'dark', false);
    } else {
      this.setDarkTheme(false, false);
      localStorage.setItem('theme', 'light');
    }
  }

  toggleTheme(): void {
    this.setDarkTheme(!this.isDarkThemeSubject.value);
  }

  setDarkTheme(isDark: boolean, persist: boolean = true): void {
    this.isDarkThemeSubject.next(isDark);
    this.applyTheme(isDark);
    if (persist) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }

  private applyTheme(isDark: boolean): void {
    const root = document.documentElement;
    const body = document.body;
    if (isDark) {
      this.renderer.setAttribute(root, 'data-theme', 'dark');
      this.renderer.setAttribute(body, 'data-theme', 'dark');
    } else {
      this.renderer.setAttribute(root, 'data-theme', 'light');
      this.renderer.setAttribute(body, 'data-theme', 'light');
    }
  }
}
