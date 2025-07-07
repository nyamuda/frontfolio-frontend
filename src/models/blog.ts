import { BlogStatus } from "@/enums/blogStatus";
import type { Paragraph } from "./paragraph";

export class Blog {
  public constructor(
    public id: string | number = 0,
    public title: string = "",
    public topic: string = "",
    public summary: string = "",
    public imageUrl: string = "",
    public status: BlogStatus = BlogStatus.Draft,
    public content: Paragraph[] = [],
    public tags: string[] = [],
    public userId: number = 0,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public publishedAt: Date = new Date(),
  ) {}
}
