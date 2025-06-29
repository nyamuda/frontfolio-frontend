import { ParagraphType } from "@/enums/paragraphType";

export class Paragraph {
  public constructor(
    public id: string | number = crypto.randomUUID(),
    public title: string = "",
    public imageUrl: string | null = null,
    public imageCaption: string = "",
    public content: string = "",
    public paragraphType: ParagraphType = ParagraphType.ProjectBackground,
    public projectId: number = 0,
    // Indicates whether the paragraph is newly created on the frontend and hasn't been saved to the backend yet.
    // Used to differentiate between temporary frontend-only paragraphs and those already persisted in the database.
    public isNew: boolean = false,
  ) {}

  /**
   * Makes empty Url fields null
   * URL fields like imageUrl cannot have empty strings as values
   * otherwise they will fail validation on the backend expecting null for optional URLs.
   * This method makes them null if their values are empty strings
   */
  public nullifyEmptyUrls(): void {
    this.imageUrl = this.imageUrl || null;
  }
}
