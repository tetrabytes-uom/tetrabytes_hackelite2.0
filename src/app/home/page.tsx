import React from "react";
import Navbar from "@/components/HomePage/Navbar";

interface HomeProps {
  title?: string;
  description?: string;
}

const Home: React.FC<HomeProps> = ({
  title = "Welcome to PlanBee!",
  description = "Customize you own study plan and boost your productivity with AI.",
}) => {
  return (
    <div>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
            <h1 className="text-4xl font-bold text-black">{title}</h1>
            <p className="mt-4 text-lg text-gray-700">{description}</p>
        </main>
    </div>
  );
};

export default Home;
