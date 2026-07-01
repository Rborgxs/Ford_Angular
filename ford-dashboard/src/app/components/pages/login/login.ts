import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.html',
	styleUrls: ['./login.css']
})
export class LoginComponent {
	private loginService = inject(LoginService);
	private router = inject(Router);

	errorMessage: string = '';

	loginForm = new FormGroup({
		nome: new FormControl('', [Validators.required]),
		senha: new FormControl('', [Validators.required])
	});

	onSubmitLogin(): void {
		if (this.loginForm.invalid) {
			this.errorMessage = 'Preencha todos os campos.';
			return;
		}
		const nome = this.loginForm.value.nome!;
		const senha = this.loginForm.value.senha!;
		this.loginService.login(nome, senha).subscribe({
			next: (user) => {
				sessionStorage.setItem('user', JSON.stringify(user));
				this.router.navigate(['/home']);
			},
			error: (err) => {
				this.errorMessage = err.error?.message || 'Erro ao realizar login.';
			}
		});
	}
}

