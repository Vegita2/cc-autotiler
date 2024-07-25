import { Injectable, signal } from '@angular/core';

export interface Autotile {
	size: Point;
	cliff?: Point | null | false;
	mergeWithEmpty?: boolean;
	base: Point;
}


export interface JsonType {
	map: string;
	tileCountX: number;
	autotiles: Autotile[];
}

export interface Point {
	x: number;
	y: number;
}

@Injectable({
	providedIn: 'root',
})
export class ImgRenderService {
	
	img = signal<HTMLImageElement | undefined>(undefined);
	
	def = signal<JsonType>({
		map: 'map.png',
		tileCountX: 1,
		autotiles: [],
	});
	
	constructor() { }
}
