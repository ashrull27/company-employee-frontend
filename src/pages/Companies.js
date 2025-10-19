// src/pages/Companies.js
import { useState, useEffect, useCallback } from 'react';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Wrap fetchCompanies in useCallback to memoize it
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/companies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch companies');
      const data = await response.json();
      setCompanies(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Now you can safely include fetchCompanies in the dependency array
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <div>
      {/* Your component JSX here */}
    </div>
  );
}