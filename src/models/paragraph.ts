import type { ParagraphType } from "@/types/paragraphType";

export class Paragraph {
  public constructor(
    public id: string = crypto.randomUUID(),
    public title: string = "",
    public imageUrl: string | null = "",
    public imageCaption: string = "",
    public content: string = "",
    public paragraphType: ParagraphType = "ProjectBackground",
    public projectId: number = 0,
  ) {}
}
