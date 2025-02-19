// app/api/profile/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import path from 'path';
import fsPromises from 'fs/promises';

// Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload a file (received as a Blob) to Cloudinary
async function uploadToCloudinary(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);
        return reject(error);
      }
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

const dataDir = path.join(process.cwd(), 'data');
const profileFilePath = path.join(dataDir, 'companyProfile.json');

export async function GET() {
  try {
    const profileData = await fsPromises.readFile(profileFilePath, 'utf8');
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

export async function POST(req) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();

    const companyName = formData.get('companyName');
    const address = formData.get('address');
    const gstin = formData.get('gstin');
    const state = formData.get('state');
    const email = formData.get('email');
    const phone = formData.get('phone');

    // Get files from formData (they come as Blobs)
    const logoFile = formData.get('logo');
    const signatureFile = formData.get('signature');

    let logoUrl = null;
    let signatureUrl = null;

    // Upload logo to Cloudinary if provided
    if (logoFile && logoFile.size > 0) {
      try {
        const result = await uploadToCloudinary(logoFile);
        logoUrl = result.secure_url;
        console.log("Logo uploaded to Cloudinary:", logoUrl);
      } catch (error) {
        console.error("Error uploading logo:", error);
      }
    }

    // Upload signature to Cloudinary if provided
    if (signatureFile && signatureFile.size > 0) {
      try {
        const result = await uploadToCloudinary(signatureFile);
        signatureUrl = result.secure_url;
        console.log("Signature uploaded to Cloudinary:", signatureUrl);
      } catch (error) {
        console.error("Error uploading signature:", error);
      }
    }

    // Read existing profile data if available
    let existingProfile = {};
    try {
      const existingData = await fsPromises.readFile(profileFilePath, 'utf8');
      existingProfile = JSON.parse(existingData || '{}');
    } catch (readError) {
      console.warn("Could not read existing profile data, starting fresh.");
    }

    const updatedProfileData = {
      ...existingProfile,
      companyName,
      address,
      gstin,
      state,
      email,
      phone,
      logoUrl: logoUrl || existingProfile.logoUrl || null,
      signatureUrl: signatureUrl || existingProfile.signatureUrl || null,
    };

    // Write updated profile data to JSON file (for demo purposes)
    await fsPromises.writeFile(profileFilePath, JSON.stringify(updatedProfileData, null, 2));
    console.log("Profile data updated.");

    return NextResponse.json(
      { message: "Profile updated successfully", profile: updatedProfileData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Could not update profile", error: error.message },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
