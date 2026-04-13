import { Platform } from "react-native";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
}

interface LeaderboardCardData {
  challengeTitle: string;
  entries: LeaderboardEntry[];
  userRank?: number;
  userName?: string;
  userScore?: number;
}

export function generateLeaderboardHtml(data: LeaderboardCardData): string {
  const top5 = data.entries.slice(0, 5);
  const medals = ["🥇", "🥈", "🥉"];

  const rows = top5
    .map(
      (e) =>
        `<div class="row">
          <span class="rank">${e.rank <= 3 ? medals[e.rank - 1] : "#" + e.rank}</span>
          <span class="name">${e.name}</span>
          <span class="score">${e.score}</span>
        </div>`,
    )
    .join("");

  const userRow =
    data.userRank && data.userRank > 5
      ? `<div class="row user">
          <span class="rank">#${data.userRank}</span>
          <span class="name">${data.userName ?? "Voce"}</span>
          <span class="score">${data.userScore ?? 0}</span>
        </div>`
      : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: system-ui; padding: 24px; background: #0B0811; color: #F2EEF8; margin: 0; width: 400px; }
  .title { font-size: 18px; font-weight: 900; color: #781BB6; margin-bottom: 4px; }
  .subtitle { font-size: 12px; color: #6E6382; margin-bottom: 16px; }
  .row { display: flex; align-items: center; padding: 10px 12px; border-radius: 12px; margin-bottom: 4px; background: #16121E; }
  .row.user { background: #781BB620; border: 1px solid #781BB640; }
  .rank { width: 32px; font-size: 16px; text-align: center; }
  .name { flex: 1; font-size: 14px; font-weight: 600; }
  .score { font-size: 16px; font-weight: 900; color: #781BB6; }
  .footer { text-align: center; color: #6E6382; font-size: 10px; margin-top: 12px; }
</style></head><body>
  <div class="title">${data.challengeTitle}</div>
  <div class="subtitle">Ranking</div>
  ${rows}
  ${userRow}
  <div class="footer">Academia App</div>
</body></html>`;
}

export async function shareLeaderboardCard(data: LeaderboardCardData): Promise<void> {
  const html = generateLeaderboardHtml(data);

  if (Platform.OS === "web") {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
    return;
  }

  try {
    const Print = await import("expo-print");
    const Sharing = await import("expo-sharing");
    const { uri } = await Print.printToFileAsync({ html, width: 400, height: 500 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: "application/pdf" });
    }
  } catch {
    // Fallback
  }
}
