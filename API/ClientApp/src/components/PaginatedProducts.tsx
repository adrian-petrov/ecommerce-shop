import React from 'react';
import { Pagination, Row } from 'react-bootstrap';
import { FetchStatus } from '../features/Products/types';
import GlobalLoadingSpinner from './GlobalLoadingSpinner';

interface Props<T> {
  fetchStatus: FetchStatus;
  data: T[];
  pageIndex: number;
  pages: number[];
  renderItem: (item: T) => React.ReactNode;
  handlePageChange: (newPage: number) => void;
}

export default function PaginatedProducts<T>({
  fetchStatus,
  data,
  pageIndex,
  pages,
  renderItem,
  handlePageChange,
}: Props<T>) {
  return (
    <div className="mt-4">
      <Row>
        {fetchStatus === FetchStatus.Loading ? (
          <GlobalLoadingSpinner />
        ) : (
          <>
            {/* Data */}
            {data.map(renderItem)}
            {/* Pagination */}
            <div className="d-flex justify-content-center">
              <Pagination size="lg" style={{ marginBottom: '3rem' }}>
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={pages.length < 2}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(pageIndex - 1)}
                  disabled={pages.length < 2}
                />
                {pages.map((p, i) => (
                  <Pagination.Item
                    key={i}
                    active={p === pageIndex}
                    onClick={() => handlePageChange(p)}
                    disabled={pages.length < 2}
                  >
                    {p}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={pages.length < 2}
                  onClick={() => handlePageChange(pageIndex + 1)}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(pages.length)}
                  disabled={pages.length < 2}
                />
              </Pagination>
            </div>
          </>
        )}
      </Row>
    </div>
  );
}
