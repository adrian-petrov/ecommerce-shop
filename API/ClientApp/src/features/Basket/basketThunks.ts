import basketApi from '../../api/basketApi';
import { AppThunk } from '../../app/store';
import { updateCurrentProductFulfilled } from '../Products/productsActions';
import { getProductById } from '../Products/productsThunks';
import { TBasketUpdateResponse } from '../Products/types';
import {
  getDeliveryMethodsFulfilled,
  getDeliveryMethodsPending,
  getDeliveryMethodsRejected,
  updateBasketFulfilled,
  updateBasketPending,
  updateBasketRejected,
} from './basketActions';
import { setShowBasketOverlay } from './basketSlice';
import { AsyncStatus, TBasket, TBasketItemRequest } from './types';

export const updateBasket =
  (basketItem: TBasketItemRequest, fromBasketOverlay = false): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    dispatch(updateBasketPending());

    const {
      basket: { basket: oldBasket },
    } = getState();

    let response: TBasket;
    try {
      response = await basketApi.putBasketItemAsync(basketItem);
    } catch (err) {
      dispatch(updateBasketRejected());
      return;
    }
    dispatch(updateBasketFulfilled(response));

    if (!fromBasketOverlay) {
      dispatch(setShowBasketOverlay(true));
    }

    const basketUpdateReponse: TBasketUpdateResponse = {
      oldBasket,
      newBasket: response.items,
    };

    // update product variations and their respective optionValues stock
    dispatch(updateCurrentProductFulfilled(basketUpdateReponse));
  };

export const getBasket =
  (): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    const {
      basket: { basketStatus },
    } = getState();

    if (basketStatus === AsyncStatus.Pending) return;

    dispatch(updateBasketPending());

    let response;

    try {
      response = await basketApi.getBasketAsync();
    } catch (err) {
      dispatch(updateBasketRejected());
      return;
    }
    dispatch(updateBasketFulfilled(response));
  };

export const getBasketThenGetProductById =
  (productId: number): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(updateBasketPending());

    let response: TBasket;

    try {
      response = await basketApi.getBasketAsync();
    } catch (err) {
      dispatch(updateBasketRejected());
      return;
    }
    dispatch(updateBasketFulfilled(response));
    dispatch(getProductById(productId));
  };

export const deleteBasket = (): AppThunk => async (): Promise<void> => {
  await basketApi.deleteBasketAsync();
};

export const getDeliveryMethods =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(getDeliveryMethodsPending());

    let response;

    try {
      response = await basketApi.getDeliveryMethodsAsync();
    } catch (err) {
      dispatch(getDeliveryMethodsRejected());
      return;
    }
    dispatch(getDeliveryMethodsFulfilled(response));
  };
