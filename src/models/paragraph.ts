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
