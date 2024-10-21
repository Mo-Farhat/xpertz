import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { User, Mail, Phone, Calendar, Edit, Save } from 'lucide-react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
}

const EmployeeSelfService: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'employees'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data() as Employee;
          employeeData.id = querySnapshot.docs[0].id;
          setEmployee(employeeData);
          setEditedEmployee(employeeData);
        }
      }
    };

    fetchEmployeeData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedEmployee && employee) {
      try {
        await updateDoc(doc(db, 'employees', employee.id), editedEmployee);
        setEmployee(editedEmployee);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating employee data: ", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedEmployee) {
      setEditedEmployee({
        ...editedEmployee,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Employee Self-Service</h3>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 flex items-center">
          <User className="mr-2" />
          <span className="font-bold">Name:</span>
          {isEditing ? (
            <div className="ml-2">
              <input
                type="text"
                name="firstName"
                value={editedEmployee?.firstName}
                onChange={handleChange}
                className="border rounded px-2 py-1 mr-2"
              />
              <input
                type="text"
                name="lastName"
                value={editedEmployee?.lastName}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              />
            </div>
          ) : (
            <span className="ml-2">{`${employee.firstName} ${employee.lastName}`}</span>
          )}
        </div>
        <div className="mb-4 flex items-center">
          <Mail className="mr-2" />
          <span className="font-bold">Email:</span>
          <span className="ml-2">{employee.email}</span>
        </div>
        <div className="mb-4 flex items-center">
          <Phone className="mr-2" />
          <span className="font-bold">Phone:</span>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={editedEmployee?.phone}
              onChange={handleChange}
              className="border rounded px-2 py-1 ml-2"
            />
          ) : (
            <span className="ml-2">{employee.phone}</span>
          )}
        </div>
        <div className="mb-4 flex items-center">
          <Calendar className="mr-2" />
          <span className="font-bold">Date of Birth:</span>
          {isEditing ? (
            <input
              type="date"
              name="dateOfBirth"
              value={editedEmployee?.dateOfBirth}
              onChange={handleChange}
              className="border rounded px-2 py-1 ml-2"
            />
          ) : (
            <span className="ml-2">{employee.dateOfBirth}</span>
          )}
        </div>
        <div className="mb-4">
          <span className="font-bold">Address:</span>
          {isEditing ? (
            <textarea
              name="address"
              value={editedEmployee?.address}
              onChange={(e) => handleChange(e as any)}
              className="border rounded px-2 py-1 w-full mt-2"
            />
          ) : (
            <p className="mt-2">{employee.address}</p>
          )}
        </div>
        <div className="mb-4">
          <span className="font-bold">Emergency Contact:</span>
          {isEditing ? (
            <input
              type="text"
              name="emergencyContact"
              value={editedEmployee?.emergencyContact}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full mt-2"
            />
          ) : (
            <p className="mt-2">{employee.emergencyContact}</p>
          )}
        </div>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            <Save className="mr-2" size={18} />
            Save Changes
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            <Edit className="mr-2" size={18} />
            Edit Information
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeSelfService;