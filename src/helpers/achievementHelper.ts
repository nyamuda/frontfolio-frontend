import { Achievement } from "@/models/achievement";

export class AchievementHelper {
  /**
   * Resets temporary string IDs to 0.
   *
   * In the frontend, when users create new achievements dynamically (e.g., for a project),
   * each achievement is assigned a temporary string-based ID using tools like `crypto.randomUUID()`.
   * These IDs are useful for managing state in the UI (e.g., tracking and updating items before saving).
   *
   * However, the backend expects each achievement's `id` field to be an integer, since it uses integers
   * as primary keys in the database. Submitting string-based IDs would either cause validation errors
   * or be incorrectly interpreted.
   *
   * This helper function loops through the array of achievements and checks each achievement's `id`:
   * - If the `id` is a string (indicating it's a new, unsaved achievement), it's replaced with `0`.
   *   The backend interprets an ID of `0` as a signal to create a new achievement.
   * - If the `id` is already a number, it's left unchanged (indicating it's an existing achievement).
   * @param achievements - An array of Achievement objects to be cleaned before sending to the backend.
   * @returns A new array of Achievements with temporary string IDs converted to 0.
   */
  public static resetTemporaryIds(achievements: Achievement[]): Achievement[] {
    return achievements.map((achievement) => {
      if (typeof achievement.id === "string") {
        const achievementWithZeroId = Object.assign(new Achievement(), achievement);
        achievementWithZeroId.id = 0;
        return achievementWithZeroId;
      }
      return achievement;
    });
  }
}
