"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");

    if (!tx_ref) {
      setStatus("error");
      setMessage("Missing transaction reference.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/payment/callback?tx_ref=${tx_ref}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Payment verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-xl shadow-lg bg-white text-center">
      {status === "verifying" && <p className="text-blue-600 text-lg">Verifying payment...</p>}
      {status === "success" && (
        <div className="text-green-600 text-xl font-semibold">
          ✅ {message}
        </div>
      )}
      {status === "error" && (
        <div className="text-red-600 text-xl font-semibold">
          ❌ {message}
        </div>
      )}
    </div>
  );
}
