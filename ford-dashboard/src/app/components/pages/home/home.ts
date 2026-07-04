import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { API_IMG } from '../../../app.config';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive],
	templateUrl: './home.html',
	styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
	private router = inject(Router);
	userName: string = '';
	menuOpen: boolean = true;
	fordLogo = API_IMG.fordLogo;
	rangerImg = API_IMG.ranger;

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