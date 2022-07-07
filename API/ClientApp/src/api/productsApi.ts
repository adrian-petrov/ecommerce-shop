import qs from 'qs';
import { TProduct, TProductQueryParams } from '../features/Products/types';
import { baseInstance } from './index';

export default {
  getProducts: async (productQueryParams: TProductQueryParams) => {
    const response = await baseInstance.get('products', {
      params: productQueryParams,
      paramsSerializer: (params) => qs.stringify(params),
    });
    return response.data;
  },
  getProduct: async (id: number): Promise<TProduct> => {
    const response = await baseInstance.get(`products/${id}`);
    return response.data;
  },
  getFeaturedProducts: async () => {
    const response = await baseInstance.get('products', {
      params: {
        sort: 'createdAtDesc',
        pageSize: 5,
      },
    });
    return response.data;
  },
  getBrands: async () => {
    const response = await baseInstance.get('products/productBrands');
    return response.data;
  },
  getTypes: async () => {
    const response = await baseInstance.get('products/productTypes');
    return response.data;
  },
  getProductFilters: async () => {
    const response = await baseInstance.get('products/filters');
    return response.data;
  },
  getProductsByGenderByType: async (
    path: string,
    productQueryParams: TProductQueryParams,
  ) => {
    const response = await baseInstance.get(`products/${path}`, {
      params: productQueryParams,
      paramsSerializer: (params) => qs.stringify(params),
    });
    return response.data;
  },
};
