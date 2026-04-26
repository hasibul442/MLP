// This will show that database is connected and the server is running
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    const dbState = mongoose.connection.readyState;
    const isConnected = dbState === 1;
    const stateMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };

    return NextResponse.json(
        {
            server: "running",
            database: {
                status: stateMap[dbState] || "unknown",
                // host: mongoose.connection.host || null,
                // name: mongoose.connection.name || null,
            },
            uptime: Math.floor(process.uptime()) + "s",
            environment: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
        },
        { status: isConnected ? 200 : 503 }
    );
}