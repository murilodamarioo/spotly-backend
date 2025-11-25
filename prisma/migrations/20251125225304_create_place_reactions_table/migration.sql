-- CreateTable
CREATE TABLE "place_reactions" (
    "id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "like" BOOLEAN,
    "dislike" BOOLEAN,

    CONSTRAINT "place_reactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "place_reactions" ADD CONSTRAINT "place_reactions_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_reactions" ADD CONSTRAINT "place_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
