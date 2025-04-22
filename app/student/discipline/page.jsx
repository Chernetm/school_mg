"use client";
import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiClock, FiUser } from 'react-icons/fi';

const DisciplineRecordList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/discipline')
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch discipline records:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-sm text-gray-500">Loading...</div>;
  }

  if (records.error) {
    return <div className="text-center mt-10 text-red-500 text-sm">{records.error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-12 px-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">📋 Discipline Records</h1>
      {records.length === 0 ? (
        <div className="text-gray-400 text-center text-base">No discipline records found.</div>
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <div
              key={record.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-2 text-rose-600 font-medium text-sm mb-1">
                <FiAlertCircle className="text-base mt-[2px]" />
                <p className="leading-tight">{record.message}</p>
              </div>

              <div className="flex items-center gap-2 text-gray-700 text-sm mb-1">
                <FiUser className="text-sm" />
                <span className="truncate">
                  {record.student.firstName} {record.student.middleName} {record.student.lastName}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <FiClock className="text-xs" />
                <span>{new Date(record.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisciplineRecordList;
