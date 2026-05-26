-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- BackfillOwner
INSERT INTO "users" ("id", "email", "name", "createdAt", "updatedAt")
VALUES (
    '11111111-1111-4111-8111-111111111111',
    'founder@example.com',
    'Solo Founder',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;

-- AlterTable
ALTER TABLE "ideas" ADD COLUMN "ownerId" UUID;

-- BackfillIdeas
UPDATE "ideas"
SET "ownerId" = '11111111-1111-4111-8111-111111111111'
WHERE "ownerId" IS NULL;

-- AlterTable
ALTER TABLE "ideas" ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
