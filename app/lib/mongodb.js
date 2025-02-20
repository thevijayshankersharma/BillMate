// lib/mongodb.js
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs'; // Import bcryptjs

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();

        global._mongoClientPromise.then(async (connectedClient) => {
            const db = connectedClient.db();
            const usersCollection = db.collection('users'); // Assuming your user collection is named 'users'

            const testUserEmail = 'test@example.com';
            const testUserPasswordPlain = 'password123';

            const existingUser = await usersCollection.findOne({ email: testUserEmail });

            if (!existingUser) {
                try {
                    const hashedPassword = await bcrypt.hash(testUserPasswordPlain, 10);
                    await usersCollection.insertOne({
                        email: testUserEmail,
                        password: hashedPassword,
                    });
                    console.log(`Test user created: ${testUserEmail} / ${testUserPasswordPlain}`);
                } catch (error) {
                    console.error('Error seeding test user:', error);
                }
            } else {
                console.log(`Test user already exists: ${testUserEmail}`);
            }
        });
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, don't use a global variable
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;