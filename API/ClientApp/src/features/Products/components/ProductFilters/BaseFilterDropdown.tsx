import React, { ReactElement } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import styled from 'styled-components';

interface Props {
  title: string;
  children: React.ReactNode;
}

const FilterGroup = styled.li`
  position: relative;
  width: 15rem;
  padding: 5px;
`;

const FiltersListContainer = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: absolute;
  pointer-events: auto;
  background: #fff;
  border: 1px solid #bdbdbd;
  box-sizing: border-box;
  max-height: 250px;
  overflow-y: auto;
  left: -18px;
  top: 50px;
  min-width: 230px;
  z-index: 100;
  font-size: 1.4rem;

  & ul {
    z-index: 1;
    padding: 5px 0;

    & li {
      width: 100%;
      z-index: 50;
      padding: 10px;

      label {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      input {
        margin-right: 5px;
      }
    }
  }
`;

const FilterToggler = styled.span<{ show: boolean }>`
  width: 100%;
  cursor: pointer;
  ${({ show }) => show && 'font-weight: 900'};

  svg {
    margin-left: 8px;
  }
`;

export default function BaseFilterDropdown({
  title,
  children,
}: Props): ReactElement {
  const [show, setShow] = React.useState(false);
  const filtersListRef = React.useRef<HTMLDivElement>(null);
  const filterTogglerRef = React.useRef<HTMLSpanElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (!filtersListRef.current || !filterTogglerRef.current) return;

    if (
      !filtersListRef.current.contains(event.target as Node) &&
      !filterTogglerRef.current.contains(event.target as Node)
    ) {
      setShow(false);
    }
  };

  const handleFilterToggle = () => setShow(!show);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <FilterGroup>
      <FilterToggler
        ref={filterTogglerRef}
        show={show}
        onClick={handleFilterToggle}
      >
        {title}
        {show ? <BsChevronUp /> : <BsChevronDown />}
      </FilterToggler>
      <FiltersListContainer show={show} ref={filtersListRef}>
        <ul>{children}</ul>
      </FiltersListContainer>
    </FilterGroup>
  );
}
