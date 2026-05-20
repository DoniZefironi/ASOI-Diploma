-- ============================================================
-- ТЕМА 2: Электроника + Английский + Хакатоны
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
-- УЧЕБНЫЕ ГРУППЫ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[course_groups] (
    [id]             INT           IDENTITY(1,1) NOT NULL,
    [courseId]       INT           NOT NULL,
    [name]           NVARCHAR(255) NOT NULL,
    [year]           INT           NOT NULL,
    [semester]       INT           NOT NULL,
    [maxStudents]    INT           NOT NULL CONSTRAINT [DF_cg_maxStudents] DEFAULT (30),
    [currentStudents]INT           NOT NULL CONSTRAINT [DF_cg_currentStudents] DEFAULT (0),
    [startDate]      DATE          NOT NULL,
    [endDate]        DATE          NOT NULL,
    [isActive]       BIT           NOT NULL CONSTRAINT [DF_cg_isActive]  DEFAULT (1),
    [createdAt]      DATETIME2(7)  NOT NULL CONSTRAINT [DF_cg_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_course_groups]          PRIMARY KEY ([id]),
    CONSTRAINT [FK_course_groups_courseId] FOREIGN KEY ([courseId])
        REFERENCES [dbo].[courses] ([id])
);
GO

CREATE TABLE [dbo].[course_group_registrations] (
    [id]            INT          IDENTITY(1,1) NOT NULL,
    [userId]        INT          NOT NULL,
    [courseGroupId] INT          NOT NULL,
    [status]        NVARCHAR(50) NOT NULL CONSTRAINT [DF_cgr_status]       DEFAULT N'approved',
    [registeredAt]  DATETIME2(7) NOT NULL CONSTRAINT [DF_cgr_registeredAt] DEFAULT GETDATE(),
    [approvedAt]    DATETIME2(7) NULL,
    [approvedBy]    INT          NULL,
    CONSTRAINT [PK_course_group_registrations]            PRIMARY KEY ([id]),
    CONSTRAINT [FK_cgr_userId]                            FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]),
    CONSTRAINT [FK_cgr_courseGroupId]                     FOREIGN KEY ([courseGroupId])
        REFERENCES [dbo].[course_groups] ([id]) ON DELETE CASCADE,
    CONSTRAINT [UQ_cgr_user_group]                        UNIQUE ([userId], [courseGroupId])
);
GO

-- ----------------------------------------------------------
-- ЗАДАНИЯ И PEER REVIEW
-- ----------------------------------------------------------

CREATE TABLE [dbo].[assignments] (
    [id]            INT           IDENTITY(1,1) NOT NULL,
    [courseGroupId] INT           NOT NULL,
    [title]         NVARCHAR(255) NOT NULL,
    [description]   NVARCHAR(MAX) NULL,
    [type]          NVARCHAR(50)  NOT NULL CONSTRAINT [DF_assignments_type] DEFAULT N'text',
    [dueDate]       DATETIME2(7)  NOT NULL,
    [maxScore]      INT           NOT NULL CONSTRAINT [DF_assignments_maxScore] DEFAULT (100),
    [createdBy]     INT           NOT NULL,
    [createdAt]     DATETIME2(7)  NOT NULL CONSTRAINT [DF_assignments_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_assignments]              PRIMARY KEY ([id]),
    CONSTRAINT [FK_assignments_courseGroupId] FOREIGN KEY ([courseGroupId])
        REFERENCES [dbo].[course_groups] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_assignments_createdBy]    FOREIGN KEY ([createdBy])
        REFERENCES [dbo].[users] ([id])
);
GO

CREATE TABLE [dbo].[assignment_test_cases] (
    [id]             INT           IDENTITY(1,1) NOT NULL,
    [assignmentId]   INT           NOT NULL,
    [inputVector]    NVARCHAR(MAX) NOT NULL,   -- JSON: {A:0, B:1}
    [expectedOutput] NVARCHAR(MAX) NOT NULL,   -- JSON: {Q:1}
    CONSTRAINT [PK_assignment_test_cases]            PRIMARY KEY ([id]),
    CONSTRAINT [FK_assignment_test_cases_assignmentId] FOREIGN KEY ([assignmentId])
        REFERENCES [dbo].[assignments] ([id]) ON DELETE CASCADE
);
GO

