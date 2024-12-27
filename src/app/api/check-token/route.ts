import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
   
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    jwt.verify(token, process.env.JWT_SECRET as string);

    return NextResponse.json({ message: 'Token is valid' });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token', error }, { status: 401 });
  }
}