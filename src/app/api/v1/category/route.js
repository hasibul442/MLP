import { createCategory, getCategories } from "@/server/controllers/CategoryController";

export async function GET(req, res) {
    return getCategories(req, res);
}

export async function POST(req, res) {
    return createCategory(req, res);
}