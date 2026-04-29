import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "./Input";

export interface ColumnDef<T> {
  key: string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface TableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  // Sorting state can be controlled or uncontrolled
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  // Pagination
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    pageSize?: number;
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable,
  searchPlaceholder = "Search...",
  onSearch,
  sortKey,
  sortDirection,
  onSort,
  pagination,
  emptyMessage = "No results found.",
  className,
  ...props
}: TableProps<T>) {
  return (
    <div className={cn("w-full flex flex-col gap-4", className)} {...props}>
      {/* Toolbar */}
      {searchable && (
        <div className="flex items-center justify-between">
          <div className="max-w-sm w-full relative">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50/80 text-xs uppercase text-neutral-600 border-b border-neutral-200 font-medium">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-6 py-4 whitespace-nowrap",
                      col.sortable && onSort ? "cursor-pointer hover:bg-neutral-100 transition-colors" : ""
                    )}
                    onClick={() => {
                      if (col.sortable && onSort) onSort(col.key);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && sortKey === col.key && (
                        <span className="flex items-center text-primary">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-neutral-500">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-neutral-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-neutral-50/50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        {col.cell ? col.cell(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination && (pagination.totalItems ?? 0) > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 bg-neutral-50/50">
            <span className="text-xs text-neutral-500">
              {pagination.totalItems != null && pagination.pageSize != null ? (
                <>
                  Showing{" "}
                  <strong className="text-neutral-900">
                    {Math.min((pagination.currentPage - 1) * pagination.pageSize + 1, pagination.totalItems)}
                    –
                    {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
                  </strong>{" "}
                  of <strong className="text-neutral-900">{pagination.totalItems}</strong>
                </>
              ) : (
                <>Page <strong className="text-neutral-900">{pagination.currentPage}</strong> of <strong className="text-neutral-900">{pagination.totalPages}</strong></>
              )}
            </span>
            <div className="flex gap-1 items-center">
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-3 py-1.5 text-xs font-medium rounded border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {getPageNumbers(pagination.currentPage, pagination.totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1 py-1.5 text-xs text-neutral-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => pagination.onPageChange(p as number)}
                    className={cn(
                      "w-8 h-8 text-xs font-medium rounded border transition-colors",
                      pagination.currentPage === p
                        ? "bg-primary border-primary text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    )}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
