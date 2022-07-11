import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import { RootState } from '../../app/store';
import { TBillingAddress } from '../Basket/types';
import {
  getCurrentUserBillingAddressFulfilled,
  getCurrentUserBillingAddressPending,
  getCurrentUserBillingAddressRejected,
  getCurrentUserFulfilled,
  refreshTokenFulfilled,
  refreshTokenPending,
  refreshTokenRejected,
  signInFulfilled,
  signInPending,
  signInRejected,
  signOutFulfilled,
  signOutPending,
  signOutRejected,
  signUpFulfilled,
  signUpPending,
  signUpRejected,
  updateEmailAddressFulfilled,
  updateEmailAddressPending,
  updateEmailAddressRejected,
  updatePasswordFulfilled,
  updatePasswordPending,
  updatePasswordRejected,
  updateUserDetailsFulfilled,
  updateUserDetailsPending,
  updateUserDetailsRejected,
} from './accountActions';
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
import {
  AsyncStatus,
  TAccountState,
  TAuthenticateResponse,
  TCurrentUser,
  TCurrentUserOrder,
  TJwtToken,
  TPasswordChangeResponse,
  TServerErrorResponse,
} from './types';

const initialState: TAccountState = {
  user: null,
  billingAddress: null,
  orders: [],
  currentOrder: null,
  signInStatus: AsyncStatus.Idle,
  signOutStatus: AsyncStatus.Idle,
  signUpStatus: AsyncStatus.Idle,
  refreshTokenStatus: AsyncStatus.Idle,
  ordersFetchStatus: AsyncStatus.Idle,
  orderFetchStatus: AsyncStatus.Idle,
  orderPlacedStatus: AsyncStatus.Idle,
  billingAddressStatus: AsyncStatus.Idle,
  updateUserDetailsStatus: AsyncStatus.Idle,
  updateEmailAddressStatus: AsyncStatus.Idle,
  updatePasswordStatus: AsyncStatus.Idle,
  updatePasswordError: '',
  updateEmailAddressError: '',
};

export const selectUser = (state: RootState) => state.account.user;
export const selectRefreshTokenStatus = (state: RootState) =>
  state.account.refreshTokenStatus;
export const selectSignInStatus = (state: RootState) =>
  state.account.signInStatus;
export const selectSignUpStatus = (state: RootState) =>
  state.account.signUpStatus;
export const selectLastPlacedOrder = (state: RootState) =>
  state.account.orders[state.account.orders.length - 1];
export const selectBillingAddress = (state: RootState) =>
  state.account.billingAddress;

