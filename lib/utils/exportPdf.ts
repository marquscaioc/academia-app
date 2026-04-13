import { Platform } from "react-native";

interface ProgressReportData {
  studentName: string;
  trainerName: string;
  period: string;
  measurements: { date: string; weight?: number; bodyFat?: number }[];
  workoutCount: number;
  adherenceScore: number;
}

export function generateProgressHtml(data: ProgressReportData): string {
  const measurementRows = data.measurements
    .map(
      (m) =>
        `<tr><td>${m.date}</td><td>${m.weight ? m.weight + " kg" : "-"}</td><td>${m.bodyFat ? m.bodyFat + "%" : "-"}</td></tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a1a; background: #fff; }
    h1 { color: #7C3AED; font-size: 24px; margin-bottom: 4px; }
    h2 { color: #555; font-size: 14px; font-weight: normal; margin-top: 0; }
    .header { border-bottom: 2px solid #7C3AED; padding-bottom: 16px; margin-bottom: 24px; }
    .stats { display: flex; gap: 16px; margin-bottom: 24px; }
    .stat { background: #f5f3ff; padding: 16px; border-radius: 12px; flex: 1; text-align: center; }
    .stat-value { font-size: 28px; font-weight: 900; color: #7C3AED; }
    .stat-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: #7C3AED; color: white; padding: 10px; text-align: left; font-size: 12px; }
    td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
    .footer { margin-top: 32px; text-align: center; color: #aaa; font-size: 11px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Relatorio de Progresso</h1>
    <h2>${data.studentName} | ${data.period}</h2>
    <p style="font-size:12px;color:#888;">Personal: ${data.trainerName}</p>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-value">${data.workoutCount}</div>
      <div class="stat-label">Treinos</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.adherenceScore}%</div>
      <div class="stat-label">Adesao</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.measurements.length}</div>
      <div class="stat-label">Medidas</div>
    </div>
  </div>

  <h3 style="color:#7C3AED;font-size:14px;">Evolucao de Medidas</h3>
  <table>
    <thead>
      <tr><th>Data</th><th>Peso</th><th>% Gordura</th></tr>
    </thead>
    <tbody>
      ${measurementRows || '<tr><td colspan="3" style="text-align:center;color:#aaa;">Sem dados</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    Gerado por Academia App em ${new Date().toLocaleDateString("pt-BR")}
  </div>
</body>
</html>`;
}

export async function exportProgressReport(data: ProgressReportData): Promise<void> {
  if (Platform.OS === "web") {
    const html = generateProgressHtml(data);
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 500);
    }
  }
}
