import React from "react";
import "../styles/Home.css"

const StaffCard = ({ staff }) => {
  return (
    <div className="staff-card">
      <img
        src={staff.image}
        alt={staff.name}
        className="w-full h-32 object-cover rounded-t-lg"
      />
      <h2 className="text-xl font-semibold mt-2">{staff.name}</h2>
      <p className="text-gray-600">Roles: {staff.position}</p>
      <p className="text-gray-600">Department: {staff.department}</p>
    </div>
  );
}

export default StaffCard;