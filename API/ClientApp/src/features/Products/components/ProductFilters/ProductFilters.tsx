import React, { ReactElement } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';

import Modal from '../../../../components/Modal';
import {
  resetProductsFilter,
  selectActiveFilters,
  selectProductFilters,
  selectProductSort,
  setProductsFilter,
} from '../../productsSlice';
import { getProducts } from '../../productsThunks';
import FilterGroupDropdown from './FilterGroupDropdown';
import SortDropdown from './SortDropdown';

const FiltersContainer = styled.div`
  flex: 1;
  margin-top: 1rem;
  padding: 1rem 0;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 992px) {
    display: none;
  }
`;

const Filters = styled.ul`
  width: 95%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const ActiveFiltersContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem 0;
`;

const ActiveFilters = styled.div`
  span {
    cursor: pointer;
    font-size: 1.2rem;

    &:not(:last-of-type) {
      margin-right: 1rem;
    }
  }
`;

const ClearFiltersBox = styled.div`
  background-color: #efefef;
  font-weight: 500;
  font-style: oblique;
  text-transform: uppercase;
  display: inline-block;
  padding: 9px 12px;
  margin: 0 12px;
  cursor: pointer;
`;

const MobileFiltersButton = styled(Button)`
  display: none;
  @media (max-width: 992px) {
    width: 30rem;
    display: block;
    margin: 2.5rem auto 0;
  }
`;

const MobileFilters = styled.div`
  display: flex;
  margin-top: 2rem;
  flex-direction: column;
  padding: 2rem 6rem;

  ul {
    list-style: none;
  }
`;

export default function ProductFilters(): ReactElement {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProductFilters);
  const activeFilters = useAppSelector(selectActiveFilters);
  const sortOptions = useAppSelector(selectProductSort);
  const [showFilters, setShowFilters] = React.useState(false);

  const handleClearAllFilters = () => {
    dispatch(resetProductsFilter());
  };

  const handleClearFilter = (e: React.MouseEvent) => {
    const filterValue = e.currentTarget.getAttribute('data-filter-value');
    const filterName = e.currentTarget.getAttribute('data-filter-name');

    if (!filterValue || !filterName) return;

    dispatch(setProductsFilter([filterName, filterValue]));
  };

  const handleShowFilters = () => setShowFilters(true);
  const handleHideFilters = () => setShowFilters(false);

  React.useEffect(() => {
    dispatch(getProducts());
  }, [filters, sortOptions]);

  return (
    <>
      <FiltersContainer>
        <Filters>
          {/* Types */}
          <FilterGroupDropdown
            title="Type"
            filterName="types"
            items={filters.types}
          />
          {/* Brands */}
          <FilterGroupDropdown
            title="Brand"
            filterName="brands"
            items={filters.brands}
          />
          {/* Genders */}
          <FilterGroupDropdown
            title="Gender"
            filterName="genders"
            items={filters.genders}
          />
          {/* Colours */}
          <FilterGroupDropdown
            title="Colour"
            filterName="colours"
            items={filters.colours}
          />
          {/* Sizes */}
          <FilterGroupDropdown
            title="Size"
            filterName="sizes"
            items={filters.sizes}
          />
          {/* Waists */}
          <FilterGroupDropdown
            title="Waist"
            filterName="waists"
            items={filters.waists}
          />
          {/* Lengths */}
          <FilterGroupDropdown
            title="Length"
            filterName="lengths"
            items={filters.lengths}
          />
          {/* Sort By */}
          <SortDropdown title="Sort By" items={sortOptions} />
        </Filters>
        <div>
          {Object.keys(activeFilters).length > 0 && (
            <ActiveFiltersContainer>
              <ActiveFilters>
                {Object.keys(activeFilters).map((f) =>
                  activeFilters[f].map((val) => (
                    <span
                      key={val}
                      role="button"
                      onClick={handleClearFilter}
                      data-filter-value={val}
                      data-filter-name={f}
                    >
                      {val} &#10006;
                    </span>
                  )),
                )}
              </ActiveFilters>
              <ClearFiltersBox onClick={handleClearAllFilters}>
                Clear All Filters
              </ClearFiltersBox>
            </ActiveFiltersContainer>
          )}
        </div>
      </FiltersContainer>
      <MobileFiltersButton size="lg" onClick={handleShowFilters}>
        Filter
      </MobileFiltersButton>
      <Modal show={showFilters}>
        <AiOutlineClose size={30} onClick={handleHideFilters} />
        <MobileFilters>
          <ul>
            {/* Types */}
            <FilterGroupDropdown
              title="Type"
              filterName="types"
              items={filters.types}
            />
            {/* Brands */}
            <FilterGroupDropdown
              title="Brand"
              filterName="brands"
              items={filters.brands}
            />
            {/* Genders */}
            <FilterGroupDropdown
              title="Gender"
              filterName="genders"
              items={filters.genders}
            />
            {/* Colours */}
            <FilterGroupDropdown
              title="Colour"
              filterName="colours"
              items={filters.colours}
            />
            {/* Sizes */}
            <FilterGroupDropdown
              title="Size"
              filterName="sizes"
              items={filters.sizes}
            />
            {/* Waists */}
            <FilterGroupDropdown
              title="Waist"
              filterName="waists"
              items={filters.waists}
            />
            {/* Lengths */}
            <FilterGroupDropdown
              title="Length"
              filterName="lengths"
              items={filters.lengths}
            />
            {/* Sort By */}
            <SortDropdown title="Sort By" items={sortOptions} />
          </ul>
          <div>
            {Object.keys(activeFilters).length > 0 && (
              <ActiveFiltersContainer>
                <ActiveFilters>
                  {Object.keys(activeFilters).map((f) =>
                    activeFilters[f].map((val) => (
                      <span
                        key={val}
                        role="button"
                        onClick={handleClearFilter}
                        data-filter-value={val}
                        data-filter-name={f}
                      >
                        {val} &#10006;
                      </span>
                    )),
                  )}
                </ActiveFilters>
                <ClearFiltersBox onClick={handleClearAllFilters}>
                  Clear All Filters
                </ClearFiltersBox>
              </ActiveFiltersContainer>
            )}
          </div>
        </MobileFilters>
      </Modal>
    </>
  );
}
