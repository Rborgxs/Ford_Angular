import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './home.html',
	styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
	private router = inject(Router);
	userName: string = '';

	ngOnInit(): void {
		const userData = sessionStorage.getItem('user');
		if (userData) {
			const user = JSON.parse(userData);
			this.userName = user.nome;
		}
	}

	logout(): void {
		sessionStorage.removeItem('user');
		this.router.navigate(['/login']);
	}
}