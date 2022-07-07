import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

export default function AccountPage() {
  return (
    <section>
      <Container>
        <Outlet />
      </Container>
    </section>
  );
}
