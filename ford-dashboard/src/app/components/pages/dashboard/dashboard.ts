import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, interval } from 'rxjs';
import { debounceTime, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { VehicleService } from '../../../services/vehicle';
import { Veiculo, VeiculoData } from '../../../models/veiculo.model';
import { VehicleCardComponent } from '../../vehicle-card/vehicle-card';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink, VehicleCardComponent],
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

	loadingVehicles: boolean = true;
	loadingVehicleData: boolean = false;
	defaultVehicleImage: string = '/img/ranger.png';

	private vinSubject = new Subject<string>();
	private vinSubscription: any;
	private refreshSubscription: any;

	ngOnInit(): void {
		this.loadVehicles();
		this.setupVinSearch();

		this.refreshSubscription = interval(30000)
			.pipe(switchMap(() => this.vehicleService.getVehicles()))
			.subscribe({
				next: (vehicles) => {
					this.vehicles = vehicles;
					if (this.selectedVehicleName) {
						const found = vehicles.find(v => v.vehicle === this.selectedVehicleName);
						if (found) this.selectedVehicle = found;
					}
				},
				error: (err) => console.error('Erro ao atualizar veículos:', err)
			});
	}

	ngOnDestroy(): void {
		if (this.vinSubscription) this.vinSubscription.unsubscribe();
		if (this.refreshSubscription) this.refreshSubscription.unsubscribe();
	}

	loadVehicles(): void {
		this.loadingVehicles = true;
		this.vehicleService.getVehicles().subscribe({
			next: (vehicles) => {
				this.vehicles = vehicles;
				if (vehicles.length > 0) {
					this.selectedVehicle = vehicles[0];
					this.selectedVehicleName = vehicles[0].vehicle;
					this.loadDefaultVehicleData();
				}
				this.loadingVehicles = false;
			},
			error: (err) => {
				console.error('Erro ao carregar veículos:', err);
				this.loadingVehicles = false;
			}
		});
	}

	onVehicleChange(): void {
		const found = this.vehicles.find(v => v.vehicle === this.selectedVehicleName);
		if (found) {
			this.selectedVehicle = found;
			this.loadDefaultVehicleData();
		}
	}

	// Carrega a tabela já com os dados do veículo selecionado, sem precisar buscar por VIN
	loadDefaultVehicleData(): void {
		const vin = (this.selectedVehicle as any)?.vin;
		if (!vin) return;
		this.loadingVehicleData = true;
		this.vinError = '';
		this.vehicleService.getVehicleData(vin).subscribe({
			next: (data) => {
				this.vehicleData = data;
				this.loadingVehicleData = false;
			},
			error: () => {
				this.vehicleData = null;
				this.loadingVehicleData = false;
			}
		});
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
		this.loadingVehicleData = true;
		this.vehicleService.getVehicleData(vin).subscribe({
			next: (data) => {
				this.vehicleData = data;
				this.loadingVehicleData = false;
			},
			error: (err) => {
				this.vinError = err.error?.message || 'VIN não encontrado.';
				this.vehicleData = null;
				this.loadingVehicleData = false;
			}
		});
	}

	logout(): void {
		sessionStorage.removeItem('user');
		this.router.navigate(['/login']);
	}
}