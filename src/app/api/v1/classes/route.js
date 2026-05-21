import { createClass, getClassList } from "@/server/controllers/ClassesController";

export async function GET(req) {
    return getClassList(req);
}

export async function POST(req, res) {
    return createClass(req, res);
}
