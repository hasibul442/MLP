import { getSolution } from "@/server/controllers/SolutionController";

export async function POST(req) {

    return getSolution(req);
}