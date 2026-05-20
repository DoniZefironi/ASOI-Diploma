-- ============================================================
-- ТЕМА 3: IoT + Стажировки + Комнаты + Расписание
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
    [id]     INT           IDENTITY(1,1) NOT NULL,
    [userId] INT           NOT NULL,
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
-- СТАЖИРОВКИ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[internships] (
    [id]           INT           IDENTITY(1,1) NOT NULL,
    [title]        NVARCHAR(255) NOT NULL,
    [company]      NVARCHAR(255) NOT NULL,
    [description]  NVARCHAR(MAX) NULL,
    [requirements] NVARCHAR(MAX) NULL,
    [type]         NVARCHAR(100) NULL,   -- internship, job, remote
    [location]     NVARCHAR(255) NULL,
    [salary]       NVARCHAR(100) NULL,
    [url]          NVARCHAR(MAX) NULL,
    [isActive]     BIT           NOT NULL CONSTRAINT [DF_int_isActive]  DEFAULT (1),
    [source]       NVARCHAR(50)  NOT NULL CONSTRAINT [DF_int_source]    DEFAULT N'manual',  -- manual, hh
    [externalId]   NVARCHAR(100) NULL,   -- ID вакансии на HH.ru
    [createdAt]    DATETIME2(7)  NOT NULL CONSTRAINT [DF_int_createdAt] DEFAULT GETDATE(),
    [updatedAt]    DATETIME2(7)  NOT NULL CONSTRAINT [DF_int_updatedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_internships] PRIMARY KEY ([id])
);
GO

CREATE TABLE [dbo].[internship_applications] (
    [id]            INT           IDENTITY(1,1) NOT NULL,
    [userId]        INT           NOT NULL,
    [internshipId]  INT           NOT NULL,
    [coverLetter]   NVARCHAR(MAX) NULL,
    [status]        NVARCHAR(50)  NOT NULL CONSTRAINT [DF_ia_status]     DEFAULT N'pending',
    [appliedAt]     DATETIME2(7)  NOT NULL CONSTRAINT [DF_ia_appliedAt]  DEFAULT GETDATE(),
    CONSTRAINT [PK_internship_applications]             PRIMARY KEY ([id]),
    CONSTRAINT [FK_ia_userId]                           FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ia_internshipId]                     FOREIGN KEY ([internshipId])
        REFERENCES [dbo].[internships] ([id]) ON DELETE CASCADE,
    CONSTRAINT [UQ_ia_user_internship]                  UNIQUE ([userId], [internshipId])
);
GO

CREATE TABLE [dbo].[internship_views] (
    [id]           INT          IDENTITY(1,1) NOT NULL,
    [userId]       INT          NOT NULL,
    [internshipId] INT          NOT NULL,
    [viewedAt]     DATETIME2(7) NOT NULL CONSTRAINT [DF_iv_viewedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_internship_views]           PRIMARY KEY ([id]),
    CONSTRAINT [FK_iv_userId]                  FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_iv_internshipId]            FOREIGN KEY ([internshipId])
        REFERENCES [dbo].[internships] ([id]) ON DELETE CASCADE
);
GO

-- ----------------------------------------------------------
-- КОМНАТЫ (совместная работа)
-- ----------------------------------------------------------

CREATE TABLE [dbo].[rooms] (
    [id]          INT               IDENTITY(1,1) NOT NULL,
    [name]        NVARCHAR(255)     NOT NULL,
    [type]        NVARCHAR(50)      NOT NULL CONSTRAINT [DF_rooms_type]     DEFAULT N'iot',
    [description] NVARCHAR(MAX)     NULL,
    [isPublic]    BIT               NOT NULL CONSTRAINT [DF_rooms_isPublic] DEFAULT (0),
    [inviteCode]  NVARCHAR(36)      NOT NULL,   -- UUID
    [ownerId]     INT               NOT NULL,
    [state]       NVARCHAR(MAX)     NULL,        -- JSON состояния схемы
    [createdAt]   DATETIME2(7)      NOT NULL CONSTRAINT [DF_rooms_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_rooms]             PRIMARY KEY ([id]),
    CONSTRAINT [FK_rooms_ownerId]     FOREIGN KEY ([ownerId])
        REFERENCES [dbo].[users] ([id]),
    CONSTRAINT [UQ_rooms_inviteCode]  UNIQUE ([inviteCode])
);
GO

