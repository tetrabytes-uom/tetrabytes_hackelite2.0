import User from '@/models/User';
import connectMongoDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();

  await connectMongoDB();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ name, email, password: hashedPassword });

  try {
    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};
