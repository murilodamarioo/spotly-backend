import { PlaceFilterType } from '../types/place-filter-type'
import { PlaceSortOption } from '../types/place-sort-option'
import { PaginationParam } from './pagination-param'

export interface PlaceFiltersParams extends PaginationParam {
  page: number
  query?: string
  category?: string
  filterType?: PlaceFilterType
  sortBy?: PlaceSortOption
}