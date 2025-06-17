import type { paragraphType } from "@/types/paragraphType";

export class Paragraph {
  public constructor(
    public title: string,
    public imageUrl: string,
    public imageCaption: string,
    public content: string,
    public paragraphType: paragraphType,
  ) {}
}
