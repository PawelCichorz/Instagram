import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import pool from '../../lib/db';


interface DecodedToken {
    id: number;
    email: string;
  }
export async function GET(req: Request) {
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

    const result = await pool.query('SELECT profile_image FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0 || !result.rows[0].profile_image) {
      return NextResponse.json({ error: 'No profile image found' }, { status: 404 });
    }

    const imageBuffer = result.rows[0].profile_image;
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg', // Zmień typ MIME, jeśli używasz innego formatu
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
