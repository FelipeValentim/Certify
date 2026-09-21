-- Certify_PostgreSQL.sql

-- Função para remover acentos (versão PostgreSQL)
CREATE OR REPLACE FUNCTION RemoveAcentos(texto TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN translate(texto, 'áéíóúàèìòùãõâêîôûäëïöüçÁÉÍÓÚÀÈÌÒÙÃÕÂÊÎÔÛÄËÏÖÜÇ', 'aeiouaeiouaoaeiouaeioucAEIOUAEIOUAOAEIOUAEIOUC');
END;
$$ LANGUAGE plpgsql;

-- Tabelas
CREATE TABLE "UserProfile" (
    "Id" UUID PRIMARY KEY,
    "Email" VARCHAR(256) NOT NULL,
    "PasswordHash" VARCHAR(100) NOT NULL,
    "Name" VARCHAR(256) NOT NULL,
    "Photo" VARCHAR(2048),
    "ConcurrencyStamp" UUID NOT NULL,
    "SecurityStamp" UUID NOT NULL,
    "CreatedDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DeletedDate" TIMESTAMP NULL
);

CREATE TABLE "EventType" (
    "Id" UUID PRIMARY KEY,
    "Name" VARCHAR(50) NOT NULL
);

CREATE TABLE "GuestType" (
    "Id" UUID PRIMARY KEY,
    "Name" VARCHAR(50) NOT NULL
);

CREATE TABLE "EventTemplate" (
    "Id" UUID PRIMARY KEY,
    "Path" VARCHAR(255) NOT NULL,
    "PreviewPath" VARCHAR(255),
    "DeletedDate" TIMESTAMP NULL,
    "CreatedDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Event" (
    "Id" UUID PRIMARY KEY,
    "Name" VARCHAR(256) NOT NULL,
    "Description" TEXT,
    "Photo" VARCHAR(2048),
    "UserId" UUID NOT NULL,
    "EventTypeId" UUID NULL,
    "Date" DATE NULL,
    "StartTime" TIME(0) NULL,
    "EndTime" TIME(0) NULL,
    "Pax" INT NULL,
    "CheckinEnabled" BOOLEAN NULL,
    "DeletedDate" TIMESTAMP NULL,
    "CreatedDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TemplatePath" VARCHAR(255) NULL,
    "TemplateId" UUID NULL,
    "EventTemplateId" UUID NULL,
    CONSTRAINT "FK_Event_User" FOREIGN KEY ("UserId") REFERENCES "UserProfile"("Id"),
    CONSTRAINT "FK_Event_EventType" FOREIGN KEY ("EventTypeId") REFERENCES "EventType"("Id"),
    CONSTRAINT "FK_Event_EventTemplate" FOREIGN KEY ("EventTemplateId") REFERENCES "EventTemplate"("Id")
);

CREATE TABLE "Guest" (
    "Id" UUID PRIMARY KEY,
    "Name" VARCHAR(256) NOT NULL,
    "Photo" VARCHAR(2048),
    "CheckinDate" TIMESTAMP NULL,
    "EventId" UUID NOT NULL,
    "GuestId" UUID NULL,
    "Email" VARCHAR(255) NULL,
    "DeletedDate" TIMESTAMP NULL,
    "CreatedDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "GuestTypeId" UUID NULL,
    CONSTRAINT "FK_Guest_Event" FOREIGN KEY ("EventId") REFERENCES "Event"("Id"),
    CONSTRAINT "FK_Guest_GuestType" FOREIGN KEY ("GuestTypeId") REFERENCES "GuestType"("Id")
);

CREATE TABLE "EventField" (
    "Id" UUID PRIMARY KEY,
    "EventId" UUID NOT NULL,
    "Name" VARCHAR(255) NOT NULL,
    "Type" VARCHAR(100) NOT NULL,
    "IsRequired" BOOLEAN NOT NULL,
    "DisplayOrder" INT NOT NULL,
    "CreatedDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DeletedDate" TIMESTAMP NULL,
    CONSTRAINT "FK_EventField_Event" FOREIGN KEY ("EventId") REFERENCES "Event"("Id")
);

CREATE TABLE "EventFieldValue" (
    "Id" UUID PRIMARY KEY,
    "EventFieldId" UUID NOT NULL,
    "GuestId" UUID NOT NULL,
    "Value" TEXT NOT NULL,
    CONSTRAINT "FK_EventFieldValue_EventField" FOREIGN KEY ("EventFieldId") REFERENCES "EventField"("Id"),
    CONSTRAINT "FK_EventFieldValue_Guest" FOREIGN KEY ("GuestId") REFERENCES "Guest"("Id")
);

-- Inserts iniciais
INSERT INTO "EventType" ("Id", "Name") VALUES
('16274d81-8b61-404e-9154-463168f1cadd', 'Palestra'),
('e30b4aa1-c5de-4eb9-95b7-4db92173b57b', 'Congresso'),
('528880f7-a93a-4858-89e5-b5552b4fb40c', 'TCC'),
('ef445b11-120f-40fd-9a1e-f0084373ef4f', 'Workshop');

INSERT INTO "GuestType" ("Id", "Name") VALUES
('569708f0-5263-4c29-a884-8ec882084715', 'Aluno'),
('7b85b9a7-42ee-445b-be35-2be795e99220', 'Professor');

INSERT INTO "UserProfile" ("Id", "Email", "PasswordHash", "Name", "Photo", "ConcurrencyStamp", "SecurityStamp", "CreatedDate", "DeletedDate")
VALUES ('d4dda3c5-1293-4995-b33b-541ce873033f', 'teste@teste.com', 'QxojAnGBbNhYnw88sLB1VVohfYG50yjZL+sv/WJtv9Y=', 'Teste', 'https://randomuser.me/api/portraits/men/81.jpg', 
        gen_random_uuid(), gen_random_uuid(), CURRENT_TIMESTAMP, NULL);
