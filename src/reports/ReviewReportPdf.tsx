import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

export interface ReviewStat {
  title: string;
  value: string;
  subtitle: string;
}

export interface PerformancePoint {
  day: string;
  acertos: number;
  erros: number;
}

export interface SubjectAccuracyItem {
  assunto: string;
  percentual: number;
  color: string;
}

export interface ErrorBySubjectItem {
  assunto: string;
  erros: number;
}

export interface ReviewNowItem {
  assunto: string;
}

export interface RecentMissionItem {
  label: string;
  status: string;
}

export interface ReviewReportData {
  userName: string;
  selectedTrack: string;
  selectedDays: string;
  extractionDate: string;
  currentXp: number;
  stats: ReviewStat[];
  performanceData: PerformancePoint[];
  subjectAccuracy: SubjectAccuracyItem[];
  errorsBySubject: ErrorBySubjectItem[];
  reviewNow: ReviewNowItem[];
  recentMissions: RecentMissionItem[];
}

const gloriaFontSrc =
  typeof window !== "undefined"
    ? `${window.location.origin}/fonts/gloria_hallelujah/gloriahallelujah.ttf`
    : "/fonts/gloria_hallelujah/gloriahallelujah.ttf";

Font.register({ family: "GloriaHallelujah", src: gloriaFontSrc });

// Paleta da identidade do app (styles/variables.css)
const CORES = {
  fundoApp: "#293046",
  verde: "#11604d",
  verdeClaro: "#178a6e",
  sucesso: "#578f48",
  dourado: "#d4a843",
  erro: "#dc2626",
  erroClaro: "#f87171",
  tinta: "#1f2937",
  mutado: "#5b6b88",
  borda: "#dde4f0",
  cartao: "#f7f9fd",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: CORES.tinta,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 46,
    fontSize: 10,
  },
  header: {
    backgroundColor: CORES.fundoApp,
    borderRadius: 8,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: "#ffffff",
    fontFamily: "GloriaHallelujah",
  },
  platformText: {
    marginTop: 4,
    color: CORES.dourado,
    fontSize: 8,
    letterSpacing: 2,
  },
  xpBadge: {
    backgroundColor: "#ffffff22",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  xpBadgeText: {
    color: CORES.dourado,
    fontSize: 11,
    fontWeight: 700,
  },
  userStrip: {
    border: `1 solid ${CORES.borda}`,
    borderLeft: `4 solid ${CORES.verdeClaro}`,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  userStripLabel: {
    color: CORES.verde,
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: 700,
  },
  userStripTitle: {
    marginTop: 6,
    color: CORES.fundoApp,
    fontSize: 15,
    fontWeight: 700,
  },
  userStripInfo: {
    marginTop: 5,
    color: CORES.mutado,
  },
  section: {
    backgroundColor: CORES.cartao,
    border: `1 solid ${CORES.borda}`,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
    color: CORES.fundoApp,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statCard: {
    width: "23.5%",
    backgroundColor: "#ffffff",
    border: `1 solid ${CORES.borda}`,
    borderRadius: 6,
    padding: 8,
  },
  statTitle: { fontSize: 8, color: CORES.mutado },
  statValue: {
    fontSize: 15,
    fontWeight: 700,
    marginTop: 3,
    color: CORES.verde,
  },
  statSubtitle: { fontSize: 7, color: CORES.mutado, marginTop: 2 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: `1 solid ${CORES.borda}`,
    paddingBottom: 4,
    marginBottom: 4,
    color: CORES.mutado,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    borderBottom: "1 solid #eef2f9",
  },
  colDia: { width: "18%" },
  colNum: { width: "12%" },
  colBarra: { width: "58%" },
  barTrack: {
    width: "100%",
    height: 6,
    borderRadius: 999,
    backgroundColor: "#e8edf6",
  },
  legenda: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  legendaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendaCor: { width: 8, height: 8, borderRadius: 2 },
  legendaTexto: { fontSize: 8, color: CORES.mutado },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1 solid #eef2f9",
    paddingVertical: 4,
  },
  vazio: { color: CORES.mutado, fontSize: 9 },
  rodape: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `1 solid ${CORES.borda}`,
    paddingTop: 6,
    color: CORES.mutado,
    fontSize: 8,
  },
});

