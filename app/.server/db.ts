import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

/** 
 * Cached connection for MongoDB.
 */

interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Use a global cache to prevent multiple connections in development
declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {

    console.log(process.env.NODE_ENV);

    if (process.env.NODE_ENV === "production") {
        
        await mongoose.connect(MONGODB_URI);

        return {
            status: 'success',
            message: 'Connection to server successful',
            data: null,
        };
    }
    else {
        if (cached.conn) {
            return cached.conn;
        }

        if (!cached.promise) {
            cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
                return mongoose;
            });
        }
        cached.conn = await cached.promise;

        return {
            status: 'success',
            message: 'Connection to server successful',
            data: null
        };
    }
}

if (process.env.NODE_ENV !== "production") {
    global.mongooseCache = cached;
}

export default dbConnect;