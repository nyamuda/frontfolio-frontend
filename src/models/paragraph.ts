import { ParagraphType } from "@/enums/paragraphType";

export class Paragraph {
  public constructor(
    public id: string = crypto.randomUUID(),
    public title: string = "",
    public imageUrl: string | null = null,
    public imageCaption: string = "",
    public content: string = "",
    public paragraphType: ParagraphType = ParagraphType.ProjectBackground,
    public projectId: number = 0,
  ) {}
}
