import { Platform } from "react-native";

interface MeasurementData {
  date: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bicepsLeft?: number;
  bicepsRight?: number;
  thighLeft?: number;
  thighRight?: number;
  calfLeft?: number;
  calfRight?: number;
}

interface PRData {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

interface PhotoData {
  url: string;
  date: string;
  pose: string;
}

export interface ProgressReportData {
  studentName: string;
  trainerName: string;
  period: string;
  measurements: MeasurementData[];
  prs?: PRData[];
  photos?: PhotoData[];
  workoutCount: number;
  adherenceScore: number;
}

export function generateProgressHtml(data: ProgressReportData): string {
  const measurementRows = data.measurements
    .map(
      (m) =>
        `<tr>
          <td>${m.date}</td>
          <td>${m.weight ? m.weight + " kg" : "-"}</td>
          <td>${m.bodyFat ? m.bodyFat + "%" : "-"}</td>
          <td>${m.waist ? m.waist + " cm" : "-"}</td>
          <td>${m.chest ? m.chest + " cm" : "-"}</td>
          <td>${m.hips ? m.hips + " cm" : "-"}</td>
        </tr>`,
    )
    .join("");

  const prRows = (data.prs ?? [])
    .map(
      (pr) =>
        `<tr><td>${pr.exerciseName}</td><td>${pr.weight}kg</td><td>${pr.reps}</td><td>${pr.date}</td></tr>`,
    )
    .join("");

  const photoGrid = (data.photos ?? [])
    .slice(0, 6)
    .map(
      (p) =>
        `<div class="photo-item"><img src="${p.url}" /><span>${p.pose} - ${p.date}</span></div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a1a; background: #fff; }
    h1 { color: #781BB6; font-size: 24px; margin-bottom: 4px; }
    h2 { color: #555; font-size: 14px; font-weight: normal; margin-top: 0; }
    h3 { color: #781BB6; font-size: 14px; margin-top: 28px; margin-bottom: 8px; }
    .header { border-bottom: 2px solid #781BB6; padding-bottom: 16px; margin-bottom: 24px; }
    .stats { display: flex; gap: 16px; margin-bottom: 24px; }
    .stat { background: #f5f3ff; padding: 16px; border-radius: 12px; flex: 1; text-align: center; }
    .stat-value { font-size: 28px; font-weight: 900; color: #781BB6; }
    .stat-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #781BB6; color: white; padding: 10px; text-align: left; font-size: 12px; }
    td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
    tr:nth-child(even) { background: #faf8fc; }
    .photo-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
    .photo-item { width: 30%; text-align: center; }
    .photo-item img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 8px; }
    .photo-item span { font-size: 10px; color: #888; display: block; margin-top: 4px; }
    .footer { margin-top: 40px; text-align: center; color: #aaa; font-size: 11px; border-top: 1px solid #eee; padding-top: 16px; }
    @media print { body { padding: 20px; } }
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
    <div class="stat">
      <div class="stat-value">${data.prs?.length ?? 0}</div>
      <div class="stat-label">PRs</div>
    </div>
  </div>

  <h3>Evolucao de Medidas</h3>
  <table>
    <thead>
      <tr><th>Data</th><th>Peso</th><th>% Gordura</th><th>Cintura</th><th>Peito</th><th>Quadril</th></tr>
    </thead>
    <tbody>
      ${measurementRows || '<tr><td colspan="6" style="text-align:center;color:#aaa;">Sem dados</td></tr>'}
    </tbody>
  </table>

  ${prRows ? `
  <h3>Recordes Pessoais (PRs)</h3>
  <table>
    <thead>
      <tr><th>Exercicio</th><th>Peso</th><th>Reps</th><th>Data</th></tr>
    </thead>
    <tbody>${prRows}</tbody>
  </table>` : ""}

  ${photoGrid ? `
  <h3>Fotos de Progresso</h3>
  <div class="photo-grid">${photoGrid}</div>` : ""}

  <div class="footer">
    Gerado por Academia App em ${new Date().toLocaleDateString("pt-BR")}
  </div>
</body>
</html>`;
}

export async function exportProgressReport(data: ProgressReportData): Promise<void> {
  const html = generateProgressHtml(data);

  if (Platform.OS === "web") {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 500);
    }
    return;
  }

  // Native: use expo-print + expo-sharing
  try {
    const Print = await import("expo-print");
    const Sharing = await import("expo-sharing");

    const { uri } = await Print.printToFileAsync({ html, width: 612, height: 792 });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    }
  } catch (e) {
    // Fallback: just print
    const Print = await import("expo-print");
    await Print.printAsync({ html });
  }
}
