// src/components/DashboardFooter.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-5 border-gray-200 py-4 px-6 text-center text-sm text-gray-700">
      © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
    </footer>
  );
}
