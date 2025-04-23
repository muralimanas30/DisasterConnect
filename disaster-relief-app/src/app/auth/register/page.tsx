"use client"
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '@/lib/slice/userSlice';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/redux-store';

const RegisterPage: React.FC = () => {
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
            email: formData.get('email'),
            password: formData.get('password'),
            phoneNumber: formData.get('phoneNumber'),
            role: formData.get('role'),
            location: {
                type: "Point",
                coordinates: [location?.lat, location?.lng]
            }
        };

        try {
            const response = await dispatch(registerUser(data));
            if (registerUser.fulfilled.match(response)) {
                router.push('/');
            } else {
                setErrorMsg(response.payload as string);
            }
        } catch {
            setErrorMsg('An error occurred during registration. Please try again.');
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 to-blue-200">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-1 font-semibold text-gray-700">Username</label>
                        <input type="text" id="username" name="username" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email</label>
                        <input type="email" id="email" name="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block mb-1 font-semibold text-gray-700">Phone Number</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Password</label>
                        <input type="password" id="password" name="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Role</label>
                        <div className="flex justify-around">
                            <label className="text-black inline-flex items-center gap-2">
                                <input type="radio" id="role-victim" name="role" value="victim" required className="accent-blue-600" />
                                Victim
                            </label>
                            <label className="text-black inline-flex items-center gap-2">
                                <input type="radio" id="role-ngo" name="role" value="ngo" className="accent-blue-600" />
                                NGO
                            </label>
                            <label className="text-black inline-flex items-center gap-2">
                                <input type="radio" id="role-volunteer" name="role" value="volunteer" className="accent-blue-600" />
                                Volunteer
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition duration-200 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading && <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    {(error || errorMsg) && (
                        <p className="text-red-500 text-sm text-center">{error || errorMsg}</p>
                    )}
                </form>
                <div className="mt-6 text-center text-sm text-gray-700">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => router.push('/auth/login')}
                        className="text-blue-600 hover:underline"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
