'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../lib/hooks/redux';
import { signUp, clearError } from '../lib/store/authSlice';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';

interface FormData {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
}

const SignUpForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.passwordConfirmation) {
            errors.passwordConfirmation = 'Please confirm your password';
        } else if (formData.password !== formData.passwordConfirmation) {
            errors.passwordConfirmation = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));