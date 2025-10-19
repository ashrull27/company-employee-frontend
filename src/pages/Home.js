import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center mb-5">
            <h1 className="display-4 mb-3">Company & Employee Management</h1>
            <p className="lead text-muted">
              A modern admin panel to manage companies and their employees efficiently
            </p>
          </div>

          {isAuthenticated ? (
            <Row>
              <Col md={6} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>Companies</Card.Title>
                    <Card.Text>
                      View, create, update, and delete companies in your database.
                    </Card.Text>
                    <Button as={Link} to="/companies" variant="primary" className="mt-auto">
                      Manage Companies
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>Employees</Card.Title>
                    <Card.Text>
                      View, create, update, and delete employees linked to companies.
                    </Card.Text>
                    <Button as={Link} to="/employees" variant="primary" className="mt-auto">
                      Manage Employees
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <Card className="text-center shadow-sm">
              <Card.Body className="py-5">
                <Card.Title className="mb-4">Get Started</Card.Title>
                <Card.Text className="mb-4">
                  Please login with your GitHub account to access the admin panel
                </Card.Text>
                <Button as={Link} to="/login" variant="primary" size="lg">
                  Login with GitHub
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;