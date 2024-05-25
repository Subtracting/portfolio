import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, interval, Observable, Subscription } from 'rxjs';

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
  startY: number = Math.random() * 600;
  followArray: Array<{ x: number, y: number }> = [
    {x: 500, y: 500},
    {x: 1200, y: 200},
    {x: 1200, y: 800},
    {x: 200, y: 200},
    {x: 700, y: 800},
    {x: 750, y: 500}
  ];

  word: string = "subtracting.";
  points: Array<{ x: number, y: number }> = [];
  rotation: number = 100;
  direction: number = 1;
  randomVar: number = Math.random();

  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;
  width!: number;
  height!: number;

  @ViewChild('titleCanvas', { static: false, read: ElementRef})
  titleCanvas!: ElementRef;

  context: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  @ViewChild('gridCanvas', { static: false, read: ElementRef})
  gridCanvas!: ElementRef;

  context2: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  ngOnInit() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(_ => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    })
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
      this.context2.canvas.height = this.height;
      this.context2.canvas.width = this.width;
      this.generatePoints(this.startX, this.startY);
      this.animateGrid();
      this.changeDirection();
    }

  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  generatePoints(startX: number, startY: number) {
    const count = 10000;
    const radius = this.context2.canvas.width;

    for (let i = 0; i < 10000; i++) {
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
    let toDx = 0;
    let toDy = 0;
    let toDist = 0;

    for (const point of this.points) {
      let smallestDist = 99999;

      for (const follow of followArray) {
        const dx = follow.x - point.x;
        const dy = follow.y - point.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < smallestDist) {
          smallestDist = dist;
          toDx = dx
          toDy = dy;
          toDist = dist;
        };

      };

      const ux = toDx / toDist;
      const uy = toDy / toDist;

      const movedX = point.x + ux * (Math.cos(Math.PI * 2 / ux ));
      const movedY = point.y + uy * (Math.cos(Math.PI * 2 / uy ));
      newPoints.push({x: movedX, y: movedY});
    };

    this.points = newPoints;
  }

  changeDirection() {
    interval(20000).subscribe(_ => {
      this.direction *= -1;
      this.rotation += 1000;
      this.randomVar = Math.random();

      this.moveAttractor(this.followArray);
    });
  }

  moveAttractor(followArray: Array<{ x: number, y: number }>) {
    const newFollowArray: Array<{ x: number, y: number }> = [];
    for (var j = 0; j < Math.random() * 100; j++) {
      const newFollowX = Math.random() * 2000;
      const newFollowY = Math.random() * 1000;

      newFollowArray.push({ x: newFollowX, y: newFollowY });
    }

    this.followArray = newFollowArray;
  }

  animateGrid() {
    setTimeout(()=> {
      requestAnimationFrame(this.animateGrid.bind(this));

      this.context2.canvas.width = this.width;
      this.context2.canvas.height = this.height;

      this.context2.clearRect(0, 0, this.context2.canvas.width, this.context2.canvas.height);
      for (const point of this.points) {
        if ((point.x <= this.context2.canvas.width) && (point.y <= this.context2.canvas.height)) {
          this.context2.fillStyle = `rgb(255 255 255 / ${60}%)`;

          /*/(point.x/point.y)
          this.context2.beginPath();
          this.context2.arc(point.x,point.y, Math.random() * 3, 0, Math.PI * 2, false);
          this.context2.fill();
          this.context2.closePath(); */

          this.context2.fillRect(point.x, point.y, 1, 1);
        }

      }
      for (const vortex of this.followArray) {
        this.context2.beginPath();
        this.context2.arc(vortex.x, vortex.y, 10, 0, Math.PI * 2, false);
        this.context2.stroke();
        this.context2.closePath();

      }
    }
    , 10);

  this.movePoints(this.followArray);

  }

  animateSineWave(word: string) {
    setTimeout(()=> {
      requestAnimationFrame(this.animateSineWave.bind(this, word));
      this.context.strokeStyle = 'white';
      this.n = this.context.canvas.width;
      this.context.save();
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.context.beginPath();
      for (var x = 0; x < this.n; x ++) {
        var y =  x * this.appearVarX * Math.cos(Math.random() * 20);
        this.context.lineTo(x, y);
      }
      this.context.closePath();
      this.context.clip();
      this.context.font = "80px helvetica";
      this.context.fillStyle = "white";
      /*this.context.fillText(word, 0, 80);*/
      this.context.restore();
      this.context.font = "80px helvetica";
      this.context.fillStyle = "white";
      this.context.fillText(word, 0, 80);
      this.appearVarX += (this.direction + 5);
      this.appearVarY += (this.direction * 1)
    }
    , 70);
  }


  @HostListener('body:mousemove', ['$event'])
  handleMousemove($event: MouseEvent) {
    this.amplitude = this.context.canvas.width / $event.clientX;
    this.frequency = this.context.canvas.height / $event.clientY;
    if (Math.round($event.clientX) === 500) {
      console.log("popup");
    }
  };

}
