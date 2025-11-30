import { Controller, Get, HttpCode, Query } from '@nestjs/common'

import z from 'zod'

import { FetchPlacesByFilterUseCase } from '@/domain/core/application/use-cases/fetch-places-by-filter'

import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { FetchPlacesPresenter } from '@/infra/presenters/fetch-places-presenter'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const PlaceSortOptionSchema = z.enum(['recent', 'most_popular']).default('recent')
const PlaceFilterTypeSchema = z.enum(['all', 'liked_by_user', 'disliked_by_user']).default('all')

const fetchPlacesQuerySchema = z.object({
  page: z.string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  query: z.string().optional(),
  category: z.string().optional(),
  sortBy: PlaceSortOptionSchema.optional().default('recent'),
  filterType: PlaceFilterTypeSchema.optional().default('all')
})

type FetchPlacesQuerySchema = z.infer<typeof fetchPlacesQuerySchema>

const queryValidationPipe = new ZodValidationPipe(fetchPlacesQuerySchema)

@Controller('/places')
export class FetchPlacesByFilterController {
  constructor(private fetchPlacesByFilter: FetchPlacesByFilterUseCase) { }

  @Get()
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) filters: FetchPlacesQuerySchema,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const response = await this.fetchPlacesByFilter.execute({
      userId,
      placeFiltersParams: {
        page: filters.page,
        category: filters.category,
        query: filters.query,
        filterType: filters.filterType,
        sortBy: filters.sortBy
        
      }
    })

    const places = response.value?.places

    return {
      places: places
        ? places.map((place) => FetchPlacesPresenter.toHttp(place))
        : []
    }
  }
}