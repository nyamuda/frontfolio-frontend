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
    // Indicates whether the feedback is newly created on the frontend and hasn't been saved to the backend yet.
    // Used to differentiate between temporary frontend-only feedback and that already persisted in the database.
    public isNew: boolean = false,
  ) {}
}
