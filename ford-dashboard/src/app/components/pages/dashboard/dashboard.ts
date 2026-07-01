import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, filter, distinctUntilChanged } from 'rxjs/operators';
import { VehicleService } from '../../../services/vehicle';
import { Veiculo, VeiculoData } from '../../../models/veiculo.model';
import { VehicleCardComponent } from '../../vehicle-card/vehicle-card';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [CommonModule, FormsModule, VehicleCardComponent],
	templateUrl: './dashboard.html',
	styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
	private vehicleService = inject(VehicleService);
	private router = inject(Router);

	vehicles: Veiculo[] = [];
	selectedVehicle: Veiculo | null = null;
	selectedVehicleName: string = '';
	vehicleData: VeiculoData | null = null;
	vinSearch: string = '';
	vinError: string = '';

	private vinSubject = new Subject<string>();
	private vinSubscription: any;

	ngOnInit(): void {
		this.loadVehicles();
		this.setupVinSearch();
	}

	ngOnDestroy(): void {
		if (this.vinSubscription) {
			this.vinSubscription.unsubscribe();
		}
	}

	loadVehicles(): void {
		this.vehicleService.getVehicles().subscribe({
			next: (vehicles) => {
				this.vehicles = vehicles;
				if (vehicles.length > 0) {
					this.selectedVehicle = vehicles[0];
					this.selectedVehicleName = vehicles[0].vehicle;
				}
			},
			error: (err) => {
				console.error('Erro ao carregar veículos:', err);
			}
		});
	}

	onVehicleChange(): void {
		const found = this.vehicles.find(v => v.vehicle === this.selectedVehicleName);
		if (found) {
			this.selectedVehicle = found;
		}
	}

	setupVinSearch(): void {
		this.vinSubscription = this.vinSubject.pipe(
			debounceTime(500),
			filter(vin => vin.trim().length > 5),
			distinctUntilChanged()
		).subscribe(vin => this.searchVehicleData(vin));
	}

	onVinInput(): void {
		this.vinSubject.next(this.vinSearch);
	}

	searchVehicleData(vin: string): void {
		this.vinError = '';
		this.vehicleData = null;
		this.vehicleService.getVehicleData(vin).subscribe({
			next: (data) => this.vehicleData = data,
			error: (err) => this.vinError = err.error?.message || 'VIN não encontrado.'
		});
	}

	logout(): void {
		sessionStorage.removeItem('user');
		this.router.navigate(['/login']);
	}
}