import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { interval } from 'rxjs';

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
  startX: number = 700;
  startY: number = Math.random() * 1000;
  followArray: Array<{ x: number, y: number }> = [
    {x: 500, y: 500},
    {x: 1200, y: 200},
    {x: 1200, y: 800},
    {x: 200, y: 200},
    {x: 700, y: 800},
    {x: 750, y: 500}
  ];

  word: string = "SUBTRACTING.";
  points: Array<{ x: number, y: number }> = [];
  rotation: number = 0;
  direction: number = 1;

  @ViewChild('titleCanvas', { static: false, read: ElementRef})
  titleCanvas!: ElementRef;

  context: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  @ViewChild('gridCanvas', { static: false, read: ElementRef})
  gridCanvas!: ElementRef;

  context2: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

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
      this.generatePoints(this.startX, this.startY);
      this.animateGrid();
      this.changeDirection();
    }

  }

  generatePoints(startX: number, startY: number) {
    const count = 10000;
    const radius = this.context2.canvas.width;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = 10 + Math.random() * radius;
      const x = startX + distance * Math.tan(angle);
      const y = startY + distance ;
      this.points.push({ x, y });
    }
      for (var i = 0; i < 10000; i ++) {
        const x = Math.random() * this.context2.canvas.width;
        const y = Math.random() * this.context2.canvas.height;
        this.points.push({ x, y });
      }

  }

  movePoints(followArray: Array<{ x: number, y: number }>) {
    const newPoints: Array<{ x:number, y: number }> = [];
    let toX = 0;
    let toY = 0;

    for (const point of this.points) {
      let smallestDist = 99999;

      for (const follow of followArray) {
        const dx = follow.x - point.x;
        const dy = follow.y - point.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (Math.random() * dist < smallestDist) {
          smallestDist = dist;
          toX = follow.x;
          toY = follow.y;
        };

      };

      const dx = toX - point.x;
      const dy = toY - point.y;

      const dist = Math.sqrt(dx*dx + dy*dy);

      const ux = dx / dist;
      const uy = dy / dist;

      const movedX = point.x - uy;
      const movedY = point.y + ux;
      newPoints.push({x: movedX, y: movedY});
    };

    this.points = newPoints;
  }

  changeDirection() {
    interval(10000).subscribe(_ => {
      this.direction *= -.1;
      this.rotation += 1;

      this.moveAttractor(this.followArray);
    });
  }

  moveAttractor(followArray: Array<{ x: number, y: number }>) {
    const newFollowArray: Array<{ x: number, y: number }> = [];
    for (var j = 0; j < followArray.length; j++) {
      const newFollowX = Math.random() * 2000;
      const newFollowY = Math.random() * 1000;

      newFollowArray.push({ x: newFollowX, y: newFollowY });
    }

    this.followArray = newFollowArray;
  }

  animateGrid() {
    setTimeout(()=> {
      requestAnimationFrame(this.animateGrid.bind(this));

      this.context2.clearRect(0, 0, this.context2.canvas.width, this.context2.canvas.height);
      for (const point of this.points) {
        if ((point.x <= this.context2.canvas.width) && (point.y <= this.context2.canvas.height)) {
          this.context2.fillStyle = `rgb(200 200 200 / ${100/(point.x/point.y)}%)`;
          this.context2.fillRect(point.x, point.y, 1, 1);
        }

      }
      this.movePoints(this.followArray);
    }
    , 10);

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
        var y = 450 * (this.context.canvas.width / (10000-this.appearVarY)) * Math.sin(40000/this.appearVarX / this.amplitude * x);
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
