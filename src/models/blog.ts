import { BlogStatus } from "@/enums/blogStatus";
import { Paragraph } from "./paragraph";

export class Blog {
  public constructor(
    public id: number = 0,
    public title: string = "",
    public topic: string = "",
    public summary: string = "",
    public imageUrl: string | null = null,
    public status: BlogStatus = BlogStatus.Draft,
    public content: Paragraph[] = [],
    public tags: string[] = [],
    public userId: number = 0,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public publishedAt: Date = new Date(),
  ) {}

  /**
   * Makes empty Url fields null
   * URL fields like imageUrl cannot have empty strings as values
   * otherwise they will fail validation on the backend expecting null for optional URLs.
   * This method makes them null if their values are empty strings
   */
  public nullifyEmptyUrls(): void {
    //main URLs
    this.imageUrl = this.imageUrl || null;

    //content paragraphs URLs
    this.content = this.content.map((paragraph) => {
      const sanitizedParagraph = Object.assign(new Paragraph(), paragraph);
      sanitizedParagraph.nullifyEmptyUrls();
      return sanitizedParagraph;
    });
  }
}
