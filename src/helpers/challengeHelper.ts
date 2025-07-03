import { Challenge } from "@/models/challenge";

export class ChallengeHelper {
  /**
   * Resets temporary string IDs to 0.
   *
   * In the frontend, when users create new challenges dynamically (e.g., for a project or blog),
   * each challenge is assigned a temporary string-based ID using tools like `crypto.randomUUID()`.
   * These IDs are useful for managing state in the UI (e.g., tracking and updating items before saving).
   *
   * However, the backend expects each challenge's `id` field to be an integer, since it uses integers
   * as primary keys in the database. Submitting string-based IDs would either cause validation errors
   * or be incorrectly interpreted.
   *
   * This helper function loops through the array of challenges and checks each challenge's `id`:
   * - If the `id` is a string (indicating it's a new, unsaved challenge), it's replaced with `0`.
   *   The backend interprets an ID of `0` as a signal to create a new challenge.
   * - If the `id` is already a number, it's left unchanged (indicating it's an existing challenge).
   * @param challenges - An array of Challenge objects to be cleaned before sending to the backend.
   * @returns A new array of Challenges with temporary string IDs converted to 0.
   */
  public static resetTemporaryIds(challenges: Challenge[]): Challenge[] {
    return challenges.map((challenge) => {
      if (typeof challenge.id === "string") {
        const challengeWithZeroId = Object.assign(new Challenge(), challenge);
        challengeWithZeroId.id = 0;
        return challengeWithZeroId;
      }
      return challenge;
    });
  }
}
