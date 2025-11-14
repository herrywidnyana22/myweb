// lib/translateCache.ts
import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache_translate");
const CACHE_FILE = path.join(CACHE_DIR, "portfolio_translated_v1.json");
const TTL = 1000 * 60 * 60 * 6; // 6 jam

if (!fs.existsSync(CACHE_DIR)) {
  try { fs.mkdirSync(CACHE_DIR, { recursive: true }); } catch {}
}

export function readDiskCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const stat = fs.statSync(CACHE_FILE);
    const age = Date.now() - stat.mtimeMs;
    if (age > TTL) return null;
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.warn("readDiskCache failed", e);
    return null;
  }
}

export function writeDiskCache(data: any) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ ts: Date.now(), data }), "utf-8");
  } catch (e) {
    console.warn("writeDiskCache failed", e);
  }
}

export function readDiskCacheData() {
  const obj = readDiskCache();
  return obj?.data ?? null;
}
