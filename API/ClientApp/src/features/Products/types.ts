import { TBasketItem } from '../Basket/types';

export enum FetchStatus {
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Idle = 'IDLE',
}

export type TProductType = {
  id: number;
  name: string;
};

export type TProductBrand = {
  id: number;
  name: string;
};

export type TProduct = {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  type: string;
  brand: string;
  productOptions: TProductOption[];
  productVariations: TProductVariation[];
  images: TImage[];
};

export type TImage = {
  id: number;
  productId: number;
  imageUrl: string;
};

export type TProductOption = {
  id: number;
  name: string;
  productOptionValues: TProductOptionValue[];
};

export type TProductOptionValue = {
  id: number;
  name: string;
  productOptionId: number;
  optionId: number;
  stock: number;
};

export type TProductVariation = {
  id: number;
  sku: string;
  variationString: string;
  price: number;
  totalStock: number;
  imageUrl: string;
};

export type TProductsGetResponse = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: TProduct[];
};

export type TFiltersGetResposne = {
  types: TProductType[];
  brands: TProductBrand[];
  options: TOption[];
  sortOptions: string[];
};

export type TOption = {
  name: string;
  values: string[];
};

export type TFilterParam = {
  value: string;
  isSelected: boolean;
};

export type TSortParam = {
  value: string;
  valueTitle: string;
  isSelected: boolean;
};

export type TPagination<T> = {
  data: T[];
  pageSize: number;
  pageIndex: number;
  count: number;
};

export type TFilter = {
  [key: string]: TFilterParam[];
};

export type TProductsState = {
  pagination: TPagination<TProduct>;
  featuredProducts: TProduct[];
  filters: TFilter;
  sort: TSortParam[];
  currentProduct: {
    product: TProduct | null;
    imageUrl: string;
    variationString: string;
  };
  search: {
    results: TPagination<TElasticSearchProductDto>;
    autocomplete: TElasticSearchProductDto[];
  };
  productsStatus: FetchStatus;
  productStatus: FetchStatus;
  featuredProductsStatus: FetchStatus;
  searchStatus: FetchStatus;
};

export type TSearchResult = {
  pageIndex: number;
  pageSize: number;
  count: number;
  results: TElasticSearchProductDto[];
};

export type TElasticSearchProductDto = {
  id: number;
  name: string;
  brand: string;
  basePrice: number;
  imageUrl: string;
};

export type TProductQueryParams = {
  pageIndex?: number;
  pageSize?: number;
  types?: string[];
  brands?: string[];
  genders?: string[];
  colours?: string[];
  sizes?: string[];
  waists?: string[];
  lengths?: string[];
  sort?: string;
  search?: string;
};

export type TProductFilters = {
  types: string[];
  brands: string[];
  genders: string[];
  colours: string[];
  sizes: string[];
  waists: string[];
  lengths: string[];
};

export type TProductAndUpdatedBasket = {
  product: TProduct;
  basket: TBasketItem[];
};

export type TBasketUpdateResponse = {
  oldBasket: TBasketItem[];
  newBasket: TBasketItem[];
};
