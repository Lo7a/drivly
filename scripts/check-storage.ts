import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("❌ Missing SUPABASE env vars");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log("🔍 Checking storage buckets...\n");

  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("❌ Failed to list buckets:", error.message);
    process.exit(1);
  }

  console.log("Existing buckets:");
  buckets.forEach((b) => {
    console.log(`  - ${b.name} (public: ${b.public}, size: ${b.file_size_limit ?? "unlimited"})`);
  });

  const carImages = buckets.find((b) => b.name === "car-images");
  if (!carImages) {
    console.log("\n⚠️ 'car-images' bucket not found. Creating it...\n");
    const { error: createErr } = await supabase.storage.createBucket("car-images", {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });
    if (createErr) {
      console.error("❌ Failed to create bucket:", createErr.message);
      process.exit(1);
    }
    console.log("✅ Created 'car-images' bucket (public, 10MB limit)");
  } else {
    console.log(`\n✅ 'car-images' bucket exists (public: ${carImages.public})`);
    if (!carImages.public) {
      console.log("⚠️ Bucket is private — updating to public...");
      const { error: updErr } = await supabase.storage.updateBucket("car-images", {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
      });
      if (updErr) console.error("❌ Update failed:", updErr.message);
      else console.log("✅ Now public");
    }
  }

  // Try a test upload
  console.log("\n🧪 Testing upload with a 1x1 PNG...");
  const pngBytes = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "base64"
  );
  const testPath = `_diagnostics/${Date.now()}.png`;
  const { error: upErr } = await supabase.storage
    .from("car-images")
    .upload(testPath, pngBytes, { contentType: "image/png" });
  if (upErr) {
    console.error("❌ Test upload failed:", upErr.message);
    process.exit(1);
  }
  const { data: pub } = supabase.storage.from("car-images").getPublicUrl(testPath);
  console.log(`✅ Test upload works. URL: ${pub.publicUrl}`);
  await supabase.storage.from("car-images").remove([testPath]);
  console.log("🧹 Cleaned up test file");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
