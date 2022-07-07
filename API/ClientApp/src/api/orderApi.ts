import { TCurrentUserOrder } from '../features/Account/types';
import { TBillingAddress, TDeliveryAddress } from '../features/Basket/types';
import { baseInstance } from './index';

export default {
  createOrderAsync: async (
    deliveryAddress: TDeliveryAddress,
    billingAddress: TBillingAddress,
    deliveryMethodId: number,
  ): Promise<TCurrentUserOrder> => {
    const response = await baseInstance.post('order', {
      deliveryAddress: deliveryAddress,
      billingAddress: billingAddress,
      deliveryMethodId: deliveryMethodId,
    });
    return response.data;
  },
  getOrdersAsync: async (buyerEmail: string): Promise<TCurrentUserOrder[]> => {
    const response = await baseInstance.get(`order/${buyerEmail}`);
    return response.data;
  },
  getOrderAsync: async (id: number): Promise<TCurrentUserOrder> => {
    const response = await baseInstance.get(`order/${id}`);
    return response.data;
  },
};
