import type { Project } from "./project";

export class Achievement {
  public constructor(
    public id: string = crypto.randomUUID(),
    public title: string = "",
    public description: string = "",
    public projectId: number = 0,
    public Project: Project | null = null,
    public CreatedAt: Date = new Date(),
    public UpdatedAt: Date = new Date(),
  ) {}
}
