import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ProductCardContainer = styled(Link)`
  max-width: 30rem;
  min-width: 18rem;
  max-height: 32rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  border: 1px solid lightgrey;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;

  img {
    max-height: 60%;
  }

  &:hover {
    cursor: pointer;
  }

  span:first-of-type {
    margin-top: 1rem;
    font-weight: 600;
  }
`;
interface Props {
  name: string;
  brand: string;
  basePrice: number;
  imageUrl: string;
  to: string | number;
}

export default function ProductCard({
  name,
  brand,
  basePrice,
  imageUrl,
  to,
}: Props): JSX.Element {
  return (
    <ProductCardContainer to={`/products/${to.toString()}`}>
      <img src={imageUrl} alt="Product image" />
      <div className="d-flex flex-column align-items-center">
        <span>{brand}</span>
        <span>{name}</span>
        <span>&#163;{basePrice}</span>
      </div>
    </ProductCardContainer>
  );
}
