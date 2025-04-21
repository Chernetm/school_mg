'use client';
import { React } from 'react';
import './loader.css'; // Make sure this path is correct

export default function UploadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="loader"></div>
    </div>
  );
}

