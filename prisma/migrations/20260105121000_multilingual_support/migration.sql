-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('PRIA', 'WANITA');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('ABOUT', 'RESUME');

-- CreateEnum
CREATE TYPE "ItemKind" AS ENUM ('FILE', 'FOLDER');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('PROJECT_INFO', 'TECHSTACK', 'FIG', 'URL', 'TXT', 'IMG', 'PDF', 'OTHER', 'CONTACT');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "tooltipText" JSONB,
    "icon" TEXT,
    "bgColor" TEXT,
    "contactURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" JSONB NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "role" JSONB NOT NULL,
    "quote" JSONB NOT NULL,
    "photoURL" TEXT,
    "birthDate" TIMESTAMP(3),
    "birthPlace" JSONB,
    "experienceYears" INTEGER,
    "description" JSONB,
    "address" JSONB,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "mapURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileItem" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "kind" "ItemKind" NOT NULL,
    "fileType" "ItemType",
    "parentId" TEXT,
    "icon" TEXT,
    "imageUrl" TEXT,
    "href" TEXT,
    "subtitle" JSONB,
    "description" JSONB,
    "tooltipText" JSONB,
    "extra" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "school" JSONB NOT NULL,
    "major" JSONB NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER NOT NULL,
    "schoolLogo" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "company" JSONB NOT NULL,
    "role" JSONB NOT NULL,
    "location" JSONB NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "jobdesk" JSONB,
    "description" JSONB,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "progressValue" INTEGER NOT NULL,
    "demoURL" TEXT,
    "repoURL" TEXT,
    "icon" TEXT NOT NULL,
    "subIcon" TEXT,
    "tooltipText" JSONB,
    "techStack" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectEntry" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "kind" "ItemKind" NOT NULL,
    "fileType" "ItemType",
    "parentId" TEXT,
    "projectId" TEXT NOT NULL,
    "icon" TEXT,
    "subIcon" TEXT,
    "tooltipText" JSONB,
    "href" TEXT,
    "imageUrl" TEXT,
    "subtitle" JSONB,
    "progress" INTEGER,
    "description" JSONB,
    "techStack" JSONB,
    "extra" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileItem" ADD CONSTRAINT "ProfileItem_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileItem" ADD CONSTRAINT "ProfileItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ProfileItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEntry" ADD CONSTRAINT "ProjectEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ProjectEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEntry" ADD CONSTRAINT "ProjectEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
