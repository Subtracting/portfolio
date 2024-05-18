import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  aboutArray: Array<string> = [
    "Hey, I'm [Artist's Name]. By profession, I'm a data analyst, known for my problem-solving skills. Off the clock, I express myself through abstract art. My pieces reflect my analytical approach to life, blending emotion with logic. I enjoy creating enigmatic faces that challenge perceptions and inspire curiosity, fusing my passion for art with my love for problem-solving.",
    "Jan-Willem van der Boom, 35 years old. Data analyst. I have a passion for problem-solving, puzzles and patterns. Both art and coding allow me to express and challenge myself. @subtracting",
    "Hey, I'm [Artist's Name]. By profession, I'm a data analyst, crunching numbers and solving problems. In my spare time, I'm equally passionate about coding and painting abstract faces. Both art and coding provide me with avenues for creative problem-solving and expression.",
    "Hey, I'm [Artist's Name]. By day, I'm a data analyst, solving puzzles with numbers. Off-hours, I'm coding or painting abstract faces. Both art and coding are my canvas for problem-solving and creativity."
  ];

  aboutText: string = '';

  ngOnInit() {
    this.selectAboutText();
  }

  selectAboutText() {
    this.aboutText = this.aboutArray[Math.floor(Math.random() * this.aboutArray.length)]
  }
}
