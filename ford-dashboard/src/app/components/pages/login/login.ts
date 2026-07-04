import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/login';
import { API_IMG } from '../../../app.config';

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

	errorMessage = signal<string>('');
	showPassword = signal<boolean>(false);
	isLoading = signal<boolean>(false);

	rangerImg = API_IMG.ranger;
	fordLogo = API_IMG.fordLogo;

	loginForm = new FormGroup({
		nome: new FormControl('', [Validators.required]),
		senha: new FormControl('', [Validators.required])
	});

	togglePassword(): void {
		this.showPassword.update(v => !v);
	}

	onSubmitLogin(): void {
		if (this.loginForm.invalid) {
			this.errorMessage.set('Preencha todos os campos.');
			return;
		}
		const nome = this.loginForm.value.nome!;
		const senha = this.loginForm.value.senha!;

		this.errorMessage.set('');
		this.isLoading.set(true);

		this.loginService.login(nome, senha).subscribe({
			next: (user) => {
				sessionStorage.setItem('user', JSON.stringify(user));
				this.isLoading.set(false);
				this.router.navigate(['/home']);
			},
			error: (err) => {
				this.errorMessage.set(err.error?.message || 'Erro ao realizar login.');
				this.isLoading.set(false);
			}
		});
	}
}