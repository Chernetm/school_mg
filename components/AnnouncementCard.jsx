import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FiCalendar, FiTrash2 } from 'react-icons/fi';

dayjs.extend(relativeTime);

export default function AnnouncementCard({ announcement, currentStaffID }) {
  const { id, title, message, createdAt, staff, staffID } = announcement;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const res = await fetch(`/api/announcement/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        window.location.reload(); // or lift state up and remove it locally
      } else {
        alert('Failed to delete announcement');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting announcement');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 max-w-md w-full mx-auto relative">
      {/* Staff Info */}
      <div className="flex items-center gap-4 mb-3">
        <img
          src={staff?.image || '/default-user.png'}
          alt={`${staff?.firstName} ${staff?.middleName}`}
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">
            {staff?.firstName} {staff?.middleName}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <FiCalendar className="text-sm" />
            {dayjs(createdAt).fromNow()}
          </span>
        </div>

        {/* Delete button (if owner) */}
        {currentStaffID === staffID && (
          <button
            onClick={handleDelete}
            className="ml-auto text-red-500 hover:text-red-700"
            title="Delete"
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      {/* Title & Message */}
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-700 text-sm">{message}</p>
    </div>
  );
}
