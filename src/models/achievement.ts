import type { Project } from "./project";

export class Achievement {
  public constructor(
    public id: string = crypto.randomUUID(),
    public title: string = "",
    public description: string = "",
    public projectId: number = 0,
    public project: Project | null = null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
