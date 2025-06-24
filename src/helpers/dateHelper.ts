import dayjs from "dayjs";
export class DateHelper {
  /**
   * Converts a UTC timestamp to the user's local time in a readable format.
   *
   * This is useful for displaying times stored in UTC on the backend
   * (e.g., project or blog timestamps) in a way that's relevant to the user's timezone.
   *
   * @param {Date} utcTime - A UTC datetime to be converted.
   * @returns {Date} - The converted local time.
   */
  public static convertTimeFromUTCToLocal(utcTime: Date): Date {
    return new Date(dayjs.utc(utcTime).local().toString());
  }

  /**
   * Converts a UTC Date to the local timezone and formats it as "Month, Year".
   *
   * Example output: "June, 2025"
   *
   * @param time - A JavaScript Date object in UTC.
   * @returns A string formatted as "MMMM, YYYY" in the user's local time zone.
   */
  public static formatDateToMonthYear(time: Date): string {
    return dayjs.utc(time).local().format("MMMM, YYYY");
  }
}
