import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if MongoDB URI is set
    const mongodbUri = process.env.MONGODB_URI
    
    return NextResponse.json({
      mongodbUriSet: !!mongodbUri,
      mongodbUriFirstChars: mongodbUri ? mongodbUri.substring(0, 15) + "..." : "Not set",
      nodeEnv: process.env.NODE_ENV || "Not set"
    })
  } catch (error) {
    console.error("Error checking environment:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
