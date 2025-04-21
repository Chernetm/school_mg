'use client';

import Spinner from '@/components/Loading/Spinner/page';
import { useEffect, useState } from 'react';

export default function AllBookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/library/book/list')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });
  }, []);
  
    if (loading) return <Spinner />;
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">📚 All Registered Books</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Grade</th>
            <th className="border p-2">Copies</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="border p-2">{book.id}</td>
              <td className="border p-2">{book.title}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">{book.grade}</td>
              <td className="border p-2">{book.copies}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
