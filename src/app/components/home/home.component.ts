import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ArtComponent } from '../art/art.component';
import { ProjectsComponent } from '../projects/projects.component';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  selectedItem: string | null = null;

  selectItem(item: string): void {
    this.selectedItem = item;
  }

  n: number = 0;
  amplitude: number = 600;
  frequency: number = 600;
  appearVarX: number = 0;
  appearVarY: number = 0;
  followX: number = 500;
  followY: number = 500;
  word: string = "SUBTRACTING.";

  @ViewChild('titleCanvas', { static: false, read: ElementRef})
  titleCanvas!: ElementRef;

  context: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  @ViewChild('gridCanvas', { static: false, read: ElementRef})
  gridCanvas!: ElementRef;

  context2: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  backgroundStyles: { [key: string]: any } = {
    'background': 'rgba(0,0,0,1)',
    'bgMode': 'color: #8b8b8b',
    'bgModeGradient': '0'
  };

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.titleCanvas && this.titleCanvas.nativeElement) {
      this.context = this.titleCanvas.nativeElement.getContext("2d");
      this.context.canvas.height = 100;
      this.context.canvas.width = 650;
      this.animateSineWave(this.word);
    }

    if (this.gridCanvas && this.gridCanvas.nativeElement) {
      this.context2 = this.gridCanvas.nativeElement.getContext("2d");
      this.context2.canvas.height = window.innerHeight;
      this.context2.canvas.width = window.innerWidth;
      this.animateGrid();
    }
  }

  animateGrid() {
    setTimeout(()=> {
      requestAnimationFrame(this.animateGrid.bind(this));
      const step = 40;
      this.context2.clearRect(0, 0, this.context2.canvas.width, this.context2.canvas.height);
      this.context2.strokeStyle = 'grey';
      for (var x = 0; x < this.context2.canvas.width; x += step) {
        for (var y = 0; y < this.context2.canvas.height; y += step) {
          const dx = this.followX - x;
          const dy = this.followY - y;

          const dist = Math.sqrt(dx*dx + dy*dy);

          const ux = dx / dist;
          const uy = dy / dist;

          const x2 = x + ux * Math.min(50, 220/dist);
          const y2 = y + uy * Math.min(50, 50/dist);

          this.context2.beginPath();
          this.context2.moveTo(x, y);
          this.context2.lineTo(x2, y2);
          this.context2.stroke();
          this.context2.closePath();
        }
      }
    }
    , 10);
  this.followX += Math.random()*8*(Math.round(Math.random())*2 - 1);
  this.followY += Math.random()*8*(Math.round(Math.random())*2 - 1);
  }

  animateSineWave(word: string) {
    setTimeout(()=> {
      requestAnimationFrame(this.animateSineWave.bind(this, word));
      this.context.strokeStyle = '#8b8b8b';
      this.n = this.context.canvas.width;
      this.context.save();
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.context.beginPath();
      for (var x = 0; x < this.n; x ++) {
        var y = 50 * (this.context.canvas.width / (10000-this.appearVarY)) * Math.tan(40000/this.appearVarX / this.amplitude * x);
        this.context.lineTo(x-20, y + 60);
      }
      this.context.closePath();
      this.context.clip();
      this.context.font = "80px arial";
      this.context.fillStyle = "#8b8b8b";
      this.context.fillText(word, 0, 80);
      this.context.restore();
    }
    , 70);
  this.appearVarX = (this.appearVarX + 5) % (2000);
  this.appearVarY = (this.appearVarY + 100) % (10000);
  }


  @HostListener('body:mousemove', ['$event'])
  handleMousemove($event: MouseEvent) {
    this.amplitude = this.context.canvas.width / $event.clientX;
    this.frequency = this.context.canvas.height / $event.clientY;
  };

}