CREATE TABLE [dbo].[room_members] (
    [id]       INT          IDENTITY(1,1) NOT NULL,
    [roomId]   INT          NOT NULL,
    [userId]   INT          NOT NULL,
    [role]     NVARCHAR(50) NOT NULL CONSTRAINT [DF_rm_role]     DEFAULT N'viewer',  -- viewer, editor, admin
    [joinedAt] DATETIME2(7) NOT NULL CONSTRAINT [DF_rm_joinedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_room_members]        PRIMARY KEY ([id]),
    CONSTRAINT [FK_rm_roomId]           FOREIGN KEY ([roomId])
        REFERENCES [dbo].[rooms] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_rm_userId]           FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]),
    CONSTRAINT [UQ_rm_room_user]        UNIQUE ([roomId], [userId])
);
GO

-- ----------------------------------------------------------
-- РАСПИСАНИЕ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[schedule_items] (
    [id]            INT           IDENTITY(1,1) NOT NULL,
    [courseGroupId] INT           NULL,
    [title]         NVARCHAR(255) NOT NULL,
    [description]   NVARCHAR(MAX) NULL,
    [date]          DATE          NOT NULL,
    [startTime]     TIME(0)       NOT NULL,
    [endTime]       TIME(0)       NOT NULL,
    [location]      NVARCHAR(255) NULL,
    [type]          NVARCHAR(50)  NOT NULL CONSTRAINT [DF_si_type]      DEFAULT N'lecture',
    [createdBy]     INT           NOT NULL,
    [createdAt]     DATETIME2(7)  NOT NULL CONSTRAINT [DF_si_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_schedule_items]              PRIMARY KEY ([id]),
    CONSTRAINT [FK_si_createdBy]                FOREIGN KEY ([createdBy])
        REFERENCES [dbo].[users] ([id])
);
GO

-- ----------------------------------------------------------
-- ХАКАТОНЫ (повторяется из Т2 для IoT-хакатонов)
-- ----------------------------------------------------------

CREATE TABLE [dbo].[hackathons] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [title]       NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [type]        NVARCHAR(50)  NOT NULL,   -- iot, electronics
    [startDate]   DATETIME2(7)  NOT NULL,
    [endDate]     DATETIME2(7)  NOT NULL,
    [status]      NVARCHAR(50)  NOT NULL CONSTRAINT [DF_h_status]    DEFAULT N'upcoming',
    [createdAt]   DATETIME2(7)  NOT NULL CONSTRAINT [DF_h_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_hackathons] PRIMARY KEY ([id])
);
GO

CREATE TABLE [dbo].[hackathon_tasks] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [hackathonId] INT           NOT NULL,
    [title]       NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [maxScore]    INT           NOT NULL CONSTRAINT [DF_ht_maxScore] DEFAULT (100),
    CONSTRAINT [PK_hackathon_tasks]            PRIMARY KEY ([id]),
    CONSTRAINT [FK_hackathon_tasks_hackathonId] FOREIGN KEY ([hackathonId])
        REFERENCES [dbo].[hackathons] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[hackathon_stages] (
    [id]          INT          IDENTITY(1,1) NOT NULL,
    [hackathonId] INT          NOT NULL,
    [title]       NVARCHAR(255) NOT NULL,
    [deadline]    DATETIME2(7) NOT NULL,
    CONSTRAINT [PK_hackathon_stages]             PRIMARY KEY ([id]),
    CONSTRAINT [FK_hackathon_stages_hackathonId] FOREIGN KEY ([hackathonId])
        REFERENCES [dbo].[hackathons] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[hackathon_teams] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [hackathonId] INT           NOT NULL,
    [name]        NVARCHAR(255) NOT NULL,
    [leaderId]    INT           NOT NULL,
    [status]      NVARCHAR(50)  NOT NULL CONSTRAINT [DF_hteam_status]    DEFAULT N'active',
    [createdAt]   DATETIME2(7)  NOT NULL CONSTRAINT [DF_hteam_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_hackathon_teams]             PRIMARY KEY ([id]),
    CONSTRAINT [FK_hackathon_teams_hackathonId] FOREIGN KEY ([hackathonId])
        REFERENCES [dbo].[hackathons] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_hackathon_teams_leaderId]    FOREIGN KEY ([leaderId])
        REFERENCES [dbo].[users] ([id])
);
GO

