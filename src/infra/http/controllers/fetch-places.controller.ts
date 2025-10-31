import { Controller, Get, HttpCode, Query } from '@nestjs/common'

import z from 'zod'

import { FetchPlacesUseCase } from '@/domain/core/application/use-cases/fetch-places'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchPlacesPresenter } from '@/infra/presenters/fetch-places-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/places')
export class FetchPlacesController {

  constructor(private fetchPlaces: FetchPlacesUseCase) { }

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const response = await this.fetchPlaces.execute({ page })

    const places = response.value?.places

    return {
      places: places
        ? places.map((place) => FetchPlacesPresenter.toHttp(place))
        : []
    }
  }
}