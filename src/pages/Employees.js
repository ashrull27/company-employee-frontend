// src/pages/Employees.js
import { useState, useEffect, useCallback } from 'react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Wrap fetchEmployees in useCallback to memoize it
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Now you can safely include fetchEmployees in the dependency array
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div>
      {/* Your component JSX here */}
    </div>
  );
}