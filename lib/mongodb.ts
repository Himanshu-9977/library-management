import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  try {
    console.log('Connecting to MongoDB...')

    if (cached.conn) {
      console.log('Using cached connection')
      return cached.conn
    }

    if (!cached.promise) {
      console.log('Creating new connection promise')
      const opts = {
        bufferCommands: false,
      }

      cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
        console.log('MongoDB connected successfully')
        return mongoose
      })
    }

    console.log('Awaiting connection promise')
    cached.conn = await cached.promise
    console.log('Connection established')
    return cached.conn
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}
