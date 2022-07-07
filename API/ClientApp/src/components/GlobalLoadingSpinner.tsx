import React from 'react';
import { Spinner } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const StyledModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);

  & .spinner-border {
    width: 8rem;
    height: 8rem;
    border-width: 8px;
  }
`;

const GlobalLoadingSpinner = () => {
  const modalRoot = document.getElementById('modal-root');
  const element = document.createElement('div');

  React.useEffect(() => {
    modalRoot?.appendChild(element);

    return () => {
      modalRoot?.removeChild(element);
    };
  });

  return createPortal(
    <StyledModalBackdrop>
      <Spinner role="status" animation="border" />
    </StyledModalBackdrop>,
    element,
  );
};

export default GlobalLoadingSpinner;
