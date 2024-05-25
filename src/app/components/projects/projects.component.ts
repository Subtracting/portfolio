import { Component } from '@angular/core';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects: Project[] = [
    new Project({
      title: 'Project Title 1',
      description: 'Short description of Project 1. This project involves...',
      tags: ['Python', 'Data Analysis'],
      link: 'project1.html',
      showDetails: false
    }),
    new Project({
      title: 'Project Title 2',
      description: 'Short description of Project 2. This project involves...',
      tags: ['Frontend', 'Angular'],
      link: 'project2.html',
      showDetails: false
    }),
  ];

  toggleDetails(project: Project) {
    project.showDetails = !project.showDetails;
  }
}

