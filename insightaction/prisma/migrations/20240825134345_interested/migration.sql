-- CreateTable
CREATE TABLE "Interested" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "feature" TEXT[],

    CONSTRAINT "Interested_pkey" PRIMARY KEY ("id")
);
