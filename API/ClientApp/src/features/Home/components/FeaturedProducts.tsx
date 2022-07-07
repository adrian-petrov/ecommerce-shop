import React, { ReactElement } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { useAppSelector } from '../../../app/hooks';
import ProductCard from '../../../components/ProductCard';
import { selectFeaturedProducts } from '../../Products/productsSlice';

const StyledRow = styled(Row)`
  padding-top: 3rem;

  @media (max-width: 1200px) {
    overflow-x: auto;
    flex-wrap: nowrap;
  }
`;

const StyledCol = styled(Col)``;

export default function FeaturedProducts(): ReactElement {
  const products = useAppSelector(selectFeaturedProducts);

  return (
    <section>
      <Container>
        <h1 style={{ textAlign: 'center' }}>Just in</h1>
        <StyledRow xl={5}>
          {products.map((product, index) => (
            <StyledCol key={index}>
              <ProductCard
                to={product.id}
                name={product.name}
                brand={product.brand}
                basePrice={product.basePrice}
                imageUrl={product.images[0].imageUrl}
              />
            </StyledCol>
          ))}
        </StyledRow>
      </Container>
    </section>
  );
}
