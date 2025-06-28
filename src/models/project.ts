import { ProjectStatus } from "@/enums/projectStatus";
import { Paragraph } from "./paragraph";
import type { Challenge } from "./challenge";
import type { Achievement } from "./achievement";
import type { Feedback } from "./feedback";
import { ProjectDifficultyLevel } from "@/enums/projectDifficultyLevel";

export class Project {
  public constructor(
    public id: number = 0,
    public title: string = "",
    public sortOrder: number = 1,
    public difficultyLevel: ProjectDifficultyLevel = ProjectDifficultyLevel.Beginner,
    public startDate: Date = new Date(),
    public endDate: Date = new Date(),
    public summary: string = "",
    public techStack: string[] = [],
    public githubUrl: string | null = null,
    public imageUrl: string | null = null,
    public videoUrl: string | null = null,
    public liveUrl: string | null = null,
    public status: ProjectStatus = ProjectStatus.Draft,
    public background: Paragraph[] = [],
    public challenges: Challenge[] = [],
    public achievements: Achievement[] = [],
    public feedback: Feedback[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  /**
   * Makes empty Url fields null
   * URL fields like imageUrl cannot have empty strings as values
   * otherwise they will fail validation on the backend expecting null for optional URLs.
   * This method makes them null if their values are empty strings
   */
  public nullifyEmptyUrls(): void {
    //main URLs
    this.imageUrl = this.imageUrl || null;
    this.githubUrl = this.githubUrl || null;
    this.videoUrl = this.videoUrl || null;
    this.liveUrl = this.liveUrl || null;
    //background paragraphs URLs
    this.background = this.background.map((paragraph) => {
      const sanitizedParagraph = Object.assign(new Paragraph(), paragraph);
      sanitizedParagraph.nullifyEmptyUrls();
      return sanitizedParagraph;
    });
    console.log(this.background);
  }
}
