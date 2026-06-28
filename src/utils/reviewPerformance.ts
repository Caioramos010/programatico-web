export interface ReviewPerformancePointLike {
  day: string;
  acertos: number;
  erros: number;
}

const WEEKDAY_ALIASES: Record<string, string> = {
  dom: "Dom",
  domingo: "Dom",
  seg: "Seg",
  segunda: "Seg",
  "segunda-feira": "Seg",
  ter: "Ter",
  terca: "Ter",
  "terca-feira": "Ter",
  qua: "Qua",
  quarta: "Qua",
  "quarta-feira": "Qua",
  qui: "Qui",
  quinta: "Qui",
  "quinta-feira": "Qui",
  sex: "Sex",
  sexta: "Sex",
  "sexta-feira": "Sex",
  sab: "S\u00E1b",
  sabado: "S\u00E1b",
};

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function parseReviewPointDate(value: string): Date | null {
  const dayMonthYearMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\D.*)?$/);
  if (dayMonthYearMatch) {
    const [, day, month, year] = dayMonthYearMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const yearMonthDayMatch = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/);
  if (yearMonthDayMatch) {
    const [, year, month, day] = yearMonthDayMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const directDate = new Date(value);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  return null;
}

function formatWeekdayLabel(value: string, includeDayNumber = false) {
  const parsedDate = parseReviewPointDate(value);
  if (parsedDate) {
    const label = parsedDate.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
    const weekday = label.charAt(0).toUpperCase() + label.slice(1);
    return includeDayNumber ? `${weekday} ${parsedDate.getDate()}` : weekday;
  }

  return WEEKDAY_ALIASES[normalizeKey(value)] ?? value;
}

function formatMonthLabel(date: Date) {
  const label = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return startOfDay(nextDate);
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function sumPoints(points: ReviewPerformancePointLike[]) {
  return points.reduce(
    (totals, point) => ({
      acertos: totals.acertos + point.acertos,
      erros: totals.erros + point.erros,
    }),
    { acertos: 0, erros: 0 },
  );
}

function buildDailySeries(
  data: ReviewPerformancePointLike[],
  selectedDays: number,
  referenceDate: Date,
) {
  const endDate = startOfDay(referenceDate);
  const startDate = addDays(endDate, -(selectedDays - 1));
  const totalsByDay = new Map<string, { acertos: number; erros: number }>();

  data.forEach((point) => {
    const parsedDate = parseReviewPointDate(point.day);
    if (!parsedDate) {
      return;
    }

    const normalizedDate = startOfDay(parsedDate);
    if (normalizedDate < startDate || normalizedDate > endDate) {
      return;
    }

    const key = toDateKey(normalizedDate);
    const current = totalsByDay.get(key) ?? { acertos: 0, erros: 0 };
    totalsByDay.set(key, {
      acertos: current.acertos + point.acertos,
      erros: current.erros + point.erros,
    });
  });

  return Array.from({ length: selectedDays }, (_, index) => {
    const date = addDays(startDate, index);
    const key = toDateKey(date);
    const totals = totalsByDay.get(key) ?? { acertos: 0, erros: 0 };

    return {
      day: key,
      acertos: totals.acertos,
      erros: totals.erros,
    };
  });
}

function groupSequentialBuckets(
  data: ReviewPerformancePointLike[],
  bucketSizes: number[],
  getLabel: (chunk: ReviewPerformancePointLike[], index: number) => string,
) {
  const grouped: ReviewPerformancePointLike[] = [];
  let startIndex = 0;

  bucketSizes.forEach((bucketSize, index) => {
    const chunk = data.slice(startIndex, startIndex + bucketSize);
    startIndex += bucketSize;

    const totals = sumPoints(chunk);
    grouped.push({
      day: getLabel(chunk, index),
      acertos: totals.acertos,
      erros: totals.erros,
    });
  });

  return grouped;
}

export function formatReviewPerformanceData(
  data: ReviewPerformancePointLike[],
  selectedDays: number,
  referenceDate = new Date(),
) {
  const dailySeries = buildDailySeries(data, selectedDays, referenceDate);

  if (selectedDays <= 15) {
    return dailySeries.map((item) => ({
      ...item,
      day: formatWeekdayLabel(item.day, selectedDays > 7),
    }));
  }

  if (selectedDays <= 30) {
    return groupSequentialBuckets(dailySeries, [9, 7, 7, 7], (_chunk, index) => `Semana ${index + 1}`);
  }

  return groupSequentialBuckets(dailySeries, [30, 30, 30], (chunk) => {
    const lastChunkDate = parseReviewPointDate(chunk[chunk.length - 1]?.day ?? "");
    return formatMonthLabel(lastChunkDate ?? referenceDate);
  });
}
