import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
// import { prisma } from '@/lib/prisma'; // Если используешь Prisma
// import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        // Валидация данных
        if (!username || !email || !password) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Проверка существования пользователя
        // const existingUser = await prisma.user.findFirst({
        //   where: {
        //     OR: [
        //       { email },
        //       { username }
        //     ]
        //   }
        // });

        // if (existingUser) {
        //   return NextResponse.json(
        //     { message: 'User already exists' },
        //     { status: 409 }
        //   );
        // }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 12);

        // Создание пользователя
        // const user = await prisma.user.create({
        //   data: {
        //     username,
        //     email,
        //     password: hashedPassword,
        //   },
        //   select: {
        //     id: true,
        //     username: true,
        //     email: true,
        //     createdAt: true,
        //   }
        // });

        // Создание JWT токена
        // const token = jwt.sign(
        //   { userId: user.id },
        //   process.env.JWT_SECRET!,
        //   { expiresIn: '7d' }
        // );

        // Симуляция для примера
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            username,
            email,
            createdAt: new Date().toISOString(),
        };

        return NextResponse.json({
            message: 'User created successfully',
            user,
            // token,
        }, { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}