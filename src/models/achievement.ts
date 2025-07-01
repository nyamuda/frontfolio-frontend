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
    // Indicates whether the achievement is newly created on the frontend and hasn't been saved to the backend yet.
    // Used to differentiate between temporary frontend-only achievements and those already persisted in the database.
    public isNew: boolean = false,
  ) {}
}
