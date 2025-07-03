import { Project } from "@/models/project";
import { ParagraphHelper } from "./paragraphHelper";
import { ChallengeHelper } from "./challengeHelper";
import { AchievementHelper } from "./achievementHelper";
import { FeedbackHelper } from "./feedbackHelper";

export class ProjectHelper {
  /**
   * Prepares a project object for submission to the backend by cleaning and normalizing its data.
   *
   * This includes:
   * - Nullifying empty string URL fields to prevent backend validation errors.
   * - Resetting temporary paragraph IDs (e.g., UUIDs) to 0 so they can be created server-side.
   * @param project - The project instance to sanitize.
   * @returns A cleaned and safe version of the project, ready to be sent to the backend.
   */
  public static prepareProjectForSubmission(project: Project): Project {
    const projectToSubmit = Object.assign(new Project(), project);
    //nullify the project URLs
    projectToSubmit.nullifyEmptyUrls();
    //Reset temporary string IDs of new background paragraphs to 0
    projectToSubmit.background = ParagraphHelper.resetTemporaryIds(projectToSubmit.background);
    //Reset temporary string IDs of new challenges to 0
    projectToSubmit.challenges = ChallengeHelper.resetTemporaryIds(projectToSubmit.challenges);
    //Reset temporary string IDs of new achievements to 0
    projectToSubmit.achievements = AchievementHelper.resetTemporaryIds(
      projectToSubmit.achievements,
    );
    //Reset temporary string IDs of new feedback to 0
    projectToSubmit.feedback = FeedbackHelper.resetTemporaryIds(projectToSubmit.feedback);

    return projectToSubmit;
  }
}