CREATE TABLE [dbo].[assignment_submissions] (
    [id]           INT           IDENTITY(1,1) NOT NULL,
    [assignmentId] INT           NOT NULL,
    [userId]       INT           NOT NULL,
    [content]      NVARCHAR(MAX) NULL,
    [circuitData]  NVARCHAR(MAX) NULL,   -- JSON схемы
    [status]       NVARCHAR(50)  NOT NULL CONSTRAINT [DF_asub_status]       DEFAULT N'submitted',
    [finalGrade]   FLOAT         NULL,
    [submittedAt]  DATETIME2(7)  NOT NULL CONSTRAINT [DF_asub_submittedAt]  DEFAULT GETDATE(),
    CONSTRAINT [PK_assignment_submissions]             PRIMARY KEY ([id]),
    CONSTRAINT [FK_asub_assignmentId]                  FOREIGN KEY ([assignmentId])
        REFERENCES [dbo].[assignments] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_asub_userId]                        FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id])
);
GO

CREATE TABLE [dbo].[peer_reviews] (
    [id]           INT           IDENTITY(1,1) NOT NULL,
    [submissionId] INT           NOT NULL,
    [reviewerId]   INT           NOT NULL,
    [score]        INT           NULL,
    [comment]      NVARCHAR(MAX) NULL,
    [status]       NVARCHAR(50)  NOT NULL CONSTRAINT [DF_pr_status]      DEFAULT N'pending',
    [completedAt]  DATETIME2(7)  NULL,
    CONSTRAINT [PK_peer_reviews]            PRIMARY KEY ([id]),
    CONSTRAINT [FK_pr_submissionId]         FOREIGN KEY ([submissionId])
        REFERENCES [dbo].[assignment_submissions] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_pr_reviewerId]           FOREIGN KEY ([reviewerId])
        REFERENCES [dbo].[users] ([id])
);
GO

CREATE TABLE [dbo].[circuit_submissions] (
    [id]           INT           IDENTITY(1,1) NOT NULL,
    [assignmentId] INT           NOT NULL,
    [userId]       INT           NOT NULL,
    [circuitData]  NVARCHAR(MAX) NOT NULL,   -- JSON
    [score]        INT           NULL,
    [isPassed]     BIT           NOT NULL CONSTRAINT [DF_cs_isPassed]     DEFAULT (0),
    [feedback]     NVARCHAR(MAX) NULL,
    [submittedAt]  DATETIME2(7)  NOT NULL CONSTRAINT [DF_cs_submittedAt]  DEFAULT GETDATE(),
    CONSTRAINT [PK_circuit_submissions]           PRIMARY KEY ([id]),
    CONSTRAINT [FK_cs_assignmentId]               FOREIGN KEY ([assignmentId])
        REFERENCES [dbo].[assignments] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_cs_userId]                     FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id])
);
GO

-- ----------------------------------------------------------
-- СЛОВАРЬ (АНГЛИЙСКИЙ ЯЗЫК)
-- ----------------------------------------------------------

CREATE TABLE [dbo].[vocabulary_words] (
    [id]            INT           IDENTITY(1,1) NOT NULL,
    [word]          NVARCHAR(255) NOT NULL,
    [transcription] NVARCHAR(255) NULL,
    [translation]   NVARCHAR(255) NOT NULL,
    [example]       NVARCHAR(MAX) NULL,
    [category]      NVARCHAR(100) NULL,
    [level]         NVARCHAR(10)  NULL,   -- A1, A2, B1, B2, C1, C2
    [createdAt]     DATETIME2(7)  NOT NULL CONSTRAINT [DF_vocab_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_vocabulary_words] PRIMARY KEY ([id])
);
GO

-- ----------------------------------------------------------
-- УЧЕБНЫЕ МАТЕРИАЛЫ (БИБЛИОТЕКА)
-- ----------------------------------------------------------

CREATE TABLE [dbo].[course_materials] (
    [id]         INT           IDENTITY(1,1) NOT NULL,
    [courseId]   INT           NOT NULL,
    [title]      NVARCHAR(255) NOT NULL,
    [description]NVARCHAR(MAX) NULL,
    [type]       NVARCHAR(50)  NOT NULL,   -- pdf, video, link, presentation
    [url]        NVARCHAR(MAX) NOT NULL,
    [isPublic]   BIT           NOT NULL CONSTRAINT [DF_cm_isPublic]  DEFAULT (0),
    [uploadedBy] INT           NOT NULL,
    [createdAt]  DATETIME2(7)  NOT NULL CONSTRAINT [DF_cm_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_course_materials]        PRIMARY KEY ([id]),
    CONSTRAINT [FK_cm_courseId]             FOREIGN KEY ([courseId])
        REFERENCES [dbo].[courses] ([id]),
    CONSTRAINT [FK_cm_uploadedBy]           FOREIGN KEY ([uploadedBy])
        REFERENCES [dbo].[users] ([id])
);
GO

