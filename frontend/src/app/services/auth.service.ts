import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Usuario, LoginRequest, RegisterRequest, AuthResponse, ForgotPasswordResponse, VerifySecurityAnswerRequest, ResetPasswordRequest } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/auth';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap(response => this.setAuthData(response))
      );
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => this.setAuthData(response))
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Verificar si el token no ha expirado (básico)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    return this.http.post<{ valid: boolean; user: Usuario }>(`${this.apiUrl}/verify-token`, {})
      .pipe(
        map(response => {
          if (response.valid && response.user) {
            this.currentUserSubject.next(response.user);
            return true;
          }
          return false;
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  forgotPassword(emailOrUsername: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${this.apiUrl}/forgot-password`, { emailOrUsername });
  }

  verifySecurityAnswer(data: VerifySecurityAnswerRequest): Observable<{ message: string; canResetPassword: boolean }> {
    return this.http.post<{ message: string; canResetPassword: boolean }>(`${this.apiUrl}/verify-security-answer`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, data);
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }
}
