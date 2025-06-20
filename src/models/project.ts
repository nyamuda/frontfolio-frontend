import { ProjectStatus } from "@/enums/projectStatus";
import type { Paragraph } from "./paragraph";
import type { Challenge } from "./challenge";
import type { Achievement } from "./achievement";
import type { Feedback } from "./feedback";

export class Project {
  public constructor(
    public title: string = "",
    public summary: string = "",
    public techStack: string[] = [],
    public githubUrl: string = "",
    public imageUrl: string = "",
    public liveUrl: string = "",
    public status: ProjectStatus = ProjectStatus.Draft,
    public background: Paragraph[] = [],
    public challenges: Challenge[] = [],
    public achievements: Achievement[] = [],
    public feedback: Feedback[] = [],
  ) {}
}