CREATE TABLE [dbo].[team_members] (
    [id]       INT          IDENTITY(1,1) NOT NULL,
    [teamId]   INT          NOT NULL,
    [userId]   INT          NOT NULL,
    [joinedAt] DATETIME2(7) NOT NULL CONSTRAINT [DF_tm_joinedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_team_members]     PRIMARY KEY ([id]),
    CONSTRAINT [FK_tm_teamId]        FOREIGN KEY ([teamId])
        REFERENCES [dbo].[hackathon_teams] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_tm_userId]        FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]),
    CONSTRAINT [UQ_tm_team_user]     UNIQUE ([teamId], [userId])
);
GO

CREATE TABLE [dbo].[hackathon_submissions] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [teamId]      INT           NOT NULL,
    [projectUrl]  NVARCHAR(MAX) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [isGraded]    BIT           NOT NULL CONSTRAINT [DF_hs_isGraded]  DEFAULT (0),
    [createdAt]   DATETIME2(7)  NOT NULL CONSTRAINT [DF_hs_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_hackathon_submissions]        PRIMARY KEY ([id]),
    CONSTRAINT [FK_hackathon_submissions_teamId] FOREIGN KEY ([teamId])
        REFERENCES [dbo].[hackathon_teams] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[submission_grades] (
    [id]           INT           IDENTITY(1,1) NOT NULL,
    [submissionId] INT           NOT NULL,
    [score]        INT           NOT NULL,
    [feedback]     NVARCHAR(MAX) NULL,
    [gradedBy]     INT           NOT NULL,
    [gradedAt]     DATETIME2(7)  NOT NULL CONSTRAINT [DF_sg_gradedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_submission_grades]          PRIMARY KEY ([id]),
    CONSTRAINT [FK_sg_submissionId]            FOREIGN KEY ([submissionId])
        REFERENCES [dbo].[hackathon_submissions] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_sg_gradedBy]                FOREIGN KEY ([gradedBy])
        REFERENCES [dbo].[users] ([id])
);
GO

CREATE TABLE [dbo].[stage_submissions] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [stageId]     INT           NOT NULL,
    [teamId]      INT           NOT NULL,
    [projectUrl]  NVARCHAR(MAX) NOT NULL,
    [note]        NVARCHAR(MAX) NULL,
    [submittedAt] DATETIME2(7)  NOT NULL CONSTRAINT [DF_ss_submittedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_stage_submissions]          PRIMARY KEY ([id]),
    CONSTRAINT [FK_ss_stageId]                 FOREIGN KEY ([stageId])
        REFERENCES [dbo].[hackathon_stages] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ss_teamId]                  FOREIGN KEY ([teamId])
        REFERENCES [dbo].[hackathon_teams] ([id])
);
GO

-- ----------------------------------------------------------
-- ИНДЕКСЫ
-- ----------------------------------------------------------

CREATE INDEX [IX_user_roles_userId]      ON [dbo].[user_roles]               ([userId]);
CREATE INDEX [IX_ia_userId]              ON [dbo].[internship_applications]   ([userId]);
CREATE INDEX [IX_ia_internshipId]        ON [dbo].[internship_applications]   ([internshipId]);
CREATE INDEX [IX_iv_internshipId]        ON [dbo].[internship_views]          ([internshipId]);
CREATE INDEX [IX_rooms_ownerId]          ON [dbo].[rooms]                     ([ownerId]);
CREATE INDEX [IX_rm_roomId]              ON [dbo].[room_members]              ([roomId]);
CREATE INDEX [IX_rm_userId]              ON [dbo].[room_members]              ([userId]);
CREATE INDEX [IX_si_date]                ON [dbo].[schedule_items]            ([date]);
CREATE INDEX [IX_hackathon_teams_hackId] ON [dbo].[hackathon_teams]           ([hackathonId]);
GO
