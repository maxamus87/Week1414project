-- AlterTable
ALTER TABLE "shops" ADD COLUMN "place_id" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "shops_place_id_key" ON "shops"("place_id");
