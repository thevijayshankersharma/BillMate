// app/api/profile/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // uses the default database from the connection string, or specify: client.db('billmateDB')
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

    // Prepare your update data
    const updatedProfileData = {
      _id: 1, // Use a fixed _id so that there's only one profile document
      companyName,
      address,
      gstin,
      state,
      email,
      phone,
      // You can add logoUrl and signatureUrl here if you're handling file uploads with Cloudinary
    };

    // Connect to MongoDB and update the profile document with an upsert operation
    const client = await clientPromise;
    const db = client.db(); // or client.db('billmateDB') if you want to specify the database name

    const result = await db
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
