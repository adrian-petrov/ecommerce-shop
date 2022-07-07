import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  getDeliveryMethodsFulfilled,
  getDeliveryMethodsPending,
  getDeliveryMethodsRejected,
  updateBasketFulfilled,
  updateBasketPending,
  updateBasketRejected,
} from './basketActions';
import {
  AsyncStatus,
  TBasket,
  TBasketItem,
  TBasketState,
  TDeliveryAddress,
  TDeliveryMethodResponse,
} from './types';

const initialState: TBasketState = {
  basket: [],
  basketItemsCount: 0,
  basketTotal: 0,
  basketItemsWithOptionValues: [],
  basketStatus: AsyncStatus.Idle,
  lastFocusedInput: {},
  showBasketOverlay: false,
  deliveryMethods: [],
  deliveryMethodsStatus: AsyncStatus.Idle,
  deliveryAddress: null,
};

export const selectBasket = (state: RootState) => state.basket.basket;

export const selectBasketItemsCount = (state: RootState) =>
  state.basket.basketItemsCount;

export const selectBasketTotal = (state: RootState) => {
  return state.basket.basketTotal.toFixed(2);
};

export const selectBasketStatus = (state: RootState) =>
  state.basket.basketStatus;

export const selectBasketOverlayStatus = (state: RootState) =>
  state.basket.showBasketOverlay;

export const selectBasketItemQuantities = (state: RootState) => {
  return state.basket.basket.reduce((result, curr) => {
    result[curr.productVariationId] = curr.quantity;
    return result;
  }, {} as { [key: number]: number });
};

export const selectBasketItemsWithOptionValues = (state: RootState) =>
  state.basket.basketItemsWithOptionValues;

export const selectLastFocusedInput = (state: RootState) =>
  state.basket.lastFocusedInput;

export const selectDeliveryMethods = (state: RootState) =>
  state.basket.deliveryMethods;

export const selectCurrentDeliveryMethod = (state: RootState) => {
  return state.basket.deliveryMethods.find((x) => x.isSelected === true);
};

const updateBasketTotal = (basketArr: TBasketItem[]) =>
  basketArr.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

const updateBasketItemsCount = (basketArr: TBasketItem[]) =>
  basketArr.reduce((acc, curr) => acc + curr.quantity, 0);

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setShowBasketOverlay: (state, action: PayloadAction<boolean>) => {
      state.showBasketOverlay = action.payload;
    },
    setLastFocusedInput: (state, action: PayloadAction<[number, string]>) => {
      state.lastFocusedInput = {};
      state.lastFocusedInput[action.payload[0]] = action.payload[1];
    },
    resetBasket: (state) => {
      state.basket = [];
      state.basketItemsCount = 0;
      state.basketTotal = 0;
      state.basketStatus = AsyncStatus.Idle;
    },
    setCurrentDeliveryMethod: (state, action: PayloadAction<number>) => {
      state.deliveryMethods = state.deliveryMethods.map((dm) => {
        if (dm.id === action.payload) {
          return {
            ...dm,
            isSelected: true,
          };
        }
        return {
          ...dm,
          isSelected: false,
        };
      });
    },
    setDeliveryAddress: (state, action: PayloadAction<TDeliveryAddress>) => {
      state.deliveryAddress = action.payload;
    },
    resetDeliveryAddress: (state) => {
      state.deliveryAddress = null;
    },
  },
  extraReducers: (builder) => (
    // Basket
    builder.addCase(updateBasketPending, (state) => {
      state.basketStatus = AsyncStatus.Pending;
    }),
    builder.addCase(
      updateBasketFulfilled,
      (state, action: PayloadAction<TBasket>) => {
        state.basketStatus = AsyncStatus.Successful;

        state.basket = action.payload.items.map((i) => ({
          ...i,
          stock: i.stock - i.quantity,
        }));
        state.basketTotal = updateBasketTotal(state.basket);
        state.basketItemsCount = updateBasketItemsCount(state.basket);
      },
    ),
    builder.addCase(updateBasketRejected, (state) => {
      state.basketStatus = AsyncStatus.Failed;
    }),
    // Delivery methods
    builder.addCase(getDeliveryMethodsPending, (state) => {
      state.deliveryMethodsStatus = AsyncStatus.Pending;
    }),
    builder.addCase(
      getDeliveryMethodsFulfilled,
      (state, action: PayloadAction<TDeliveryMethodResponse[]>) => {
        state.deliveryMethodsStatus = AsyncStatus.Successful;
        state.deliveryMethods = action.payload.map((dm) => {
          if (dm.id === 1) {
            return {
              ...dm,
              isSelected: true,
            };
          }
          return {
            ...dm,
            isSelected: false,
          };
        });
      },
    ),
    builder.addCase(getDeliveryMethodsRejected, (state) => {
      state.deliveryMethodsStatus = AsyncStatus.Failed;
    })
  ),
});

export const {
  setShowBasketOverlay,
  setLastFocusedInput,
  resetBasket,
  setCurrentDeliveryMethod,
  setDeliveryAddress,
  resetDeliveryAddress,
} = basketSlice.actions;

export default basketSlice.reducer;
