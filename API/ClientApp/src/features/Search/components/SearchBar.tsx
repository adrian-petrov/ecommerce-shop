import React, { ChangeEvent, KeyboardEvent, ReactElement } from 'react';
import { BsSearch } from 'react-icons/bs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import debounce from '../../../utils/debounce';
import {
  resetSearchAutocomplete,
  selectAutocompleteSuggestions,
} from '../../Products/productsSlice';
import {
  getAutocompleteSuggestions,
  getSearchResults,
} from '../../Products/productsThunks';

const SearchBarContainer = styled.div`
  position: relative;
  width: 60%;

  @media (max-width: 992px) {
    width: 100%;
  }

  & button {
    position: absolute;
    right: 10px;
    top: 8px;
    border: none;
    background: none;

    &:focus {
      outline: none;
    }
  }
`;

const Input = styled.input`
  height: 4rem;
  width: 100%;
  padding: 1rem;
  border-radius: 2px;
  background: #eee;
  border: none;
  border-radius: 4px;
`;

const SearchResultsContainer = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: absolute;
  padding: 1rem 1.5rem;
  top: 5rem;
  left: 0;
  right: 0;
  z-index: 100;
  background: #ffff;
  border: 1px solid #bdbdbd;
  border-radius: 4px;

  > span {
    font-weight: 600;
  }

  ul {
    margin-top: 1rem;

    li {
      display: flex;

      &:not(:last-of-type) {
        margin-bottom: 2rem;
      }

      a {
        flex: 1;
        display: flex;
        align-items: center;

        img {
          margin-right: 3rem;
          width: 3rem;
          max-height: 5rem;
        }
      }
    }
  }
`;

export default function SearchBar(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const suggestions = useAppSelector(selectAutocompleteSuggestions);
  const searchContainer = React.useRef<HTMLDivElement>(null);

  const [show, setShow] = React.useState(false);
  const [value, setValue] = React.useState('');

  const debouncedAutocompleteHandler = React.useMemo(
    () => debounce((query) => handleAutocompleteSuggestions(query), 300),
    [],
  );

  React.useEffect(() => {
    if (!value.length) {
      dispatch(resetSearchAutocomplete());
      setShow(false);
    }

    if (value.length > 1) {
      setShow(true);
    }

    if (value.length < 2) {
      setShow(false);
    }
  }, [value]);

  React.useEffect(() => {
    setShow(false);
  }, [location.pathname]);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  function handleInputChange(e: ChangeEvent<HTMLInputElement>): void {
    setValue(e.target.value);

    if (e.target.value.length < 2) return;

    debouncedAutocompleteHandler(e.target.value);
  }

  function handleAutocompleteSuggestions(input: string): void {
    dispatch(getAutocompleteSuggestions(input));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  function handleSearch(): void {
    if (!value.length) return;

    if (value.length === 1) {
      navigate('/');
    }

    if (value.length > 1) {
      dispatch(getSearchResults(value, 1, 6));
      goToSearchPage();
    }
    setShow(false);
  }

  function goToSearchPage(): void {
    navigate(`/search?query=${value}`);
  }

  function handleInputFocus(): void {
    if (value.length < 2) return;
    setShow(true);
  }

  function handleClickOutside(event: MouseEvent) {
    if (!searchContainer.current) return;

    if (!searchContainer.current.contains(event.target as Node)) {
      setShow(false);
    }
  }

  return (
    <SearchBarContainer ref={searchContainer}>
      <Input
        placeholder="Search..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        name="search"
        title="Search"
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        value={value}
      />
      <button onClick={handleSearch} type="button">
        <BsSearch />
      </button>
      {suggestions.length ? (
        <SearchResultsContainer show={show}>
          <span>Products</span>
          <ul>
            {suggestions.map((item) => (
              <li key={item.id}>
                <Link to={`/products/${item.id}`}>
                  <img src={item.imageUrl} alt="Product Image" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </SearchResultsContainer>
      ) : null}
    </SearchBarContainer>
  );
}
