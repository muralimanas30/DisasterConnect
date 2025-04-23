"use client";
import { useRouter } from "next/navigation";

export default function ContactPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8 md:px-8 lg:px-16">
            <div className="card w-full max-w-4xl shadow-2xl bg-base-100 border border-base-300">
                <div className="card-body px-4 py-6 sm:px-6 md:px-8 lg:px-12">
                    <h1 className="card-title text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
                        Contact Us
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-base-content">
                        Have questions or need assistance? We're here to help. Reach out to us using the information below:
                    </p>

                    <div className="mt-6">
                        <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg md:text-xl text-base-content">
                            <li>Email: <a href="mailto:support@drcp.com" className="text-blue-500 hover:underline">support@drcp.com</a></li>
                            <li>Phone: +1 (800) 123-4567</li>
                            <li>Address: 123 Disaster Relief Lane, Cityville, Country</li>
                        </ul>
                    </div>

                    <div className="card-actions justify-start mt-6">
                        <button
                            className="btn btn-outline btn-primary"
                            onClick={() => router.back()} // Go back to the previous page
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}