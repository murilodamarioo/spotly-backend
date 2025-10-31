import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'

import { Place } from '../../enterprise/entities/place'
import { PlacesRepository } from '../repositories/places-repository'

interface FetchPlacesUseCaseRequest {
  page: number
}

type FetchPlacesUseCaseResponse = Either<null, { places: Place[] }>

@Injectable()
export class FetchPlacesUseCase {
  constructor(private placesRepository: PlacesRepository) { }

  async execute({ page }: FetchPlacesUseCaseRequest): Promise<FetchPlacesUseCaseResponse> {
    const places = await this.placesRepository.findManyByRecent({ page })

    return success({ places })
  }
}