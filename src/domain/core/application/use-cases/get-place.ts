import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors-message/resource-not-found'

import { PlaceDetails } from '../../enterprise/entities/value-objects/place-details'

import { PlacesRepository } from '../repositories/places-repository'

interface GetPlaceUseCaseRequest {
  placeId: string
}

type GetPlaceUseCaseResponse = Either<ResourceNotFoundError, { place: PlaceDetails }>

@Injectable()
export class GetPlaceUseCase {

  constructor(private placesRepository: PlacesRepository) { }

  async execute({ placeId }: GetPlaceUseCaseRequest): Promise<GetPlaceUseCaseResponse> {
    const place = await this.placesRepository.findByIdWithDetails(placeId)

    if (!place) {
      return failure(new ResourceNotFoundError())
    }

    return success({ place })
  }
}