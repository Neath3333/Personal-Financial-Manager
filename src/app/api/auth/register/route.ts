import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';
import { memoryStorage } from '@/lib/memory-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = memoryStorage.users.find(u => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = {
      id: `user_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    memoryStorage.users.push(user);

    // Generate JWT token
    const token = generateToken(user.id);

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}