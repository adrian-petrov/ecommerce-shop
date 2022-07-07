import React, { MouseEvent, ReactElement } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  resetCurrentProductVariationString,
  selectCurrentProduct,
  selectCurrentProductVariation,
  setCurrentProductImageUrl,
  setCurrentProductVariationString,
} from '../../productsSlice';
import {
  TProduct,
  TProductOption,
  TProductOptionValue,
  TProductVariation,
} from '../../types';
import SizeBase from './SizeBase';
import Sizes from './Sizes';
import SwatchColour from './SwatchColour';
import Swatches from './Swatches';

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

type TOptionValueStock = {
  name: string;
  stock: number;
};

const ProductVariationBuilder = (): ReactElement => {
  const dispatch = useAppDispatch();

  const [allColours, setAllColours] = React.useState<
    TProductOptionValue[] | null
  >(null);
  const [allSizes, setAllSizes] = React.useState<TProductOptionValue[] | null>(
    null,
  );
  const [allWaists, setAllWaists] = React.useState<
    TProductOptionValue[] | null
  >(null);
  const [allLengths, setAllLengths] = React.useState<
    TProductOptionValue[] | null
  >(null);

  const [selectedColour, setSelectedColour] = React.useState('');
  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedWaist, setSelectedWaist] = React.useState('');
  const [selectedLength, setSelectedLength] = React.useState('');

  const [coloursStockAvailability, setColoursStockAvailability] =
    React.useState<TOptionValueStock[] | null>(null);
  const [sizesStockAvailability, setSizesStockAvailability] = React.useState<
    TOptionValueStock[] | null
  >(null);
  const [waistsStockAvailability, setWaistsStockAvailability] = React.useState<
    TOptionValueStock[] | null
  >(null);
  const [lengthsStockAvailability, setLengthsStockAvailability] =
    React.useState<TOptionValueStock[] | null>(null);

  const currentProduct = useAppSelector(selectCurrentProduct);
  const currentProductVariation = useAppSelector(selectCurrentProductVariation);

  // On mount set the default state
  React.useEffect(() => {
    if (!currentProduct || !currentProduct.product) return;
    const { product } = currentProduct;

    const colours = product.productOptions.find(
      (po) => po.name === 'Colour',
    )?.productOptionValues;
    setAllColours(colours ?? null);
    setSelectedColour(colours ? colours[0].name : '');

    const sizes = product.productOptions.find(
      (po) => po.name === 'Size',
    )?.productOptionValues;
    setAllSizes(sizes ?? null);

    const waists = product.productOptions.find(
      (po) => po.name === 'Waist',
    )?.productOptionValues;
    setAllWaists(waists ?? null);

    const lengths = product.productOptions.find(
      (po) => po.name === 'Length',
    )?.productOptionValues;
    setAllLengths(lengths ?? null);

    // update individual optionValue stock availability
    const coloursStock: TOptionValueStock[] =
      colours
        ?.filter((x) => x.stock > 0)
        ?.map((c) => ({ name: c.name, stock: c.stock })) || [];

    setColoursStockAvailability(coloursStock);

    const gender = getGenderValue(product.productOptions);
    const pattern = `${product.brand}_${
      product.type
    }_${gender}_${colours![0].name.replace(' ', '')}.+`;

    const variationsWithStock = getProductVariationsWithStockByRegEx(
      product,
      pattern,
    );

    if (sizes && sizes.length) {
      updateSizesStock(variationsWithStock, sizes);
    }
    if (waists && waists.length) {
      updateWaistsStock(variationsWithStock, waists);
    }
    if (lengths && lengths.length) {
      updateLengthsStock(variationsWithStock, lengths);
    }
  }, []);

  // Update the image on colour change
  React.useEffect(() => {
    if (!currentProduct || !currentProduct.product) return;

    const newImageUrl = currentProduct.product.productVariations.find((pv) =>
      pv.variationString.includes(selectedColour.replace(' ', '')),
    )?.imageUrl;

    if (!newImageUrl) return;

    dispatch(setCurrentProductImageUrl(newImageUrl));
  }, [selectedColour]);

  // Whenever an optionValue is selected, check if the variation is complete
  // If it's complete, build the variation string and update the global state
  React.useEffect(() => {
    if (!currentProduct || !currentProduct.product) return;

    // we don't know ahead of time which options will contain data
    // tshirts don't have a waist or length option
    const options = [
      selectedColour,
      selectedSize,
      selectedWaist,
      selectedLength,
    ].filter((o) => o.length > 0);

    // user has selected all options
    const { productOptions } = currentProduct.product;
    if (productOptions.length - 1 === options.length) {
      const product = currentProduct && (currentProduct.product as TProduct);
      const gender = product.productOptions.find((x) => x.name === 'Gender')
        ?.productOptionValues[0];

      if (!gender) return;

      options.unshift(product.brand, product.type, gender.name);
      const variationString = options.join('_').replace(' ', '');

      dispatch(setCurrentProductVariationString(variationString));
    }
  }, [selectedColour, selectedSize, selectedWaist, selectedLength]);

  // Update stock once more when an item is added to the basket
  React.useEffect(() => {
    if (!currentProductVariation || !currentProduct || !currentProduct.product)
      return;

    const variationStringArray =
      currentProductVariation.variationString.split('_');
    let pattern = '';

    // T-Shirts & Shoes
    if (allSizes) {
      pattern = variationStringArray.slice(0, 4).join('_');
      const variationsWithStock = getProductVariationsWithStockByRegEx(
        currentProduct.product,
        pattern,
      );
      updateSizesStock(variationsWithStock, allSizes);

      return;
    }

    // Shorts
    if (allWaists && !allLengths) {
      pattern = variationStringArray.slice(0, 4).join('_');
      const variationsWithStock = getProductVariationsWithStockByRegEx(
        currentProduct.product,
        pattern,
      );
      updateWaistsStock(variationsWithStock, allWaists);

      return;
    }

    // Trousers
    if (allWaists && allLengths) {
      const waistName = variationStringArray[variationStringArray.length - 2];
      const lengthName = variationStringArray[variationStringArray.length - 1];

      updateWaistsStockByLength(lengthName);
      updateLengthsStockByWaist(waistName);
    }
  }, [currentProduct.product]);

  const handleColourChange = (e: MouseEvent<HTMLSpanElement>) => {
    const colourId = e.currentTarget.getAttribute('data-option-value');
    const colour = allColours?.find((x) => x.id === Number(colourId));

    if (colour === undefined) return;

    setSelectedColour(colour.name);
    if (allSizes || allWaists || allLengths) {
      setSelectedSize('');
      setSelectedWaist('');
      setSelectedLength('');
      dispatch(resetCurrentProductVariationString());
    }

    const { product } = currentProduct;
    if (!product) return;

    const gender = getGenderValue(product.productOptions);
    const pattern = `${product.brand}_${
      product.type
    }_${gender}_${colour.name.replace(' ', '')}.+`;

    const variationsWithStock = getProductVariationsWithStockByRegEx(
      product,
      pattern,
    );

    // T-Shirts, Shoes
    if (allSizes) {
      updateSizesStock(variationsWithStock, allSizes);
    }

    // Shorts
    if (allWaists && !allLengths) {
      updateWaistsStock(variationsWithStock, allWaists);
    }

    // Trousers
    if (allWaists && allLengths) {
      updateWaistsStock(variationsWithStock, allWaists);
      updateLengthsStock(variationsWithStock, allLengths);
    }
  };

  const handleSizeChange = (e: MouseEvent<HTMLDivElement>) => {
    const sizeId = e.currentTarget.getAttribute('data-option-value');
    const size = allSizes?.find((x) => x.id === Number(sizeId));

    if (size === undefined) return;

    setSelectedSize(size.name);
  };

  const handleWaistChange = (e: MouseEvent<HTMLDivElement>) => {
    const waistId = e.currentTarget.getAttribute('data-option-value');
    const waist = allWaists?.find((x) => x.id === Number(waistId));

    if (waist === undefined) return;

    setSelectedWaist(waist.name);

    const { product } = currentProduct;
    if (!product) return;

    // Trousers
    if (allWaists && allLengths) {
      updateLengthsStockByWaist(waist.name);
    }
  };

  const handleLengthChange = (e: MouseEvent<HTMLDivElement>) => {
    const lengthId = e.currentTarget.getAttribute('data-option-value');
    const length = allLengths?.find((x) => x.id === Number(lengthId));

    if (length === undefined) return;

    setSelectedLength(length.name);

    const { product } = currentProduct;
    if (!product) return;

    if (allWaists) {
      updateWaistsStockByLength(length.name);
    }
  };

  const getProductVariationsWithStockByRegEx = (
    product: TProduct,
    regexPattern: string,
  ): TProductVariation[] => {
    const regex = new RegExp(regexPattern);
    return product.productVariations.filter(
      (x) => regex.test(x.variationString) && x.totalStock > 0,
    );
  };

  const getGenderValue = (values: TProductOption[]) =>
    values.find((x) => x.name === 'Gender')?.productOptionValues[0].name;

  const updateSizesStock = (
    productVariations: TProductVariation[],
    sizes: TProductOptionValue[],
  ) => {
    const sizeNames: string[] = [];
    const sizesWithStock: TOptionValueStock[] = [];

    productVariations.forEach((v) => {
      const tempArr = v.variationString.split('_');
      const sizeName = tempArr[tempArr.length - 1];
      sizeNames.push(sizeName);
    });

    sizeNames.forEach((size) => {
      const curr = sizes.find((x) => x.name === size);
      if (curr) sizesWithStock.push({ name: curr.name, stock: curr.stock });
    });

    setSizesStockAvailability(sizesWithStock);
  };

  const updateWaistsStock = (
    productVariations: TProductVariation[],
    waists: TProductOptionValue[],
  ) => {
    const waistNames: string[] = [];
    const waistsWithStock: TOptionValueStock[] = [];

    productVariations.forEach((v) => {
      const tempArr = v.variationString.split('_');
      const waistName =
        tempArr[1] === 'Trousers'
          ? tempArr[tempArr.length - 2]
          : tempArr[tempArr.length - 1];
      waistNames.push(waistName);
    });

    waistNames.forEach((waist) => {
      const curr = waists.find((x) => x.name === waist);
      if (curr) waistsWithStock.push({ name: curr.name, stock: curr.stock });
    });

    setWaistsStockAvailability(waistsWithStock);
  };

  const updateWaistsStockByLength = (length: string) => {
    if (!currentProduct || !currentProduct.product) return;
    const { product } = currentProduct;

    const gender = getGenderValue(product.productOptions);
    const pattern = `${product.brand}_${
      product.type
    }_${gender}_${selectedColour.replace(' ', '')}_\\d+_${length}`;

    const variationsWithStock = getProductVariationsWithStockByRegEx(
      product,
      pattern,
    );

    const waistNames: string[] = [];
    const waistsWithStock: TOptionValueStock[] = [];

    variationsWithStock.forEach((v) => {
      const tempArr = v.variationString.split('_');
      const waistName = tempArr[tempArr.length - 2];
      waistNames.push(waistName);
    });

    waistNames.forEach((waist) => {
      const curr = allWaists!.find((x) => x.name === waist);
      if (curr) waistsWithStock.push({ name: curr.name, stock: curr.stock });
    });

    setWaistsStockAvailability(waistsWithStock);
  };

  const updateLengthsStock = (
    productVariations: TProductVariation[],
    lengths: TProductOptionValue[],
  ) => {
    const lengthNames: string[] = [];
    const lengthsWithStock: TOptionValueStock[] = [];

    productVariations.forEach((v) => {
      const tempArr = v.variationString.split('_');
      const lengthName = tempArr[tempArr.length - 1];
      lengthNames.push(lengthName);
    });

    lengthNames.forEach((length) => {
      const curr = lengths.find((x) => x.name === length);
      if (curr) lengthsWithStock.push({ name: curr.name, stock: curr.stock });
    });

    setLengthsStockAvailability(lengthsWithStock);
  };

  const updateLengthsStockByWaist = (waist: string) => {
    if (!currentProduct || !currentProduct.product) return;
    const { product } = currentProduct;

    const gender = getGenderValue(product.productOptions);
    const pattern = `${product.brand}_${
      product.type
    }_${gender}_${selectedColour.replace(' ', '')}_${waist}_\\d+`;

    const variationsWithStock = getProductVariationsWithStockByRegEx(
      product,
      pattern,
    );

    const lengthNames: string[] = [];
    const lengthsWithStock: TOptionValueStock[] = [];

    variationsWithStock.forEach((v) => {
      const tempArr = v.variationString.split('_');
      const lengthName = tempArr[tempArr.length - 1];
      lengthNames.push(lengthName);
    });

    lengthNames.forEach((length) => {
      const curr = allLengths!.find((x) => x.name === length);
      if (curr) lengthsWithStock.push({ name: curr.name, stock: curr.stock });
    });

    setLengthsStockAvailability(lengthsWithStock);
  };

  return (
    <div>
      {/* Colour */}
      <OptionContainer>
        <span>Colour</span>
        <Swatches>
          {allColours &&
            allColours.map((optionValue) => {
              const optionValueInStock = coloursStockAvailability?.some(
                (x) => x.name === optionValue.name,
              );

              return (
                <SwatchColour
                  key={optionValue.id}
                  value={optionValue.id}
                  name={optionValue.name}
                  handleColourChange={handleColourChange}
                  isChecked={selectedColour === optionValue.name}
                  isInStock={
                    optionValueInStock === undefined
                      ? false
                      : optionValueInStock
                  }
                />
              );
            })}
        </Swatches>
      </OptionContainer>

      {/* Sizes */}
      {allSizes && (
        <OptionContainer>
          <span>Size</span>
          <Sizes>
            {allSizes.map((optionValue) => {
              const optionValueInStock = sizesStockAvailability?.some(
                (x) => x.name === optionValue.name,
              );

              return (
                <SizeBase
                  key={optionValue.id}
                  value={optionValue.id}
                  name={optionValue.name}
                  handleValueChange={handleSizeChange}
                  isChecked={selectedSize === optionValue.name}
                  isInStock={
                    optionValueInStock === undefined
                      ? false
                      : optionValueInStock
                  }
                />
              );
            })}
          </Sizes>
        </OptionContainer>
      )}

      {/* Waists */}
      {allWaists && (
        <OptionContainer>
          <span>Waist</span>
          <Sizes>
            {allWaists.map((optionValue) => {
              const optionValueInStock = waistsStockAvailability?.some(
                (x) => x.name === optionValue.name,
              );

              return (
                <SizeBase
                  key={optionValue.id}
                  value={optionValue.id}
                  name={optionValue.name}
                  handleValueChange={handleWaistChange}
                  isChecked={selectedWaist === optionValue.name}
                  isInStock={
                    optionValueInStock === undefined
                      ? false
                      : optionValueInStock
                  }
                />
              );
            })}
          </Sizes>
        </OptionContainer>
      )}

      {/* Lengths */}
      {allLengths && (
        <OptionContainer>
          <span>Length</span>
          <Sizes>
            {allLengths.map((optionValue) => {
              const optionValueInStock = lengthsStockAvailability?.some(
                (x) => x.name === optionValue.name,
              );

              return (
                <SizeBase
                  key={optionValue.id}
                  value={optionValue.id}
                  name={optionValue.name}
                  handleValueChange={handleLengthChange}
                  isChecked={selectedLength === optionValue.name}
                  isInStock={
                    optionValueInStock === undefined
                      ? false
                      : optionValueInStock
                  }
                />
              );
            })}
          </Sizes>
        </OptionContainer>
      )}
    </div>
  );
};

export default ProductVariationBuilder;
