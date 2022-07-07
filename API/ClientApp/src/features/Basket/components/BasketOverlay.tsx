import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectBasket,
  selectBasketTotal,
  setShowBasketOverlay,
} from '../basketSlice';
import BasketItemRow from './BasketItemRow';

type Ref = HTMLDivElement;
type Props = {};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border: 1px solid #d6d6d6;

  > p {
    padding: 1.5rem;
    font-family: Bebas Neue;
    font-size: 1.6rem;
  }
`;

const BasketOverlayContainer = styled.div`
  padding: 1.2rem;
  list-style: none;
  font-size: 1.1rem;
`;

const BasketItemsContainer = styled.ul`
  list-style: none;

  li:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }
`;

const Subtotal = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  font-weight: 600;
`;

export default React.forwardRef<Ref, Props>(function BasketOverlay(
  props,
  ref,
): JSX.Element {
  const basket = useAppSelector(selectBasket);
  const subtotal = useAppSelector(selectBasketTotal);
  const isEmpty = basket.length === 0;
  const elementRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      elementRef.current &&
      !elementRef.current.contains(event.target as Node)
    ) {
      dispatch(setShowBasketOverlay(false));
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <Overlay
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      ref={ref}
      id="basket-overlay"
      {...props}
    >
      {isEmpty ? (
        <p>Your basket is empty</p>
      ) : (
        <BasketOverlayContainer ref={elementRef}>
          {/* Basket items */}
          <BasketItemsContainer>
            {basket.map((item) => (
              <BasketItemRow basketItem={item} key={item.productVariationId} />
            ))}
          </BasketItemsContainer>
          {/* Subtotal */}
          <Subtotal>
            <span>Subtotal</span>
            <span>{subtotal}</span>
          </Subtotal>
        </BasketOverlayContainer>
      )}
    </Overlay>
  );
});
