import { baseInstance } from './index';

import {
  TBasket,
  TBasketItemRequest,
  TDeliveryMethod,
} from '../features/Basket/types';

export default {
  getBasketAsync: async (): Promise<TBasket> => {
    const response = await baseInstance.get('basket');
    return response.data;
  },
  deleteBasketAsync: async (): Promise<void> => {
    await baseInstance.delete('basket');
  },
  putBasketItemAsync: async (
    basketItem: TBasketItemRequest,
  ): Promise<TBasket> => {
    const response = await baseInstance.put(
      `basket/${basketItem.productVariationId}`,
      basketItem,
    );
    return response.data;
  },
  getDeliveryMethodsAsync: async (): Promise<TDeliveryMethod[]> => {
    const response = await baseInstance.get('basket/delivery');
    return response.data;
  },
};
