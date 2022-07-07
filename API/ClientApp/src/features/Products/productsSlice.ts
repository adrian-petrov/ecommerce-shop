import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { TBasketItem } from '../Basket/types';
import {
  getAutocompleteSuggestionsFulfilled,
  getFeaturedProductsFulfilled,
  getFeaturedProductsPending,
  getFeaturedProductsRejected,
  getProductFiltersFulfilled,
  getProductFulfilled,
  getProductPending,
  getProductRejected,
  getProductsFulfilled,
  getProductsPending,
  getProductsRejected,
  getSearchResultsFulfilled,
  getSearchResultsPending,
  getSearchResultsRejected,
  updateCurrentProductFulfilled,
} from './productsActions';
import {
  FetchStatus,
  TProduct,
  TProductsGetResponse,
  TProductsState,
} from './types';

const initialState: TProductsState = {
  pagination: {
    data: [],
    pageIndex: 1,
    pageSize: 6,
    count: 0,
  },
  filters: {
    types: [],
    brands: [],
    genders: [],
    colours: [],
    sizes: [],
    waists: [],
    lengths: [],
  },
  sort: [],
  featuredProducts: [],
  currentProduct: {
    product: null,
    imageUrl: '',
    variationString: '',
  },
  search: {
    results: {
      data: [],
      pageIndex: 1,
      pageSize: 6,
      count: 0,
    },
    autocomplete: [],
  },
  productsStatus: FetchStatus.Idle,
  productStatus: FetchStatus.Idle,
  featuredProductsStatus: FetchStatus.Idle,
  searchStatus: FetchStatus.Idle,
};

export const selectPagination = (state: RootState) => state.products.pagination;

export const selectProductsStatus = (state: RootState) =>
  state.products.productsStatus;

export const selectFeaturedProducts = (state: RootState) =>
  state.products.featuredProducts;

export const selectProductStatus = (state: RootState) =>
  state.products.productStatus;

export const selectSearchStatus = (state: RootState) =>
  state.products.searchStatus;

export const selectCurrentProduct = (state: RootState) =>
  state.products.currentProduct;

export const selectCurrentProductVariation = (state: RootState) => {
  return state.products.currentProduct.product?.productVariations.find(
    (pv) =>
      pv.variationString === state.products.currentProduct.variationString,
  );
};

export const selectCurrentVariationString = (state: RootState) =>
  state.products.currentProduct.variationString;

export const selectSearchResults = (state: RootState) =>
  state.products.search.results;

export const selectAutocompleteSuggestions = (state: RootState) =>
  state.products.search.autocomplete;

export const selectProductFilters = (state: RootState) =>
  state.products.filters;

export const selectProductSort = (state: RootState) => state.products.sort;

export const selectActiveFilters = (state: RootState) => {
  const { filters } = state.products;

  const selectedFilters = Object.keys(filters).reduce((acc, curr) => {
    const values = filters[curr]
      .filter((x) => x.isSelected === true)
      .map((p) => p.value);

    if (values.length) {
      acc[curr] = values;
    }
    return acc;
  }, {} as { [key: string]: string[] });
  return selectedFilters;
};

export const selectActiveSort = (state: RootState) => {
  const { sort } = state.products;
  const activeValue = sort
    .filter((x) => x.isSelected === true)
    .map((s) => s.value)[0];
  return activeValue;
};

