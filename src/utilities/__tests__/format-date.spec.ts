import { advanceTo, clear } from 'jest-date-mock';
import { dateReviver, formatTimeAgo } from '../format-date'; // Adjust the import according to your file structure
describe('formatTimeAgo', () => {
  beforeAll(() => {
    advanceTo(new Date('2024-01-01T00:00:00Z'));
  });

  afterAll(() => {
    clear();
    jest.restoreAllMocks();
  });

  const futureTests = [
    { seconds: 30, expected: 'in 30 seconds' },
    { seconds: 89, expected: 'in 1 minute' },
    { seconds: 90, expected: 'in 2 minutes' }, // 1 minute and 30 seconds
    { seconds: 1799, expected: 'in 30 minutes' },
    { seconds: 3540, expected: 'in 59 minutes' },
    { seconds: 3570, expected: 'in 60 minutes' }, // 59 minutes and 30 seconds
    { seconds: 3600, expected: 'in 1 hour' },
    { seconds: 5399, expected: 'in 1 hour' },
    { seconds: 5400, expected: 'in 2 hours' }, // 1 hour, 30 minutes
    { seconds: 8000, expected: 'in 2 hours' },
    { seconds: 82200, expected: 'in 23 hours' },
    { seconds: 84600, expected: 'in 24 hours' }, // 23 hours and 30 minutes
    { seconds: 86400, expected: 'tomorrow' },
    { seconds: 129600, expected: 'in 2 days' }, // 1 day and 12 hours
    { seconds: 518400, expected: 'in 6 days' },
    { seconds: 561600, expected: 'in 7 days' }, // 6 days, 12 hours
    { seconds: 604800, expected: 'next week' },
    { seconds: 907200, expected: 'in 2 weeks' }, // 1 week, 3 days, 12 hours
    { seconds: 2628000, expected: 'in 4 weeks' }, // 1 month (30.41666667 days)
    { seconds: 2628001, expected: 'next month' }, // 1 month, 1 second
    { seconds: 31536001, expected: 'next year' }, // 1 year, 1 second
  ];

  futureTests.forEach(({ seconds, expected }) => {
    it(`should return "${expected}" for ${seconds} seconds in the future`, () => {
      const futureDate = new Date(
        new Date('2024-01-01T00:00:00Z').getTime() + seconds * 1000,
      );

      const result = formatTimeAgo(futureDate);
      expect(result).toBe(expected);
    });
  });

  const pastTests = [
    { seconds: 30, expected: '30 seconds ago' },
    { seconds: 89, expected: '1 minute ago' },
    { seconds: 91, expected: '2 minutes ago' }, // 1 minute and 31 seconds
    { seconds: 1799, expected: '30 minutes ago' },
    { seconds: 3540, expected: '59 minutes ago' },
    { seconds: 3571, expected: '60 minutes ago' }, // 59 minutes and 31 seconds
    { seconds: 3600, expected: '1 hour ago' },
    { seconds: 5399, expected: '1 hour ago' },
    { seconds: 5401, expected: '2 hours ago' }, // 1 hour, 30 minutes, and 1 second
    { seconds: 8000, expected: '2 hours ago' },
    { seconds: 82200, expected: '23 hours ago' },
    { seconds: 84601, expected: '24 hours ago' }, // 23 hours and 30 minutes, and 1 second
    { seconds: 86400, expected: 'yesterday' },
    { seconds: 129601, expected: '2 days ago' }, // 1 day and 12 hours, and 1 second
    { seconds: 518400, expected: '6 days ago' },
    { seconds: 561601, expected: '7 days ago' }, // 6 days, 12 hours, and 1 second
    { seconds: 604800, expected: 'last week' },
    { seconds: 950400, expected: '2 weeks ago' }, // 1 week and 4 days
    { seconds: 2628000, expected: '4 weeks ago' }, // 1 month (30.41666667 days)
    { seconds: 2628001, expected: 'last month' }, // 1 month, and 1 second
    { seconds: 31536001, expected: 'last year' }, // 1 year, and 1 second
  ];

  pastTests.forEach(({ seconds, expected }) => {
    it(`should return "${expected}" for ${seconds} seconds in the past`, () => {
      const futureDate = new Date(
        new Date('2024-01-01T00:00:00Z').getTime() - seconds * 1000,
      );

      const result = formatTimeAgo(futureDate);
      expect(result).toBe(expected);
    });
  });
});

describe('dateReviver', () => {
  it('should return a Date object for a string that matches the dateJSONFormat', () => {
    const dateString = '2024-01-01T00:00:00.000Z';
    const result = dateReviver('publishDate', dateString);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe(dateString);
  });

  it('should return the value as is if it is not a string that matches the dateJSONFormat', () => {
    const value = 'not a date string';
    const result = dateReviver('publishDate', value);
    expect(result).toBe(value);
  });
});
