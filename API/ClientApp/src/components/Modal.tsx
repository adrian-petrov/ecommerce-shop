import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

type Props = {
  show: boolean;
  children: React.ReactNode;
};

const ModalBackdropContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 200;
  background: rgba(253, 253, 253);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ModalBackdrop = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  svg {
    position: absolute;
    top: 1%;
    right: 3%;

    &:hover {
      cursor: pointer;
    }
  }
`;

const Modal = ({ show, children }: Props) => {
  const modalRoot = document.getElementById('modal-root');
  const element = document.createElement('div');

  React.useEffect(() => {
    modalRoot!.appendChild(element);

    return () => {
      modalRoot!.removeChild(element);
    };
  });

  const Component = () => (
    <ModalBackdropContainer>
      <ModalBackdrop>{children}</ModalBackdrop>
    </ModalBackdropContainer>
  );

  return show ? ReactDOM.createPortal(<Component />, element) : null;
};

export default Modal;
