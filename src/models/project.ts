import { ProjectStatus } from "@/enums/projectStatus";
import type { Paragraph } from "./paragraph";
import type { Challenge } from "./challenge";
import type { Achievement } from "./achievement";
import type { Feedback } from "./feedback";

export class Project {
  public constructor(
    public id: number = 0,
    public title: string = "",
    public startDate: Date | null = null,
    public endDate: Date | null = null,
    public summary: string = "",
    public techStack: string[] = [],
    public githubUrl: string | null = "",
    public imageUrl: string | null = "",
    public videoUrl: string | null = "",
    public liveUrl: string | null = "",
    public status: ProjectStatus = ProjectStatus.Draft,
    public background: Paragraph[] = [],
    public challenges: Challenge[] = [],
    public achievements: Achievement[] = [],
    public feedback: Feedback[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
