import AnnouncementCard from './AnnouncementCard';
export default function AnnouncementsList({ announcements, currentStaffID }) {
  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
        />
      ))}
    </div>
  );
}
