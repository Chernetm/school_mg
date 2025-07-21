'use client';

export default function LoadingButton({ loading, text, loadingText = 'Loading...', ...props }) {
  return (
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full mt-4 flex justify-center items-center"
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="w-5 h-5 animate-spin mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 0 0 8-8V4a8 8 0 0 0-8 8h8z"
              stroke="none"
            />
          </svg>
          {loadingText}
        </span>
      ) : (
        text
      )}
    </button>
  );
}
