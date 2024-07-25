import { Component } from '@angular/core';
import { ImgRenderService } from '../img-render.service';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'app-definition',
	standalone: true,
	imports: [
		FormsModule,
		JsonPipe,
	],
	templateUrl: './definition.component.html',
	styleUrl: './definition.component.scss',
})
export class DefinitionComponent {
	
	constructor(
		public service: ImgRenderService,
	) {}
	
	update(text: string) {
		const parsed = JSON.parse(text);
		this.service.def.set(parsed);
	}
	
}
