import Image from "next/image";
import InputField from "./InputField";

export const StudentFields = ({ formData, handleChange, handleFileChange, previewImage }) => (
  <>
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
    <div className="flex space-x-6">
      <InputField
        label="Grade"
        name="student.grade"
        type="number"
        value={formData.grade}
        onChange={handleChange}
      />
      <InputField
        label="Year"
        name="student.year"
        type="number"
        value={formData.year}
        onChange={handleChange}
      />
      <InputField
        label="Stream"
        name="student.stream"
        type="text"
        value={formData.stream}
        onChange={handleChange}
      />
    </div>

    <InputField
      label="StudentID"
      name="student.studentID"
      type="text"
      value={formData.studentID}
      onChange={handleChange}
    />
    <div>
      <label className="block text-sm font-medium text-gray-700">Profile Image</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
      {previewImage && <Image src={previewImage} alt="Profile preview" width={128} height={128} className="rounded-full border mt-2" />}
    </div>
  </>
);

// import Image from "next/image";

// import InputField from "./InputField";
// export const StudentFields = ({ formData, handleChange, handleFileChange, previewImage }) => (
//     <>
//       <div className="flex space-x-6">
//         <InputField label="First Name" name="student.firstName" type="text" value={formData.firstName} onChange={handleChange} />
//         <InputField label="Middle Name" name="student.middleName" type="text" value={formData.middleName} onChange={handleChange} />
//         <InputField label="Last Name" name="student.lastName" type="text" value={formData.lastName} onChange={handleChange} />
//       </div>
//       <div className="flex space-x-6">
//         <InputField label="Age" name="student.age" type="number" value={formData.age} onChange={handleChange} />
//         <InputField label="Phone Number" name="student.phoneNumber" type="text" value={formData.phoneNumber} onChange={handleChange} />
//         <InputField label="Email" name="student.email" type="email" value={formData.email} onChange={handleChange} />
//       </div>
//       <div className="flex space-x-6">
//         <InputField label="Grade" name="student.grade" type="text" value={formData.grade} onChange={handleChange} />
//         <InputField label="Year" name="student.year" type="number" value={formData.year} onChange={handleChange} />
//         <InputField label="Stream" name="student.stream" type="text" value={formData.stream} onChange={handleChange} />
//       </div>
      
//       <InputField label="StudentID" name="student.studentID" type="text" value={formData.studentID} onChange={handleChange} />
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Profile Image</label>
//         <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
//         {previewImage && <Image src={previewImage} alt="Profile preview" width={128} height={128} className="rounded-full border mt-2" />}
//       </div>
//     </>
//   );