// here we need the fromGetProductThunk param to ensure that we are
// updating the optionValues stock correctly
// if this is part of the initial request (on mount), we will need to substract
// the quantity from the optionValues once for each element of the basket
// otherwise, if we are running the function after a basket PUT request
// we only run the subtraction once per product as only one basket item
// can be added or updated per PUT request
export const updateProductVariationsAndOptionValuesStock = (
  basket: TBasketItem[],
  product: TProduct,
  fromGetProductThunk = false,
): TProduct => {
  // if the basket contains the current product
  // then update the product's product variations stock that are currently
  // in the basket with the stock quantities from the basket
  // the basket has already subtracted the quantities from the total stock
  // also, update the productOptionValues stock based on the basket's stock

  const activeBasketItems: TBasketItem[] = [];

  // 1. Update ProductVariations stock
  const updatedProductVariations = product.productVariations.map((pv) => {
    const matchingBasketItem = basket.find(
      (b) => b.productVariationId === pv.id,
    );

    if (matchingBasketItem) {
      activeBasketItems.push(matchingBasketItem);
    }

    return matchingBasketItem
      ? {
          ...pv,
          totalStock: Math.max(
            matchingBasketItem.stock - matchingBasketItem.quantity,
            0,
          ),
        }
      : pv;
  });
  product.productVariations = updatedProductVariations;

  // 2. Update ProductOptionValues
  // Subtract quantity from stocks only once per product
  const productSeen: { [key: number]: boolean } = {};
  activeBasketItems.forEach((bi) => {
    if (productSeen[bi.productId]) return;

    const colourOptionValues = product.productOptions.find(
      (po) => po.name === 'Colour',
    )?.productOptionValues;

    // Update colour stock
    const currColour = colourOptionValues?.find((c) => c.name === bi.colour);
    currColour!.stock = currColour!.stock - bi.quantity;

    // Update size stock
    if (bi.size) {
      const currSizeOptionValues = product.productOptions.find(
        (po) => po.name === 'Size',
      )?.productOptionValues;

      const currSize = currSizeOptionValues?.find((s) => s.name === bi.size);
      currSize!.stock = currSize!.stock - bi.quantity;
    }

    // Update waist stock
    if (bi.waist) {
      const currWaistOptionValues = product.productOptions.find(
        (po) => po.name === 'Waist',
      )?.productOptionValues;

      const currWaist = currWaistOptionValues?.find((s) => s.name === bi.waist);
      currWaist!.stock = currWaist!.stock - bi.quantity;
    }

    // Update length stock
    if (bi.length) {
      const currLengthOptionValues = product.productOptions.find(
        (po) => po.name === 'Length',
      )?.productOptionValues;

      const currLength = currLengthOptionValues?.find(
        (s) => s.name === bi.length,
      );
      currLength!.stock = currLength!.stock - bi.quantity;
    }

    productSeen[bi.productId] = !fromGetProductThunk;
  });

  return product;
};

