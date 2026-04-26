import { getProblemTypes, createProblemType } from "@/server/controllers/ProblemTypeController";

export async function GET(req) {
    return getProblemTypes(req);
}

export async function POST(req) {
    return createProblemType(req);
}
