// src/PlaceholderPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="p-8">
      <Link 
        to="/"
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">This page is under construction.</p>
    </div>
  );
};

export default PlaceholderPage;