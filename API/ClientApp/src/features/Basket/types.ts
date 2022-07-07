export enum AsyncStatus {
  Idle = 'IDLE',
  Pending = 'PENDING',
  Successful = 'SUCCESSFUL',
  Failed = 'FAILED',
}

export type TBasketItem = {
  productVariationId: number;
  productId: number;
  productVariationString: string;
  colour: string;
  size: string;
  waist: string;
  length: string;
  productName: string;
  productType: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
};

export type TBasketItemRequest = {
  productVariationId: number;
  price: number;
  quantity: number;
};

export type TBasket = {
  items: TBasketItem[];
};

export type TBasketItemWithOptionValues = {
  productVariationId: number;
  productVariationString?: string;
  productType: string;
  quantity: number;
  optionValues: {
    colour: string;
    size?: string;
    waist?: string;
    length?: string;
  };
};

export type TDeliveryMethodResponse = {
  id: number;
  shortName: string;
  deliveryTime: string;
  price: number;
};

export type TDeliveryMethod = {
  id: number;
  shortName: string;
  deliveryTime: string;
  price: number;
  isSelected: boolean;
};

export type TBasketState = {
  basket: TBasketItem[];
  basketItemsWithOptionValues: TBasketItemWithOptionValues[];
  basketTotal: number;
  basketItemsCount: number;
  basketStatus: AsyncStatus;
  lastFocusedInput: {
    [key: number]: string;
  };
  showBasketOverlay: boolean;
  deliveryMethods: TDeliveryMethod[];
  deliveryMethodsStatus: AsyncStatus;
  deliveryAddress: TDeliveryAddress | null;
};

export type TDeliveryAddress = {
  firstName: string;
  lastName: string;
  street1: string;
  street2: string;
  town: string;
  county: string;
  postcode: string;
};

export type TBillingAddress = {
  street1: string;
  street2: string;
  town: string;
  county: string;
  postcode: string;
};

export type TOrder = {
  buyerEmail: string;
  orderDate: string;
  shippingAddress: string;
  deliveryMethod: TDeliveryMethod;
  orderItems: TProductItemOrdered[];
  subtotal: number;
  status: OrderStatus;
};

export type TProductItemOrdered = {
  productVariationId: number;
  productName: string;
  pictureUrl: string;
};

export enum OrderStatus {
  Pending = 'Pending',
  PaymentReceived = 'Payment Received',
  PaymentFailed = 'Payment Failed',
}
