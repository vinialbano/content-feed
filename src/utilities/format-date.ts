const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
});

const DIVISIONS = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.3452381, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
];

export function formatTimeAgo(date: Date) {
  let duration = (date.valueOf() - new Date().valueOf()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(
        Math.round(duration),
        division.name as Intl.RelativeTimeFormatUnit,
      );
    }
    duration /= division.amount;
  }
}

const dateJSONFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function dateReviver(key: string, value: any) {
  if (typeof value === 'string' && dateJSONFormat.test(value)) {
    return new Date(value);
  }

  return value;
}
