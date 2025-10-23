import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors-message/not-allowed'

import { PlacesRepository } from '../repositories/places-repository'

interface DeletePlaceUseCaseRequest {
  placeId: string
  userId: string
}

type DeletePlaceUseCaseResponse = Either<NotAllowedError, null>

export class DeletePlaceUseCase {
  constructor(private placesRepository: PlacesRepository) { }

  async execute({
    placeId,
    userId
  }: DeletePlaceUseCaseRequest): Promise<DeletePlaceUseCaseResponse> {
    const place = await this.placesRepository.findById(placeId)

    if (userId !== place?.userId.toString()) {
      return failure(new NotAllowedError())
    }

    await this.placesRepository.delete(placeId)

    return success(null)
  }
}