import { range } from 'lodash';
import React from 'react';
import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import PageHeader from '../../../components/PageHeader';
import PaginatedProducts from '../../../components/PaginatedProducts';
import ProductCard from '../../../components/ProductCard';
import { selectPagination, selectProductsStatus } from '../productsSlice';
import { getProductsByGenderByType } from '../productsThunks';
import { StyledCol } from './ProductsListPage';

const ProductTypeListPage = () => {
  const location = useLocation();
  const apiPath = location.pathname.split('/').slice(-2).join('/');
  const title = location.pathname.split('/').slice(-2).join(' ');
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
    dispatch(getProductsByGenderByType(apiPath, newPage));
  };

  React.useEffect(() => {
    dispatch(getProductsByGenderByType(apiPath));
  }, [location.pathname]);

  return (
    <div>
      <PageHeader>
        <h1 className="text-center text-capitalize">{title}</h1>
      </PageHeader>
      <Container>
        <PaginatedProducts
          fetchStatus={productsFetchStatus}
          data={pagination.data}
          pageIndex={pagination.pageIndex}
          pages={pages}
          handlePageChange={handlePageChange}
          renderItem={(product) => {
            return (
              <StyledCol xs={12} md={4} key={product.id} className="mb-5">
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
      </Container>
    </div>
  );
};

export default ProductTypeListPage;
