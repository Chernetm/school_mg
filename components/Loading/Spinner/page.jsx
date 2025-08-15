'use client';
import { React } from 'react';
import './loader.css'; // Make sure this path is correct

export default function Spinner() {
  return (

    // <div className="lds-roller">
    //   <div></div><div></div><div></div><div></div>
    //   <div></div><div></div><div></div><div></div>
    // </div>
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="lds-roller">
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  );
}
