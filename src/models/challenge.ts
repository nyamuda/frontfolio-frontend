import type { Project } from "./project";

export class Challenge {
  public constructor(
    public id: string = crypto.randomUUID(),
    public title: string = "",
    public problem: string = "",
    public solution: string = "",
    public projectId: number = 0,
    public project: Project | null = null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
