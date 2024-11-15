import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface ProfileData {
  lab: {
    timezone: string;
  };
}

export const convertToLabUTC = (
  dateTime: string | Date,
  endDate = false
): string | undefined => {
  if (!dateTime) return;

  const clientTz = dayjs.tz.guess();
  const labTimezone = "America/New_York";
  const clientTime = dayjs(dateTime).tz(clientTz);

  const h = clientTime.hour();
  const mn = clientTime.minute();
  const s = clientTime.second();

  const y = clientTime.year();
  const d = clientTime.date();
  const m = clientTime.month();

  if (endDate) {
    return dayjs()
      .tz(labTimezone)
      .set("hour", h)
      .set("minute", mn)
      .set("second", s)
      .set("year", y)
      .set("date", d)
      .set("month", m)
      .utc()
      .endOf("day")
      .format("YYYY-MM-DD");
  } else {
    return dayjs()
      .tz(labTimezone)
      .set("hour", h)
      .set("minute", mn)
      .set("second", s)
      .set("year", y)
      .set("date", d)
      .set("month", m)
      .utc()
      .format("YYYY-MM-DD");
  }
};

export const getLabTimeZoneData = (
  dateTime: string | Date,
  profileData: ProfileData
) => {
  const clientTz = dayjs.tz.guess();
  const clientTime = dayjs(dateTime).tz(clientTz);

  const h = clientTime.hour();
  const mn = clientTime.minute();
  const s = clientTime.second();

  const y = clientTime.year();
  const d = clientTime.date();
  const m = clientTime.month();

  return { hours: h, minutes: mn, year: y, seconds: s, date: d, month: m };
};

export const convertLabUTCToClient = (dateTime: string | Date): any => {
  const labTimezone = "America/New_York";
  return dayjs(dateTime).tz(labTimezone);
};

export const momentWithTimezone = (
  value: string | Date,
  format = "MM-DD-YYYY",
  timeZone = "America/New_York"
) => {
  if (!value) return "";
  return dayjs(value).tz(timeZone).format(format);
};
