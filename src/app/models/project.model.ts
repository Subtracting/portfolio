export interface IProject {
  title: string;
  description: string;
  tags: string[];
  link: string;
  showDetails: boolean;
}

export class Project implements IProject {
  title: string;
  description: string;
  tags: string[];
  link: string;
  showDetails: boolean;

  constructor(data: IProject) {
    this.title = data.title;
    this.description = data.description;
    this.tags = data.tags;
    this.link = data.link;
    this.showDetails = data.showDetails;
  }
}

