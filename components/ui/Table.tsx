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
    onPageChange: (page: number) => void;
  };
  emptyMessage?: string;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
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
              {data.length === 0 ? (
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
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 bg-neutral-50/50">
            <span className="text-xs text-neutral-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-3 py-1.5 text-xs font-medium rounded border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
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
