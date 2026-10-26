const fs = require("fs");
const data = JSON.parse(fs.readFileSync("exercises_raw.json", "utf8"));

const BASE_URL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

// Need to match against the translated names since that's how they're stored in DB
// Actually, they're stored with the original English name from the yuhonas db
// Let me use the exercise name (matches DB) and update thumbnail_url + video_url

let sql = `-- =============================================
-- UPDATE EXISTING EXERCISES WITH IMAGES
-- Source: github.com/yuhonas/free-exercise-db
-- Images: position 0 (start) and position 1 (end)
-- We'll store 0.jpg as thumbnail and use a special URL format
-- to indicate animation: "thumbnail|alt" so the component can split
-- =============================================

`;

let count = 0;
for (const ex of data) {
  if (!ex.images || ex.images.length === 0) continue;

  const id = ex.id;
  const thumbUrl = `${BASE_URL}/${id}/0.jpg`;
  const altUrl = ex.images.length > 1 ? `${BASE_URL}/${id}/1.jpg` : thumbUrl;

  // Use thumbnail_url for the primary image, video_url for the secondary (animation frame)
  // The ExerciseAnimation component will alternate between them
  const escapedName = ex.name.replace(/'/g, "''");

  sql += `UPDATE public.exercises SET thumbnail_url = '${thumbUrl}', video_url = '${altUrl}' WHERE name = '${escapedName}' AND is_global = TRUE;\n`;
  count++;
}

sql += `\n-- Total: ${count} exercises with images\n`;

fs.writeFileSync("supabase/migrations/00015_exercise_images.sql", sql);
console.log(`Generated image updates for ${count} exercises`);
console.log(`File size: ${(fs.statSync("supabase/migrations/00015_exercise_images.sql").size / 1024).toFixed(0)}KB`);
