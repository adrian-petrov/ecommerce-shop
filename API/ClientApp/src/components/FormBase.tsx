import React, { ReactElement } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';

const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & div.form-floating {
    margin-bottom: 1.5rem;
  }

  & div.invalid-feedback {
    display: block;
    margin-top: 5px;
  }
`;

interface Props {
  handleSubmit: React.FormEventHandler;
  children: React.ReactNode;
}

export default function FormBase({
  handleSubmit,
  children,
}: Props): ReactElement {
  return <FormContainer onSubmit={handleSubmit}>{children}</FormContainer>;
}
