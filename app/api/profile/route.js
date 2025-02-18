// app/api/profile/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const profileFilePath = path.join(dataDir, 'companyProfile.json');

export async function GET() {
  try {
    let profileData;
    try {
      // Try reading the profile file
      profileData = await fs.readFile(profileFilePath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        // If file doesn't exist, ensure the directory exists and create a default profile
        await fs.mkdir(dataDir, { recursive: true });
        const defaultProfile = {};
        await fs.writeFile(profileFilePath, JSON.stringify(defaultProfile, null, 2));
        profileData = JSON.stringify(defaultProfile);
      } else {
        throw error;
      }
    }
    const profile = JSON.parse(profileData || '{}');
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Could not fetch profile", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const profileData = await request.json();
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(profileFilePath, JSON.stringify(profileData, null, 2));
    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Could not update profile", error: error.message },
      { status: 500 }
    );
  }
}
