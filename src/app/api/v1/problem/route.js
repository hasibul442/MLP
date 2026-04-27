import { getProblems, createProblem } from "@/server/controllers/ProblemController";
export async function GET(req) {
    return getProblems(req);
}

export async function POST(req) {
    return createProblem(req);
}