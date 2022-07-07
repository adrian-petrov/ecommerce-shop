import React, { ReactElement } from 'react';
import { Col, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import PageHeader from '../../../components/PageHeader';
import PaginatedProducts from '../../../components/PaginatedProducts';
import ProductCard from '../../../components/ProductCard';
import range from '../../../utils/range';
import {
  selectSearchResults,
  selectSearchStatus,
} from '../../Products/productsSlice';
import { getSearchResults } from '../../Products/productsThunks';

const StyledCol = styled(Col)`
  min-height: 40rem;
`;

export default function SearchPage(): ReactElement {
  const pagination = useAppSelector(selectSearchResults);
  const searchStatus = useAppSelector(selectSearchStatus);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const pages = range(1, Math.ceil(pagination.count / pagination.pageSize), 1);
  const query = location.search.split('=')[1];

  function handlePageChange(newPage: number): void {
    if (
      newPage === 0 ||
      newPage === pages.length + 1 ||
      newPage === pagination.pageIndex
    ) {
      return;
    }
    dispatch(getSearchResults(query, newPage, 6));
  }

  return (
    <div>
      <PageHeader>
        <h1 className="text-center">Search results for: {query}</h1>
      </PageHeader>
      {/* Products */}
      <Container>
        <PaginatedProducts
          fetchStatus={searchStatus}
          data={pagination.data}
          pageIndex={pagination.pageIndex}
          pages={pages}
          handlePageChange={handlePageChange}
          renderItem={(product) => (
            <StyledCol xs={12} md={4} key={product.id} className="mb-5">
              <ProductCard
                to={product.id}
                name={product.name}
                brand={product.brand}
                basePrice={product.basePrice}
                imageUrl={product.imageUrl}
              />
            </StyledCol>
          )}
        />
      </Container>
    </div>
  );
}
