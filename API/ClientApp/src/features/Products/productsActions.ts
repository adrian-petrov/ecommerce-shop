import { createAction } from '@reduxjs/toolkit';
import {
  TBasketUpdateResponse,
  TElasticSearchProductDto,
  TFiltersGetResposne,
  TProduct,
  TProductBrand,
  TProductsGetResponse,
  TProductType,
  TSearchResult,
} from './types';

// GET products
export const getProductsPending = createAction('products/getProductsPending');
export const getProductsFulfilled = createAction<TProductsGetResponse>(
  'products/getProductsFulfilled',
);
export const getProductsRejected = createAction('products/getProductsRejected');

// GET product
export const getProductPending = createAction('products/getProductPending');
export const getProductFulfilled = createAction<TProduct>(
  'products/getProductFulfilled',
);
export const getProductRejected = createAction('products/getProductRejected');

// GET featured products
export const getFeaturedProductsPending = createAction(
  'products/getFeaturedProductsPending',
);
export const getFeaturedProductsFulfilled = createAction<TProductsGetResponse>(
  'products/getFeaturedProductsFulfilled',
);
export const getFeaturedProductsRejected = createAction(
  'products/getFeaturedProductsRejected',
);

// GET brands
export const getProductBrandsFulfilled = createAction<TProductBrand[]>(
  'products/getProductBrandsFulfilled',
);

// GET types
export const getProductTypesFulfilled = createAction<TProductType[]>(
  'products/getProductTypesFulfilled',
);

// GET filters
export const getProductFiltersFulfilled = createAction<TFiltersGetResposne>(
  'products/filters/getProductFiltersFulfilled',
);

// GET search results
export const getSearchResultsFulfilled = createAction<TSearchResult>(
  'products/search/getSearchResultsFulfilled',
);
export const getSearchResultsPending = createAction(
  'products/search/getSearchResultsPending',
);
export const getSearchResultsRejected = createAction(
  'products/search/getSearchResultsRejected',
);

// GET search suggestions
export const getAutocompleteSuggestionsFulfilled = createAction<
  TElasticSearchProductDto[]
>('products/search/getAutocompleteSuggestionsFulfilled');

export const updateCurrentProductFulfilled =
  createAction<TBasketUpdateResponse>('products/updateCurrentProductFulfilled');

export const updateCurrentProductPending = createAction(
  'products/updateCurrentProductPending',
);
