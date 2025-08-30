'use client';

import Spinner from '@/components/Loading/Spinner/page';
import { useEffect, useState } from 'react';

export default function BorrowedBookList() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/library/book/borrow/list')
      .then((res) => res.json())
      .then((data) => {
        setBorrowedBooks(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching borrowed books:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  if (!borrowedBooks.length) {
    return <p className="text-center text-gray-500">No borrowed books available.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">📖 Borrowed Books</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Book</th>
              <th className="border p-2">Student</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Section</th>
              <th className="border p-2">Borrowed</th>
              <th className="border p-2">Returned</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((borrow) => {
              // Assuming the student has at least one registration and we want the first one
              const registration = borrow.student.registrations[0]; // Access first registration

              // Get current date and compare with return date
              const returnDate = borrow.returnDate ? new Date(borrow.returnDate) : null;
              const currentDate = new Date();
              const isReturnDatePast = returnDate && returnDate < currentDate; // Check if return date is in the past

              return (
                <tr key={borrow.id}>
                  <td className="border p-2">{borrow.book.title}</td>
                  <td className="border p-2">
                    {borrow.student.firstName} {borrow.student.middleName} {borrow.student.lastName} (ID: {borrow.student.studentID})
                  </td>
                  <td className="border p-2">
                    {registration ? registration.grade : 'N/A'}
                  </td>
                  <td className="border p-2">
                    {registration ? registration.section : 'N/A'}
                  </td>
                  <td className="border p-2">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </td>
                  {/* Apply red text color if return date is in the past */}
                  <td
                    className={`border p-2 ${isReturnDatePast ? 'text-red-500' : ''}`}
                  >
                    {borrow.returnDate
                      ? new Date(borrow.returnDate).toLocaleDateString()
                      : 'Not Returned'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

