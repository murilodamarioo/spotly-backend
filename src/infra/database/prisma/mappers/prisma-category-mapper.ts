import { Category } from '@/domain/core/enterprise/entities/category'

export class PrismaCategoryMapper {

  static toPrisma(category: Category) {
    return {
      id: category.id.toString(),
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }
  }
  
}