-- ----------------------------------------------------------
-- ФОРУМ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[forum_sections] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [title]       NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [courseId]    INT           NULL,
    [createdAt]   DATETIME2(7)  NOT NULL CONSTRAINT [DF_fs_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_forum_sections]      PRIMARY KEY ([id]),
    CONSTRAINT [FK_forum_sections_courseId] FOREIGN KEY ([courseId])
        REFERENCES [dbo].[courses] ([id]) ON DELETE SET NULL
);
GO

CREATE TABLE [dbo].[forum_topics] (
    [id]        INT           IDENTITY(1,1) NOT NULL,
    [sectionId] INT           NOT NULL,
    [title]     NVARCHAR(500) NOT NULL,
    [content]   NVARCHAR(MAX) NOT NULL,
    [authorId]  INT           NOT NULL,
    [isPinned]  BIT           NOT NULL CONSTRAINT [DF_ft_isPinned]  DEFAULT (0),
    [isClosed]  BIT           NOT NULL CONSTRAINT [DF_ft_isClosed]  DEFAULT (0),
    [createdAt] DATETIME2(7)  NOT NULL CONSTRAINT [DF_ft_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_forum_topics]           PRIMARY KEY ([id]),
    CONSTRAINT [FK_forum_topics_sectionId] FOREIGN KEY ([sectionId])
        REFERENCES [dbo].[forum_sections] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_forum_topics_authorId]  FOREIGN KEY ([authorId])
        REFERENCES [dbo].[users] ([id])
);
GO

CREATE TABLE [dbo].[forum_posts] (
    [id]        INT           IDENTITY(1,1) NOT NULL,
    [topicId]   INT           NOT NULL,
    [content]   NVARCHAR(MAX) NOT NULL,
    [authorId]  INT           NOT NULL,
    [createdAt] DATETIME2(7)  NOT NULL CONSTRAINT [DF_fp_createdAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_forum_posts]          PRIMARY KEY ([id]),
    CONSTRAINT [FK_forum_posts_topicId]  FOREIGN KEY ([topicId])
        REFERENCES [dbo].[forum_topics] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_forum_posts_authorId] FOREIGN KEY ([authorId])
        REFERENCES [dbo].[users] ([id])
);
GO

-- ----------------------------------------------------------
-- ХАКАТОНЫ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[hackathons] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [title]       NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [type]        NVARCHAR(50)  NOT NULL,   -- electronics, iot
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
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [hackathonId] INT           NOT NULL,
    [title]       NVARCHAR(255) NOT NULL,
    [deadline]    DATETIME2(7)  NOT NULL,
    CONSTRAINT [PK_hackathon_stages]            PRIMARY KEY ([id]),
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
    CONSTRAINT [PK_hackathon_teams]            PRIMARY KEY ([id]),
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
    CONSTRAINT [PK_team_members]        PRIMARY KEY ([id]),
    CONSTRAINT [FK_tm_teamId]           FOREIGN KEY ([teamId])
        REFERENCES [dbo].[hackathon_teams] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_tm_userId]           FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]),
    CONSTRAINT [UQ_tm_team_user]        UNIQUE ([teamId], [userId])
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
    CONSTRAINT [PK_submission_grades]            PRIMARY KEY ([id]),
    CONSTRAINT [FK_submission_grades_subId]      FOREIGN KEY ([submissionId])
        REFERENCES [dbo].[hackathon_submissions] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_submission_grades_gradedBy]   FOREIGN KEY ([gradedBy])
        REFERENCES [dbo].[users] ([id])
);
GO

