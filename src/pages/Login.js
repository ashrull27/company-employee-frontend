import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import { FaGithub } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'https://company-employee-api-d29n.onrender.com/api';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card className="shadow-sm">
            <Card.Body className="p-5 text-center">
              <h2 className="mb-4">Welcome Back</h2>
              <p className="text-muted mb-4">
                Sign in with your GitHub account to access the admin panel
              </p>
              <Button
                variant="dark"
                size="lg"
                onClick={handleGitHubLogin}
                className="w-100"
              >
                <FaGithub className="me-2" size={20} />
                Continue with GitHub
              </Button>
              <p className="text-muted mt-4 small">
                By signing in, you agree to our terms and conditions
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Login;