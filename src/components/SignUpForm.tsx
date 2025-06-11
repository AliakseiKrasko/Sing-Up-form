'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';
import { signUp, clearError } from '@/lib/store/authSlice';
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

        // Clear specific field error when user starts typing
        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!agreedToTerms) {
            alert('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        dispatch(signUp(formData));
    };

    const handleGoogleSignUp = () => {
        // Implement Google OAuth
        window.location.href = '/api/auth/google';
    };

    const handleGithubSignUp = () => {
        // Implement GitHub OAuth
        window.location.href = '/api/auth/github';
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-lg p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white text-center mb-8">Sign Up</h2>

                {/* OAuth Buttons */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={handleGoogleSignUp}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <FaGoogle className="mr-2" />
                        Google
                    </button>
                    <button
                        onClick={handleGithubSignUp}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <FaGithub className="mr-2" />
                        GitHub
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-gray-400">or</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-600 text-white p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your username"
                        />
                        {formErrors.username && (
                            <p className="text-red-400 text-sm mt-1">{formErrors.username}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                        {formErrors.email && (
                            <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {formErrors.password && (
                            <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
                        )}
                    </div>

                    {/* Password Confirmation */}
                    <div>
                        <label className="block text-gray-300 text-sm mb-2">Password confirmation</label>
                        <div className="relative">
                            <input
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                name="passwordConfirmation"
                                value={formData.passwordConfirmation}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 pr-12 focus:outline-none focus:border-blue-500"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {formErrors.passwordConfirmation && (
                            <p className="text-red-400 text-sm mt-1">{formErrors.passwordConfirmation}</p>
                        )}
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                            I agree to the{' '}
                            <a href="/terms" className="text-blue-400 hover:underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-blue-400 hover:underline">
                                Privacy Policy
                            </a>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                    <p className="text-gray-400">
                        Do you have an account?{' '}
                        <a href="/signin" className="text-blue-400 hover:underline">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;