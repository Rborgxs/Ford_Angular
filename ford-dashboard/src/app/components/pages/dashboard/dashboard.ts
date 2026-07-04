import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../services/vehicle';
import { Veiculo, VeiculoData } from '../../../models/veiculo.model';
import { VehicleCardComponent } from '../../vehicle-card/vehicle-card';
import { API_IMG } from '../../../app.config';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink, VehicleCardComponent],
	templateUrl: './dashboard.html',
	styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
	private vehicleService = inject(VehicleService);
	private router = inject(Router);
	private cdr = inject(ChangeDetectorRef);

	vehicles: Veiculo[] = [];
	selectedVehicle: Veiculo | null = null;
	selectedVehicleName: string = '';
	vehicleData: VeiculoData | null = null;
	vinSearch: string = '';
	vinError: string = '';

	loadingVehicles: boolean = true;
	loadingVehicleData: boolean = false;
	defaultVehicleImage: string = API_IMG.ranger;
	logoImg: string = API_IMG.fordLogo;

	ngOnInit(): void {
		this.loadVehicles();
	}

	loadVehicles(): void {
		this.loadingVehicles = true;
		this.vehicleService.getVehicles().subscribe({
			next: (vehicles) => {
				this.vehicles = vehicles;
				this.loadingVehicles = false;
				this.cdr.detectChanges();
			},
			error: (err) => {
				console.error('Erro ao carregar veículos:', err);
				this.loadingVehicles = false;
				this.cdr.detectChanges();
			}
		});
	}

	onVehicleChange(): void {
		const found = this.vehicles.find(v => v.vehicle === this.selectedVehicleName);
		this.selectedVehicle = found || null;
		this.cdr.detectChanges();
	}

	onSearchClick(): void {
		const vin = this.vinSearch.trim();
		if (!vin) {
			this.vinError = 'Digite um código VIN para buscar.';
			return;
		}
		this.searchVehicleData(vin);
	}

	searchVehicleData(vin: string): void {
		this.vinError = '';
		this.vehicleData = null;
		this.loadingVehicleData = true;
		this.vehicleService.getVehicleData(vin).subscribe({
			next: (data) => {
				this.vehicleData = data;
				this.loadingVehicleData = false;
				this.cdr.detectChanges();
			},
			error: (err) => {
				this.vinError = err.error?.message || 'VIN não encontrado.';
				this.vehicleData = null;
				this.loadingVehicleData = false;
				this.cdr.detectChanges();
			}
		});
	}

	logout(): void {
		sessionStorage.removeItem('user');
		this.router.navigate(['/login']);
	}
}