import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '../../lib/db'
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; 




export async function POST(req: Request) {
 
   
    const { email, password}: { email: string; password: string } = await req.json();

    
    if (!email || !password ) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
try{
    // Sprawdzenie, czy użytkownik  istnieje
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length === 0) {
      return NextResponse.json({ error: 'invalid email or password' }, { status: 400 });
    }
    const user = userExists.rows[0];
console.log(user.password)
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '60m' }
    );


    const theme =await cookies()
    theme.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 3600, 
        path: '/',
        sameSite: 'lax',
    });

    return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
} catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
}
}
