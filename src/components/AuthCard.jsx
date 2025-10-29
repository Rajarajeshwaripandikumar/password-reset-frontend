import React from "react";
import { Link } from "react-router-dom";

export default function AuthCard({ title, subtitle, children, cta }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{subtitle}</p>
        </div>

        <div
          className="w-[420px] p-6 bg-panel rounded-2xl border border-softBorder shadow-soft"
          style={{ borderColor: "#111827" }}
        >
          {children}

          <div className="mt-6 text-sm text-gray-600">
            {cta}
          </div>
        </div>
      </div>
    </div>
  );
}
