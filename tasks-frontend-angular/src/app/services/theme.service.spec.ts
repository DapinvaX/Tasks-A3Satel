import { TestBed } from '@angular/core/testing';
import { RendererFactory2 } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockRenderer: jasmine.SpyObj<any>;
  let mockRendererFactory: jasmine.SpyObj<RendererFactory2>;

  beforeEach(() => {
    // Mock Renderer2
    mockRenderer = jasmine.createSpyObj('Renderer2', ['setAttribute']);

    // Mock RendererFactory2
    mockRendererFactory = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
    mockRendererFactory.createRenderer.and.returnValue(mockRenderer);

    // Mock localStorage
    let store: { [key: string]: string } = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      store = {};
    });

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: RendererFactory2, useValue: mockRendererFactory }
      ]
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with light theme when no saved theme', () => {
      // The service is already initialized in beforeEach
      service.isDarkTheme$.subscribe(isDark => {
        expect(isDark).toBe(false);
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should initialize with saved dark theme', () => {
      // Arrange
      localStorage.clear();
      (localStorage.getItem as jasmine.Spy).and.returnValue('dark');

      // Act - Create new service instance
      const newService = new ThemeService(mockRendererFactory);

      // Assert
      newService.isDarkTheme$.subscribe(isDark => {
        expect(isDark).toBe(true);
      });
    });

    it('should initialize with saved light theme', () => {
      // Arrange
      localStorage.clear();
      (localStorage.getItem as jasmine.Spy).and.returnValue('light');

      // Act - Create new service instance
      const newService = new ThemeService(mockRendererFactory);

      // Assert
      newService.isDarkTheme$.subscribe(isDark => {
        expect(isDark).toBe(false);
      });
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark theme', () => {
      // Arrange
      let currentTheme: boolean;
      service.isDarkTheme$.subscribe(isDark => currentTheme = isDark);
      expect(currentTheme!).toBe(false);

      // Act
      service.toggleTheme();

      // Assert
      service.isDarkTheme$.subscribe(isDark => {
        expect(isDark).toBe(true);
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should toggle from dark to light theme', () => {
      // Arrange
      service.setDarkTheme(true);

      // Act
      service.toggleTheme();

      // Assert
      service.isDarkTheme$.subscribe(isDark => {
        expect(isDark).toBe(false);
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('setDarkTheme', () => {
    it('should set dark theme and persist to localStorage', () => {
      // Act
      service.setDarkTheme(true);

      // Assert
      service.isDarkTheme$.subscribe(isDark => {
        expect(isDark).toBe(true);
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'dark');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.body, 'data-theme', 'dark');
    });

    it('should set light theme and persist to localStorage', () => {
      // Act
      service.setDarkTheme(false);

      // Assert
      service.isDarkTheme$.subscribe(isDark => {
        expect(isDark).toBe(false);
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'light');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.body, 'data-theme', 'light');
    });

    it('should set theme without persisting when persist is false', () => {
      // Arrange
      const initialCallCount = (localStorage.setItem as jasmine.Spy).calls.count();

      // Act
      service.setDarkTheme(true, false);

      // Assert
      service.isDarkTheme$.subscribe(isDark => {
        expect(isDark).toBe(true);
      });
      // localStorage.setItem should not be called again
      expect((localStorage.setItem as jasmine.Spy).calls.count()).toBe(initialCallCount);
    });
  });

  describe('applyTheme', () => {
    it('should apply dark theme attributes to DOM elements', () => {
      // Act
      service.setDarkTheme(true);

      // Assert
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'dark');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.body, 'data-theme', 'dark');
    });

    it('should apply light theme attributes to DOM elements', () => {
      // Act
      service.setDarkTheme(false);

      // Assert
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.documentElement, 'data-theme', 'light');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(document.body, 'data-theme', 'light');
    });
  });

  describe('isDarkTheme$ observable', () => {
    it('should emit initial theme state', (done) => {
      // Act & Assert
      service.isDarkTheme$.subscribe(isDark => {
        expect(typeof isDark).toBe('boolean');
        done();
      });
    });

    it('should emit changes when theme is toggled', () => {
      // Arrange
      const emittedValues: boolean[] = [];
      service.isDarkTheme$.subscribe(isDark => emittedValues.push(isDark));

      // Act
      service.toggleTheme();
      service.toggleTheme();

      // Assert
      expect(emittedValues.length).toBeGreaterThan(1);
      expect(emittedValues[emittedValues.length - 1]).toBe(false); // Should end up back to light
    });
  });
});