function Barra({ percent, color }: { percent: number; color: string }) {
  return (
    <View style={styles.barTrack}>
      <View
        style={{
          width: `${Math.max(0, Math.min(100, percent))}%`,
          height: 6,
          borderRadius: 999,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

/** Rodapé fixo com marca, data e paginação — presente em todas as páginas. */
function Rodape({ emissao }: { emissao: string }) {
  return (
    <View style={styles.rodape} fixed>
      <Text>Programático — relatório gerado em {emissao}</Text>
      <Text render={({ pageNumber, totalPages }) => `página ${pageNumber} de ${totalPages}`} />
    </View>
  );
}

function chunkArray<T>(items: T[], chunkSize: number) {
  if (items.length === 0) {
    return [[]];
  }

  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
}

export function ReviewReportPdf({ data }: { data: ReviewReportData }) {
  const subjectAccuracyChunks = chunkArray(data.subjectAccuracy, 18);
  const errorsBySubjectChunks = chunkArray(data.errorsBySubject, 18);
  const reviewNowChunks = chunkArray(data.reviewNow, 18);
  const recentMissionsChunks = chunkArray(data.recentMissions, 18);
  const temDetalhes =
    data.subjectAccuracy.length + data.errorsBySubject.length +
    data.reviewNow.length + data.recentMissions.length > 0;
  const detailPageCount = temDetalhes
    ? Math.max(
        subjectAccuracyChunks.length,
        errorsBySubjectChunks.length,
        reviewNowChunks.length,
        recentMissionsChunks.length,
      )
    : 0;

  // Escala real do gráfico: o maior valor do período define os 100%.
  const maiorValor = Math.max(
    1,
    ...data.performanceData.map((p) => Math.max(p.acertos, p.erros)),
  );

  return (
    <Document
      title={`Relatório de desempenho — ${data.userName}`}
      author="Programático"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>programático</Text>
            <Text style={styles.platformText}>PLATAFORMA DE APRENDIZADO</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeText}>{data.currentXp.toLocaleString("pt-BR")} XP</Text>
          </View>
        </View>

        <View style={styles.userStrip}>
          <Text style={styles.userStripLabel}>RELATÓRIO DE DESEMPENHO</Text>
          <Text style={styles.userStripTitle}>Trilha: {data.selectedTrack}</Text>
          <Text style={styles.userStripInfo}>
            Período analisado: {data.selectedDays}  |  Emissão: {data.extractionDate}  |  Aluno: {data.userName}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo geral</Text>
          <View style={styles.statGrid}>
            {data.stats.map((stat) => (
              <View key={stat.title} style={styles.statCard}>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desempenho no período</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colDia}>Dia</Text>
            <Text style={styles.colNum}>Acertos</Text>
            <Text style={styles.colNum}>Erros</Text>
            <Text style={styles.colBarra}>Distribuição</Text>
          </View>
          {data.performanceData.length === 0 ? (
            <Text style={styles.vazio}>Sem atividade no período.</Text>
          ) : (
            data.performanceData.map((item) => (
              <View key={item.day} style={styles.tableRow}>
                <Text style={styles.colDia}>{item.day}</Text>
                <Text style={[styles.colNum, { color: CORES.sucesso, fontWeight: 700 }]}>{item.acertos}</Text>
                <Text style={[styles.colNum, { color: CORES.erro, fontWeight: 700 }]}>{item.erros}</Text>
                <View style={[styles.colBarra, { gap: 2 }]}>
                  <Barra percent={(item.acertos / maiorValor) * 100} color={CORES.sucesso} />
                  <Barra percent={(item.erros / maiorValor) * 100} color={CORES.erroClaro} />
                </View>
              </View>
            ))
          )}
          <View style={styles.legenda}>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaCor, { backgroundColor: CORES.sucesso }]} />
              <Text style={styles.legendaTexto}>Acertos</Text>
            </View>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaCor, { backgroundColor: CORES.erroClaro }]} />
              <Text style={styles.legendaTexto}>Erros</Text>
            </View>
          </View>
        </View>

        <Rodape emissao={data.extractionDate} />
      </Page>

      {Array.from({ length: detailPageCount }, (_, pageIndex) => (
        <Page key={`details-${pageIndex + 1}`} size="A4" style={styles.page}>
          <View style={styles.row}>
            <View style={[styles.section, { width: "50%" }]}>
              <Text style={styles.sectionTitle}>Taxa de acerto por assunto</Text>
              {(subjectAccuracyChunks[pageIndex] ?? []).length === 0 ? (
                <Text style={styles.vazio}>Sem dados no período.</Text>
              ) : (
                (subjectAccuracyChunks[pageIndex] ?? []).map((item) => (
                  <View key={`${item.assunto}-${pageIndex}`} style={{ marginBottom: 6 }}>
                    <Text>{item.assunto} — {item.percentual}%</Text>
                    <Barra percent={item.percentual} color={item.color} />
                  </View>
                ))
              )}
            </View>

            <View style={[styles.section, { width: "50%" }]}>
              <Text style={styles.sectionTitle}>Erros por assunto</Text>
              {(errorsBySubjectChunks[pageIndex] ?? []).length === 0 ? (
                <Text style={styles.vazio}>Sem dados no período.</Text>
              ) : (
                (errorsBySubjectChunks[pageIndex] ?? []).map((item) => (
                  <View key={`${item.assunto}-${pageIndex}`} style={styles.listItem}>
                    <Text>{item.assunto}</Text>
                    <Text style={{ color: CORES.erro, fontWeight: 700 }}>{item.erros} erros</Text>
                  </View>
                ))
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.section, { width: "50%" }]}>
              <Text style={styles.sectionTitle}>O que revisar agora</Text>
              {(reviewNowChunks[pageIndex] ?? []).length === 0 ? (
                <Text style={styles.vazio}>Nada pendente — bom trabalho!</Text>
              ) : (
                (reviewNowChunks[pageIndex] ?? []).map((item) => (
                  <View key={`${item.assunto}-${pageIndex}`} style={styles.listItem}>
                    <Text>{item.assunto}</Text>
                    <Text style={{ color: CORES.dourado, fontWeight: 700 }}>revisar</Text>
                  </View>
                ))
              )}
            </View>

            <View style={[styles.section, { width: "50%" }]}>
              <Text style={styles.sectionTitle}>Missões recentes</Text>
              {(recentMissionsChunks[pageIndex] ?? []).length === 0 ? (
                <Text style={styles.vazio}>Sem missões no período.</Text>
              ) : (
                (recentMissionsChunks[pageIndex] ?? []).map((item) => (
                  <View key={`${item.label}-${pageIndex}`} style={styles.listItem}>
                    <Text>{item.label}</Text>
                    <Text
                      style={{
                        color: item.status.startsWith("Concluida") || item.status.startsWith("Concluída")
                          ? CORES.sucesso
                          : CORES.dourado,
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>

          <Rodape emissao={data.extractionDate} />
        </Page>
      ))}
    </Document>
  );
}
