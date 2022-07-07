import { throttle } from 'lodash';
import React from 'react';
import { Button } from 'react-bootstrap';
import { BsDash, BsPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectBasketStatus, setLastFocusedInput } from '../basketSlice';
import { updateBasket } from '../basketThunks';
import { AsyncStatus, TBasketItem } from '../types';

type Props = {
  basketItem: TBasketItem;
};

type Ref = HTMLInputElement;

const ItemRow = styled.li`
  z-index: 1000;
  max-height: 25rem;
  width: 38rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  > span {
    margin-left: auto;
    font-weight: 600;
  }
`;

const ProductDetailsContainer = styled.div`
  height: 100%;
  width: 100%:
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  span {
    display: block;
  }
`;

const ProductImage = styled(Link)`
  width: 8rem;

  img {
    max-height: 10rem;
    max-width: 5rem;
  }
`;

const ProductName = styled(Link)`
  align-self: flex-start;

  span {
    font-weight: 600;
  }
`;

const QuantityButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  width: 3rem;

  button {
    font-size: 1.2rem;
  }
`;

const Input = styled.input`
  border: none;
  text-align: center;
  min-width: 2.5rem;

  &:focus {
    outline: none;
  }
`;

export default React.forwardRef<Ref, Props>(function BasketItemRow(
  props,
  ref,
): JSX.Element {
  const { basketItem } = props;
  const [input, setInput] = React.useState('');
  let timeout: number;
  const [stockError, setStockError] = React.useState(false);
  const dispatch = useAppDispatch();
  const basketStatus = useAppSelector(selectBasketStatus);

  const handleQuantityIncremented = (): void => {
    if (basketStatus === AsyncStatus.Pending) return;

    const newQuantity = basketItem.quantity + 1;
    if (newQuantity > 25) return;

    if (basketItem.stock === 0) {
      setStockError(true);
      timeout = window.setTimeout(() => {
        setStockError(false);
      }, 1500);
      return;
    }

    const newItem = createNewBasketItem(newQuantity);
    dispatch(updateBasket(newItem, true));
  };

  const handleQuantityDecremented = () => {
    if (basketStatus === AsyncStatus.Pending) return;

    if (basketItem.quantity === 1) {
      const newItem = createNewBasketItem(0);
      dispatch(updateBasket(newItem, true));
      return;
    }

    const newQuantity = basketItem.quantity - 1;
    const newItem = createNewBasketItem(newQuantity);
    dispatch(updateBasket(newItem, true));
  };

  const throttledQuantityIncrementedHandler = React.useMemo(
    () => throttle(handleQuantityIncremented, 1000),
    [],
  );

  const throttledQuantityDecrementedHandler = React.useMemo(
    () => throttle(handleQuantityDecremented, 1000),
    [],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setStockError(false);

    const maskedValue = e.target.value.replace(/[^0-9]+/g, '');

    if (Number(maskedValue) === basketItem.stock + 1) {
      setInput(basketItem.quantity.toString());
      return;
    }

    if (Number(maskedValue) > basketItem.stock) {
      setStockError(true);
      setInput(basketItem.quantity.toString());
      return;
    }
    setInput(maskedValue);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    setStockError(false);

    const { value } = e.target;
    dispatchUpdateBasketFromBlur(value);
  };

  // Set the initial input value to that item's quantity
  React.useEffect(() => {
    setInput(basketItem.quantity.toString());
  }, [basketItem.quantity]);

  // Whenever the input value changes, set the current input as the lastFocusedInput
  React.useEffect(() => {
    dispatch(setLastFocusedInput([basketItem.productVariationId, input]));
  }, [input]);

  function createNewBasketItem(quantity: number): TBasketItem {
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
      quantity: quantity,
      stock: basketItem.stock,
    };
  }

  function dispatchUpdateBasketFromBlur(value: string) {
    if (basketItem.quantity === Number(value) || value === '') {
      setInput(basketItem.quantity.toString());
      return;
    }

    if (Number(value) > 25) {
      setInput('25');
      const newItem = createNewBasketItem(25);
      dispatch(updateBasket(newItem, true));
    } else {
      const newItem = createNewBasketItem(Number(value));
      dispatch(updateBasket(newItem, true));
    }
  }

  return (
    <ItemRow onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      {/* IMAGE */}
      <ProductImage
        to={`/products/${basketItem.productId}`}
        state={{
          id: basketItem.productId,
        }}
      >
        <img src={basketItem.imageUrl} alt="Product image" />
      </ProductImage>
      {/* PRODUCT DETAILS */}
      <ProductDetailsContainer>
        <ProductName to={`/products/${basketItem.productId}`}>
          <span>{basketItem.productName}</span>
        </ProductName>
        {/* Options from variationString */}
        <span>Colour: {basketItem.colour}</span>
        <span>
          Size:{' '}
          {basketItem.productType === 'Trousers'
            ? basketItem.waist + '-' + basketItem.length
            : basketItem.productType === 'Shorts'
            ? basketItem.waist
            : basketItem.productType === 'T-Shirts' ||
              basketItem.productType === 'Shoes'
            ? basketItem.size
            : ''}
        </span>
        {/* BUTTONS */}
        <div className="position-relative w-100">
          <QuantityButtons>
            {/* minus */}
            <Button
              size="sm"
              variant="outline-secondary"
              disabled={basketStatus === AsyncStatus.Pending}
              onClick={throttledQuantityDecrementedHandler}
            >
              <BsDash strokeWidth={1} />
            </Button>
            <Input
              ref={ref}
              data-id={basketItem.productVariationId}
              type="text"
              pattern="[0-9]*"
              value={input}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
            <Button
              size="sm"
              variant="outline-secondary"
              disabled={basketStatus === AsyncStatus.Pending}
              onClick={throttledQuantityIncrementedHandler}
            >
              <BsPlus strokeWidth={1} />
            </Button>
          </QuantityButtons>
          {stockError && (
            <span
              style={{
                minWidth: '15rem',
              }}
              className="text-danger position-absolute"
            >
              Sorry! There is no stock left.
            </span>
          )}
        </div>
      </ProductDetailsContainer>
      <span>&#163;{basketItem.price}</span>
    </ItemRow>
  );
});
