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
  currentLevel: number;
  currentXp: number;
  nextLevelXp: number;
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

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: "#1f2937",
    padding: 24,
    fontSize: 10,
  },
  pageWithFooterSpace: {
    backgroundColor: "#ffffff",
    color: "#1f2937",
    padding: 24,
    paddingBottom: 90,
    fontSize: 10,
    position: "relative",
  },
  header: {
    backgroundColor: "#0f1f3a",
    border: "1 solid #1b3158",
    padding: 18,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    fontFamily: "GloriaHallelujah",
  },
  brandAccent: { color: "#3b82f6" },
  platformText: {
    marginTop: 4,
    color: "#7f95b8",
    fontSize: 9,
    letterSpacing: 1,
  },
  userStrip: {
    backgroundColor: "#ffffff",
    border: "1 solid #d9e3f5",
    borderLeft: "4 solid #3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  userStripLabel: {
    color: "#7f95b8",
    fontSize: 10,
    letterSpacing: 1.2,
  },
  userStripTitle: {
    marginTop: 6,
    color: "#0f1f3a",
    fontSize: 16,
  },
  userStripInfo: {
    marginTop: 6,
    color: "#5b6b88",
  },
  section: {
    backgroundColor: "#f7faff",
    border: "1 solid #d9e3f5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    border: "1 solid #d9e3f5",
    borderRadius: 6,
    padding: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 4,
  },
  muted: { color: "#5b6b88" },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #d9e3f5",
    paddingBottom: 4,
    marginBottom: 4,
    color: "#48608a",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottom: "1 solid #e7edf8",
  },
  col1: { width: "28%" },
  col2: { width: "24%" },
  col3: { width: "24%" },
  col4: { width: "24%" },
  barTrack: {
    width: "100%",
    height: 7,
    borderRadius: 999,
    backgroundColor: "#e5ecfa",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1 solid #e7edf8",
    paddingVertical: 4,
  },
  progressOuter: { marginTop: 6 },
  levelBox: {
    backgroundColor: "#142748",
    border: "1 solid #1e3b6b",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  levelTitle: { color: "#ffffff", fontSize: 12, fontWeight: 700 },
  levelInfo: { color: "#dce8ff", marginTop: 4 },
  levelResult: { marginTop: 4, color: "#9ec0ff" },
  lastPageFooter: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 24,
    backgroundColor: "#142748",
    border: "1 solid #1e3b6b",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { color: "#dce8ff" },
  footerBrand: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "GloriaHallelujah",
  },
});

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  return (
    <View style={styles.barTrack}>
      <View
        style={{
          width: `${Math.max(0, Math.min(100, percent))}%`,
          height: 7,
          borderRadius: 999,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function ReviewReportPdf({ data }: { data: ReviewReportData }) {
  const progress = Math.round((data.currentXp / data.nextLevelXp) * 100);
  const remainingXp = Math.max(0, data.nextLevelXp - data.currentXp);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            program<Text style={styles.brandAccent}>atico</Text>
          </Text>
          <Text style={styles.platformText}>PLATAFORMA DE APRENDIZADO</Text>
        </View>

        <View style={styles.userStrip}>
          <Text style={styles.userStripLabel}>RELATORIO DE DESEMPENHO</Text>
          <Text style={styles.userStripTitle}>Trilha: {data.selectedTrack}</Text>
          <Text style={styles.userStripInfo}>
            Periodo Analisado: {data.selectedDays}  |  Data de Emissao: {data.extractionDate}  |  Aluno: {data.userName}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Geral</Text>
          <View style={styles.statGrid}>
            {data.stats.map((stat) => (
              <View key={stat.title} style={styles.statCard}>
                <Text>{stat.title}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.muted}>{stat.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desempenho por dia</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Dia</Text>
            <Text style={styles.col2}>Acertos</Text>
            <Text style={styles.col3}>Erros</Text>
            <Text style={styles.col4}>Grafico (acertos)</Text>
          </View>
          {data.performanceData.map((item) => (
            <View key={item.day} style={styles.tableRow}>
              <Text style={styles.col1}>{item.day}</Text>
              <Text style={styles.col2}>{item.acertos}</Text>
              <Text style={styles.col3}>{item.erros}</Text>
              <View style={styles.col4}>
                <ProgressBar percent={(item.acertos / 12) * 100} color="#5aa4ff" />
              </View>
            </View>
          ))}
        </View>
      </Page>

      <Page size="A4" style={styles.pageWithFooterSpace}>
        <View style={styles.row}>
          <View style={[styles.section, { width: "50%" }]}>
            <Text style={styles.sectionTitle}>Taxa de acerto por assunto</Text>
            {data.subjectAccuracy.map((item) => (
              <View key={item.assunto} style={{ marginBottom: 6 }}>
                <Text>{item.assunto} - {item.percentual}%</Text>
                <ProgressBar percent={item.percentual} color={item.color} />
              </View>
            ))}
          </View>

          <View style={[styles.section, { width: "50%" }]}>
            <Text style={styles.sectionTitle}>Erros por assunto</Text>
            {data.errorsBySubject.map((item) => (
              <View key={item.assunto} style={styles.listItem}>
                <Text>{item.assunto}</Text>
                <Text style={{ color: "#ff636c" }}>{item.erros} erros</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.section, { width: "50%" }]}>
            <Text style={styles.sectionTitle}>O que revisar agora</Text>
            {data.reviewNow.map((item) => (
              <View key={item.assunto} style={styles.listItem}>
                <Text>{item.assunto}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.section, { width: "50%" }]}>
            <Text style={styles.sectionTitle}>Missoes recentes</Text>
            {data.recentMissions.map((item) => (
              <View key={item.label} style={styles.listItem}>
                <Text>{item.label}</Text>
                <Text style={styles.muted}>{item.status}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.levelBox}>
          <Text style={styles.levelTitle}>Evolucao de nivel</Text>
          <Text style={styles.levelInfo}>
            Nivel {data.currentLevel} para nivel {data.currentLevel + 1}
          </Text>
          <View style={styles.progressOuter}>
            <ProgressBar percent={progress} color="#5aa4ff" />
          </View>
          <Text style={styles.levelResult}>
            {progress}% - faltam {remainingXp} XP para o proximo nivel
          </Text>
        </View>

        <View style={styles.lastPageFooter} fixed>
          <Text style={styles.footerText}>Programatico | Relatorio academico</Text>
          <Text style={styles.footerBrand}>Programatico</Text>
        </View>
      </Page>
    </Document>
  );
}

