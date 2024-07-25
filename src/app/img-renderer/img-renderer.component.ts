import { Component, effect, ElementRef, OnInit, untracked, ViewChild } from '@angular/core';
import { Autotile, ImgRenderService, Point } from '../img-render.service';

const TILE_SIZE = 16;

@Component({
	selector: 'app-img-renderer',
	standalone: true,
	imports: [],
	templateUrl: './img-renderer.component.html',
	styleUrl: './img-renderer.component.scss',
})
export class ImgRendererComponent implements OnInit {
	
	@ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
	@ViewChild('canvas2') canvas2!: ElementRef<HTMLCanvasElement>;
	
	constructor(
		private service: ImgRenderService,
	) {
		effect(() => {
			const img = service.img();
			if (!img) {
				return;
			}
			const ctx = this.canvas.nativeElement.getContext('2d')!;
			
			this.canvas.nativeElement.width = img.width;
			this.canvas.nativeElement.height = img.height;
			
			this.canvas2.nativeElement.width = img.width;
			this.canvas2.nativeElement.height = img.height;
			
			
			const w = 8;
			const h = 8;
			
			const nRow = img.width / w * 2;
			const nCol = img.height / h;
			
			ctx.fillStyle = '#616161';
			ctx.fillRect(0, 0, img.width, img.height);
			ctx.fillStyle = '#3f3f3f';
			for (let i = 0; i < nRow; ++i) {
				for (let j = 0; j < nCol; ++j) {
					ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
				}
			}
			
			ctx.fill();
			
			
			ctx.drawImage(img, 0, 0, img.width, img.height);
			
			const def = this.copy(untracked(service.def));
			def.tileCountX = img.width / TILE_SIZE;
			service.def.set(def);
		}, { allowSignalWrites: true });
		
		effect(() => this.render2());
	}
	
	ngOnInit() {
	}
	
	private render2() {
		const def = this.service.def();
		this.clear();
		
		const cols = [
			'#922d2d',
			'#92832d',
			'#39922d',
			'#2d928a',
			'#2d4892',
			'#612d92',
			'#902d92',
		];
		
		for (let i = 0; i < def.autotiles.length; i++) {
			this.drawRect(def.autotiles[i], cols[i % cols.length]);
		}
	}
	
	drawRect(autotile: Autotile, col: string) {
		const ctx = this.canvas2.nativeElement.getContext('2d')!;
		
		ctx.fillStyle = col;
		ctx.globalAlpha = 0.6;
		ctx.fillRect(
			autotile.base.x * TILE_SIZE,
			autotile.base.y * TILE_SIZE,
			autotile.size.x * TILE_SIZE,
			autotile.size.y * TILE_SIZE,
		);
		ctx.globalAlpha = 1;
		ctx.strokeRect(
			autotile.base.x * TILE_SIZE,
			autotile.base.y * TILE_SIZE,
			autotile.size.x * TILE_SIZE,
			autotile.size.y * TILE_SIZE,
		);
	}
	
	clear() {
		const ctx = this.canvas2.nativeElement.getContext('2d')!;
		ctx.clearRect(0, 0, this.canvas2.nativeElement.width, this.canvas2.nativeElement.height);
	}
	
	private start?: Point;
	private lastAutoTile?: Autotile;
	
	private copy<T>(v: T): T {
		return JSON.parse(JSON.stringify(v));
	}
	
	mouseDown(event: MouseEvent) {
		// check if overlaps
		const def = this.copy(this.service.def());
		const pos = this.getMousePos(event);
		
		const index = def.autotiles.findIndex(v => this.overlaps(pos, v));
		
		
		if (index >= 0) {
			def.autotiles.splice(index, 1);
			this.service.def.set(def);
			return;
		}
		
		this.start = this.getMousePos(event);
		this.lastAutoTile = undefined;
	}
	
	private overlaps(p: Point, tile: Autotile) {
		// noinspection PointlessBooleanExpressionJS
		return true &&
			p.x >= tile.base.x && p.x < (tile.base.x + tile.size.x) &&
			p.y >= tile.base.y && p.y < (tile.base.y + tile.size.y);
	}
	
	mouseUp(event: MouseEvent) {
		if (!this.start || !this.lastAutoTile) {
			this.start = undefined;
			this.lastAutoTile = undefined;
			return;
		}
		const def = this.copy(this.service.def());
		def.autotiles.push(this.lastAutoTile);
		this.service.def.set(def);
		
		this.lastAutoTile = undefined;
		this.start = undefined;
	}
	
	
	mouseMove(event: MouseEvent) {
		if (!this.start) {
			return;
		}
		const pos2 = this.getMousePos(event);
		const [smaller, bigger] = this.getBetter(this.start, pos2);
		const newTile = {
			base: smaller,
			size: {
				x: bigger.x - smaller.x + 1,
				y: bigger.y - smaller.y + 1,
			},
		};
		if (JSON.stringify(newTile) === JSON.stringify(this.lastAutoTile)) {
			return;
		}
		this.lastAutoTile = newTile;
		this.clear();
		this.render2();
		this.drawRect(this.lastAutoTile, '#1cecef');
	}
	
	private getMousePos(event: MouseEvent): Point {
		const rect = this.canvas2.nativeElement.getBoundingClientRect();
		const out: Point = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
		out.x = Math.max(0, out.x);
		out.y = Math.max(0, out.y);
		return {
			x: Math.floor(out.x / TILE_SIZE),
			y: Math.floor(out.y / TILE_SIZE),
		};
	}
	
	private getBetter(start: Point, end: Point) {
		const smaller = {
			x: Math.min(start.x, end.x),
			y: Math.min(start.y, end.y),
		};
		
		const bigger = {
			x: Math.max(start.x, end.x),
			y: Math.max(start.y, end.y),
		};
		
		return [
			smaller,
			bigger,
		];
	}
}
