// api/auth/login/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb'; // Adjust path if needed
import bcrypt from 'bcryptjs'; // Import bcryptjs

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
        }

        const mongoClient = await clientPromise;
        const db = mongoClient.db();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 }); // User not found
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 }); // Password mismatch
        }

        // Login successful
        return NextResponse.json({ message: "Login successful", userEmail: user.email }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Could not log in", error: error.message }, { status: 500 });
    }
}