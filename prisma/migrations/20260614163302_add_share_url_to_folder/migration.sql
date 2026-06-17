/*
  Warnings:

  - Added the required column `shareUrl` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "shareUrl" VARCHAR(255) NOT NULL;
