import { TProductOption } from '../../Products/types';

export type TQueryParams = {
  sort?: string;
  range?: string;
  filter?: string;
};

export type TAdminProductVariation = {
  id: number;
  sku: string;
  variationString: string;
  price: number;
  totalStock: number;
  name: string;
  imageUrl: string;
};

export type TAdminProduct = {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  productTypeId: number;
  productBrandId: number;
  productOptions: TAdminProductOption[];
  productVariationImages: TProductVariationImage[];
  images: TAdminImage[];
};

export type TAdminImage = {
  id: number;
  imageUrl: string;
  productId: number;
  rawFile?: File;
};

export type TAdminProductOption = {
  id: number;
  name: string;
  optionId: number;
  productOptionValues: TAdminProductOptionValue[];
};

export type TAdminProductOptionValue = {
  id: number;
  name: string;
  productOptionId: number;
  optionId: number;
  stock: number;
};

export type TAdminProductRequest = {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  productTypeId: number;
  productBrandId: number;
  productOptions: TProductOption[];
  images: TAdminImage[];
};

export type TProductVariationImage = {
  id?: number;
  imageUrl?: string;
  rawFile?: File;
};
