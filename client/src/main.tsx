import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Simple test component to verify React is working
function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          HKT - Home Krypto Token
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Real Estate Investment Platform
        </p>
        <div className="space-y-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900">Investment Calculator</h2>
            <p className="text-blue-700">Calculate your monthly investment returns</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-green-900">Portfolio Dashboard</h2>
            <p className="text-green-700">Track your real estate investments</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-purple-900">Property Showcase</h2>
            <p className="text-purple-700">Explore premium properties worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
