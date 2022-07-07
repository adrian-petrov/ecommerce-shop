import { createAction } from '@reduxjs/toolkit';
import { TCurrentUserOrder } from './types';

export const createOrderPending = createAction('order/createOrderPending');
export const createOrderFulfilled = createAction<TCurrentUserOrder>(
  'order/createOrderFulfilled',
);
export const createOrderRejected = createAction('order/createOrderRejected');

// Current user orders
export const getCurrentUserOrdersPending = createAction(
  'order/getCurrentUserOrdersPending',
);
export const getCurrentUserOrdersFulfilled = createAction<TCurrentUserOrder[]>(
  'order/getCurrentUserOrdersFulfilled',
);
export const getCurrentUserOrdersRejected = createAction(
  'order/getCurrentUserOrdersRejected',
);

// Current user order
export const getCurrentUserOrderPending = createAction(
  'order/getCurrentUserOrderPending',
);
export const getCurrentUserOrderFulfilled = createAction<TCurrentUserOrder>(
  'order/getCurrentUserOrderFulfilled',
);
export const getCurrentUserOrderRejected = createAction(
  'order/getCurrentUserOrderRejected',
);
