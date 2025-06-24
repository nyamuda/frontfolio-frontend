import dayjs from "dayjs";
export class DateHelper {
  /**
   * Converts a UTC timestamp to the user's local time in a readable format.
   *
   * This is useful for displaying times stored in UTC on the backend
   * (e.g., booking or review timestamps) in a way that's relevant to the user's timezone.
   *
   * @param {Date} utcTime - A UTC datetime to be converted.
   * @returns {Date} - The converted local time.
   */
  public static ConvertTimeFromUTCToLocal(utcTime: Date): Date {
    return new Date(dayjs.utc(utcTime).local().format("MMMM, YYYY"));
  }
}
