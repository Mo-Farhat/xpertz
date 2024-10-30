import React, { useState } from 'react';
import { Users, DollarSign, Calendar, UserPlus, BarChart2, Settings, Wallet } from 'lucide-react';
import EmployeeDatabase from './HRManagement/EmployeeDatabase';
import PayrollManagement from './HRManagement/PayrollManagement';
import AttendanceLeaveManagement from './HRManagement/AttendanceLeaveManagement';
import RecruitmentOnboarding from './HRManagement/RecruitmentOnboarding';
import PerformanceEvaluation from './HRManagement/PerformanceEvaluation';
import EmployeeSelfService from './HRManagement/EmployeeSelfService';
import LoanManagement from './HRManagement/LoanManagement';

const HRManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('employeeDatabase');

  const tabs = [
    { id: 'employeeDatabase', name: 'Employee Database', icon: <Users /> },
    { id: 'payrollManagement', name: 'Payroll Management', icon: <DollarSign /> },
    { id: 'attendanceLeave', name: 'Attendance & Leave', icon: <Calendar /> },
    { id: 'recruitmentOnboarding', name: 'Recruitment & Onboarding', icon: <UserPlus /> },
    { id: 'performanceEvaluation', name: 'Performance Evaluation', icon: <BarChart2 /> },
    { id: 'employeeSelfService', name: 'Employee Self-Service', icon: <Settings /> },
    { id: 'loanManagement', name: 'Loan Management', icon: <Wallet /> },
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case 'employeeDatabase':
        return <EmployeeDatabase />;
      case 'payrollManagement':
        return <PayrollManagement />;
      case 'attendanceLeave':
        return <AttendanceLeaveManagement />;
      case 'recruitmentOnboarding':
        return <RecruitmentOnboarding />;
      case 'performanceEvaluation':
        return <PerformanceEvaluation />;
      case 'employeeSelfService':
        return <EmployeeSelfService />;
      case 'loanManagement':
        return <LoanManagement />;
      default:
        return <EmployeeDatabase />;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">HR Management</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="text-3xl mb-2">{tab.icon}</div>
            <span className="text-sm text-center">{tab.name}</span>
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {renderComponent()}
      </div>
    </div>
  );
};

export default HRManagement;