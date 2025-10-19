import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import jwt_decode from 'jwt-decode';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      try {
        const decoded = jwt_decode(token);
        login(token, decoded);
        navigate('/');
      } catch (error) {
        console.error('Token decode error:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <Container className="mt-5 text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3">Authenticating...</p>
    </Container>
  );
};

export default AuthCallback;