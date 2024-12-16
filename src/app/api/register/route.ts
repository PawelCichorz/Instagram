import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '../../lib/db'



export async function POST(req: Request) {
  try {
    // Pobierz dane z żądania
    const { email, password, userName }: { email: string; password: string; userName: string } = await req.json();

    // Walidacja danych
    if (!email || !password || !userName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Sprawdzenie, czy użytkownik już istnieje
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Wstawianie użytkownika do bazy danych
    const result = await pool.query(
      'INSERT INTO users (email, password, user_name) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, userName]
    );

    return NextResponse.json(
      { message: 'User registered successfully', userId: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