const addStockBackToProductVariationsAndOptionValues = (
  product: TProduct,
  removedId: number,
) => {
  const productVariation = product.productVariations.find(
    (pv) => pv.id === removedId,
  );

  if (productVariation === undefined) return;

  productVariation.totalStock += 1;

  const variationStringArr = productVariation.variationString.split('_');

  // Update colour
  const colours = product.productOptions.find(
    (po) => po.name === 'Colour',
  )?.productOptionValues;
  const colourToUpdate = colours?.find(
    (pov) => pov.name.replace(' ', '') === variationStringArr[3],
  );
  colourToUpdate!.stock += 1;

  // Update size
  if (
    variationStringArr[1] === 'T-Shirts' ||
    variationStringArr[1] === 'Shoes'
  ) {
    const sizes = product.productOptions.find(
      (po) => po.name === 'Size',
    )?.productOptionValues;
    const sizeToUpdate = sizes?.find(
      (pov) => pov.name === variationStringArr[4],
    );
    sizeToUpdate!.stock += 1;
  }

  if (variationStringArr[1] === 'Shorts') {
    const waists = product.productOptions.find(
      (po) => po.name === 'Waist',
    )?.productOptionValues;
    const waistToUpdate = waists?.find(
      (pov) => pov.name === variationStringArr[4],
    );
    waistToUpdate!.stock += 1;
  }

  if (variationStringArr[1] === 'Trousers') {
    const waists = product.productOptions.find(
      (po) => po.name === 'Waist',
    )?.productOptionValues;
    const waistToUpdate = waists?.find(
      (pov) => pov.name === variationStringArr[4],
    );
    waistToUpdate!.stock += 1;

    const lengths = product.productOptions.find(
      (po) => po.name === 'Length',
    )?.productOptionValues;
    const lengthToUpdate = lengths?.find(
      (pov) => pov.name === variationStringArr[5],
    );
    lengthToUpdate!.stock += 1;
  }
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetCurrentProduct: (state) => {
      state.currentProduct.product = null;
    },
    resetCurrentProductVariationString: (state) => {
      state.currentProduct.variationString = '';
    },
    resetCurrentProductImageUrl: (state) => {
      state.currentProduct.imageUrl = '';
    },
    setCurrentProductImageUrl: (state, action: PayloadAction<string>) => {
      state.currentProduct.imageUrl = action.payload;
    },
    setProductsFilter: (
      state,
      action: PayloadAction<[filter: string, filterValue: string]>,
    ) => {
      const [filter, filterValue] = action.payload;
      const index = state.filters[filter].findIndex(
        (x) => x.value === filterValue,
      );

      state.filters[filter][index].isSelected =
        !state.filters[filter][index].isSelected;
    },
    resetProductsFilter: (state) => {
      const { filters } = state;

      Object.keys(filters).forEach((f) => {
        filters[f].forEach((value) => {
          value.isSelected = false;
        });
      });
    },
    setProductsSort: (state, action: PayloadAction<string>) => {
      state.sort.forEach((s) => {
        if (action.payload !== s.value) {
          s.isSelected = false;
        } else {
          s.isSelected = true;
        }
      });
    },
    setCurrentProductVariationString: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.currentProduct.variationString = action.payload;
    },
    resetSearchAutocomplete: (state) => {
      state.search.autocomplete = [];
    },
  },
  extraReducers: (builder) => (
    // Paginated products
    builder.addCase(getProductsPending, (state) => {
      state.productsStatus = FetchStatus.Loading;
    }),
    builder.addCase(
      getProductsFulfilled,
      (state, action: PayloadAction<TProductsGetResponse>) => {
        state.productsStatus = FetchStatus.Success;

        const { pageIndex, pageSize, count, data } = action.payload;
        state.pagination.data = [...data];
        state.pagination.pageIndex = pageIndex;
        state.pagination.pageSize = pageSize;
        state.pagination.count = count;
      },
    ),
    builder.addCase(getProductsRejected, (state) => {
      state.productsStatus = FetchStatus.Failed;
    }),
    // Single product
    builder.addCase(getProductPending, (state) => {
      state.productStatus = FetchStatus.Loading;
    }),
    builder.addCase(getProductFulfilled, (state, action) => {
      state.productStatus = FetchStatus.Success;

      state.currentProduct.product = action.payload;
      state.currentProduct.imageUrl =
        action.payload.productVariations[0].imageUrl;
    }),
    builder.addCase(getProductRejected, (state) => {
      state.productStatus = FetchStatus.Failed;
    }),
    // Update current product after basket change
    builder.addCase(updateCurrentProductFulfilled, (state, action) => {
      if (!state.currentProduct.product) return;

      const { product } = state.currentProduct;
      const { oldBasket, newBasket } = action.payload;

      const itemsDictionary = new Map();
      newBasket.forEach((newItem) =>
        itemsDictionary.set(newItem.productVariationId, 0),
      );

      oldBasket.forEach((oldItem) => {
        if (!itemsDictionary.has(oldItem.productVariationId)) {
          itemsDictionary.set(oldItem.productVariationId, 1);
        }
      });

      let removedProductVariationId = 0;
      itemsDictionary.forEach((value, key) => {
        removedProductVariationId = value === 1 ? key : null;
      });

      // Basket item has been removed
      if (removedProductVariationId) {
        addStockBackToProductVariationsAndOptionValues(
          product,
          removedProductVariationId,
        );
      }

      // Basket item has been added
      const newProduct = updateProductVariationsAndOptionValuesStock(
        newBasket,
        product,
      );
      state.currentProduct.product = newProduct;
    }),
    // Featured products
    builder.addCase(getFeaturedProductsPending, (state) => {
      state.featuredProductsStatus = FetchStatus.Loading;
    }),
    builder.addCase(getFeaturedProductsFulfilled, (state, action) => {
      state.featuredProductsStatus = FetchStatus.Success;
      state.featuredProducts = action.payload.data;
    }),
    builder.addCase(getFeaturedProductsRejected, (state) => {
      state.featuredProductsStatus = FetchStatus.Failed;
    }),
    // Filters
    builder.addCase(getProductFiltersFulfilled, (state, action) => {
      state.filters.types = action.payload.types.map((type) => {
        return {
          value: type.name,
          isSelected: false,
        };
      });

      state.filters.brands = action.payload.brands.map((brand) => {
        return {
          value: brand.name,
          isSelected: false,
        };
      });

      action.payload.options.forEach((option) => {
        if (option.name === 'Gender') {
          state.filters.genders = option.values.map((o) => {
            return {
              value: o,
              isSelected: false,
            };
          });
        }
        if (option.name === 'Colour') {
          state.filters.colours = option.values.map((o) => {
            return {
              value: o,
              isSelected: false,
            };
          });
        }
        if (option.name === 'Size') {
          state.filters.sizes = option.values.map((o) => {
            return {
              value: o,
              isSelected: false,
            };
          });
        }
        if (option.name === 'Waist') {
          state.filters.waists = option.values.map((o) => {
            return {
              value: o,
              isSelected: false,
            };
          });
        }
        if (option.name === 'Length') {
          state.filters.lengths = option.values.map((o) => {
            return {
              value: o,
              isSelected: false,
            };
          });
        }
      });

      // Sort options
      action.payload.sortOptions.forEach((o) => {
        if (o === 'nameAsc') {
          state.sort.push({
            value: o,
            valueTitle: 'Name (A - Z)',
            isSelected: true,
          });
        }

        if (o === 'nameDesc') {
          state.sort.push({
            value: o,
            valueTitle: 'Name (Z - A)',
            isSelected: false,
          });
        }

        if (o === 'priceAsc') {
          state.sort.push({
            value: o,
            valueTitle: 'Price (Low - High)',
            isSelected: false,
          });
        }

        if (o === 'priceDesc') {
          state.sort.push({
            value: o,
            valueTitle: 'Price (High - Low)',
            isSelected: false,
          });
        }
      });
    }),
    // Search results
    builder.addCase(getSearchResultsPending, (state) => {
      state.searchStatus = FetchStatus.Loading;
    }),
    builder.addCase(getSearchResultsRejected, (state) => {
      state.searchStatus = FetchStatus.Failed;
    }),
    builder.addCase(getSearchResultsFulfilled, (state, action) => {
      state.searchStatus = FetchStatus.Success;

      const { pageIndex, pageSize, count, results } = action.payload;
      state.search.results.data = [...results];
      state.search.results.pageIndex = pageIndex;
      state.search.results.pageSize = pageSize;
      state.search.results.count = count;
    }),
    // Search suggestions
    builder.addCase(getAutocompleteSuggestionsFulfilled, (state, action) => {
      state.search.autocomplete = action.payload;
    })
  ),
});

export const {
  resetCurrentProduct,
  resetCurrentProductVariationString,
  resetCurrentProductImageUrl,
  setCurrentProductVariationString,
  setCurrentProductImageUrl,
  setProductsFilter,
  resetProductsFilter,
  setProductsSort,
  resetSearchAutocomplete,
} = productsSlice.actions;
export default productsSlice.reducer;
