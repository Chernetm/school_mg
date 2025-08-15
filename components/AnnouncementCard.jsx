import { useUser } from '@/context/UserContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { FiCalendar, FiTrash2 } from 'react-icons/fi';
import ConfirmModal from './ConfirmModal';

dayjs.extend(relativeTime);

export default function AnnouncementCard({ announcement }) {
  const { user } = useUser();
  const currentStaffID = user?.staffID;
  console.log("Announcement User", user)
  const { id, title, message, createdAt, staff, staffID } = announcement;

  const [showConfirm, setShowConfirm] = useState(false); // State to control the ConfirmModal visibility
  const [status, setStatus] = useState(''); // State for feedback (success/error messages)

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/announcement/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStatus('✅ Announcement deleted successfully!');
        // Optionally, you can remove the item from the UI without a reload by lifting the state up or using context
        // setTimeout(() => window.location.reload(), 2000); // Refresh the page after a short delay
      } else {
        setStatus('❌ Failed to delete announcement.');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Error deleting announcement.');
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
        {Number(currentStaffID) === staffID && (
          <button
            onClick={() => setShowConfirm(true)} // Open the confirm modal
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

      {/* Status Message */}
      {status && <p className="text-center text-sm mt-4 text-gray-800 font-medium">{status}</p>}

      {/* Confirm Modal for Deletion */}
      <ConfirmModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)} // Close the modal without doing anything
        onConfirm={() => {
          handleDelete(); // Call the delete function if confirmed
          setShowConfirm(false); // Close the modal after confirmation
        }}
        title="Delete this announcement?"
        message="Once deleted, this cannot be recovered."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
