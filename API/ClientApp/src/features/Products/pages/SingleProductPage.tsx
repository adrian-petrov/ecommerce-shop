import React from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import GlobalLoadingSpinner from '../../../components/GlobalLoadingSpinner';
import RouteNotFound from '../../../components/RouteNotFound';
import {
  selectBasket,
  selectBasketItemQuantities,
  selectBasketStatus,
} from '../../Basket/basketSlice';
import {
  getBasketThenGetProductById,
  updateBasket,
} from '../../Basket/basketThunks';
import { AsyncStatus, TBasketItemRequest } from '../../Basket/types';
import ProductVariationBuilder from '../components/ProductVariationBuilder/ProductVariationBuilder';
import {
  resetCurrentProduct,
  resetCurrentProductImageUrl,
  resetCurrentProductVariationString,
  selectCurrentProduct,
  selectCurrentProductVariation,
  selectCurrentVariationString,
  selectProductStatus,
} from '../productsSlice';
import { getProductById } from '../productsThunks';
import { FetchStatus } from '../types';

const ProductImageContainer = styled.div`
  img {
    max-width: 350px;
  }
`;
const ProductDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  h2 {
  }

  > span {
    color: var(--mainOrange);
    margin-bottom: 2rem;
  }

  p {
    margin-top: 3rem;
  }

  button {
    width: 50%;

    & .spinner-border {
      width: 6px;
      height: 6px;
      border-width: 2px;
      padding: 0;
      margin: 0;
    }
    }
  }
`;

export default function SingleProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId } = useParams();

  const [itemError, setItemError] = React.useState(false);

  const dispatch = useAppDispatch();
  const productFetchStatus = useAppSelector(selectProductStatus);
  const basketUpdateStatus = useAppSelector(selectBasketStatus);
  const currentProduct = useAppSelector(selectCurrentProduct);
  const currentProductVariation = useAppSelector(selectCurrentProductVariation);
  const currentVariationString = useAppSelector(selectCurrentVariationString);
  const basketItemQuantities = useAppSelector(selectBasketItemQuantities);
  const basket = useAppSelector(selectBasket);
  const variationIsOutOfStock = currentProductVariation
    ? currentProductVariation.totalStock === 0
    : true;

  React.useEffect(() => {
    if (!productId) {
      navigate('/');
    }
  }, []);

  React.useEffect(() => {
    setItemError(false);
  }, [currentVariationString]);

  function addItem(): void {
    if (!currentProduct.product) {
      return;
    }

    if (
      variationIsOutOfStock ||
      (currentVariationString && !currentProductVariation)
    ) {
      return;
    }

    if (!currentProductVariation) {
      setItemError(true);
      return;
    }

    const quantity = basketItemQuantities[currentProductVariation.id];

    const basketItem: TBasketItemRequest = {
      productVariationId: currentProductVariation.id,
      price: currentProductVariation.price,
      quantity: quantity ? quantity + 1 : 1,
    };
    dispatch(updateBasket(basketItem));
  }

  React.useEffect(() => {
    if (!productId) return;

    const id = parseInt(productId, 10);
    if (Number.isNaN(id)) return;

    if (basket.length) {
      dispatch(getProductById(parseInt(productId, 10)));
    } else {
      dispatch(getBasketThenGetProductById(parseInt(productId, 10)));
    }

    return () => {
      dispatch(resetCurrentProduct());
      dispatch(resetCurrentProductImageUrl());
      dispatch(resetCurrentProductVariationString());
    };
  }, [location.pathname]);

  if (productFetchStatus === FetchStatus.Loading) {
    return <GlobalLoadingSpinner />;
  }

  if (Number.isNaN(parseInt(productId!, 10))) return <RouteNotFound />;

  return (
    <Container>
      <Row>
        <Col>
          <ProductImageContainer>
            {currentProduct && (
              <img src={currentProduct.imageUrl} alt="Product image" />
            )}
          </ProductImageContainer>
        </Col>
        <Col>
          {currentProduct && currentProduct.product && (
            <ProductDetailsContainer>
              <h1>{currentProduct.product.name}</h1>
              <span>
                &#163;
                {currentProduct.product.productVariations &&
                  currentProduct.product.productVariations[0].price}
              </span>
              <ProductVariationBuilder />
              {itemError && (
                <span className="text-danger">
                  Please select a size before adding to the basket
                </span>
              )}
              {currentVariationString.length > 0 && variationIsOutOfStock && (
                <span className="text-danger">
                  This size is currently out of stock
                </span>
              )}
              <Button
                onClick={addItem}
                variant="primary"
                disabled={
                  basketUpdateStatus === AsyncStatus.Pending ||
                  variationIsOutOfStock
                }
              >
                {basketUpdateStatus === AsyncStatus.Pending ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <Spinner
                      style={{
                        width: '2.2rem',
                        minHeight: '2.2rem',
                      }}
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <span>
                    {currentVariationString.length > 0 && variationIsOutOfStock
                      ? 'Out of stock'
                      : 'Add item'}
                  </span>
                )}
              </Button>
              <p>
                {currentProduct.product && currentProduct.product.description}
              </p>
            </ProductDetailsContainer>
          )}
        </Col>
      </Row>
    </Container>
  );
}
