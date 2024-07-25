import { Component } from '@angular/core';
import { ImgRenderService } from '../img-render.service';

@Component({
	selector: 'app-img-uploader',
	standalone: true,
	imports: [],
	templateUrl: './img-uploader.component.html',
	styleUrl: './img-uploader.component.scss',
})
export class ImgUploaderComponent {
	
	constructor(
		private service: ImgRenderService,
	) {}
	
	fileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (!file) {
			return;
		}
		
		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => {
				this.service.img.set(img);
				const def = this.service.def();
				def.map = `media/map/${file.name}`
				this.service.def.set(def);
			};
			img.src = reader.result as string;
		};
		reader.readAsDataURL(file);
		
	}
}
