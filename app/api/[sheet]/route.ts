// app/api/[sheet]/route.ts
import { NextResponse } from "next/server";
import { fetchSheetData } from "@/lib/fetchSheetData";

export async function GET(req: Request, { params }: { params: { sheet: string } }) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("lang") ?? "id";
    const lang = q === "en" ? "en" : "id";
    const sheet = params.sheet;

    const allowed = ["profile","address","projects","contacts","educations","experiences"];
    if (!allowed.includes(sheet)) return NextResponse.json({ error: "Invalid sheet" }, { status: 400 });

    const data = await fetchSheetData<any>(sheet, lang);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Sheet route error", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
