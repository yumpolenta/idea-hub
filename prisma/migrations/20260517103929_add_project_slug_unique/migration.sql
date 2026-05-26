-- AlterTable
ALTER TABLE "projects" ADD COLUMN "slug" TEXT;

-- BackfillProjectSlugs
UPDATE "projects"
SET "slug" = CASE
    WHEN "id" = '660e8400-e29b-41d4-a716-446655440000' THEN 'idea-hub'
    WHEN "id" = '660e8400-e29b-41d4-a716-446655440001' THEN 'founder-operations'
    ELSE lower(regexp_replace(trim("name"), '\s+', '-', 'g'))
END
WHERE "slug" IS NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "projects_ownerId_slug_key" ON "projects"("ownerId", "slug");
