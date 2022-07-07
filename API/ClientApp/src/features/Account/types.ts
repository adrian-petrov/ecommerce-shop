import { TBillingAddress, TDeliveryAddress } from '../Basket/types';

export type TCurrentUser = {
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
  roles: string[];
};

export type TAuthenticateResponse = {
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
};

export type TAuthenticateRequest = {
  username: string;
  password: string;
};

export type TRegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type TAccountState = {
  user: TCurrentUser | null;
  billingAddress: TBillingAddress | null;
  orders: TCurrentUserOrder[];
  currentOrder: TCurrentUserOrder | null;
  signInStatus: AsyncStatus;
  signOutStatus: AsyncStatus;
  signUpStatus: AsyncStatus;
  refreshTokenStatus: AsyncStatus;
  ordersFetchStatus: AsyncStatus;
  orderFetchStatus: AsyncStatus;
  orderPlacedStatus: AsyncStatus;
  billingAddressStatus: AsyncStatus;
  updateUserDetailsStatus: AsyncStatus;
  updateEmailAddressStatus: AsyncStatus;
  updatePasswordStatus: AsyncStatus;
  updatePasswordError: string;
  updateEmailAddressError: string;
};

export type TCurrentUserOrder = {
  id: number;
  buyerEmail: string;
  orderDate: string;
  deliveryAddress: TDeliveryAddress;
  deliveryMethod: string;
  shippingPrice: number;
  orderItems: TOrderItem[];
  total: number;
  status: string;
};

export type TOrderItem = {
  productVariationId: number;
  productVariationString: string;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
};

export type TUserDetailsRequest = {
  email: string;
  firstName: string;
  lastName: string;
  billingAddress: TBillingAddress;
};

export type TUserDetailsResponse = {
  firstName: string;
  lastName: string;
  billingAddress: TBillingAddress;
};

export type TPasswordChangeResponse = {
  errors: string[];
  succeeded: boolean;
};

export enum AsyncStatus {
  Idle = 'IDLE',
  Pending = 'PENDING',
  Successful = 'SUCCESSFUL',
  Failed = 'FAILED',
}

export enum AuthExceptions {
  ACCESS_TOKEN_NOT_FOUND = 'ACCESS_TOKEN_NOT_FOUND',
  ACCESS_TOKEN_INVALID = 'ACCESS_TOKEN_INVALID',
  REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
}

export type TServerErrorResponse = {
  message: string;
};

export type TJwtToken = {
  name: string;
  id: string;
  role: string | string[];
  nbf: string;
  exp: string;
  iat: string;
  iss: string;
  aud: string;
};
