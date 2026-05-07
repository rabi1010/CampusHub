import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";
import { TableSkeleton } from "./Skeleton";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import SearchInput from "./SearchInput";

// ── Types ───────────────────────────────────────────────
export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  actions?: (row: T) => React.ReactNode;
  emptyTitle?: string;
  emptyDesc?: string;
  pageSize?: number;
  toolbar?: React.ReactNode; // extra filters/buttons
}

type SortDir = "asc" | "desc" | null;

// ── Component ────────────────────────────────────────────
export default function DataTable<T extends { id: string }>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchKeys = [],
  searchPlaceholder = "Search...",
  actions,
  emptyTitle = "No results found",
  emptyDesc = "Try adjusting your search or filters.",
  pageSize = 10,
  toolbar,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);

  // ── Search filter ──────────────────────────────────────
  const filtered = data.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return searchKeys.some((key) =>
      String(row[key] ?? "")
        .toLowerCase()
        .includes(q),
    );
  });

  // ── Sort ───────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const av = String((a as Record<string, unknown>)[sortKey] ?? "");
    const bv = String((b as Record<string, unknown>)[sortKey] ?? "");
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  // ── Paginate ───────────────────────────────────────────
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    if (sortDir === "asc") {
      setSortDir("desc");
      return;
    }
    setSortKey(null);
    setSortDir(null);
  };

  // Reset to page 1 when search changes
  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const SortIcon = ({ col }: { col: Column<T> }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key)
      return <ChevronsUpDown size={13} className="text-ink-600" />;
    return sortDir === "asc" ? (
      <ChevronUp size={13} className="text-jade-400" />
    ) : (
      <ChevronDown size={13} className="text-jade-400" />
    );
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* ── Toolbar ──────────────────────────────────── */}
      {(searchable || toolbar) && (
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center
                        gap-3 p-4 border-b border-white/[0.07]"
        >
          {searchable && (
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder={searchPlaceholder}
              className="w-full sm:w-64"
            />
          )}
          {toolbar && (
            <div className="flex items-center gap-2 sm:ml-auto">{toolbar}</div>
          )}
        </div>
      )}

      {/* ── Loading ───────────────────────────────────── */}
      {loading ? (
        <TableSkeleton rows={pageSize} />
      ) : paginated.length === 0 ? (
        /* ── Empty ────────────────────────────────────── */
        <EmptyState title={emptyTitle} description={emptyDesc} />
      ) : (
        /* ── Table ────────────────────────────────────── */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={clsx(
                      "px-4 py-3 text-left text-xs font-mono",
                      "font-medium text-ink-500 uppercase tracking-wider",
                      col.sortable &&
                        "cursor-pointer hover:text-ink-300 select-none",
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      <SortIcon col={col} />
                    </div>
                  </th>
                ))}
                {actions && (
                  <th
                    className="px-4 py-3 text-right text-xs font-mono
                                 font-medium text-ink-500 uppercase
                                 tracking-wider w-24"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {paginated.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3.5 text-sm text-ink-300"
                    >
                      {col.render
                        ? col.render(row)
                        : String(
                            (row as Record<string, unknown>)[col.key] ?? "—",
                          )}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3.5">
                      <div
                        className="flex items-center justify-end gap-1
                                      opacity-0 group-hover:opacity-100
                                      transition-opacity"
                      >
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ────────────────────────────────── */}
      {!loading && paginated.length > 0 && (
        <div className="px-4 pb-4 pt-2">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={sorted.length}
            pageSize={pageSize}
            onPage={setPage}
          />
        </div>
      )}
    </div>
  );
}
