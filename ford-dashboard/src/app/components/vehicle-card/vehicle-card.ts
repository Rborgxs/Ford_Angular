import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-vehicle-card',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './vehicle-card.html',
	styleUrls: ['./vehicle-card.css']
})
export class VehicleCardComponent {
	@Input() title: string = '';
	@Input() value: number = 0;
	@Input() unit: string = 'unid';
}
