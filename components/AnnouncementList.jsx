import { useEffect, useState } from 'react';

export default function AnnouncementList({ role, gradeId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const res = await fetch(`/api/announcements?role=${role}&gradeId=${gradeId || ''}`);
      const data = await res.json();
      setAnnouncements(data);
      setLoading(false);
    };

    fetchAnnouncements();
  }, [role, gradeId]);

  if (loading) return <p className="text-center">Loading announcements...</p>;

  if (announcements.length === 0) {
    return <p className="text-center text-gray-500">No announcements found.</p>;
  }

  return (
    <div className="space-y-4">
      {announcements.map((a) => (
        <div key={a.id} className="border p-4 rounded shadow bg-white">
          <h2 className="text-xl font-semibold">{a.title}</h2>
          <p className="text-gray-700 mt-2">{a.message}</p>
          <div className="text-xs text-gray-500 mt-2">{new Date(a.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
