import React from 'react';
import { Col, Container } from 'react-bootstrap';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import PageHeader from '../../../components/PageHeader';
import PaginatedProducts from '../../../components/PaginatedProducts';
import ProductCard from '../../../components/ProductCard';
import range from '../../../utils/range';
import ProductFilters from '../components/ProductFilters/ProductFilters';
import { selectPagination, selectProductsStatus } from '../productsSlice';
import { getProducts } from '../productsThunks';

export const StyledCol = styled(Col)`
  min-height: 40rem;
`;

export default function ProductsListPage() {
  const dispatch = useAppDispatch();
  const pagination = useAppSelector(selectPagination);
  const productsFetchStatus = useAppSelector(selectProductsStatus);

  const pages = range(1, Math.ceil(pagination.count / pagination.pageSize), 1);

  const handlePageChange = (newPage: number): void => {
    if (
      newPage === 0 ||
      newPage === pages.length + 1 ||
      newPage === pagination.pageIndex
    ) {
      return;
    }
    dispatch(getProducts(newPage));
  };

  return (
    <div>
      <PageHeader>
        <h1 className="text-center">Our products</h1>
      </PageHeader>
      {/* Products */}
      <Container>
        <ProductFilters />
        <section>
          <PaginatedProducts
            fetchStatus={productsFetchStatus}
            data={pagination.data}
            pageIndex={pagination.pageIndex}
            pages={pages}
            handlePageChange={handlePageChange}
            renderItem={(product) => {
              return (
                <StyledCol
                  xs={12}
                  md={6}
                  lg={4}
                  key={product.id}
                  className="mb-5 d-flex justify-content-center"
                >
                  <ProductCard
                    to={product.id}
                    name={product.name}
                    brand={product.brand}
                    basePrice={product.basePrice}
                    imageUrl={product.images[0].imageUrl}
                  />
                </StyledCol>
              );
            }}
          />
        </section>
      </Container>
    </div>
  );
}
