-- ============================================================
-- ТЕМА 1: Информатика / CS
-- SQL Server 2012  |  Enterprise Architect import
-- Общие таблицы: users, user_roles, courses
-- ============================================================

USE [AsoimDB];
GO

-- ----------------------------------------------------------
-- ОБЩИЕ ТАБЛИЦЫ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[users] (
    [id]           INT           IDENTITY(1,1) NOT NULL,
    [email]        NVARCHAR(255) NOT NULL,
    [passwordHash] NVARCHAR(255) NOT NULL,
    [firstName]    NVARCHAR(100) NULL,
    [lastName]     NVARCHAR(100) NULL,
    [avatar]       NVARCHAR(MAX) NULL,
    [isActive]     BIT           NOT NULL CONSTRAINT [DF_users_isActive]    DEFAULT (1),
    [createdAt]    DATETIME2(7)  NOT NULL CONSTRAINT [DF_users_createdAt]   DEFAULT GETDATE(),
    CONSTRAINT [PK_users]       PRIMARY KEY ([id]),
    CONSTRAINT [UQ_users_email] UNIQUE      ([email])
);
GO

CREATE TABLE [dbo].[user_roles] (
    [id]     INT          IDENTITY(1,1) NOT NULL,
    [userId] INT          NOT NULL,
    [role]   NVARCHAR(100) NOT NULL,
    CONSTRAINT [PK_user_roles]        PRIMARY KEY ([id]),
    CONSTRAINT [FK_user_roles_userId] FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[courses] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [name]        NVARCHAR(255) NOT NULL,
    [type]        NVARCHAR(50)  NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [duration]    INT           NULL,
    [imageUrl]    NVARCHAR(500) NULL,
    [isActive]    BIT           NOT NULL CONSTRAINT [DF_courses_isActive]  DEFAULT (1),
    [createdAt]   DATETIME2(7)  NOT NULL CONSTRAINT [DF_courses_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_courses] PRIMARY KEY ([id])
);
GO

-- ----------------------------------------------------------
-- ПРОФОРИЕНТАЦИЯ И КАРЬЕРНЫЕ ТЕСТЫ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[career_tests] (
    [id]        INT           IDENTITY(1,1) NOT NULL,
    [title]     NVARCHAR(255) NOT NULL,
    [category]  NVARCHAR(100) NOT NULL,
    [questions] NVARCHAR(MAX) NOT NULL,   -- хранится как JSON-строка
    [isActive]  BIT           NOT NULL CONSTRAINT [DF_career_tests_isActive]  DEFAULT (1),
    [createdAt] DATETIME2(7)  NOT NULL CONSTRAINT [DF_career_tests_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_career_tests] PRIMARY KEY ([id])
);
GO

CREATE TABLE [dbo].[professional_orientations] (
    [id]                    INT           IDENTITY(1,1) NOT NULL,
    [userId]                INT           NOT NULL,
    [answers]               NVARCHAR(MAX) NOT NULL,   -- JSON
    [recommendedProfession] NVARCHAR(255) NULL,
    [score]                 FLOAT         NULL,
    [completedAt]           DATETIME2(7)  NOT NULL CONSTRAINT [DF_prof_orient_completedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_professional_orientations]  PRIMARY KEY ([id]),
    CONSTRAINT [FK_prof_orient_userId]         FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------
-- ОЛИМПИАДЫ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[olympiads] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [title]       NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [startDate]   DATETIME2(7)  NOT NULL,
    [endDate]     DATETIME2(7)  NOT NULL,
    [createdBy]   INT           NOT NULL,
    [isActive]    BIT           NOT NULL CONSTRAINT [DF_olympiads_isActive]  DEFAULT (1),
    [createdAt]   DATETIME2(7)  NOT NULL CONSTRAINT [DF_olympiads_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_olympiads]           PRIMARY KEY ([id]),
    CONSTRAINT [FK_olympiads_createdBy] FOREIGN KEY ([createdBy])
        REFERENCES [dbo].[users] ([id])
);
GO

