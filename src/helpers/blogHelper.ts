import { Blog } from "@/models/blog";
import { ParagraphHelper } from "./paragraphHelper";

export class BlogHelper {
  /**
   * Prepares a blog object for submission to the backend by cleaning and normalizing its data.
   *
   * This includes:
   * - Nullifying empty string URL fields to prevent backend validation errors.
   * - Resetting temporary paragraph IDs (e.g., UUIDs) to 0 so they can be created server-side.
   * @param blog - The blog instance to sanitize.
   * @returns A cleaned and safe version of the blog, ready to be sent to the backend.
   */
  public static prepareBlogForSubmission(blog: Blog): Blog {
    const blogToSubmit = Object.assign(new Blog(), blog);
    //nullify the blog URLs
    blogToSubmit.nullifyEmptyUrls();
    //Reset temporary string IDs of new content paragraphs to 0
    blogToSubmit.content = ParagraphHelper.resetTemporaryIds(blogToSubmit.content);

    return blogToSubmit;
  }
}
