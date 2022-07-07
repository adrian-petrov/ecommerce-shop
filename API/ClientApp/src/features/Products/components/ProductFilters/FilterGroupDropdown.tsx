import React, { ReactElement } from 'react';
import { useAppDispatch } from '../../../../app/hooks';
import { setProductsFilter } from '../../productsSlice';
import { TFilterParam } from '../../types';
import BaseFilterDropdown from './BaseFilterDropdown';

interface Props {
  title: string;
  filterName: string;
  items: TFilterParam[];
}

export default function FilterGroupDropdown({
  title,
  filterName,
  items,
}: Props): ReactElement {
  const dispatch = useAppDispatch();

  const handleFilterSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = e.currentTarget.name;
    if (!filterName) return;

    dispatch(setProductsFilter([filterName, filterValue]));
  };

  return (
    <BaseFilterDropdown title={title}>
      {items &&
        items.map((item, idx) => (
          <li key={`${item.value}-${idx}`}>
            <label htmlFor={`filter-option-${filterName}-${item.value}`}>
              <input
                type="checkbox"
                id={`filter-option-${filterName}-${item.value}`}
                checked={item.isSelected}
                onChange={handleFilterSelected}
                name={item.value}
                data-filter={filterName}
              />
              <span>{item.value}</span>
            </label>
          </li>
        ))}
    </BaseFilterDropdown>
  );
}
