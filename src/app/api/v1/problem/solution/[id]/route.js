import Solution from "@/server/models/Solution";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const solution = await Solution.findOne({ problemId: id }).exec();

        if (!solution) {
            return NextResponse.json({ status: "info", message: "Solution not found for the given problem ID" }, { status: 404 });
        }

        return NextResponse.json({ status: "success", data: solution }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "An error occurred while fetching the solution", details: error.message }, 
            { status: 500 });
    }
}