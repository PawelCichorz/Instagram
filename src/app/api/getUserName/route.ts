import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken'; // Do dekodowania tokena JWT
import pool from '../../lib/db'; // Połączenie z bazą danych

interface DecodedToken {
    id: number;
    email: string;
    userName:string
  }

export async function GET(req: Request) {
  try {
    // Odczytanie ciasteczek i pobranie tokena
    const cookies = req.headers.get('Cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token not found' }, { status: 400 });
    }

    // Dekodowanie tokena JWT
    const decoded = verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    // Wyciągamy userId z tokena
    const userId = decoded.id;

    // Pobieramy dane użytkownika na podstawie userId z bazy danych
    const userResult = await pool.query('SELECT user_name FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Zwracamy dane użytkownika (np. userName)
    const userName = userResult.rows[0].user_name;
    return NextResponse.json({ userName }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching user data' }, { status: 500 });
  }
}
