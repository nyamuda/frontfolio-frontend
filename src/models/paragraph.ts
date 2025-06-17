import type { ParagraphType } from "@/enums/paragraphType";

export class Paragraph {
  public constructor(
    public title: string,
    public imageUrl: string,
    public imageCaption: string,
    public content: string,
    public paragraphType: ParagraphType,
    public projectId: number,
  ) {}
}
