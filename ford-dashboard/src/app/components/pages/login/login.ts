import { Component, inject } from '@angular/core';
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

	errorMessage: string = '';
	showPassword: boolean = false;
	isLoading: boolean = false;
	rangerImg = API_IMG.ranger;
	fordLogo = API_IMG.fordLogo;

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

		this.errorMessage = '';
		this.isLoading = true;

		this.loginService.login(nome, senha).subscribe({
			next: (user) => {
				sessionStorage.setItem('user', JSON.stringify(user));
				this.isLoading = false;
				this.router.navigate(['/home']);
			},
			error: (err) => {
				this.errorMessage = err.error?.message || 'Erro ao realizar login.';
				this.isLoading = false;
			}
		});
	}
}