
export const Section = ({ title, children }) => (
    <>
      <h2 className="text-lg font-semibold text-blue-500">{title}</h2>
      {children}
    </>
  );