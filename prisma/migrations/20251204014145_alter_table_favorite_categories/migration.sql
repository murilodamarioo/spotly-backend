/*
  Warnings:

  - You are about to drop the `favorite_categoires` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "favorite_categoires" DROP CONSTRAINT "favorite_categoires_category_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_categoires" DROP CONSTRAINT "favorite_categoires_user_id_fkey";

-- DropTable
DROP TABLE "favorite_categoires";

-- CreateTable
CREATE TABLE "favorite_categories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "favorite_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "favorite_categories" ADD CONSTRAINT "favorite_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_categories" ADD CONSTRAINT "favorite_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
