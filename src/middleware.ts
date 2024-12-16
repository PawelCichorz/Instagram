import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
export async function middleware(request: NextRequest) {
    
    const tokenCookie = request.cookies.get('token');

   
    if (!tokenCookie) {
        console.log('Cookie not found'); 
        return NextResponse.redirect(new URL('/', request.url));
    }

  
    const token = tokenCookie.value; 
    console.log('Token from cookie:', token); 

    if (!token) {
        console.log('Token value is undefined'); 
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
     
        const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

       
        await jwtVerify(token, secret);

        return NextResponse.next();
    } catch (error) {
        console.log('Token verification failed:', error); 
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: ['/logged',], 
};