const parseJwtRoles = (token: string): string[] => {
  const parsedToken: TJwtToken = jwtDecode(token);
  const result: string[] = [];

  if (Array.isArray(parsedToken.role)) {
    parsedToken.role.forEach((x) => {
      result.push(x.toLowerCase());
    });
    return result;
  }

  result.push(parsedToken.role.toLowerCase());
  return result;
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    resetOrderPlacedStatus: (state) => {
      state.orderPlacedStatus = AsyncStatus.Idle;
    },
    setBillingAddress: (state, action: PayloadAction<TBillingAddress>) => {
      state.billingAddress = action.payload;
    },
    resetBillingAddress: (state) => {
      state.billingAddress = null;
    },
    resetSignInStatus: (state) => {
      state.signInStatus = AsyncStatus.Idle;
    },
    resetRefreshTokenStatus: (state) => {
      state.refreshTokenStatus = AsyncStatus.Idle;
    },
    resetUpdateUserDetailsStatus: (state) => {
      state.updateUserDetailsStatus = AsyncStatus.Idle;
    },
    resetUpdateEmailAddressStatus: (state) => {
      state.updateEmailAddressStatus = AsyncStatus.Idle;
    },
    resetUpdatePasswordStatus: (state) => {
      state.updatePasswordStatus = AsyncStatus.Idle;
    },
    resetCurrentUserOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => (
    // Sign in
    builder.addCase(signInPending, (state) => {
      state.signInStatus = AsyncStatus.Pending;
    }),
    builder.addCase(signInRejected, (state) => {
      state.signInStatus = AsyncStatus.Failed;
    }),
    builder.addCase(
      signInFulfilled,
      (state, action: PayloadAction<TAuthenticateResponse>) => {
        state.signInStatus = AsyncStatus.Successful;
        state.user = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          accessToken: action.payload.accessToken,
          roles: parseJwtRoles(action.payload.accessToken),
        };
      },
    ),
    // Sign out
    builder.addCase(signOutPending, (state) => {
      state.signOutStatus = AsyncStatus.Pending;
    }),
    builder.addCase(signOutRejected, (state) => {
      state.signOutStatus = AsyncStatus.Failed;
    }),
    builder.addCase(signOutFulfilled, (state) => {
      state.signOutStatus = AsyncStatus.Successful;
      state.user = null;
      state.billingAddress = null;
      state.billingAddressStatus = AsyncStatus.Idle;
    }),
    // Sign up
    builder.addCase(signUpPending, (state) => {
      state.signUpStatus = AsyncStatus.Pending;
    }),
    builder.addCase(signUpRejected, (state) => {
      state.signUpStatus = AsyncStatus.Failed;
    }),
    builder.addCase(
      signUpFulfilled,
      (state, action: PayloadAction<TAuthenticateResponse>) => {
        state.signUpStatus = AsyncStatus.Successful;
        state.user = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          accessToken: action.payload.accessToken,
          roles: parseJwtRoles(action.payload.accessToken),
        };
      },
    ),
    // Refresh token
    builder.addCase(refreshTokenPending, (state) => {
      state.refreshTokenStatus = AsyncStatus.Pending;
    }),
    builder.addCase(refreshTokenRejected, (state) => {
      state.refreshTokenStatus = AsyncStatus.Failed;
    }),
    builder.addCase(
      refreshTokenFulfilled,
      (state, action: PayloadAction<TAuthenticateResponse>) => {
        state.refreshTokenStatus = AsyncStatus.Successful;
        state.user = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          accessToken: action.payload.accessToken,
          roles: parseJwtRoles(action.payload.accessToken),
        };
      },
    ),
    builder.addCase(
      getCurrentUserFulfilled,
      (state, action: PayloadAction<TCurrentUser>) => {
        state.signInStatus = AsyncStatus.Successful;
        state.user = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          accessToken: action.payload.accessToken,
          roles: parseJwtRoles(action.payload.accessToken),
        };
      },
    ),
    // Get current user orders
    builder.addCase(getCurrentUserOrdersPending, (state) => {
      state.ordersFetchStatus = AsyncStatus.Pending;
    }),
    builder.addCase(getCurrentUserOrdersRejected, (state) => {
      state.ordersFetchStatus = AsyncStatus.Failed;
    }),
    builder.addCase(
      getCurrentUserOrdersFulfilled,
      (state, action: PayloadAction<TCurrentUserOrder[]>) => {
        state.orders = action.payload;
        state.ordersFetchStatus = AsyncStatus.Successful;
      },
    ),
    // Get current user order
    builder.addCase(getCurrentUserOrderPending, (state) => {
      state.orderFetchStatus = AsyncStatus.Pending;
    }),
    builder.addCase(getCurrentUserOrderRejected, (state) => {
      state.orderFetchStatus = AsyncStatus.Failed;
    }),
    builder.addCase(
      getCurrentUserOrderFulfilled,
      (state, action: PayloadAction<TCurrentUserOrder>) => {
        state.currentOrder = action.payload;
        state.ordersFetchStatus = AsyncStatus.Successful;
      },
    ),
    // Get current user billing address
    builder.addCase(getCurrentUserBillingAddressPending, (state) => {
      state.billingAddressStatus = AsyncStatus.Pending;
    }),
    builder.addCase(
      getCurrentUserBillingAddressFulfilled,
      (state, action: PayloadAction<TBillingAddress>) => {
        state.billingAddressStatus = AsyncStatus.Successful;
        state.billingAddress = action.payload;
      },
    ),
    builder.addCase(getCurrentUserBillingAddressRejected, (state) => {
      state.billingAddressStatus = AsyncStatus.Failed;
    }),
    // Create order
    builder.addCase(createOrderPending, (state) => {
      state.orderPlacedStatus = AsyncStatus.Pending;
    }),
    builder.addCase(createOrderRejected, (state) => {
      state.orderPlacedStatus = AsyncStatus.Failed;
    }),
    builder.addCase(
      createOrderFulfilled,
      (state, action: PayloadAction<TCurrentUserOrder>) => {
        state.orderPlacedStatus = AsyncStatus.Successful;
        state.orders.push(action.payload); // TODO: not sure about this implementation
      },
    ),
    // Update user details
    builder.addCase(updateUserDetailsPending, (state) => {
      state.updateUserDetailsStatus = AsyncStatus.Pending;
    }),
    builder.addCase(updateUserDetailsFulfilled, (state) => {
      state.updateUserDetailsStatus = AsyncStatus.Successful;
    }),
    builder.addCase(updateUserDetailsRejected, (state) => {
      state.updateUserDetailsStatus = AsyncStatus.Failed;
    }),
    // Update email address
    builder.addCase(updateEmailAddressPending, (state) => {
      state.updateEmailAddressStatus = AsyncStatus.Pending;
    }),
    builder.addCase(
      updateEmailAddressFulfilled,
      (state, action: PayloadAction<TAuthenticateResponse>) => {
        state.updateEmailAddressStatus = AsyncStatus.Successful;
        state.user = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          accessToken: action.payload.accessToken,
          roles: parseJwtRoles(action.payload.accessToken),
        };
      },
    ),
    builder.addCase(
      updateEmailAddressRejected,
      (state, action: PayloadAction<TServerErrorResponse>) => {
        state.updateEmailAddressStatus = AsyncStatus.Failed;
        state.updateEmailAddressError = action.payload.message;
      },
    ),
    // Update password
    builder.addCase(updatePasswordPending, (state) => {
      state.updatePasswordStatus = AsyncStatus.Pending;
    }),
    builder.addCase(
      updatePasswordFulfilled,
      (state, action: PayloadAction<TPasswordChangeResponse>) => {
        if (!action.payload.succeeded) {
          state.updatePasswordError = action.payload.errors[0];
          state.updatePasswordStatus = AsyncStatus.Failed;
          return;
        }
        state.updatePasswordStatus = AsyncStatus.Successful;
      },
    ),
    builder.addCase(updatePasswordRejected, (state) => {
      state.updatePasswordStatus = AsyncStatus.Failed;
    })
  ),
});

export const {
  resetOrderPlacedStatus,
  setBillingAddress,
  resetBillingAddress,
  resetSignInStatus,
  resetRefreshTokenStatus,
  resetUpdateUserDetailsStatus,
  resetUpdateEmailAddressStatus,
  resetUpdatePasswordStatus,
  resetCurrentUserOrder,
} = accountSlice.actions;

export default accountSlice.reducer;
