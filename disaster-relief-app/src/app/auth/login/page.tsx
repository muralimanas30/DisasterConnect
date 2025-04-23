"use client"
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, UserState } from '@/lib/slice/userSlice';
import { redirect, useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/redux-store';

const LoginPage: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const { loading, error } = useSelector((state: RootState) => state.user);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
            location: {
                type: "point",
                coordinates: [location?.lat, location?.lng]
            }
        };

        try {
            const response = await dispatch(loginUser(data));
            if (loginUser.fulfilled.match(response)) {
                router.push('/');
            } else {
                setErrorMsg(response.payload as string);
            }
        } catch {
            setErrorMsg('An error occurred during login. Please try again.');
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            });
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-purple-200">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-1 font-semibold text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition duration-200 ${loading ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {loading && <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {(error || errorMsg) && (
                        <p className="text-red-500 text-sm text-center">{error || errorMsg}</p>
                    )}
                </form>
                <div className="mt-6 text-center text-sm text-gray-700">
                    New here?{" "}
                    <button
                        type="button"
                        onClick={() => router.push('/auth/register')}
                        className="text-purple-600 hover:underline"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
