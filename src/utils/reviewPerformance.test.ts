import { formatReviewPerformanceData } from "./reviewPerformance";

describe("formatReviewPerformanceData", () => {
  test("mantem 7 dias incluindo dias sem dados com rotulos por dia da semana", () => {
    const result = formatReviewPerformanceData(
      [
        { day: "2026-06-21", acertos: 1, erros: 0 },
        { day: "2026-06-22", acertos: 2, erros: 1 },
        { day: "2026-06-24", acertos: 4, erros: 0 },
        { day: "2026-06-26", acertos: 6, erros: 0 },
        { day: "2026-06-27", acertos: 7, erros: 0 },
      ],
      7,
      new Date(2026, 5, 27, 15, 30, 10),
    );

    expect(result).toEqual([
      { day: "Dom", acertos: 1, erros: 0 },
      { day: "Seg", acertos: 2, erros: 1 },
      { day: "Ter", acertos: 0, erros: 0 },
      { day: "Qua", acertos: 4, erros: 0 },
      { day: "Qui", acertos: 0, erros: 0 },
      { day: "Sex", acertos: 6, erros: 0 },
      { day: "Sáb", acertos: 7, erros: 0 },
    ]);
  });

  test("filtra apenas os ultimos 7 dias ignorando horas e soma o mesmo dia", () => {
    const result = formatReviewPerformanceData(
      [
        { day: "2026-06-20T23:59:59Z", acertos: 99, erros: 99 },
        { day: "2026-06-21T10:00:00", acertos: 1, erros: 0 },
        { day: "2026-06-21T20:00:00", acertos: 2, erros: 3 },
        { day: "2026-06-27T01:30:00", acertos: 7, erros: 1 },
      ],
      7,
      new Date(2026, 5, 27, 8, 0, 0),
    );

    expect(result).toEqual([
      { day: "Dom", acertos: 3, erros: 3 },
      { day: "Seg", acertos: 0, erros: 0 },
      { day: "Ter", acertos: 0, erros: 0 },
      { day: "Qua", acertos: 0, erros: 0 },
      { day: "Qui", acertos: 0, erros: 0 },
      { day: "Sex", acertos: 0, erros: 0 },
      { day: "Sáb", acertos: 7, erros: 1 },
    ]);
  });

  test("mostra dia da semana com dia do mes em 15 dias", () => {
    const result = formatReviewPerformanceData(
      [
        { day: "2026-06-13", acertos: 2, erros: 0 },
        { day: "2026-06-20", acertos: 3, erros: 0 },
        { day: "2026-06-27", acertos: 4, erros: 0 },
      ],
      15,
      new Date(2026, 5, 27),
    );

    expect(result).toHaveLength(15);
    expect(result[0]).toEqual({ day: "Sáb 13", acertos: 2, erros: 0 });
    expect(result[7]).toEqual({ day: "Sáb 20", acertos: 3, erros: 0 });
    expect(result[14]).toEqual({ day: "Sáb 27", acertos: 4, erros: 0 });
    expect(result[1].acertos).toBe(0);
  });

  test("agrupar 30 dias em 4 semanas com preenchimento de zeros", () => {
    const base = Array.from({ length: 3 }, (_, index) => {
      const date = new Date(2026, 5, 19 + index);
      const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return { day, acertos: 1, erros: 2 };
    });

    const result = formatReviewPerformanceData(base, 30, new Date(2026, 5, 27));

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ day: "Semana 1", acertos: 0, erros: 0 });
    expect(result[1]).toEqual({ day: "Semana 2", acertos: 0, erros: 0 });
    expect(result[2]).toEqual({ day: "Semana 3", acertos: 2, erros: 4 });
    expect(result[3]).toEqual({ day: "Semana 4", acertos: 1, erros: 2 });
  });

  test("agrupar 90 dias em 3 blocos mensais de 30 dias", () => {
    const base = Array.from({ length: 90 }, (_, index) => {
      const date = new Date(2026, 2, 30 + index);
      const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return { day, acertos: 1, erros: 0 };
    });

    const result = formatReviewPerformanceData(base, 90, new Date(2026, 5, 27));

    expect(result).toEqual([
      { day: "Abr", acertos: 30, erros: 0 },
      { day: "Mai", acertos: 30, erros: 0 },
      { day: "Jun", acertos: 30, erros: 0 },
    ]);
  });
});
