import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import pool from '../../lib/db';

interface DecodedToken {
  id: number;
  email: string;
}


export async function POST(req: Request) {
  try {
    const cookies = req.headers.get('cookie') || '';
    const token = cookies.split('; ').find(c => c.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Aktualizacja zdjęcia profilowego w bazie danych
    await pool.query('UPDATE users SET profile_image = $1 WHERE id = $2', [buffer, userId]);

    return NextResponse.json({ message: 'Profile image updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