CREATE TABLE [dbo].[olympiad_problems] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [olympiadId]  INT           NOT NULL,
    [title]       NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NOT NULL,
    [maxScore]    INT           NOT NULL CONSTRAINT [DF_olympiad_problems_maxScore]   DEFAULT (100),
    [testCases]   NVARCHAR(MAX) NULL,   -- JSON
    [createdAt]   DATETIME2(7)  NOT NULL CONSTRAINT [DF_olympiad_problems_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_olympiad_problems]           PRIMARY KEY ([id]),
    CONSTRAINT [FK_olympiad_problems_olympiadId] FOREIGN KEY ([olympiadId])
        REFERENCES [dbo].[olympiads] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[olympiad_submissions] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [olympiadId]  INT           NOT NULL,
    [problemId]   INT           NOT NULL,
    [userId]      INT           NOT NULL,
    [code]        NVARCHAR(MAX) NOT NULL,
    [language]    NVARCHAR(50)  NOT NULL,
    [status]      NVARCHAR(50)  NOT NULL CONSTRAINT [DF_olympiad_subs_status]      DEFAULT N'pending',
    [score]       INT           NULL,
    [submittedAt] DATETIME2(7)  NOT NULL CONSTRAINT [DF_olympiad_subs_submittedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_olympiad_submissions]           PRIMARY KEY ([id]),
    CONSTRAINT [FK_olympiad_subs_olympiadId]       FOREIGN KEY ([olympiadId])
        REFERENCES [dbo].[olympiads] ([id]),
    CONSTRAINT [FK_olympiad_subs_problemId]        FOREIGN KEY ([problemId])
        REFERENCES [dbo].[olympiad_problems] ([id]),
    CONSTRAINT [FK_olympiad_subs_userId]           FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id])
);
GO

-- ----------------------------------------------------------
-- ФАКУЛЬТАТИВЫ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[electives] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [title]       NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [maxStudents] INT           NOT NULL CONSTRAINT [DF_electives_maxStudents] DEFAULT (30),
    [startDate]   DATETIME2(7)  NULL,
    [courseType]  NVARCHAR(50)  NULL,
    [isActive]    BIT           NOT NULL CONSTRAINT [DF_electives_isActive]  DEFAULT (1),
    [createdBy]   INT           NOT NULL,
    [createdAt]   DATETIME2(7)  NOT NULL CONSTRAINT [DF_electives_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_electives]           PRIMARY KEY ([id]),
    CONSTRAINT [FK_electives_createdBy] FOREIGN KEY ([createdBy])
        REFERENCES [dbo].[users] ([id])
);
GO

CREATE TABLE [dbo].[elective_enrollments] (
    [id]         INT          IDENTITY(1,1) NOT NULL,
    [userId]     INT          NOT NULL,
    [electiveId] INT          NOT NULL,
    [status]     NVARCHAR(50) NOT NULL CONSTRAINT [DF_elective_enroll_status]     DEFAULT N'active',
    [enrolledAt] DATETIME2(7) NOT NULL CONSTRAINT [DF_elective_enroll_enrolledAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_elective_enrollments]          PRIMARY KEY ([id]),
    CONSTRAINT [FK_elective_enroll_userId]        FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]),
    CONSTRAINT [FK_elective_enroll_electiveId]    FOREIGN KEY ([electiveId])
        REFERENCES [dbo].[electives] ([id]) ON DELETE CASCADE,
    CONSTRAINT [UQ_elective_enroll_user_elective] UNIQUE ([userId], [electiveId])
);
GO

CREATE TABLE [dbo].[elective_schedule_items] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [electiveId]  INT           NOT NULL,
    [topic]       NVARCHAR(255) NOT NULL,
    [scheduledAt] DATETIME2(7)  NOT NULL,
    [room]        NVARCHAR(100) NULL,
    CONSTRAINT [PK_elective_schedule_items]          PRIMARY KEY ([id]),
    CONSTRAINT [FK_elective_schedule_electiveId]     FOREIGN KEY ([electiveId])
        REFERENCES [dbo].[electives] ([id]) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------
-- АНАЛИТИКА ПОСЕЩАЕМОСТИ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[site_visits] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [userId]      INT           NULL,
    [path]        NVARCHAR(500) NOT NULL,
    [displayName] NVARCHAR(255) NULL,
    [visitedAt]   DATETIME2(7)  NOT NULL CONSTRAINT [DF_site_visits_visitedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_site_visits]        PRIMARY KEY ([id]),
    CONSTRAINT [FK_site_visits_userId] FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]) ON DELETE SET NULL
);
GO

-- ----------------------------------------------------------
-- ИНДЕКСЫ
-- ----------------------------------------------------------

CREATE INDEX [IX_user_roles_userId]            ON [dbo].[user_roles]              ([userId]);
CREATE INDEX [IX_prof_orient_userId]           ON [dbo].[professional_orientations]([userId]);
CREATE INDEX [IX_olympiad_problems_olympiadId] ON [dbo].[olympiad_problems]        ([olympiadId]);
CREATE INDEX [IX_olympiad_subs_userId]         ON [dbo].[olympiad_submissions]     ([userId]);
CREATE INDEX [IX_elective_enroll_userId]       ON [dbo].[elective_enrollments]     ([userId]);
CREATE INDEX [IX_site_visits_userId]           ON [dbo].[site_visits]              ([userId]);
CREATE INDEX [IX_site_visits_path]             ON [dbo].[site_visits]              ([path]);
GO
