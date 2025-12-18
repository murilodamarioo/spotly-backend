/*
  Warnings:

  - You are about to drop the column `userId` on the `password_reset_tokens` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_userId_fkey";

-- AlterTable
ALTER TABLE "password_reset_tokens" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
