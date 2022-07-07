import { AxiosError } from 'axios';
import qs from 'qs';
import {
  CreateParams,
  DataProvider,
  DeleteManyParams,
  DeleteParams,
  GetListParams,
  GetManyParams,
  GetManyReferenceParams,
  GetOneParams,
  HttpError,
  UpdateManyParams,
  UpdateParams,
} from 'react-admin';
import { adminInstance } from '../api';
import inMemoryJwtService from '../authProvider/inMemoryJwtService';
import { TAdminProductRequest, TQueryParams } from './types';

export type TDataProvider = DataProvider & {
  uploadImages: (files: File[]) => Promise<Response>;
};

export const dataProvider: TDataProvider = {
  getList: async (resource: string, params: GetListParams) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const queryParams: TQueryParams = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
    };

    if (params.filter) queryParams.filter = JSON.stringify(params.filter);

    const response = await adminInstance.get(`${resource}`, {
      params: queryParams,
      paramsSerializer: (qp) => qs.stringify(qp),
    });

    return {
      data: response.data.data,
      total: getTotal(response.headers['content-range']),
    };
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const response = await adminInstance.get(`${resource}/${params.id}`);

    return {
      data: response.data.data,
    };
  },

  getMany: async (resource: string, params: GetManyParams) => {
    const queryParams: TQueryParams = {
      filter: JSON.stringify({ ids: params.ids }),
    };

    const response = await adminInstance.get(`${resource}/getmany`, {
      params: queryParams,
      paramsSerializer: (qp) => qs.stringify(qp),
    });

    return {
      data: response.data.data,
    };
  },

  getManyReference: async (
    resource: string,
    params: GetManyReferenceParams,
  ) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const queryParams: TQueryParams = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };

    const response = await adminInstance.get(`${resource}`, {
      params: queryParams,
      paramsSerializer: (qp) => qs.stringify(qp),
    });

    return {
      data: response.data.data,
      total: getTotal(response.headers['content-range']),
    };
  },

  update: async (resource: string, params: UpdateParams) => {
    let response = null;

    if (resource === 'products') {
      let productParams = params as UpdateParams<TAdminProductRequest>;
      productParams = await handleImageUpload<
        UpdateParams<TAdminProductRequest>
      >(productParams);

      response = await adminInstance.put(
        `${resource}/${productParams.id}`,
        JSON.stringify(productParams.data),
      );

      return {
        data: response.data.data,
      };
    }

    // other endpoints
    response = await adminInstance.put(
      `${resource}/${params.id}`,
      JSON.stringify(params.data),
    );

    return {
      data: response.data.data,
    };
  },

  updateMany: async (resource: string, params: UpdateManyParams) => {
    const queryParams: TQueryParams = {
      filter: JSON.stringify({ id: params.ids }),
    };

    const response = await adminInstance.put(
      `${resource}`,
      {
        data: JSON.stringify(params.data),
      },
      {
        params: queryParams,
        paramsSerializer: (qp) => qs.stringify(qp),
      },
    );

    return {
      data: response.data.data,
    };
  },

  create: async (resource: string, params: CreateParams) => {
    let response = null;

    try {
      if (resource === 'products') {
        let productParams = params as CreateParams<TAdminProductRequest>;
        productParams = await handleImageUpload<
          CreateParams<TAdminProductRequest>
        >(productParams);

        response = await adminInstance.post(
          `${resource}`,
          JSON.stringify(productParams.data),
        );

        return {
          data: response.data.data,
        };
      }

      // other endpoints
      response = await adminInstance.post(
        `${resource}`,
        JSON.stringify(params.data),
      );
    } catch (err) {
      const error = err as AxiosError;
      throw new HttpError(
        error.response!.data.message,
        error.response!.status,
        error.response!.data,
      );
    }

    return {
      data: response.data.data,
    };
  },

  delete: async (resource: string, params: DeleteParams) => {
    let response = null;
    try {
      response = await adminInstance.delete(`${resource}/${params.id}`);
    } catch (err: any) {
      const error = err as AxiosError;
      throw new HttpError(
        error.response!.data.message,
        error.response!.status,
        error.response!.data,
      );
    }

    return {
      data: response.data.data,
    };
  },

  deleteMany: async (resource: string, params: DeleteManyParams) => {
    const queryParams: TQueryParams = {
      filter: JSON.stringify({ id: params.ids }),
    };

    let response = null;

    try {
      response = await adminInstance.delete(`${resource}`, {
        params: queryParams,
        paramsSerializer: (qp) => qs.stringify(qp),
      });
    } catch (err: any) {
      const error = err as AxiosError;
      throw new HttpError(
        error.response!.data.message,
        error.response!.status,
        error.response!.data,
      );
    }

    return {
      data: response.data.data,
    };
  },

  uploadImages: async (images: File[]) => {
    const formData = new FormData();
    images.forEach((img) => formData.append(`images`, img));

    const token = inMemoryJwtService.token;
    const config: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    };

    let result;
    try {
      result = await fetch('images', config);
    } catch (err) {
      const error = err as AxiosError;
      throw new HttpError(
        error.response!.data.message,
        error.response!.status,
        error.response!.data,
      );
    }
    return result as Response;
  },
};

const getTotal = (header: string): number => {
  const total = header.split('/').pop() as string;
  return parseInt(total, 10);
};

type ImageUploadParams =
  | UpdateParams<TAdminProductRequest>
  | CreateParams<TAdminProductRequest>;

const handleImageUpload = async <T,>(
  productParams: ImageUploadParams,
): Promise<T> => {
  let imageUploadResponse = null;

  const newImages =
    productParams.data.images &&
    productParams.data.images.filter((x) => {
      return Object.prototype.hasOwnProperty.call(x, 'rawFile');
    });
  const newImagesFiles = newImages?.map((x) => x.rawFile) as File[];

  // we also delete the new images from the payload because
  // the server is not expecting a DTO with that shape { "rawFile": "path": "text" }
  productParams.data.images =
    productParams.data.images &&
    productParams.data.images.filter((x) => {
      return !Object.prototype.hasOwnProperty.call(x, 'rawFile');
    });

  imageUploadResponse = await dataProvider.uploadImages(newImagesFiles);

  if (imageUploadResponse && imageUploadResponse.status === 201) {
    const uploadedImages: any = await imageUploadResponse.json();
    productParams.data.images = [
      ...productParams.data.images!,
      ...uploadedImages.data,
    ];
  }
  return productParams as unknown as T;
};
