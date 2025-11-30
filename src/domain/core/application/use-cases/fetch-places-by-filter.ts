import { PlaceFiltersParams } from '@/core/repositories/place-filters-params'
import { Either, success } from '@/core/either'

import { PlacesRepository } from '../repositories/places-repository'
import { Place } from '../../enterprise/entities/place'

interface FetchPlacesByFilterUseCaseRequest {
  userId: string
  placeFiltersParams: PlaceFiltersParams
}

type FetchPlacesByFilterUseCaseResponse = Either<null, { places: Place[] }>

export class FetchPlacesByFilterUseCase {

  constructor(private placesRepository: PlacesRepository) { }

  async execute({
    userId,
    placeFiltersParams
  }: FetchPlacesByFilterUseCaseRequest): Promise<FetchPlacesByFilterUseCaseResponse> {
    const places = await this.placesRepository.findManyByFilter(
      userId,
      placeFiltersParams
    )

    return success({ places })
  }
}