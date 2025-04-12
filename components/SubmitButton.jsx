export const SubmitButton = ({ loading }) => (
    <div className="flex justify-center mt-6">
      <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );