import InputField from "./InputField";
export const ParentFields = ({ formData, handleChange }) => (
    <>
      <div className="flex space-x-6">
        <InputField label="First Name" name="parent.firstName" type="text" value={formData.firstName} onChange={handleChange} />
        <InputField label="Last Name" name="parent.lastName" type="text" value={formData.lastName} onChange={handleChange} />
      </div>
      <div className="flex space-x-6">
        <InputField label="Email" name="parent.email" type="email" value={formData.email} onChange={handleChange} />
        <InputField label="Phone Number" name="parent.phoneNumber" type="text" value={formData.phoneNumber} onChange={handleChange} />
        <InputField label="Address" name="parent.address" type="text" value={formData.address} onChange={handleChange} />
      </div>
    </>
  );