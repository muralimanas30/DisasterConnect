"use client";
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8 md:px-8 lg:px-16">
            <div className="card w-full max-w-4xl shadow-2xl bg-base-100 border border-base-300">
                <div className="card-body px-4 py-6 sm:px-6 md:px-8 lg:px-12">
                    <h1 className="card-title text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
                        About Us
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-base-content">
                        The Disaster Relief Coordination Platform (DRCP) is a comprehensive system designed to improve disaster response and recovery efforts. Our mission is to connect victims, volunteers, and administrators in a seamless and efficient way to ensure timely assistance during emergencies.
                    </p>
                    <p className="text-base sm:text-lg md:text-xl text-base-content mt-4">
                        DRCP provides tools for victims to report incidents, volunteers to accept tasks, and administrators to manage operations. By leveraging technology, we aim to reduce response times and improve the overall coordination of disaster relief efforts.
                    </p>
                    <p className="text-base sm:text-lg md:text-xl text-base-content mt-4">
                        Whether it's a natural disaster, a humanitarian crisis, or a local emergency, DRCP is here to help communities recover and rebuild.
                    </p>

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