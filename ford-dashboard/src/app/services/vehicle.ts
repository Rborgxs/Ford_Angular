import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Veiculo, VeiculoData } from '../models/veiculo.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
	private http = inject(HttpClient);
	private apiUrl = 'http://localhost:3001';

	getVehicles(): Observable<Veiculo[]> {
		return this.http
			.get<{ vehicles: Veiculo[] }>(`${this.apiUrl}/vehicles`)
			.pipe(map(response => response.vehicles));
	}

	getVehicleData(vin: string): Observable<VeiculoData> {
		return this.http.post<VeiculoData>(`${this.apiUrl}/vehicleData`, { vin });
	}
}