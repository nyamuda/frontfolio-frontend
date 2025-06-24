import dayjs from "dayjs";
export class DateHelper {
  /**
   * Converts a UTC timestamp to the user's local time in a readable format.
   *
   * This is useful for displaying times stored in UTC on the backend
   * (e.g., booking or review timestamps) in a way that's relevant to the user's timezone.
   *
   * @param {string} utcTime - A UTC datetime string to be converted.
   * @returns {string} - The converted local time.
   */
  public static ConvertTimeFromUTCToLocal(utcTime: string): string {
    return dayjs.utc(utcTime).local().format("MMMM Do, YYYY");
  }
}
