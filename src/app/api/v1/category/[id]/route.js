import { getCategoryById } from "@/server/controllers/CategoryController";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const category = await getCategoryById(id, req);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
    }
}