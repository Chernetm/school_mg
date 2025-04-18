'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FinancialRecordPage() {
  const { id: studentID } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await fetch("/api/student/fee");
        const data = await res.json();
        setRecords(data.fees || []);
      } catch (error) {
        console.error('Error fetching fees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [studentID]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Financial Record</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-2 px-4">Month</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Amount Paid</th>
                <th className="py-2 px-4">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((fee) => (
                <tr key={fee.month + fee.year} className="border-t">
                  <td className="py-2 px-4">{fee.month}</td>
                  <td className={`py-2 px-4 font-semibold ${fee.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                    {fee.status}
                  </td>
                  <td className="py-2 px-4">{fee.amountPaid ? `ETB ${fee.amountPaid}` : '-'}</td>
                  <td className="py-2 px-4">{fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
