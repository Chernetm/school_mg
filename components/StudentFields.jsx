import Image from "next/image";
import InputField from "./InputField";

export const StudentFields = ({ formData, handleChange, handleFileChange, previewImage }) => (
  <>
    {/* Name fields */}
    <div className="flex space-x-6">
      <InputField
        label="First Name"
        name="student.firstName"
        type="text"
        value={formData.firstName}
        onChange={handleChange}
      />
      <InputField
        label="Middle Name"
        name="student.middleName"
        type="text"
        value={formData.middleName}
        onChange={handleChange}
      />
      <InputField
        label="Last Name"
        name="student.lastName"
        type="text"
        value={formData.lastName}
        onChange={handleChange}
      />
    </div>

    {/* Age / Phone / Email */}
    <div className="flex space-x-6">
      <InputField
        label="Age"
        name="student.age"
        type="number"
        value={formData.age}
        onChange={handleChange}
      />
      <InputField
        label="Phone Number"
        name="student.phoneNumber"
        type="text"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <InputField
        label="Email"
        name="student.email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
    </div>

    {/* Grade / Year / Stream */}
    <div className="flex space-x-6">
      {/* Grade */}
      <div className="flex flex-col w-full">
        <label className="block text-sm font-medium text-gray-700">Grade</label>
        <select
          name="student.grade"
          value={formData.grade}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Grade</option>
          {[9, 10, 11, 12].map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div className="flex flex-col w-full">
        <label className="block text-sm font-medium text-gray-700">Year</label>
        <select
          name="student.year"
          value={formData.year}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Year</option>
          {Array.from({ length: 9 }, (_, i) => 2018 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Stream */}
      <div className="flex flex-col w-full">
        <label className="block text-sm font-medium text-gray-700">Stream</label>
        <select
          name="student.stream"
          value={formData.stream}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Stream</option>
          {["SCIENCE", "NATURAL", "SOCIAL"].map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* StudentID / Image / Gender in one row */}
    <div className="flex space-x-6">
      {/* StudentID */}
      <div className="w-full">
        <InputField
          label="StudentID"
          name="student.studentID"
          type="text"
          value={formData.studentID}
          onChange={handleChange}
        />
      </div>

      {/* Image upload */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700">Profile Image (optional)</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
        />
        {previewImage && (
          <Image
            src={previewImage}
            alt="Profile preview"
            width={64}
            height={64}
            className="rounded-full border mt-2"
          />
        )}
      </div>

      {/* Gender */}
      <div className="w-full">
  <label className="block font-medium text-gray-700 mb-2">Gender</label>
  <div className="flex gap-4">
    {["MALE", "FEMALE"].map((genderOption) => (
      <label
        key={genderOption}
        className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer border 
          ${formData.gender === genderOption
            ? "bg-blue-100 border-blue-500 text-blue-700"
            : "bg-white border-gray-300 text-gray-700"
          } transition`}
      >
        <input
          type="radio"
          name="student.gender"
          value={genderOption}
          checked={formData.gender === genderOption}
          onChange={(e) => handleChange(e, genderOption)}
          className="hidden"
        />
        {genderOption}
      </label>
    ))}
  </div>
</div>

    </div>
  </>
);
