'use client';
import Spinner from '@/components/Loading/Spinner/page';
import { React } from 'react';
// import './loader.css'; // Make sure this path is correct

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* <div className="loader"></div> */}
      <Spinner />
    </div>
  );
}

