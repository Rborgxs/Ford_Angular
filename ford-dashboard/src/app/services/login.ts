import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
	private http = inject(HttpClient);
	private apiUrl = 'http://localhost:3001';

	login(nome: string, senha: string): Observable<Usuario> {
		return this.http.post<Usuario>(`${this.apiUrl}/login`, { nome, senha });
	}
}
