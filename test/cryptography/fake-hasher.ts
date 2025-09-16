import { HashComparer } from "@/modules/cryptography/hash-compare"
import { HashGenerator } from "@/modules/cryptography/hash-generator"

export class FakeHasher implements HashGenerator, HashComparer {

  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }

}