CREATE TABLE [dbo].[stage_submissions] (
    [id]         INT           IDENTITY(1,1) NOT NULL,
    [stageId]    INT           NOT NULL,
    [teamId]     INT           NOT NULL,
    [projectUrl] NVARCHAR(MAX) NOT NULL,
    [note]       NVARCHAR(MAX) NULL,
    [submittedAt]DATETIME2(7)  NOT NULL CONSTRAINT [DF_ss_submittedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_stage_submissions]         PRIMARY KEY ([id]),
    CONSTRAINT [FK_stage_submissions_stageId] FOREIGN KEY ([stageId])
        REFERENCES [dbo].[hackathon_stages] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_stage_submissions_teamId]  FOREIGN KEY ([teamId])
        REFERENCES [dbo].[hackathon_teams] ([id])
);
GO

CREATE TABLE [dbo].[task_reviewers] (
    [id]     INT IDENTITY(1,1) NOT NULL,
    [taskId] INT NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [PK_task_reviewers]        PRIMARY KEY ([id]),
    CONSTRAINT [FK_task_reviewers_taskId] FOREIGN KEY ([taskId])
        REFERENCES [dbo].[hackathon_tasks] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_task_reviewers_userId] FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id])
);
GO

CREATE TABLE [dbo].[task_grades] (
    [id]         INT           IDENTITY(1,1) NOT NULL,
    [taskId]     INT           NOT NULL,
    [teamId]     INT           NOT NULL,
    [reviewerId] INT           NOT NULL,
    [score]      INT           NOT NULL,
    [feedback]   NVARCHAR(MAX) NULL,
    [gradedAt]   DATETIME2(7)  NOT NULL CONSTRAINT [DF_tg_gradedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_task_grades]          PRIMARY KEY ([id]),
    CONSTRAINT [FK_task_grades_taskId]   FOREIGN KEY ([taskId])
        REFERENCES [dbo].[hackathon_tasks] ([id]),
    CONSTRAINT [FK_task_grades_teamId]   FOREIGN KEY ([teamId])
        REFERENCES [dbo].[hackathon_teams] ([id]),
    CONSTRAINT [FK_task_grades_reviewer] FOREIGN KEY ([reviewerId])
        REFERENCES [dbo].[users] ([id])
);
GO

-- ----------------------------------------------------------
-- ДОСТИЖЕНИЯ
-- ----------------------------------------------------------

CREATE TABLE [dbo].[achievements] (
    [id]          INT           IDENTITY(1,1) NOT NULL,
    [name]        NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [icon]        NVARCHAR(255) NULL,
    [condition]   NVARCHAR(MAX) NULL,
    CONSTRAINT [PK_achievements] PRIMARY KEY ([id])
);
GO

CREATE TABLE [dbo].[user_achievements] (
    [id]            INT          IDENTITY(1,1) NOT NULL,
    [userId]        INT          NOT NULL,
    [achievementId] INT          NOT NULL,
    [grantedAt]     DATETIME2(7) NOT NULL CONSTRAINT [DF_ua_grantedAt] DEFAULT GETDATE(),
    CONSTRAINT [PK_user_achievements]              PRIMARY KEY ([id]),
    CONSTRAINT [FK_ua_userId]                      FOREIGN KEY ([userId])
        REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ua_achievementId]               FOREIGN KEY ([achievementId])
        REFERENCES [dbo].[achievements] ([id]) ON DELETE CASCADE,
    CONSTRAINT [UQ_ua_user_achievement]            UNIQUE ([userId], [achievementId])
);
GO

-- ----------------------------------------------------------
-- ИНДЕКСЫ
-- ----------------------------------------------------------

CREATE INDEX [IX_user_roles_userId]       ON [dbo].[user_roles]                  ([userId]);
CREATE INDEX [IX_cgr_userId]              ON [dbo].[course_group_registrations]   ([userId]);
CREATE INDEX [IX_cgr_courseGroupId]       ON [dbo].[course_group_registrations]   ([courseGroupId]);
CREATE INDEX [IX_asub_userId]             ON [dbo].[assignment_submissions]       ([userId]);
CREATE INDEX [IX_asub_assignmentId]       ON [dbo].[assignment_submissions]       ([assignmentId]);
CREATE INDEX [IX_pr_reviewerId]           ON [dbo].[peer_reviews]                 ([reviewerId]);
CREATE INDEX [IX_forum_topics_sectionId]  ON [dbo].[forum_topics]                 ([sectionId]);
CREATE INDEX [IX_forum_posts_topicId]     ON [dbo].[forum_posts]                  ([topicId]);
CREATE INDEX [IX_hackathon_teams_hackId]  ON [dbo].[hackathon_teams]              ([hackathonId]);
GO
