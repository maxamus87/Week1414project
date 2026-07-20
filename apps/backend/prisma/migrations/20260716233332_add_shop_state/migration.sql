/*
  Warnings:

  - Added the required column `state` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "state" VARCHAR(50) NOT NULL;
