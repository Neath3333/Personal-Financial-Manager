import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/lib/auth';
import { memoryStorage } from '@/lib/memory-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = memoryStorage.users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: userResponse,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}