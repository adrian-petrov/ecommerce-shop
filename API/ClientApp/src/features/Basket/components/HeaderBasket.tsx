import React from 'react';
import { Overlay } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import basketIcon from '../../../assets/icons/cart2.svg';
import {
  selectBasket,
  selectBasketItemQuantities,
  selectBasketItemsCount,
  selectBasketOverlayStatus,
  selectLastFocusedInput,
  setShowBasketOverlay,
} from '../basketSlice';
import { updateBasket } from '../basketThunks';
import { TBasketItem } from '../types';
import BasketOverlay from './BasketOverlay';

const StyledLink = styled(Link)`
  position: relative;

  span {
    position: absolute;
    top: 5;
    left: 20px;
    font-size: 1.4rem;
    font-weight: 600;
    padding-left: 4px;
    padding-top: 1px;
  }

  &:hover {
    & span {
      color: var(--font-primary-color);
    }
  }
`;

export default function HeaderBasket(): JSX.Element {
  const target = React.useRef(null);
  const location = useLocation();
  const basket = useAppSelector(selectBasket);
  const basketItemsCount = useAppSelector(selectBasketItemsCount);
  const showBasketOverlay = useAppSelector(selectBasketOverlayStatus);
  const currentQuantities = useAppSelector(selectBasketItemQuantities);
  const lastFocusedInput = useAppSelector(selectLastFocusedInput);
  const dispatch = useAppDispatch();

  const handleShowOverlay = () => {
    if (location.pathname === '/basket') return;

    setTimeout(() => {
      dispatch(setShowBasketOverlay(true));
    }, 150);
  };

  const handleHideOverlay = () => {
    setTimeout(() => {
      dispatch(setShowBasketOverlay(false));
      dispatchUpdatedBasketOnUnmount();
    }, 150);
  };

  function createNewBasketItem(basketItem: TBasketItem): TBasketItem {
    return {
      productVariationId: basketItem.productVariationId,
      productVariationString: basketItem.productVariationString,
      productId: basketItem.productId,
      productType: basketItem.productType,
      colour: basketItem.colour,
      size: basketItem.size ?? '',
      waist: basketItem.waist ?? '',
      length: basketItem.length ?? '',
      productName: basketItem.productName,
      price: basketItem.price,
      imageUrl: basketItem.imageUrl,
      quantity: basketItem.quantity,
      stock: basketItem.stock,
    };
  }

  function dispatchUpdatedBasketOnUnmount(): void {
    if (Object.entries(lastFocusedInput).length === 0) return;

    const [inputKey, inputValue] = Object.entries(lastFocusedInput)[0];
    const currentQuantity = currentQuantities[Number(inputKey)];
    const currentBasketItem = basket.find(
      (item) => item.productVariationId === Number(inputKey),
    ) as TBasketItem;

    if (currentQuantity) {
      // Number("") = 0 so we compare strings instead
      if (inputValue !== currentQuantity.toString()) {
        let newItem: TBasketItem;

        if (Number(inputValue) > 25) {
          newItem = createNewBasketItem({ ...currentBasketItem, quantity: 25 });
          dispatch(updateBasket(newItem, true));
          return;
        }
        if (inputValue !== '') {
          newItem = createNewBasketItem({
            ...currentBasketItem,
            quantity: Number(inputValue),
          });
          dispatch(updateBasket(newItem, true));
        }
      }
    }
  }

  return (
    <StyledLink
      to="/basket"
      onMouseEnter={handleShowOverlay}
      onMouseLeave={handleHideOverlay}
      ref={target}
    >
      <img src={basketIcon} alt="Basket icon" />
      {basketItemsCount > 0 && <span>{basketItemsCount}</span>}
      <Overlay
        target={target.current}
        show={showBasketOverlay}
        placement="bottom"
      >
        <BasketOverlay />
      </Overlay>
    </StyledLink>
  );
}
