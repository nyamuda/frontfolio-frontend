import type { Project } from "./project";

export class Challenge {
  public constructor(
    public Id: string = crypto.randomUUID(),
    public title: string = "",
    public problem: string = "",
    public solution: string = "",
    public projectId: number = 0,
    public Project: Project | null = null,
    public CreatedAt: Date = new Date(),
    public UpdatedAt: Date = new Date(),
  ) {}
}
