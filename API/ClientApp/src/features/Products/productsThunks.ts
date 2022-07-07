import productsApi from '../../api/productsApi';
import searchApi from '../../api/searchApi';
import { AppThunk } from '../../app/store';
import ProductQueryParams from './ProductQueryParams';
import {
  getAutocompleteSuggestionsFulfilled,
  getFeaturedProductsFulfilled,
  getFeaturedProductsPending,
  getFeaturedProductsRejected,
  getProductFiltersFulfilled,
  getProductFulfilled,
  getProductPending,
  getProductRejected,
  getProductsFulfilled,
  getProductsPending,
  getProductsRejected,
  getSearchResultsFulfilled,
  getSearchResultsPending,
  getSearchResultsRejected,
} from './productsActions';
import {
  selectActiveFilters,
  selectActiveSort,
  updateProductVariationsAndOptionValuesStock,
} from './productsSlice';
import { TProduct, TProductFilters } from './types';

export const getProducts =
  (pageIndex = 1): AppThunk =>
  async (dispatch, getState) => {
    dispatch(getProductsPending());

    const state = getState();
    const activeFilters = selectActiveFilters(state) as TProductFilters;
    const activeSort = selectActiveSort(state);
    const { pageSize } = state.products.pagination;

    const queryParams = new ProductQueryParams();
    queryParams.pageIndex = pageIndex;
    queryParams.pageSize = pageSize;
    queryParams.sort = activeSort;

    if (activeFilters.types) {
      queryParams.types = activeFilters.types;
    }
    if (activeFilters.brands) {
      queryParams.brands = activeFilters.brands;
    }
    if (activeFilters.genders) {
      queryParams.genders = activeFilters.genders;
    }
    if (activeFilters.colours) {
      queryParams.colours = activeFilters.colours;
    }
    if (activeFilters.sizes) {
      queryParams.sizes = activeFilters.sizes;
    }
    if (activeFilters.waists) {
      queryParams.waists = activeFilters.waists;
    }
    if (activeFilters.lengths) {
      queryParams.lengths = activeFilters.lengths;
    }

    let response;
    try {
      response = await productsApi.getProducts(queryParams);
    } catch (err) {
      dispatch(getProductsRejected());
      return;
    }
    dispatch(getProductsFulfilled(response));
  };

export const getProductsByGenderByType =
  (path: string, pageIndex = 1): AppThunk =>
  async (dispatch, getState) => {
    dispatch(getProductsPending());

    const state = getState();
    const { pageSize } = state.products.pagination;

    const queryParams = new ProductQueryParams();
    queryParams.pageIndex = pageIndex;
    queryParams.pageSize = pageSize;

    let response;
    try {
      response = await productsApi.getProductsByGenderByType(path, queryParams);
    } catch (err) {
      dispatch(getProductsRejected());
    }
    dispatch(getProductsFulfilled(response));
  };

export const getProductById =
  (id: number): AppThunk =>
  async (dispatch, getState) => {
    dispatch(getProductPending());

    let response: TProduct;
    try {
      response = await productsApi.getProduct(id);
    } catch (err) {
      dispatch(getProductRejected());
      return;
    }

    const {
      basket: { basket },
    } = getState();

    // no basket items, just update current product as usual
    if (!basket.length) {
      dispatch(getProductFulfilled(response));
      return;
    }

    const currProductIsInBasket = basket.some(
      (i) => i.productId === response.id,
    );

    if (!currProductIsInBasket) {
      dispatch(getProductFulfilled(response));
      return;
    }

    const updatedCurrentProduct = updateProductVariationsAndOptionValuesStock(
      basket,
      response,
      true,
    );

    // Dispatch response with updated stock
    dispatch(getProductFulfilled(updatedCurrentProduct));
  };

export const getFeaturedProducts = (): AppThunk => async (dispatch) => {
  dispatch(getFeaturedProductsPending());

  let response;
  try {
    response = await productsApi.getFeaturedProducts();
  } catch (err) {
    dispatch(getFeaturedProductsRejected());
    return;
  }
  dispatch(getFeaturedProductsFulfilled(response));
};

export const getProductFilters = (): AppThunk => async (dispatch) => {
  let response;

  try {
    response = await productsApi.getProductFilters();
  } catch (err) {
    return null;
  }
  dispatch(getProductFiltersFulfilled(response));
};

export const getSearchResults =
  (query: string, pageIndex: number, pageSize: number): AppThunk =>
  async (dispatch) => {
    dispatch(getSearchResultsPending());

    let response;
    try {
      response = await searchApi.search(query, pageIndex, pageSize);
    } catch (err) {
      dispatch(getSearchResultsRejected());
    }
    dispatch(getSearchResultsFulfilled(response));
  };

export const getAutocompleteSuggestions =
  (query: string): AppThunk =>
  async (dispatch) => {
    let response;

    try {
      response = await searchApi.autocomplete(query);
    } catch (err) {
      return null;
    }
    dispatch(getAutocompleteSuggestionsFulfilled(response));
  };
