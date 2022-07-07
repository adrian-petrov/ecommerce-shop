import React, { ReactElement } from 'react';
import { useAppDispatch } from '../../../../app/hooks';
import { setProductsSort } from '../../productsSlice';
import { TSortParam } from '../../types';
import BaseFilterDropdown from './BaseFilterDropdown';

interface Props {
  title: string;
  items: TSortParam[];
}

export default function SortDropdown({ title, items }: Props): ReactElement {
  const dispatch = useAppDispatch();

  const handleSortSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.name;
    dispatch(setProductsSort(value));
  };

  return (
    <BaseFilterDropdown title={title}>
      {items &&
        items.map((item, idx) => (
          <li key={`${item.value}-${idx}`}>
            <label htmlFor={`sort-option-${item.value}`}>
              <input
                type="radio"
                id={`sort-option-${item.value}`}
                checked={item.isSelected}
                onChange={handleSortSelected}
                name={item.value}
              />
              <span>{item.valueTitle}</span>
            </label>
          </li>
        ))}
    </BaseFilterDropdown>
  );
}
