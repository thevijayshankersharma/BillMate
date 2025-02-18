import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const hardcodedEmail = process.env.HARDCODED_EMAIL;
        const hardcodedPassword = process.env.HARDCODED_PASSWORD;

        if (!hardcodedEmail || !hardcodedPassword) {
            console.error("Environment variables HARDCODED_EMAIL or HARDCODED_PASSWORD not set.");
            return NextResponse.json({ message: "Login configuration error." }, { status: 500 });
        }

        if (email === hardcodedEmail && password === hardcodedPassword) {
            // Hardcoded login successful
            return NextResponse.json({ message: "Login successful" }, { status: 200 });
        } else {
            // Invalid credentials
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Could not log in", error: error.message }, { status: 500 });
    }
}
