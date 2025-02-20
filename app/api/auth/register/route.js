// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../lib/mongodb'; // Import MongoDB connection

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
        }

        const mongoClient = await clientPromise;
        const db = mongoClient.db();
        const usersCollection = db.collection('users'); // Assuming your user collection is named 'users'

        // Check if a user with this email already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "Email is already registered." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email,
            password: hashedPassword,
            // Add any other user fields here if needed (e.g., name, registration date, etc.)
        };

        await usersCollection.insertOne(newUser);

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Could not register user", error: error.message, details: error.message }, { status: 500 });
    }
}