import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors-message/resource-not-found'

import { Place } from '../../enterprise/entities/place'

import { PlacesRepository } from '../repositories/places-repository'
import { NotAllowedError } from '@/core/errors/errors-message'

interface GetPlaceUseCaseRequest {
  placeId: string
  userId: string
}

type GetPlaceUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { place: Place }>

@Injectable()
export class GetPlaceUseCase {

  constructor(private placesRepository: PlacesRepository) { }

  async execute({ placeId, userId }: GetPlaceUseCaseRequest): Promise<GetPlaceUseCaseResponse> {
    const place = await this.placesRepository.findById(placeId)

    if (!place) {
      return failure(new ResourceNotFoundError())
    }

    if (place.userId.toString() !== userId) {
      return failure(new NotAllowedError())
    }

    return success({ place })
  }
}