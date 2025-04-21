"use client";

import Spinner from "@/components/Loading/Spinner/page";
import { useEffect, useState } from "react";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/head/message");

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (messages.length === 0 && !error) {
    return <p className="text-center text-gray-500">No messages available.</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Messages from Users</h1>

      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li key={message.id} className="border-b pb-4">
              <h3 className="font-semibold">{message.name}</h3>
              <p className="text-sm text-gray-600">{message.email}</p>
              <p className="mt-2">{message.message}</p>
              <p className="mt-2 text-xs text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
