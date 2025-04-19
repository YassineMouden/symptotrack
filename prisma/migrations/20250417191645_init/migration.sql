-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "age" INTEGER,
    "sex" TEXT
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TrackingSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "currentStep" TEXT NOT NULL DEFAULT 'info',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    CONSTRAINT "TrackingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BodyPart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "svgId" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Symptom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "severityOptions" TEXT NOT NULL,
    "bodyPartId" TEXT NOT NULL,
    CONSTRAINT "Symptom_bodyPartId_fkey" FOREIGN KEY ("bodyPartId") REFERENCES "BodyPart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSymptom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "severity" TEXT NOT NULL,
    "duration" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "symptomId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "UserSymptom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserSymptom_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "Symptom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserSymptom_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrackingSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "treatmentInfo" TEXT,
    "isSevere" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "SymptomCondition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "relevance" REAL NOT NULL,
    "symptomId" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    CONSTRAINT "SymptomCondition_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "Symptom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SymptomCondition_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserCondition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confidenceScore" REAL NOT NULL,
    "userConfirmed" BOOLEAN,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "UserCondition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCondition_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCondition_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrackingSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "BodyPart_name_key" ON "BodyPart"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BodyPart_svgId_key" ON "BodyPart"("svgId");

-- CreateIndex
CREATE UNIQUE INDEX "Symptom_name_key" ON "Symptom"("name");

-- CreateIndex
CREATE INDEX "Symptom_bodyPartId_idx" ON "Symptom"("bodyPartId");

-- CreateIndex
CREATE INDEX "UserSymptom_userId_idx" ON "UserSymptom"("userId");

-- CreateIndex
CREATE INDEX "UserSymptom_symptomId_idx" ON "UserSymptom"("symptomId");

-- CreateIndex
CREATE INDEX "UserSymptom_sessionId_idx" ON "UserSymptom"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSymptom_userId_symptomId_sessionId_key" ON "UserSymptom"("userId", "symptomId", "sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Condition_name_key" ON "Condition"("name");

-- CreateIndex
CREATE INDEX "SymptomCondition_symptomId_idx" ON "SymptomCondition"("symptomId");

-- CreateIndex
CREATE INDEX "SymptomCondition_conditionId_idx" ON "SymptomCondition"("conditionId");

-- CreateIndex
CREATE UNIQUE INDEX "SymptomCondition_symptomId_conditionId_key" ON "SymptomCondition"("symptomId", "conditionId");

-- CreateIndex
CREATE INDEX "UserCondition_userId_idx" ON "UserCondition"("userId");

-- CreateIndex
CREATE INDEX "UserCondition_conditionId_idx" ON "UserCondition"("conditionId");

-- CreateIndex
CREATE INDEX "UserCondition_sessionId_idx" ON "UserCondition"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCondition_userId_conditionId_sessionId_key" ON "UserCondition"("userId", "conditionId", "sessionId");
