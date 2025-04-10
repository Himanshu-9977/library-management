import { NextResponse } from "next/server"

export async function GET() {
  const mongodbUri = process.env.MONGODB_URI
  
  return NextResponse.json({
    mongodbUri: mongodbUri ? "Set (value hidden for security)" : "Not set",
    nodeEnv: process.env.NODE_ENV || "Not set"
  })
}
