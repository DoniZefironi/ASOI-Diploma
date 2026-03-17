// features/common/DataTableFilters.tsx
'use client';

import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface DataTableFiltersProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: Array<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
  }>;
  sortBy?: string;
  onSortByChange: (value: string) => void;
  sortOptions?: FilterOption[];
  sortOrder?: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export default function DataTableFilters({
  searchPlaceholder = 'Поиск...',
  searchValue,
  onSearchChange,
  filters = [],
  sortBy,
  onSortByChange,
  sortOptions = [],
  sortOrder = 'asc',
  onSortOrderChange,
}: DataTableFiltersProps) {
  return (
    <div className="flex gap-4 mb-4 flex-wrap items-center">
      {/* Поиск */}
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-800 text-white border border-gray-600"
        />
      </div>

      {/* Фильтры */}
      {filters.map((filter, idx) => (
        <select
          key={idx}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 min-w-[150px]"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {/* Сортировка */}
      {sortOptions.length > 0 && (
        <>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 min-w-[150px]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <Button
            variant="secondary"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </>
      )}
    </div>
  );
}
