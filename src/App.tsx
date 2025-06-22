import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SalesManagement from './components/SalesManagement';
import ExpenseManagement from './components/ExpenseManagement';
import EmployeeManagement from './components/EmployeeManagement';
import Reports from './components/Reports';
import { storage } from './utils/storage';
import { generateId } from './utils/calculations';

// Sample data generator
const generateSampleData = async () => {
  try {
    // Check if data already exists
    const existingSales = await storage.getData('sales');
    const existingExpenses = await storage.getData('expenses');
    const existingEmployees = await storage.getData('employees');

    if (existingSales.length > 0 || existingExpenses.length > 0 || existingEmployees.length > 0) {
      return; // Data already exists
    }

    const sampleSales = [
      {
        id: generateId(),
        date: new Date('2024-01-15'),
        product: {
          id: generateId(),
          name: 'iPhone 15 Pro',
          category: 'smartphone',
          brand: 'Apple',
          model: 'iPhone 15 Pro',
          serialNumber: 'APL123456789',
          imei: '356789012345678',
          warrantyPeriod: 12
        },
        quantity: 1,
        unitPrice: 99999,
        totalAmount: 99999,
        paymentMethod: 'card' as const,
        customerName: 'Rajesh Kumar',
        customerPhone: '+91-9876543210',
        salesPerson: 'Amit Sharma',
        commission: 4999.95,
        isReturned: false,
        warrantyStartDate: new Date('2024-01-15'),
        notes: 'Customer purchased extended warranty'
      },
      {
        id: generateId(),
        date: new Date('2024-01-16'),
        product: {
          id: generateId(),
          name: 'Samsung Galaxy S24',
          category: 'smartphone',
          brand: 'Samsung',
          model: 'Galaxy S24',
          serialNumber: 'SAM987654321',
          imei: '356789012345679',
          warrantyPeriod: 12
        },
        quantity: 1,
        unitPrice: 79999,
        totalAmount: 79999,
        paymentMethod: 'emi' as const,
        customerName: 'Priya Patel',
        customerPhone: '+91-9876543211',
        salesPerson: 'Neha Singh',
        commission: 3999.95,
        isReturned: false,
        warrantyStartDate: new Date('2024-01-16'),
        notes: 'EMI for 12 months'
      },
      {
        id: generateId(),
        date: new Date('2024-01-17'),
        product: {
          id: generateId(),
          name: 'MacBook Air M3',
          category: 'laptop',
          brand: 'Apple',
          model: 'MacBook Air M3',
          serialNumber: 'MBA123456789',
          imei: '',
          warrantyPeriod: 12
        },
        quantity: 1,
        unitPrice: 134999,
        totalAmount: 134999,
        paymentMethod: 'card' as const,
        customerName: 'Arjun Reddy',
        customerPhone: '+91-9876543212',
        salesPerson: 'Amit Sharma',
        commission: 6749.95,
        isReturned: false,
        warrantyStartDate: new Date('2024-01-17'),
        notes: 'Student discount applied'
      }
    ];

    const sampleExpenses = [
      {
        id: generateId(),
        date: new Date('2024-01-10'),
        category: 'rent',
        subcategory: 'Shop Rent',
        amount: 50000,
        description: 'Monthly shop rent for January 2024',
        vendor: 'Property Owner',
        paymentMethod: 'online' as const,
        status: 'approved' as const,
        approvedBy: 'Admin',
        isRecurring: true,
        recurringFrequency: 'monthly' as const
      },
      {
        id: generateId(),
        date: new Date('2024-01-12'),
        category: 'inventory',
        subcategory: 'Product Purchase',
        amount: 200000,
        description: 'Purchase of smartphones from distributor',
        vendor: 'Tech Distributors Ltd',
        paymentMethod: 'card' as const,
        status: 'approved' as const,
        approvedBy: 'Admin',
        isRecurring: false
      },
      {
        id: generateId(),
        date: new Date('2024-01-14'),
        category: 'marketing',
        subcategory: 'Social Media',
        amount: 15000,
        description: 'Facebook and Instagram advertising campaign',
        vendor: 'Digital Marketing Agency',
        paymentMethod: 'online' as const,
        status: 'pending' as const,
        isRecurring: false
      },
      {
        id: generateId(),
        date: new Date('2024-01-18'),
        category: 'salary',
        subcategory: 'Basic Salary',
        amount: 75000,
        description: 'Monthly salary for all employees',
        vendor: '',
        paymentMethod: 'online' as const,
        status: 'approved' as const,
        approvedBy: 'Admin',
        isRecurring: true,
        recurringFrequency: 'monthly' as const
      }
    ];

    const sampleEmployees = [
      {
        id: generateId(),
        name: 'Amit Sharma',
        position: 'Sales Manager',
        department: 'Sales',
        baseSalary: 45000,
        commissionRate: 7,
        joinDate: new Date('2023-06-15'),
        isActive: true,
        phone: '+91-9876543220',
        email: 'amit.sharma@company.com',
        address: '123 Main Street, Mumbai, Maharashtra',
        emergencyContact: '+91-9876543221',
        bankAccount: '1234567890',
        panNumber: 'ABCDE1234F',
        aadharNumber: '1234-5678-9012'
      },
      {
        id: generateId(),
        name: 'Neha Singh',
        position: 'Senior Sales Executive',
        department: 'Sales',
        baseSalary: 35000,
        commissionRate: 5,
        joinDate: new Date('2023-08-20'),
        isActive: true,
        phone: '+91-9876543222',
        email: 'neha.singh@company.com',
        address: '456 Park Avenue, Delhi, Delhi',
        emergencyContact: '+91-9876543223',
        bankAccount: '2345678901',
        panNumber: 'FGHIJ5678K',
        aadharNumber: '2345-6789-0123'
      },
      {
        id: generateId(),
        name: 'Rajesh Patel',
        position: 'Technical Support',
        department: 'Technical',
        baseSalary: 30000,
        commissionRate: 2,
        joinDate: new Date('2023-09-10'),
        isActive: true,
        phone: '+91-9876543224',
        email: 'rajesh.patel@company.com',
        address: '789 Tech Street, Bangalore, Karnataka',
        emergencyContact: '+91-9876543225',
        bankAccount: '3456789012',
        panNumber: 'KLMNO9012P',
        aadharNumber: '3456-7890-1234'
      }
    ];

    // Add sample data to Supabase
    for (const sale of sampleSales) {
      await storage.addItem('sales', sale);
    }
    
    for (const expense of sampleExpenses) {
      await storage.addItem('expenses', expense);
    }

    for (const employee of sampleEmployees) {
      await storage.addItem('employees', employee);
    }

    console.log('Sample data generated successfully');
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Generate sample data on first load
        await generateSampleData();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsInitialized(true); // Still allow app to load
      }
    };

    initializeApp();
  }, []);

  const renderCurrentPage = () => {
    if (!isInitialized) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Initializing Application</h2>
          <p className="text-gray-600">Setting up your financial management system...</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'sales':
        return <SalesManagement />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'reports':
        return <Reports />;
      case 'employees':
        return <EmployeeManagement />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">System settings and configuration coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;