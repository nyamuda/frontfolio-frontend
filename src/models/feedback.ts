import type { Project } from "./project";

export class Feedback {
  public constructor(
    public id: string = crypto.randomUUID(),
    public authorName: string = "",
    public authorRole: string = "",
    public comment: string = "",
    public projectId: number = 0,
    public project: Project | null = null,
    public createdAt: Date = new Date(),
    public submittedAt: Date = new Date(),
  ) {}
}
