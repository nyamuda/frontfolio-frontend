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
    // Indicates whether the challenge is newly created on the frontend and hasn't been saved to the backend yet.
    // Used to differentiate between temporary frontend-only challenges and those already persisted in the database.
    public isNew: boolean = false,
  ) {}
}
