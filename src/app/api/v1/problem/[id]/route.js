import { getProblemById } from "@/server/controllers/ProblemController";

export async function GET(req, { params }) {
    return getProblemById(req, params);
}