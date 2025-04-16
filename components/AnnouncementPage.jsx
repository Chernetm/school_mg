'use client';

import AnnouncementList from '@/components/AnnouncementList';
import { useEffect, useState } from 'react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentStaffID, setCurrentStaffID] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log('Current Staff ID:', currentStaffID); 

  // Fetch announcements and auth info
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch announcements
        const annRes = await fetch('/api/announcement/get/all');
        const announcementsData = await annRes.json();
        setAnnouncements(announcementsData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading announcements...</p>;

  if (!announcements.length) {
    return <p className="text-center text-gray-500">No announcements available.</p>;
  }

  return (
    <div className="space-y-4 py-6 px-4">
      <AnnouncementList announcements={announcements} currentStaffID={currentStaffID} />
    </div>
  );
}
