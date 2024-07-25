import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImgUploaderComponent } from './img-uploader/img-uploader.component';
import { ImgRendererComponent } from './img-renderer/img-renderer.component';
import { DefinitionComponent } from './definition/definition.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, ImgUploaderComponent, ImgRendererComponent, DefinitionComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'autotiler';
}
