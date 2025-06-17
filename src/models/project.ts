import type { projectStatus } from "@/enums/projectStatus";
import type { Paragraph } from "./paragraph";

export class Project {
  public constructor(
    public title: string,
    public summary: string,
    public techStack: string[],
    public githubUrl: string,
    public imageUrl: string,
    public liveUrl: string,
    public projectStatus: projectStatus,
    public description: Paragraph[],
  ) {}
}
