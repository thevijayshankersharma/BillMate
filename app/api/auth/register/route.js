// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const usersFilePath = path.join(dataDir, 'users.json');

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Read existing users
        const usersData = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(usersData || '[]');

        // Check if a user already exists (single user scenario)
        if (users.length > 0) {
            return NextResponse.json({ message: "A user is already registered. Only one user allowed." }, { status: 400 });
        }

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: 1, // Assuming only one user, ID can be fixed
            email,
            password: hashedPassword,
        };

        users.push(newUser);

        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Could not register user", error: error.message }, { status: 500 });
    }
}