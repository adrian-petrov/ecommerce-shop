import orderApi from '../../api/orderApi';
import { AppThunk } from '../../app/store';
import { resetBasket, setDeliveryAddress } from '../Basket/basketSlice';
import { deleteBasket } from '../Basket/basketThunks';
import { TBillingAddress, TDeliveryAddress } from '../Basket/types';
import {
  createOrderFulfilled,
  createOrderPending,
  createOrderRejected,
  getCurrentUserOrderFulfilled,
  getCurrentUserOrderPending,
  getCurrentUserOrderRejected,
  getCurrentUserOrdersFulfilled,
  getCurrentUserOrdersPending,
  getCurrentUserOrdersRejected,
} from './orderActions';

export const createOrder =
  (
    deliveryAddress: TDeliveryAddress,
    billingAddress: TBillingAddress,
    deliveryMethodId: number,
  ): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(createOrderPending());

    let response;
    try {
      response = await orderApi.createOrderAsync(
        deliveryAddress,
        billingAddress,
        deliveryMethodId,
      );
    } catch (err) {
      dispatch(createOrderRejected());
      return;
    }
    dispatch(createOrderFulfilled(response));
    dispatch(deleteBasket());
    dispatch(resetBasket());
  };

export const getCurrentUserOrders =
  (buyerEmail: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(getCurrentUserOrdersPending());

    let response;
    try {
      response = await orderApi.getOrdersAsync(buyerEmail);
    } catch (err) {
      dispatch(getCurrentUserOrdersRejected());
      return;
    }
    dispatch(getCurrentUserOrdersFulfilled(response));
    if (!response.length) return;

    dispatch(setDeliveryAddress(response[response.length - 1].deliveryAddress));
  };

export const getCurrentUserOrder =
  (id: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(getCurrentUserOrderPending());

    let response;
    try {
      response = await orderApi.getOrderAsync(id);
    } catch (err) {
      dispatch(getCurrentUserOrderRejected());
      return;
    }

    dispatch(getCurrentUserOrderFulfilled(response));
  };
