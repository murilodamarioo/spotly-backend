/*
  Warnings:

  - You are about to drop the column `user_id` on the `attachments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_user_id_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "user_id";
