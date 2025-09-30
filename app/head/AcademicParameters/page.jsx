import React from "react";
import YearManager from "@/components/AcademicParameters/year/page";
import SemesterManager from "@/components/AcademicParameters/semester/page";
export default  function AcademicParameters() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Academic Parameters</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Manage Academic Years</h2>
          <YearManager />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Manage Semesters</h2>
          <SemesterManager />
        </div>
      </div>
    </div>
  );
}