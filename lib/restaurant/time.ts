function localDateNumber(date: Date, formatter: Intl.DateTimeFormat) {
  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(values.year) * 10_000 + Number(values.month) * 100 + Number(values.day);
}

export function getRestaurantLocalDate(
  timeZone: string,
  instant: Date = new Date(),
) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const values = Object.fromEntries(
    formatter.formatToParts(instant).map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

function localDayBoundary(localDate: string, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month, day] = localDate.split("-").map(Number);
  const wanted = year * 10_000 + month * 100 + day;
  const approximate = Date.UTC(year, month - 1, day);
  let low = approximate - 48 * 60 * 60 * 1_000;
  let high = approximate + 48 * 60 * 60 * 1_000;

  // Find the first instant represented by this local calendar date. This also
  // handles zones where DST skips local midnight (for example America/Santiago).
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (localDateNumber(new Date(middle), formatter) < wanted) low = middle + 1;
    else high = middle;
  }
  if (localDateNumber(new Date(low), formatter) !== wanted) {
    throw new Error("The local date does not exist in this timezone.");
  }
  return new Date(low);
}

export function getRestaurantDayWindow(localDate: string, timeZone: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate)) throw new Error("Invalid local date.");
  const parsed = new Date(`${localDate}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== localDate) {
    throw new Error("Invalid local date.");
  }
  // This also validates the IANA timezone identifier.
  new Intl.DateTimeFormat("en-US", { timeZone }).format();
  const start = localDayBoundary(localDate, timeZone);
  const nextLocalDay = new Date(`${localDate}T12:00:00Z`);
  nextLocalDay.setUTCDate(nextLocalDay.getUTCDate() + 1);
  const nextDate = nextLocalDay.toISOString().slice(0, 10);
  const end = localDayBoundary(nextDate, timeZone);
  return { startsAt: start.toISOString(), endsAt: end.toISOString() };
}
