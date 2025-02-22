import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('billmate'); // Use your database name
    const parties = await db.collection('parties').find({}).toArray();
    return NextResponse.json(parties);
  } catch (error) {
    console.error('Error fetching parties:', error);
    return NextResponse.json({ error: 'Failed to fetch parties' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db('billmate'); // Use your database name
    const result = await db.collection('parties').insertOne(data);
    return NextResponse.json({ ...data, id: result.insertedId });
  } catch (error) {
    console.error('Error saving party:', error);
    return NextResponse.json({ error: 'Failed to save party' }, { status: 500 });
  }
}
