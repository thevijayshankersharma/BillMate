// app/api/profile/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import clientPromise from '../../lib/mongodb';

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

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // use default database or specify one, e.g., client.db('billmateDB')
    const profile = await db.collection('companyProfile').findOne({ _id: 1 });
    return NextResponse.json(profile || {});
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
    const formData = await req.formData();

    // Get fields from formData
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

    // Prepare your update data, including image URLs if available
    const updatedProfileData = {
      _id: 1, // Fixed _id so there’s only one profile document
      companyName,
      address,
      gstin,
      state,
      email,
      phone,
      logoUrl,       // Will be null if not provided/uploaded
      signatureUrl,  // Will be null if not provided/uploaded
    };

    // Connect to MongoDB and update the profile document with an upsert operation
    const client = await clientPromise;
    const db = client.db();
    await db
      .collection('companyProfile')
      .updateOne({ _id: 1 }, { $set: updatedProfileData }, { upsert: true });

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
