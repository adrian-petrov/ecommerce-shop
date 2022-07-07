import React from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import HeroVideo from '../components/HeroVideo';
import { selectFeaturedProducts } from '../../Products/productsSlice';
import { getFeaturedProducts } from '../../Products/productsThunks';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFeaturedProducts);

  React.useEffect(() => {
    if (products.length > 0) return;
    dispatch(getFeaturedProducts());
  }, []);

  return (
    <div>
      <HeroVideo />
      <FeaturedProducts />
    </div>
  );
};

export default HomePage;
