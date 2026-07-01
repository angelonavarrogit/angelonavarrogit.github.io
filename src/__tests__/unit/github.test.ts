import { describe, it, expect } from 'vitest';
import { calculateLanguagePercentages } from '@/lib/github';

describe('calculateLanguagePercentages', () => {
  it('returns empty array for empty input', () => {
    const result = calculateLanguagePercentages({});
    expect(result).toEqual([]);
  });

  it('returns single language at 100%', () => {
    const result = calculateLanguagePercentages({ Python: 5000 });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Python');
    expect(result[0].percentage).toBe(100);
  });

  it('returns max 5 languages', () => {
    const languages = {
      Python: 1000,
      TypeScript: 900,
      JavaScript: 800,
      Shell: 700,
      SQL: 600,
      HTML: 500,
      CSS: 400,
    };
    const result = calculateLanguagePercentages(languages);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('sorts languages in descending order by percentage', () => {
    const languages = {
      Shell: 100,
      Python: 5000,
      TypeScript: 3000,
      JavaScript: 1000,
    };
    const result = calculateLanguagePercentages(languages);

    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].percentage).toBeGreaterThanOrEqual(
        result[i].percentage
      );
    }
  });

  it('percentages sum to approximately 100%', () => {
    const languages = {
      Python: 4500,
      TypeScript: 2500,
      JavaScript: 1500,
      Shell: 1000,
      SQL: 500,
    };
    const result = calculateLanguagePercentages(languages);
    const sum = result.reduce((acc, lang) => acc + lang.percentage, 0);
    expect(sum).toBeGreaterThanOrEqual(99);
    expect(sum).toBeLessThanOrEqual(101);
  });

  it('all percentages are greater than 0', () => {
    const languages = {
      Python: 9990,
      TypeScript: 5,
      JavaScript: 3,
      Shell: 1,
      SQL: 1,
    };
    const result = calculateLanguagePercentages(languages);
    for (const lang of result) {
      expect(lang.percentage).toBeGreaterThan(0);
    }
  });

  it('assigns correct colors from the static map', () => {
    const languages = { Python: 1000, TypeScript: 500 };
    const result = calculateLanguagePercentages(languages);
    expect(result[0].color).toBe('#3572A5'); // Python
    expect(result[1].color).toBe('#3178c6'); // TypeScript
  });

  it('assigns fallback color for unknown languages', () => {
    const languages = { UnknownLang: 1000 };
    const result = calculateLanguagePercentages(languages);
    expect(result[0].color).toBe('#8b8b8b');
  });

  it('filters out languages with 0 bytes', () => {
    const languages = { Python: 1000, TypeScript: 0, JavaScript: 500 };
    const result = calculateLanguagePercentages(languages);
    expect(result.find((l) => l.name === 'TypeScript')).toBeUndefined();
  });

  it('handles two equal languages', () => {
    const languages = { Python: 500, TypeScript: 500 };
    const result = calculateLanguagePercentages(languages);
    expect(result).toHaveLength(2);
    expect(result[0].percentage).toBe(50);
    expect(result[1].percentage).toBe(50);
  });
});
