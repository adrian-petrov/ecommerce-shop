import { createAction } from '@reduxjs/toolkit';
import { TBasket, TDeliveryMethod } from './types';

export const updateBasketPending = createAction('basket/updateBasketPending');
export const updateBasketFulfilled = createAction<TBasket>(
  'basket/updateBasketFulfilled',
);
export const updateBasketRejected = createAction('basket/updateBasketRejected');

export const getDeliveryMethodsPending = createAction(
  'basket/delivery/getDeliveryMethodsPending',
);
export const getDeliveryMethodsFulfilled = createAction<TDeliveryMethod[]>(
  'basket/delivery/getDeliveryMethodsFulfilled',
);
export const getDeliveryMethodsRejected = createAction(
  'basket/delivery/getDeliveryMethodsRejected',
);
