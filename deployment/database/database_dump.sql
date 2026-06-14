--
-- PostgreSQL database dump
--

\restrict odKV5GH2jb9zNFxgS55qLitvoVQN1X9irdVmLFCdLVHTSzEua8v2N2yQxq03V0x

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.hackathon_task_reviewers DROP CONSTRAINT IF EXISTS "FK_faba44ce3222be5ec9a4fa7ad40";
ALTER TABLE IF EXISTS ONLY public.forum_posts DROP CONSTRAINT IF EXISTS "FK_ee11320a399813b9ee190a6b135";
ALTER TABLE IF EXISTS ONLY public.elective_enrollments DROP CONSTRAINT IF EXISTS "FK_ec656ea5c5aac6f3bfd8906774f";
ALTER TABLE IF EXISTS ONLY public.hackathon_tasks DROP CONSTRAINT IF EXISTS "FK_e919a3ff3c25dbcf11cfe296409";
ALTER TABLE IF EXISTS ONLY public.room_members DROP CONSTRAINT IF EXISTS "FK_e6cf45f179a524427ddf8bacd8e";
ALTER TABLE IF EXISTS ONLY public.hackathon_team_members DROP CONSTRAINT IF EXISTS "FK_e45fdd0fbab67920df74ced447b";
ALTER TABLE IF EXISTS ONLY public.elective_enrollments DROP CONSTRAINT IF EXISTS "FK_d9a49b68b8efd665c684aca4502";
ALTER TABLE IF EXISTS ONLY public.hackathon_stages DROP CONSTRAINT IF EXISTS "FK_c89a65634b562b01aef96500655";
ALTER TABLE IF EXISTS ONLY public.course_materials DROP CONSTRAINT IF EXISTS "FK_c72fda5c18f31710e7decde8bc3";
ALTER TABLE IF EXISTS ONLY public.forum_topics DROP CONSTRAINT IF EXISTS "FK_c228733246cf2aee0240663b354";
ALTER TABLE IF EXISTS ONLY public.hackathon_stage_submissions DROP CONSTRAINT IF EXISTS "FK_c15ab2aabe60e83d66cb1463f1e";
ALTER TABLE IF EXISTS ONLY public.course_registrations DROP CONSTRAINT IF EXISTS "FK_bf1afb5a5857b9810ad3ea71c84";
ALTER TABLE IF EXISTS ONLY public.internship_views DROP CONSTRAINT IF EXISTS "FK_b924ce8e3b048a5694d9e21e48e";
ALTER TABLE IF EXISTS ONLY public.internship_applications DROP CONSTRAINT IF EXISTS "FK_b80d0deb281c61086e387b2816f";
ALTER TABLE IF EXISTS ONLY public.course_groups DROP CONSTRAINT IF EXISTS "FK_b6ec3d0cce75665e56432841b22";
ALTER TABLE IF EXISTS ONLY public.room_members DROP CONSTRAINT IF EXISTS "FK_b2d15baf5b46ed9659bd71fbb43";
ALTER TABLE IF EXISTS ONLY public.schedule_items DROP CONSTRAINT IF EXISTS "FK_acee6be562046e2928aec54247d";
ALTER TABLE IF EXISTS ONLY public.course_materials DROP CONSTRAINT IF EXISTS "FK_ace3ef4157ae10a215848945a36";
ALTER TABLE IF EXISTS ONLY public.internship_views DROP CONSTRAINT IF EXISTS "FK_a80149e7da5ad21a1f3398518ff";
ALTER TABLE IF EXISTS ONLY public.schedule_items DROP CONSTRAINT IF EXISTS "FK_a58fa25de0601dc5b5471f1e8ce";
ALTER TABLE IF EXISTS ONLY public.peer_review_sessions DROP CONSTRAINT IF EXISTS "FK_a3bd4e9c1bca59d362b8fce43c9";
ALTER TABLE IF EXISTS ONLY public.hackathon_team_members DROP CONSTRAINT IF EXISTS "FK_9f3e1e47610486f6ea3e488ef44";
ALTER TABLE IF EXISTS ONLY public.rooms DROP CONSTRAINT IF EXISTS "FK_9f38c339cb7a6e33b02f9d2c743";
ALTER TABLE IF EXISTS ONLY public.professional_orientations DROP CONSTRAINT IF EXISTS "FK_96cc8da75732c415bcfc07299da";
ALTER TABLE IF EXISTS ONLY public.hackathon_task_reviewers DROP CONSTRAINT IF EXISTS "FK_8e8f1b6396d99ed8c6652c8bcc6";
ALTER TABLE IF EXISTS ONLY public.assignments DROP CONSTRAINT IF EXISTS "FK_8e5a2e9380222968b7b88a2751c";
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS "FK_87b8888186ca9769c960e926870";
ALTER TABLE IF EXISTS ONLY public.hackathon_submissions DROP CONSTRAINT IF EXISTS "FK_84c04b0ced793ee64e02d3fb753";
ALTER TABLE IF EXISTS ONLY public.olympiad_submissions DROP CONSTRAINT IF EXISTS "FK_7fa1e70b26f7d5767cfdd561b42";
ALTER TABLE IF EXISTS ONLY public.olympiad_submissions DROP CONSTRAINT IF EXISTS "FK_73fe6c1b19117880b1e422205d9";
ALTER TABLE IF EXISTS ONLY public.assignment_submissions DROP CONSTRAINT IF EXISTS "FK_6e8a68594fde52f61876a40489c";
ALTER TABLE IF EXISTS ONLY public.user_achievements DROP CONSTRAINT IF EXISTS "FK_6a5a5816f54d0044ba5f3dc2b74";
ALTER TABLE IF EXISTS ONLY public.course_registrations DROP CONSTRAINT IF EXISTS "FK_66c60a13fcc02be5951f1d97659";
ALTER TABLE IF EXISTS ONLY public.electives DROP CONSTRAINT IF EXISTS "FK_5fae0b7207643a536e80450feeb";
ALTER TABLE IF EXISTS ONLY public.olympiad_problems DROP CONSTRAINT IF EXISTS "FK_5a59b3933d0a6a8c4987c0a8ca6";
ALTER TABLE IF EXISTS ONLY public.hackathon_teams DROP CONSTRAINT IF EXISTS "FK_58201dc448757f1b9a19ae9fdeb";
ALTER TABLE IF EXISTS ONLY public.hackathon_task_grades DROP CONSTRAINT IF EXISTS "FK_570a614361497922cbe3049df93";
ALTER TABLE IF EXISTS ONLY public.hackathon_task_grades DROP CONSTRAINT IF EXISTS "FK_548ff8abfe477f463e93f80d9ae";
ALTER TABLE IF EXISTS ONLY public.hackathon_stage_submissions DROP CONSTRAINT IF EXISTS "FK_53a7cde3f3ecc50ac9f5e7758f8";
ALTER TABLE IF EXISTS ONLY public.hackathon_grades DROP CONSTRAINT IF EXISTS "FK_4e37a131f36738cb52b4f49dcd9";
ALTER TABLE IF EXISTS ONLY public.circuit_submissions DROP CONSTRAINT IF EXISTS "FK_4d9b81de61eb5807fdf3fd80e20";
ALTER TABLE IF EXISTS ONLY public.circuit_submissions DROP CONSTRAINT IF EXISTS "FK_4804f5d41db7f3ca62293024d08";
ALTER TABLE IF EXISTS ONLY public.peer_review_sessions DROP CONSTRAINT IF EXISTS "FK_47f7788fd8eb676f2b56a3d200a";
ALTER TABLE IF EXISTS ONLY public.electives DROP CONSTRAINT IF EXISTS "FK_46b963ed3907db0bc60da37dff5";
ALTER TABLE IF EXISTS ONLY public.hackathon_task_grades DROP CONSTRAINT IF EXISTS "FK_42ed05a46cb9d0b6e9bc462f4ee";
ALTER TABLE IF EXISTS ONLY public.hackathon_grades DROP CONSTRAINT IF EXISTS "FK_3f9f0337ea289cd5f890a861851";
ALTER TABLE IF EXISTS ONLY public.hackathon_teams DROP CONSTRAINT IF EXISTS "FK_3d34425206302ad8c68e5df9d29";
ALTER TABLE IF EXISTS ONLY public.olympiad_submissions DROP CONSTRAINT IF EXISTS "FK_3d27aa4c2d27ca1ebc294f34f6f";
ALTER TABLE IF EXISTS ONLY public.user_achievements DROP CONSTRAINT IF EXISTS "FK_3ac6bc9da3e8a56f3f7082012dd";
ALTER TABLE IF EXISTS ONLY public.internship_applications DROP CONSTRAINT IF EXISTS "FK_29ee4775294094c41f9cb0c51df";
ALTER TABLE IF EXISTS ONLY public.assignment_submissions DROP CONSTRAINT IF EXISTS "FK_16c8e730e6a93035772cf97ed25";
ALTER TABLE IF EXISTS ONLY public.forum_posts DROP CONSTRAINT IF EXISTS "FK_151dff45f01c0c195022e7db127";
ALTER TABLE IF EXISTS ONLY public.hackathons DROP CONSTRAINT IF EXISTS "FK_115d426b9f65d2134bbaee6e6cd";
ALTER TABLE IF EXISTS ONLY public.olympiads DROP CONSTRAINT IF EXISTS "FK_112260651a59744778cfc676269";
ALTER TABLE IF EXISTS ONLY public.forum_sections DROP CONSTRAINT IF EXISTS "FK_0c4e9cbc4e10fce00550edd6800";
ALTER TABLE IF EXISTS ONLY public.peer_reviews DROP CONSTRAINT IF EXISTS "FK_07c9f6b29a8b8db324223eb558f";
ALTER TABLE IF EXISTS ONLY public.circuit_solutions DROP CONSTRAINT IF EXISTS "FK_0743c23c16f3a993f6fc277b20a";
ALTER TABLE IF EXISTS ONLY public.peer_reviews DROP CONSTRAINT IF EXISTS "FK_05fe25ed8b62ec86b08b2aad491";
ALTER TABLE IF EXISTS ONLY public.forum_topics DROP CONSTRAINT IF EXISTS "FK_006898061c2e0db9181ff28edc3";
DROP INDEX IF EXISTS public."IDX_ed528548f4d36f81efbaaacff8";
DROP INDEX IF EXISTS public."IDX_8204e73c6913d43e85434d1252";
DROP INDEX IF EXISTS public."IDX_692a909ee0fa9383e7859f9b40";
DROP INDEX IF EXISTS public."IDX_2bfbe5441b458f6bf2e7eabf65";
ALTER TABLE IF EXISTS ONLY public.course_registrations DROP CONSTRAINT IF EXISTS "UQ_f5159b7f0fa5473ef6b91597263";
ALTER TABLE IF EXISTS ONLY public.peer_reviews DROP CONSTRAINT IF EXISTS "UQ_ea76c408d8de293962bb935575e";
ALTER TABLE IF EXISTS ONLY public.hackathon_task_grades DROP CONSTRAINT IF EXISTS "UQ_e33f73347a0b5d78b9134c0b39f";
ALTER TABLE IF EXISTS ONLY public.room_members DROP CONSTRAINT IF EXISTS "UQ_d4ea360161fd5ff21a94ae9d8a6";
ALTER TABLE IF EXISTS ONLY public.elective_enrollments DROP CONSTRAINT IF EXISTS "UQ_ca6c53049643183a882a1e7daea";
ALTER TABLE IF EXISTS ONLY public.internship_views DROP CONSTRAINT IF EXISTS "UQ_b780b880920f92160429377c1f2";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "UQ_97672ac88f789774dd47f7c8be3";
ALTER TABLE IF EXISTS ONLY public.rooms DROP CONSTRAINT IF EXISTS "UQ_8f569e8b851d66275352ede4bf2";
ALTER TABLE IF EXISTS ONLY public.internship_applications DROP CONSTRAINT IF EXISTS "UQ_7b35c07ab6ca856486d3a374f94";
ALTER TABLE IF EXISTS ONLY public.hackathon_team_members DROP CONSTRAINT IF EXISTS "UQ_79dc6cc4aa620b3ea7123a83c8c";
ALTER TABLE IF EXISTS ONLY public.career_tests DROP CONSTRAINT IF EXISTS "UQ_5d116d1dc8709e8ad75cebc4173";
ALTER TABLE IF EXISTS ONLY public.hackathon_task_reviewers DROP CONSTRAINT IF EXISTS "UQ_4f3c0e3efab12b0cade4c09f04a";
ALTER TABLE IF EXISTS ONLY public.hackathon_stage_submissions DROP CONSTRAINT IF EXISTS "UQ_311ae8e632d71696cc2fe2318d6";
ALTER TABLE IF EXISTS ONLY public.electives DROP CONSTRAINT IF EXISTS "PK_fdbd070acb971f9cad861aa293a";
ALTER TABLE IF EXISTS ONLY public.career_tests DROP CONSTRAINT IF EXISTS "PK_f4a7176713122ec8bf5074fdd01";
ALTER TABLE IF EXISTS ONLY public.olympiads DROP CONSTRAINT IF EXISTS "PK_e769cf321c3bb81860f8db30c9d";
ALTER TABLE IF EXISTS ONLY public.vocab_terms DROP CONSTRAINT IF EXISTS "PK_df4df3fe57eab695b92b7568242";
ALTER TABLE IF EXISTS ONLY public.forum_sections DROP CONSTRAINT IF EXISTS "PK_c9325bcd3ec6be258eed84ca839";
ALTER TABLE IF EXISTS ONLY public.assignments DROP CONSTRAINT IF EXISTS "PK_c54ca359535e0012b04dcbd80ee";
ALTER TABLE IF EXISTS ONLY public.forum_topics DROP CONSTRAINT IF EXISTS "PK_c3cfc62a16863804757504742b4";
ALTER TABLE IF EXISTS ONLY public.hackathon_team_members DROP CONSTRAINT IF EXISTS "PK_bd4a1ee6e3aa5a16059ee0c327a";
ALTER TABLE IF EXISTS ONLY public.course_materials DROP CONSTRAINT IF EXISTS "PK_b8d788301b7ea04c1cefc4bd2ca";
ALTER TABLE IF EXISTS ONLY public.hackathon_tasks DROP CONSTRAINT IF EXISTS "PK_b6a226216c40d0def9c5ed4e835";
ALTER TABLE IF EXISTS ONLY public.hackathons DROP CONSTRAINT IF EXISTS "PK_b290177bd925b16bf35bf59961b";
ALTER TABLE IF EXISTS ONLY public.course_registrations DROP CONSTRAINT IF EXISTS "PK_a8726b4f90ee73642e768e21ef0";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "PK_a3ffb1c0c8416b9fc6f907b7433";
ALTER TABLE IF EXISTS ONLY public.course_groups DROP CONSTRAINT IF EXISTS "PK_9722c03add9ea0dca5c69447398";
ALTER TABLE IF EXISTS ONLY public.hackathon_stage_submissions DROP CONSTRAINT IF EXISTS "PK_9632fa63b130535d9d95be6bb01";
ALTER TABLE IF EXISTS ONLY public.hackathon_task_grades DROP CONSTRAINT IF EXISTS "PK_92939f3a94f238928c2253e8025";
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS "PK_8acd5cf26ebd158416f477de799";
ALTER TABLE IF EXISTS ONLY public.hackathon_submissions DROP CONSTRAINT IF EXISTS "PK_84e5597b2922c2d332b18dd61c3";
ALTER TABLE IF EXISTS ONLY public.hackathon_task_reviewers DROP CONSTRAINT IF EXISTS "PK_7d6a19548d2336cdd9e3f249155";
ALTER TABLE IF EXISTS ONLY public.circuit_submissions DROP CONSTRAINT IF EXISTS "PK_7861c16bb55e590107e2ea87979";
ALTER TABLE IF EXISTS ONLY public.professional_orientations DROP CONSTRAINT IF EXISTS "PK_73ffc94fb2ebecece2ba8492b67";
ALTER TABLE IF EXISTS ONLY public.hackathon_stages DROP CONSTRAINT IF EXISTS "PK_6d07f0c7af00e448870328249ef";
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS "PK_6a72c3c0f683f6462415e653c3a";
ALTER TABLE IF EXISTS ONLY public.hackathon_teams DROP CONSTRAINT IF EXISTS "PK_698e891160d654b5763ff88c3a4";
ALTER TABLE IF EXISTS ONLY public.internship_views DROP CONSTRAINT IF EXISTS "PK_5fdf3ffa9e879dfd04b67081bd7";
ALTER TABLE IF EXISTS ONLY public.olympiad_problems DROP CONSTRAINT IF EXISTS "PK_5c839de074c011dc17632a6abed";
ALTER TABLE IF EXISTS ONLY public.elective_enrollments DROP CONSTRAINT IF EXISTS "PK_599866b9a790885cc4d291b432d";
ALTER TABLE IF EXISTS ONLY public.internship_applications DROP CONSTRAINT IF EXISTS "PK_44ff34aef5f553a222a2cb770fe";
ALTER TABLE IF EXISTS ONLY public.room_members DROP CONSTRAINT IF EXISTS "PK_4493fab0433f741b7cf842e6038";
ALTER TABLE IF EXISTS ONLY public.courses DROP CONSTRAINT IF EXISTS "PK_3f70a487cc718ad8eda4e6d58c9";
ALTER TABLE IF EXISTS ONLY public.forum_posts DROP CONSTRAINT IF EXISTS "PK_3e9c301114a0fd42c998681b04e";
ALTER TABLE IF EXISTS ONLY public.user_achievements DROP CONSTRAINT IF EXISTS "PK_3d94aba7e9ed55365f68b5e77fa";
ALTER TABLE IF EXISTS ONLY public.circuit_element_types DROP CONSTRAINT IF EXISTS "PK_3cdb855fa9e777fbbafeb0dc02a";
ALTER TABLE IF EXISTS ONLY public.circuit_solutions DROP CONSTRAINT IF EXISTS "PK_34a0f404b9818a8a9401889cd04";
ALTER TABLE IF EXISTS ONLY public.site_visits DROP CONSTRAINT IF EXISTS "PK_33b7e3823d02ff3218134f0a277";
ALTER TABLE IF EXISTS ONLY public.peer_review_sessions DROP CONSTRAINT IF EXISTS "PK_322bba6d1127eb59342e2362c5d";
ALTER TABLE IF EXISTS ONLY public.olympiad_submissions DROP CONSTRAINT IF EXISTS "PK_2adbedb5b703fbe3ca79169e969";
ALTER TABLE IF EXISTS ONLY public.peer_reviews DROP CONSTRAINT IF EXISTS "PK_2532078fca474d3c97e56a5bd19";
ALTER TABLE IF EXISTS ONLY public.achievements DROP CONSTRAINT IF EXISTS "PK_1bc19c37c6249f70186f318d71d";
ALTER TABLE IF EXISTS ONLY public.hackathon_grades DROP CONSTRAINT IF EXISTS "PK_13ec9a862dcac5cba9f27c1d643";
ALTER TABLE IF EXISTS ONLY public.assignment_submissions DROP CONSTRAINT IF EXISTS "PK_0caedc49d0357bedac05ca5a806";
ALTER TABLE IF EXISTS ONLY public.internships DROP CONSTRAINT IF EXISTS "PK_0a44e3c9dde1f2b92a4eb3c529f";
ALTER TABLE IF EXISTS ONLY public.rooms DROP CONSTRAINT IF EXISTS "PK_0368a2d7c215f2d0458a54933f2";
ALTER TABLE IF EXISTS ONLY public.schedule_items DROP CONSTRAINT IF EXISTS "PK_035b2d214f67bd7ef775cb44ab1";
ALTER TABLE IF EXISTS public.vocab_terms ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.user_roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.user_achievements ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.site_visits ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.schedule_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.rooms ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.room_members ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.professional_orientations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.peer_reviews ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.peer_review_sessions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.olympiads ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.olympiad_submissions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.olympiad_problems ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.notifications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.internships ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.internship_views ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.internship_applications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hackathons ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hackathon_teams ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hackathon_team_members ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hackathon_tasks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hackathon_task_reviewers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hackathon_task_grades ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hackathon_submissions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hackathon_stages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hackathon_stage_submissions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hackathon_grades ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.forum_topics ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.forum_sections ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.forum_posts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.electives ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.elective_enrollments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.courses ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.course_registrations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.course_materials ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.course_groups ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.circuit_submissions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.circuit_solutions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.career_tests ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.assignments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.assignment_submissions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.achievements ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.vocab_terms_id_seq;
DROP TABLE IF EXISTS public.vocab_terms;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.user_roles_id_seq;
DROP TABLE IF EXISTS public.user_roles;
DROP SEQUENCE IF EXISTS public.user_achievements_id_seq;
DROP TABLE IF EXISTS public.user_achievements;
DROP SEQUENCE IF EXISTS public.site_visits_id_seq;
DROP TABLE IF EXISTS public.site_visits;
DROP SEQUENCE IF EXISTS public.schedule_items_id_seq;
DROP TABLE IF EXISTS public.schedule_items;
DROP SEQUENCE IF EXISTS public.rooms_id_seq;
DROP TABLE IF EXISTS public.rooms;
DROP SEQUENCE IF EXISTS public.room_members_id_seq;
DROP TABLE IF EXISTS public.room_members;
DROP SEQUENCE IF EXISTS public.professional_orientations_id_seq;
DROP TABLE IF EXISTS public.professional_orientations;
DROP SEQUENCE IF EXISTS public.peer_reviews_id_seq;
DROP TABLE IF EXISTS public.peer_reviews;
DROP SEQUENCE IF EXISTS public.peer_review_sessions_id_seq;
DROP TABLE IF EXISTS public.peer_review_sessions;
DROP SEQUENCE IF EXISTS public.olympiads_id_seq;
DROP TABLE IF EXISTS public.olympiads;
DROP SEQUENCE IF EXISTS public.olympiad_submissions_id_seq;
DROP TABLE IF EXISTS public.olympiad_submissions;
DROP SEQUENCE IF EXISTS public.olympiad_problems_id_seq;
DROP TABLE IF EXISTS public.olympiad_problems;
DROP SEQUENCE IF EXISTS public.notifications_id_seq;
DROP TABLE IF EXISTS public.notifications;
DROP SEQUENCE IF EXISTS public.internships_id_seq;
DROP TABLE IF EXISTS public.internships;
DROP SEQUENCE IF EXISTS public.internship_views_id_seq;
DROP TABLE IF EXISTS public.internship_views;
DROP SEQUENCE IF EXISTS public.internship_applications_id_seq;
DROP TABLE IF EXISTS public.internship_applications;
DROP SEQUENCE IF EXISTS public.hackathons_id_seq;
DROP TABLE IF EXISTS public.hackathons;
DROP SEQUENCE IF EXISTS public.hackathon_teams_id_seq;
DROP TABLE IF EXISTS public.hackathon_teams;
DROP SEQUENCE IF EXISTS public.hackathon_team_members_id_seq;
DROP TABLE IF EXISTS public.hackathon_team_members;
DROP SEQUENCE IF EXISTS public.hackathon_tasks_id_seq;
DROP TABLE IF EXISTS public.hackathon_tasks;
DROP SEQUENCE IF EXISTS public.hackathon_task_reviewers_id_seq;
DROP TABLE IF EXISTS public.hackathon_task_reviewers;
DROP SEQUENCE IF EXISTS public.hackathon_task_grades_id_seq;
DROP TABLE IF EXISTS public.hackathon_task_grades;
DROP SEQUENCE IF EXISTS public.hackathon_submissions_id_seq;
DROP TABLE IF EXISTS public.hackathon_submissions;
DROP SEQUENCE IF EXISTS public.hackathon_stages_id_seq;
DROP TABLE IF EXISTS public.hackathon_stages;
DROP SEQUENCE IF EXISTS public.hackathon_stage_submissions_id_seq;
DROP TABLE IF EXISTS public.hackathon_stage_submissions;
DROP SEQUENCE IF EXISTS public.hackathon_grades_id_seq;
DROP TABLE IF EXISTS public.hackathon_grades;
DROP SEQUENCE IF EXISTS public.forum_topics_id_seq;
DROP TABLE IF EXISTS public.forum_topics;
DROP SEQUENCE IF EXISTS public.forum_sections_id_seq;
DROP TABLE IF EXISTS public.forum_sections;
DROP SEQUENCE IF EXISTS public.forum_posts_id_seq;
DROP TABLE IF EXISTS public.forum_posts;
DROP SEQUENCE IF EXISTS public.electives_id_seq;
DROP TABLE IF EXISTS public.electives;
DROP SEQUENCE IF EXISTS public.elective_enrollments_id_seq;
DROP TABLE IF EXISTS public.elective_enrollments;
DROP SEQUENCE IF EXISTS public.courses_id_seq;
DROP TABLE IF EXISTS public.courses;
DROP SEQUENCE IF EXISTS public.course_registrations_id_seq;
DROP TABLE IF EXISTS public.course_registrations;
DROP SEQUENCE IF EXISTS public.course_materials_id_seq;
DROP TABLE IF EXISTS public.course_materials;
DROP SEQUENCE IF EXISTS public.course_groups_id_seq;
DROP TABLE IF EXISTS public.course_groups;
DROP SEQUENCE IF EXISTS public.circuit_submissions_id_seq;
DROP TABLE IF EXISTS public.circuit_submissions;
DROP SEQUENCE IF EXISTS public.circuit_solutions_id_seq;
DROP TABLE IF EXISTS public.circuit_solutions;
DROP TABLE IF EXISTS public.circuit_element_types;
DROP SEQUENCE IF EXISTS public.career_tests_id_seq;
DROP TABLE IF EXISTS public.career_tests;
DROP SEQUENCE IF EXISTS public.assignments_id_seq;
DROP TABLE IF EXISTS public.assignments;
DROP SEQUENCE IF EXISTS public.assignment_submissions_id_seq;
DROP TABLE IF EXISTS public.assignment_submissions;
DROP SEQUENCE IF EXISTS public.achievements_id_seq;
DROP TABLE IF EXISTS public.achievements;
DROP TYPE IF EXISTS public.user_roles_role_enum;
DROP TYPE IF EXISTS public.rooms_type_enum;
DROP TYPE IF EXISTS public.room_members_role_enum;
DROP TYPE IF EXISTS public.olympiad_submissions_status_enum;
DROP TYPE IF EXISTS public.olympiad_problems_difficulty_enum;
DROP TYPE IF EXISTS public.notifications_type_enum;
DROP TYPE IF EXISTS public.courses_type_enum;
DROP TYPE IF EXISTS public.course_registrations_status_enum;
DROP TYPE IF EXISTS public.course_materials_type_enum;
DROP TYPE IF EXISTS public.assignments_type_enum;
DROP TYPE IF EXISTS public.assignment_submissions_status_enum;
DROP TYPE IF EXISTS public.achievements_type_enum;
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: achievements_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.achievements_type_enum AS ENUM (
    'first_registration',
    'course_registration',
    'first_submission',
    'multiple_submissions',
    'assignment_excellence',
    'perfect_score',
    'peer_reviewer',
    'forum_contributor',
    'early_bird',
    'hackathon_participant',
    'hackathon_winner',
    'olympiad_winner',
    'course_completion'
);


--
-- Name: assignment_submissions_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.assignment_submissions_status_enum AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'reviewed',
    'graded'
);


--
-- Name: assignments_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.assignments_type_enum AS ENUM (
    'practice',
    'test',
    'practice_review',
    'hackathon',
    'olympiad'
);


--
-- Name: course_materials_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.course_materials_type_enum AS ENUM (
    'lecture_slides',
    'video',
    'document',
    'code_example',
    'project_template',
    'reference'
);


--
-- Name: course_registrations_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.course_registrations_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: courses_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.courses_type_enum AS ENUM (
    'english',
    'electronics',
    'computer_science',
    'iot'
);


--
-- Name: notifications_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notifications_type_enum AS ENUM (
    'achievement',
    'course',
    'assignment',
    'system'
);


--
-- Name: olympiad_problems_difficulty_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.olympiad_problems_difficulty_enum AS ENUM (
    'easy',
    'medium',
    'hard'
);


--
-- Name: olympiad_submissions_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.olympiad_submissions_status_enum AS ENUM (
    'pending',
    'accepted',
    'wrong_answer',
    'error'
);


--
-- Name: room_members_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.room_members_role_enum AS ENUM (
    'owner',
    'editor',
    'viewer'
);


--
-- Name: rooms_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.rooms_type_enum AS ENUM (
    'circuit',
    'iot',
    'compiler'
);


--
-- Name: user_roles_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_roles_role_enum AS ENUM (
    'registered_user',
    'student_english',
    'student_electronics',
    'student_computer_science',
    'student_iot',
    'mentor_english',
    'mentor_electronics',
    'mentor_computer_science',
    'mentor_iot',
    'admin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    type public.achievements_type_enum NOT NULL,
    icon character varying NOT NULL,
    points integer DEFAULT 1 NOT NULL,
    conditions json NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- Name: assignment_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assignment_submissions (
    id integer NOT NULL,
    content text,
    attachments json,
    "repositoryUrl" text,
    status public.assignment_submissions_status_enum DEFAULT 'draft'::public.assignment_submissions_status_enum NOT NULL,
    "submittedAt" timestamp without time zone,
    "finalScore" integer,
    "mentorFeedback" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer NOT NULL,
    "assignmentId" integer NOT NULL
);


--
-- Name: assignment_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assignment_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assignment_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assignment_submissions_id_seq OWNED BY public.assignment_submissions.id;


--
-- Name: assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assignments (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    type public.assignments_type_enum NOT NULL,
    requirements json,
    "maxScore" integer NOT NULL,
    deadline timestamp without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "peerReviewEnabled" boolean,
    "peerReviewStartDate" timestamp without time zone,
    "peerReviewEndDate" timestamp without time zone,
    "peerReviewsPerStudent" integer DEFAULT 5 NOT NULL,
    "peerReviewCriteria" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "courseGroupId" integer,
    "electiveId" integer,
    "testCases" json
);


--
-- Name: assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;


--
-- Name: career_tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_tests (
    id integer NOT NULL,
    type character varying NOT NULL,
    title character varying NOT NULL,
    description text,
    duration character varying DEFAULT '10–15 минут'::character varying NOT NULL,
    "answerFormat" character varying DEFAULT 'yes_no'::character varying NOT NULL,
    questions jsonb NOT NULL,
    "categoryMeta" jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: career_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_tests_id_seq OWNED BY public.career_tests.id;


--
-- Name: circuit_element_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.circuit_element_types (
    type character varying NOT NULL,
    metadata json NOT NULL
);


--
-- Name: circuit_solutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.circuit_solutions (
    id integer NOT NULL,
    "circuitData" json NOT NULL,
    "simulationResults" json,
    score integer NOT NULL,
    "maxScore" integer NOT NULL,
    feedback text,
    "submittedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "assignmentId" integer NOT NULL
);


--
-- Name: circuit_solutions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.circuit_solutions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: circuit_solutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.circuit_solutions_id_seq OWNED BY public.circuit_solutions.id;


--
-- Name: circuit_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.circuit_submissions (
    id integer NOT NULL,
    "circuitData" json NOT NULL,
    score integer NOT NULL,
    "maxScore" integer NOT NULL,
    feedback text,
    "isPassed" boolean DEFAULT false NOT NULL,
    submitted_at timestamp without time zone DEFAULT now() NOT NULL,
    "assignmentId" integer NOT NULL,
    "userId" integer NOT NULL
);


--
-- Name: circuit_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.circuit_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: circuit_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.circuit_submissions_id_seq OWNED BY public.circuit_submissions.id;


--
-- Name: course_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_groups (
    id integer NOT NULL,
    name character varying NOT NULL,
    year integer NOT NULL,
    semester integer NOT NULL,
    "maxStudents" integer DEFAULT 30 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "courseId" integer NOT NULL
);


--
-- Name: course_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_groups_id_seq OWNED BY public.course_groups.id;


--
-- Name: course_materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_materials (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    type public.course_materials_type_enum NOT NULL,
    "fileUrl" character varying NOT NULL,
    "thumbnailUrl" character varying,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "courseId" integer NOT NULL,
    "uploadedById" integer NOT NULL
);


--
-- Name: course_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_materials_id_seq OWNED BY public.course_materials.id;


--
-- Name: course_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_registrations (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "courseGroupId" integer NOT NULL,
    status public.course_registrations_status_enum DEFAULT 'pending'::public.course_registrations_status_enum NOT NULL,
    "registeredAt" timestamp without time zone DEFAULT now() NOT NULL,
    "approvedAt" timestamp without time zone,
    "approvedBy" integer
);


--
-- Name: course_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_registrations_id_seq OWNED BY public.course_registrations.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    name character varying NOT NULL,
    type public.courses_type_enum NOT NULL,
    description text NOT NULL,
    duration integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "imageUrl" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: elective_enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.elective_enrollments (
    id integer NOT NULL,
    "electiveId" integer NOT NULL,
    "userId" integer NOT NULL,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    "enrolledAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: elective_enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.elective_enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: elective_enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.elective_enrollments_id_seq OWNED BY public.elective_enrollments.id;


--
-- Name: electives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.electives (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    "imageUrl" character varying,
    "courseGroupId" integer NOT NULL,
    "instructorId" integer,
    "startDate" timestamp without time zone,
    "endDate" timestamp without time zone,
    "maxParticipants" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: electives_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.electives_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: electives_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.electives_id_seq OWNED BY public.electives.id;


--
-- Name: forum_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forum_posts (
    id integer NOT NULL,
    "topicId" integer NOT NULL,
    "authorId" integer NOT NULL,
    content text NOT NULL,
    "isEdited" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now()
);


--
-- Name: forum_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.forum_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: forum_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.forum_posts_id_seq OWNED BY public.forum_posts.id;


--
-- Name: forum_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forum_sections (
    id integer NOT NULL,
    "courseId" integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    "orderIndex" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: forum_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.forum_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: forum_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.forum_sections_id_seq OWNED BY public.forum_sections.id;


--
-- Name: forum_topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forum_topics (
    id integer NOT NULL,
    "sectionId" integer NOT NULL,
    "authorId" integer NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL,
    "isClosed" boolean DEFAULT false NOT NULL,
    "viewsCount" integer DEFAULT 0 NOT NULL,
    "lastPostAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: forum_topics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.forum_topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: forum_topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.forum_topics_id_seq OWNED BY public.forum_topics.id;


--
-- Name: hackathon_grades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hackathon_grades (
    id integer NOT NULL,
    "submissionId" integer NOT NULL,
    "judgeId" integer NOT NULL,
    "innovationScore" numeric(5,2),
    "functionalityScore" numeric(5,2),
    "presentationScore" numeric(5,2),
    "teamworkScore" numeric(5,2),
    "totalScore" numeric(5,2),
    feedback text,
    "judgingCriteriaScores" jsonb,
    "judgedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: hackathon_grades_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hackathon_grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hackathon_grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hackathon_grades_id_seq OWNED BY public.hackathon_grades.id;


--
-- Name: hackathon_stage_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hackathon_stage_submissions (
    id integer NOT NULL,
    stage_id integer NOT NULL,
    team_id integer NOT NULL,
    "projectUrl" character varying(1000) NOT NULL,
    note text,
    "submittedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: hackathon_stage_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hackathon_stage_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hackathon_stage_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hackathon_stage_submissions_id_seq OWNED BY public.hackathon_stage_submissions.id;


--
-- Name: hackathon_stages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hackathon_stages (
    id integer NOT NULL,
    "hackathonId" integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    "order" integer DEFAULT 0 NOT NULL,
    "startDate" timestamp without time zone,
    "endDate" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: hackathon_stages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hackathon_stages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hackathon_stages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hackathon_stages_id_seq OWNED BY public.hackathon_stages.id;


--
-- Name: hackathon_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hackathon_submissions (
    id integer NOT NULL,
    "teamId" integer NOT NULL,
    "circuitProjectId" integer,
    "documentationUrl" character varying(500),
    "presentationUrl" character varying(500),
    "videoDemoUrl" character varying(500),
    "sourceCodeUrl" character varying(500),
    "archiveUrl" character varying(1000),
    "submissionNote" text,
    "submittedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: hackathon_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hackathon_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hackathon_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hackathon_submissions_id_seq OWNED BY public.hackathon_submissions.id;


--
-- Name: hackathon_task_grades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hackathon_task_grades (
    id integer NOT NULL,
    task_id integer NOT NULL,
    team_id integer NOT NULL,
    reviewer_id integer NOT NULL,
    score numeric(5,2) NOT NULL,
    feedback text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: hackathon_task_grades_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hackathon_task_grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hackathon_task_grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hackathon_task_grades_id_seq OWNED BY public.hackathon_task_grades.id;


--
-- Name: hackathon_task_reviewers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hackathon_task_reviewers (
    id integer NOT NULL,
    task_id integer NOT NULL,
    user_id integer NOT NULL,
    "assignedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: hackathon_task_reviewers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hackathon_task_reviewers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hackathon_task_reviewers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hackathon_task_reviewers_id_seq OWNED BY public.hackathon_task_reviewers.id;


--
-- Name: hackathon_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hackathon_tasks (
    id integer NOT NULL,
    "stageId" integer NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    "maxScore" integer DEFAULT 100 NOT NULL,
    "scoringCriteria" text,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: hackathon_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hackathon_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hackathon_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hackathon_tasks_id_seq OWNED BY public.hackathon_tasks.id;


--
-- Name: hackathon_team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hackathon_team_members (
    id integer NOT NULL,
    "teamId" integer NOT NULL,
    "userId" integer NOT NULL,
    role character varying DEFAULT 'member'::character varying NOT NULL,
    "joinedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: hackathon_team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hackathon_team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hackathon_team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hackathon_team_members_id_seq OWNED BY public.hackathon_team_members.id;


--
-- Name: hackathon_teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hackathon_teams (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    "hackathonId" integer NOT NULL,
    "leaderId" integer NOT NULL,
    "projectName" character varying(200),
    "projectDescription" text,
    status character varying DEFAULT 'forming'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: hackathon_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hackathon_teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hackathon_teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hackathon_teams_id_seq OWNED BY public.hackathon_teams.id;


--
-- Name: hackathons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hackathons (
    id integer NOT NULL,
    "courseId" integer,
    title character varying(200) DEFAULT 'Untitled Hackathon'::character varying NOT NULL,
    description text NOT NULL,
    theme character varying(200),
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    "registrationDeadline" timestamp without time zone,
    "maxTeamSize" integer DEFAULT 5 NOT NULL,
    "minTeamSize" integer DEFAULT 3 NOT NULL,
    "prizePool" numeric(10,2),
    "isActive" boolean DEFAULT true NOT NULL,
    "judgingCriteria" jsonb,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    rules text
);


--
-- Name: hackathons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hackathons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hackathons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hackathons_id_seq OWNED BY public.hackathons.id;


--
-- Name: internship_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.internship_applications (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "internshipId" integer NOT NULL,
    "appliedAt" timestamp without time zone DEFAULT now() NOT NULL,
    comment character varying
);


--
-- Name: internship_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.internship_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: internship_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.internship_applications_id_seq OWNED BY public.internship_applications.id;


--
-- Name: internship_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.internship_views (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "internshipId" integer NOT NULL,
    "viewedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "viewCount" integer DEFAULT 1 NOT NULL
);


--
-- Name: internship_views_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.internship_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: internship_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.internship_views_id_seq OWNED BY public.internship_views.id;


--
-- Name: internships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.internships (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    company character varying(200) NOT NULL,
    "companyDescription" text,
    description text NOT NULL,
    requirements text,
    prospects text,
    location character varying,
    format character varying(20) DEFAULT 'office'::character varying NOT NULL,
    duration character varying,
    salary character varying,
    "applicationEmail" character varying,
    "applicationUrl" character varying,
    "imageUrl" character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    deadline timestamp without time zone,
    tags jsonb,
    "externalId" character varying,
    source character varying(50),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: internships_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.internships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: internships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.internships_id_seq OWNED BY public.internships.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    type public.notifications_type_enum DEFAULT 'system'::public.notifications_type_enum NOT NULL,
    title character varying NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    metadata json,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: olympiad_problems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.olympiad_problems (
    id integer NOT NULL,
    olympiad_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text NOT NULL,
    input_description text,
    output_description text,
    examples jsonb DEFAULT '[]'::jsonb NOT NULL,
    difficulty public.olympiad_problems_difficulty_enum DEFAULT 'medium'::public.olympiad_problems_difficulty_enum NOT NULL,
    points integer DEFAULT 100 NOT NULL,
    order_index integer DEFAULT 0 NOT NULL
);


--
-- Name: olympiad_problems_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.olympiad_problems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: olympiad_problems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.olympiad_problems_id_seq OWNED BY public.olympiad_problems.id;


--
-- Name: olympiad_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.olympiad_submissions (
    id integer NOT NULL,
    olympiad_id integer NOT NULL,
    problem_id integer NOT NULL,
    user_id integer NOT NULL,
    code text NOT NULL,
    language character varying(20) NOT NULL,
    status public.olympiad_submissions_status_enum DEFAULT 'pending'::public.olympiad_submissions_status_enum NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    output text,
    error_message text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: olympiad_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.olympiad_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: olympiad_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.olympiad_submissions_id_seq OWNED BY public.olympiad_submissions.id;


--
-- Name: olympiads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.olympiads (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    "registrationDeadline" timestamp without time zone,
    "allowedLanguages" jsonb DEFAULT '["js", "python", "cpp", "java"]'::jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    course_id integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: olympiads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.olympiads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: olympiads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.olympiads_id_seq OWNED BY public.olympiads.id;


--
-- Name: peer_review_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.peer_review_sessions (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    "assignmentId" integer NOT NULL,
    "courseGroupId" integer NOT NULL,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    "reviewsPerStudent" integer DEFAULT 5 NOT NULL,
    criteria jsonb,
    "isDistributed" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: peer_review_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.peer_review_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: peer_review_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.peer_review_sessions_id_seq OWNED BY public.peer_review_sessions.id;


--
-- Name: peer_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.peer_reviews (
    id integer NOT NULL,
    "reviewerId" integer NOT NULL,
    "submissionId" integer NOT NULL,
    score numeric(5,2),
    "criteriaScores" jsonb,
    feedback text,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: peer_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.peer_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: peer_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.peer_reviews_id_seq OWNED BY public.peer_reviews.id;


--
-- Name: professional_orientations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.professional_orientations (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "testResult" json DEFAULT '{}'::json NOT NULL,
    "recommendedProfession" character varying NOT NULL,
    "expertResult" json,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: professional_orientations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.professional_orientations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: professional_orientations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.professional_orientations_id_seq OWNED BY public.professional_orientations.id;


--
-- Name: room_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room_members (
    id integer NOT NULL,
    room_id integer NOT NULL,
    user_id integer NOT NULL,
    role public.room_members_role_enum DEFAULT 'editor'::public.room_members_role_enum NOT NULL,
    "joinedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: room_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.room_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: room_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.room_members_id_seq OWNED BY public.room_members.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    type public.rooms_type_enum DEFAULT 'circuit'::public.rooms_type_enum NOT NULL,
    owner_id integer NOT NULL,
    state jsonb,
    "inviteCode" character varying(32) NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    hackathon_team_id integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: schedule_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule_items (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    type character varying(50) DEFAULT 'lecture'::character varying NOT NULL,
    content text,
    "videoUrl" text,
    "materialsUrl" text,
    "assignmentDescription" text,
    "startTime" timestamp without time zone NOT NULL,
    "endTime" timestamp without time zone NOT NULL,
    location character varying DEFAULT 'online'::character varying NOT NULL,
    "meetingUrl" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "courseGroupId" integer,
    "instructorId" integer,
    "electiveId" integer,
    "linkedScheduleItemId" integer
);


--
-- Name: schedule_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schedule_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schedule_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schedule_items_id_seq OWNED BY public.schedule_items.id;


--
-- Name: site_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_visits (
    id integer NOT NULL,
    path character varying(500) NOT NULL,
    "userId" integer,
    "userDisplayName" character varying(200),
    "visitedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: site_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_visits_id_seq OWNED BY public.site_visits.id;


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_achievements (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "achievementId" integer NOT NULL,
    "earnedAt" timestamp without time zone DEFAULT now() NOT NULL,
    metadata json
);


--
-- Name: user_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_achievements_id_seq OWNED BY public.user_achievements.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    role public.user_roles_role_enum DEFAULT 'registered_user'::public.user_roles_role_enum NOT NULL
);


--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    avatar text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vocab_terms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vocab_terms (
    id integer NOT NULL,
    term character varying NOT NULL,
    transcription character varying,
    translation character varying NOT NULL,
    category character varying NOT NULL,
    definition text NOT NULL,
    example text,
    level character varying DEFAULT 'basic'::character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: vocab_terms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vocab_terms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vocab_terms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vocab_terms_id_seq OWNED BY public.vocab_terms.id;


--
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- Name: assignment_submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignment_submissions ALTER COLUMN id SET DEFAULT nextval('public.assignment_submissions_id_seq'::regclass);


--
-- Name: assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);


--
-- Name: career_tests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_tests ALTER COLUMN id SET DEFAULT nextval('public.career_tests_id_seq'::regclass);


--
-- Name: circuit_solutions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.circuit_solutions ALTER COLUMN id SET DEFAULT nextval('public.circuit_solutions_id_seq'::regclass);


--
-- Name: circuit_submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.circuit_submissions ALTER COLUMN id SET DEFAULT nextval('public.circuit_submissions_id_seq'::regclass);


--
-- Name: course_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_groups ALTER COLUMN id SET DEFAULT nextval('public.course_groups_id_seq'::regclass);


--
-- Name: course_materials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_materials ALTER COLUMN id SET DEFAULT nextval('public.course_materials_id_seq'::regclass);


--
-- Name: course_registrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_registrations ALTER COLUMN id SET DEFAULT nextval('public.course_registrations_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: elective_enrollments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elective_enrollments ALTER COLUMN id SET DEFAULT nextval('public.elective_enrollments_id_seq'::regclass);


--
-- Name: electives id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.electives ALTER COLUMN id SET DEFAULT nextval('public.electives_id_seq'::regclass);


--
-- Name: forum_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_posts ALTER COLUMN id SET DEFAULT nextval('public.forum_posts_id_seq'::regclass);


--
-- Name: forum_sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_sections ALTER COLUMN id SET DEFAULT nextval('public.forum_sections_id_seq'::regclass);


--
-- Name: forum_topics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_topics ALTER COLUMN id SET DEFAULT nextval('public.forum_topics_id_seq'::regclass);


--
-- Name: hackathon_grades id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_grades ALTER COLUMN id SET DEFAULT nextval('public.hackathon_grades_id_seq'::regclass);


--
-- Name: hackathon_stage_submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_stage_submissions ALTER COLUMN id SET DEFAULT nextval('public.hackathon_stage_submissions_id_seq'::regclass);


--
-- Name: hackathon_stages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_stages ALTER COLUMN id SET DEFAULT nextval('public.hackathon_stages_id_seq'::regclass);


--
-- Name: hackathon_submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_submissions ALTER COLUMN id SET DEFAULT nextval('public.hackathon_submissions_id_seq'::regclass);


--
-- Name: hackathon_task_grades id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_grades ALTER COLUMN id SET DEFAULT nextval('public.hackathon_task_grades_id_seq'::regclass);


--
-- Name: hackathon_task_reviewers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_reviewers ALTER COLUMN id SET DEFAULT nextval('public.hackathon_task_reviewers_id_seq'::regclass);


--
-- Name: hackathon_tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_tasks ALTER COLUMN id SET DEFAULT nextval('public.hackathon_tasks_id_seq'::regclass);


--
-- Name: hackathon_team_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_team_members ALTER COLUMN id SET DEFAULT nextval('public.hackathon_team_members_id_seq'::regclass);


--
-- Name: hackathon_teams id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_teams ALTER COLUMN id SET DEFAULT nextval('public.hackathon_teams_id_seq'::regclass);


--
-- Name: hackathons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathons ALTER COLUMN id SET DEFAULT nextval('public.hackathons_id_seq'::regclass);


--
-- Name: internship_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship_applications ALTER COLUMN id SET DEFAULT nextval('public.internship_applications_id_seq'::regclass);


--
-- Name: internship_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship_views ALTER COLUMN id SET DEFAULT nextval('public.internship_views_id_seq'::regclass);


--
-- Name: internships id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internships ALTER COLUMN id SET DEFAULT nextval('public.internships_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: olympiad_problems id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiad_problems ALTER COLUMN id SET DEFAULT nextval('public.olympiad_problems_id_seq'::regclass);


--
-- Name: olympiad_submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiad_submissions ALTER COLUMN id SET DEFAULT nextval('public.olympiad_submissions_id_seq'::regclass);


--
-- Name: olympiads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiads ALTER COLUMN id SET DEFAULT nextval('public.olympiads_id_seq'::regclass);


--
-- Name: peer_review_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peer_review_sessions ALTER COLUMN id SET DEFAULT nextval('public.peer_review_sessions_id_seq'::regclass);


--
-- Name: peer_reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peer_reviews ALTER COLUMN id SET DEFAULT nextval('public.peer_reviews_id_seq'::regclass);


--
-- Name: professional_orientations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professional_orientations ALTER COLUMN id SET DEFAULT nextval('public.professional_orientations_id_seq'::regclass);


--
-- Name: room_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_members ALTER COLUMN id SET DEFAULT nextval('public.room_members_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: schedule_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_items ALTER COLUMN id SET DEFAULT nextval('public.schedule_items_id_seq'::regclass);


--
-- Name: site_visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_visits ALTER COLUMN id SET DEFAULT nextval('public.site_visits_id_seq'::regclass);


--
-- Name: user_achievements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements ALTER COLUMN id SET DEFAULT nextval('public.user_achievements_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vocab_terms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vocab_terms ALTER COLUMN id SET DEFAULT nextval('public.vocab_terms_id_seq'::regclass);


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.achievements (id, name, description, type, icon, points, conditions, "isActive", "createdAt", "updatedAt") FROM stdin;
1	Добро пожаловать!	Зарегистрировался на сайте	first_registration	🎉	5	{}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
2	Студент	Записался на первый курс	course_registration	📚	10	{"minRegistrations":1}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
3	Первые шаги	Сдал первое задание	first_submission	✏️	15	{"minSubmissions":1}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
4	Прилежный ученик	Сдал 5 заданий	multiple_submissions	📖	25	{"minSubmissions":5}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
5	Отличник	Получил 90 и более баллов за задание	assignment_excellence	⭐	20	{"minScore":90,"minAssignments":1}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
6	Перфекционист	Получил максимальный балл за задание	perfect_score	💯	30	{"minPerfectScores":1}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
7	Участник форума	Написал первое сообщение на форуме	forum_contributor	💬	10	{"minPosts":1}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
8	Активный участник	Написал 10 сообщений на форуме	forum_contributor	🗣️	25	{"minPosts":10}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
9	Форумный эксперт	Написал 50 сообщений на форуме	forum_contributor	👑	50	{"minPosts":50}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
10	Рецензент	Выполнил первую взаимооценку	peer_reviewer	🔍	15	{"minReviews":1}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
11	Опытный рецензент	Выполнил 5 взаимооценок	peer_reviewer	🏅	35	{"minReviews":5}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
12	Ранняя пташка	Записался на курс, когда до начала оставалось больше 7 дней	early_bird	🐦	15	{"minDaysBeforeStart":7}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
13	Участник хакатона	Подал первый проект на хакатон	hackathon_participant	🚀	20	{}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
14	Победитель хакатона	Набрал 90+ баллов на хакатоне	hackathon_winner	🏆	50	{"minScore":90}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
15	Активный студент	Записан хотя бы на один курс	course_completion	🎓	40	{"minCourses":1}	t	2026-05-09 16:20:54.371715	2026-05-09 16:20:54.371715
16	Труженик	Сдал 10 заданий	multiple_submissions	💪	40	{"minSubmissions":10}	t	2026-05-13 17:15:36.50969	2026-05-13 17:15:36.50969
17	Мастер сдачи	Сдал 25 заданий	multiple_submissions	🧠	75	{"minSubmissions":25}	t	2026-05-13 17:15:36.533249	2026-05-13 17:15:36.533249
18	Легенда	Сдал 50 заданий	multiple_submissions	🌟	150	{"minSubmissions":50}	t	2026-05-13 17:15:36.543038	2026-05-13 17:15:36.543038
19	Постоянный отличник	Получил 90+ баллов за 5 заданий	assignment_excellence	🌠	60	{"minScore":90,"minAssignments":5}	t	2026-05-13 17:15:36.552326	2026-05-13 17:15:36.552326
20	Безупречный	Получил максимальный балл за 5 заданий	perfect_score	💎	100	{"minPerfectScores":5}	t	2026-05-13 17:15:36.563477	2026-05-13 17:15:36.563477
21	Форумная легенда	Написал 100 сообщений на форуме	forum_contributor	🏛️	100	{"minPosts":100}	t	2026-05-13 17:15:36.575918	2026-05-13 17:15:36.575918
22	Эксперт-рецензент	Выполнил 10 взаимооценок	peer_reviewer	🎯	60	{"minReviews":10}	t	2026-05-13 17:15:36.589384	2026-05-13 17:15:36.589384
23	Мастер-рецензент	Выполнил 25 взаимооценок	peer_reviewer	🔬	120	{"minReviews":25}	t	2026-05-13 17:15:36.595643	2026-05-13 17:15:36.595643
24	Финалист хакатона	Набрал 75+ баллов на хакатоне	hackathon_winner	🥉	35	{"minScore":75}	t	2026-05-13 17:15:36.605771	2026-05-13 17:15:36.605771
25	Чемпион хакатонов	Участвовал в трёх и более хакатонах	hackathon_participant	🎖️	60	{"minHackathons":3}	t	2026-05-13 17:15:36.626514	2026-05-13 17:15:36.626514
26	Призёр олимпиады	Занял призовое место на олимпиаде	olympiad_winner	🥇	80	{}	t	2026-05-13 17:15:36.633756	2026-05-13 17:15:36.633756
\.


--
-- Data for Name: assignment_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assignment_submissions (id, content, attachments, "repositoryUrl", status, "submittedAt", "finalScore", "mentorFeedback", "createdAt", "userId", "assignmentId") FROM stdin;
4	Решение практического задания: используем закон Ома...	\N	\N	submitted	2026-05-22 12:02:23.75	\N	\N	2026-05-22 12:02:23.752045	8	25
2	\N	["blob:http://localhost:3000/4b7d09dc-8cbb-4c97-b358-cf25fa7a2747"]	\N	under_review	2026-05-22 08:46:35.945	9	\N	2026-05-22 08:46:35.945628	13	25
3	\N	["blob:http://localhost:3000/f3296de5-3671-4921-9dd3-e65e9efc0699"]	\N	under_review	2026-05-22 08:47:01.901	69	\N	2026-05-22 08:47:01.901476	14	25
5	\N	["blob:http://localhost:3000/b8f1ece1-c913-40c3-9906-a5f75e473de8"]	https://github.com/DoniZefironi/savtAssistApp-server/tree/feature/security	submitted	2026-06-09 09:34:47.078	\N	\N	2026-06-09 09:34:47.080306	13	28
1	Прикрепил схему, строгоне судите :)	["blob:http://localhost:3000/400a5fa3-1248-48cb-915c-bbc6a07d8a1d"]	\N	under_review	2026-05-22 08:42:19.041	62	\N	2026-05-22 08:42:19.042569	8	25
\.


--
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assignments (id, title, description, type, requirements, "maxScore", deadline, "isActive", "peerReviewEnabled", "peerReviewStartDate", "peerReviewEndDate", "peerReviewsPerStudent", "peerReviewCriteria", "createdAt", "updatedAt", "courseGroupId", "electiveId", "testCases") FROM stdin;
1	Закон Ома в деле	Соберите схему из источника напряжения и трёх резисторов (последовательно). Рассчитайте ток в цепи, напряжение на каждом резисторе и общую мощность. Приложите ручной расчёт и скриншот симуляции.	practice	"{\\"minLength\\": 80, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2025-09-21 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 08:52:41.652639	2026-05-21 08:52:41.652639	8	\N	\N
2	Делитель напряжения	Спроектируйте резистивный делитель, который из 12 В делает 5 В. Подберите номиналы из стандартного ряда E24. Обоснуйте выбор. Приложите расчёт и симуляцию с измерением выходного напряжения.	practice	"{\\"minLength\\": 100, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2025-09-28 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 08:53:51.456302	2026-05-21 08:53:51.456302	8	\N	\N
3	Параллельные цепи	Даны три резистора: 100 Ом, 220 Ом, 470 Ом. Соедините их параллельно. Рассчитайте эквивалентное сопротивление и ток через каждый резистор при напряжении 9 В. Проверьте расчёт симуляцией.	practice	"{\\"minLength\\": 80, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2025-10-05 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 08:56:27.168714	2026-05-21 08:56:27.168714	8	\N	\N
4	Первый закон Кирхгофа	Постройте схему с одним источником и тремя ветвями. Измерьте токи во всех ветвях в симуляторе. Проверьте первый закон Кирхгофа для двух узлов. Оформите отчёт с таблицей измерений.	practice	"{\\"minLength\\": 120, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2025-10-12 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 08:57:26.762327	2026-05-21 08:57:26.762327	8	\N	\N
5	Второй закон Кирхгофа	Составьте схему с двумя источниками напряжения и тремя резисторами (два контура). Рассчитайте токи методом контурных токов. Подтвердите расчёт симуляцией. Покажите обход контуров на схеме.	practice	"{\\"minLength\\": 150, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2025-10-19 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 08:58:15.185319	2026-05-21 08:58:15.185319	8	\N	\N
6	RC-цепь и постоянная времени	Соберите RC-цепь (R = 10 кОм, C = 100 мкФ). Рассчитайте постоянную времени. Снимите осциллограмму заряда и разряда конденсатора. Определите постоянную времени графически. Сравните с расчётом.	practice	"{\\"minLength\\": 120, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2025-10-26 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 08:59:14.002932	2026-05-21 08:59:14.002932	8	\N	\N
7	Диодный мост	Постройте двухполупериодный выпрямитель на четырёх диодах. Подайте синусоидальный сигнал 10 В амплитуды. Покажите входной и выходной сигнал на осциллограмме. Объясните, почему выходной сигнал выглядит именно так.	practice	"{\\"minLength\\": 100, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2025-11-02 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:00:01.661868	2026-05-21 09:00:01.661868	8	\N	\N
8	Сглаживающий конденсатор	Добавьте конденсатор к выходу диодного моста из задания 1.7. Подберите ёмкость так, чтобы пульсации не превышали 10%. Покажите осциллограмму до и после. Рассчитайте требуемую ёмкость.	practice	"{\\"minLength\\": 120, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2025-11-09 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:00:49.408018	2026-05-21 09:00:49.408018	8	\N	\N
9	Транзисторный ключ	Постройте схему транзисторного ключа на биполярном NPN-транзисторе для управления светодиодом от цифрового сигнала 5 В. Рассчитайте номинал базового резистора. Покажите работу схемы при высоком и низком уровне сигнала.	practice	"{\\"minLength\\": 130, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2025-11-16 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:01:44.564733	2026-05-21 09:01:44.564733	8	\N	\N
10	Итоговая работа: источник питания 5 В	Спроектируйте законченный источник питания: трансформатор (или симуляция сети), диодный мост, сглаживающий конденсатор и стабилизатор на 5 В (например, 7805). Покажите выходное напряжение под нагрузкой 100 мА. Оформите полный отчёт.	practice	"{\\"minLength\\": 200, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2025-11-28 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:02:43.434119	2026-05-21 09:02:43.434119	8	\N	\N
11	Характеристики ОУ: повторитель напряжения	Соберите схему повторителя напряжения на операционном усилителе (LM358 или аналог). Подайте синусоидальный сигнал 1 кГц, 2 В амплитуды. Покажите, что выходной сигнал повторяет входной. Измерьте входное и выходное сопротивление схемы.	practice	"{\\"minLength\\": 100, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2026-01-25 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:11:39.465219	2026-05-21 09:11:39.465219	9	\N	\N
12	Неинвертирующий усилитель	Спроектируйте неинвертирующий усилитель с коэффициентом усиления 11. Выберите резисторы из ряда E24. Проверьте усиление синусоидальным сигналом 100 мВ. Покажите осциллограммы входа и выхода. Измерьте фактический коэффициент усиления.	practice	"{\\"minLength\\": 120, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2026-02-01 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:12:27.298675	2026-05-21 09:12:27.298675	9	\N	\N
13	Инвертирующий усилитель	Постройте инвертирующий усилитель с коэффициентом усиления –10. Объясните, почему выходной сигнал инвертирован. Подайте треугольный сигнал и покажите инверсию на осциллограмме.	practice	"{\\"minLength\\": 120, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2026-02-08 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:13:05.649578	2026-05-21 09:13:05.649578	9	\N	\N
14	Сумматор на ОУ	Реализуйте инвертирующий сумматор на три входа. Подайте на входы постоянные напряжения 1 В, 2 В и 3 В. Рассчитайте ожидаемое выходное напряжение. Сравните с измеренным.	practice	"{\\"minLength\\": 100, \\"format\\": \\"markdown\\", \\"attachments\\": true}"	100	2026-02-15 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:16:26.130832	2026-05-21 09:16:26.130832	9	\N	\N
15	Компаратор на ОУ	Постройте компаратор без обратной связи. На инвертирующий вход подайте опорное напряжение 2.5 В, на неинвертирующий — синус 5 В амплитуды, 100 Гц. Покажите переключение выхода. Объясните явление дребезга, если оно наблюдается.	practice	""	100	2026-02-22 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:17:07.107473	2026-05-21 09:17:07.107473	9	\N	\N
16	Триггер Шмитта	Постройте неинвертирующий триггер Шмитта. Рассчитайте верхний и нижний пороги переключения. Подайте треугольный сигнал и покажите петлю гистерезиса (осциллограмма в режиме XY или две временные развёртки).	practice	""	100	2026-03-01 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:17:47.543315	2026-05-21 09:17:47.543315	9	\N	\N
17	Фильтр нижних частот (ФНЧ)	Спроектируйте активный ФНЧ первого порядка с частотой среза 1 кГц. Снимите АЧХ в диапазоне 100 Гц – 10 кГц. Постройте график. Определите наклон спада в полосе заграждения.	practice	""	100	2026-03-08 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:18:29.263848	2026-05-21 09:18:29.263848	9	\N	\N
18	Фильтр верхних частот (ФВЧ)	Реализуйте активный ФВЧ первого порядка с частотой среза 500 Гц. Подайте сигнал, содержащий частоты 100 Гц и 2 кГц. Покажите, как фильтр подавляет низкую частоту и пропускает высокую.	practice	""	100	2026-03-15 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:19:05.290878	2026-05-21 09:19:05.290878	9	\N	\N
19	Генератор прямоугольных импульсов	Постройте генератор прямоугольных импульсов на ОУ (релаксационный генератор). Рассчитайте частоту. Сравните расчётную частоту с измеренной. Объясните, как можно регулировать скважность.	practice	""	100	2026-03-22 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:19:38.713667	2026-05-21 09:19:38.713667	9	\N	\N
20	Итоговая работа: датчик температуры с аналоговым выходом	Спроектируйте схему термометра на основе термистора и операционного усилителя. Выходной сигнал должен линейно меняться на 100 мВ/°C в диапазоне 0–50 °C. Приложите полный расчёт, схему и результаты симуляции для трёх температур.	practice	""	100	2026-04-03 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:20:22.549458	2026-05-21 09:20:22.549458	9	\N	\N
21	Hello, Blink!	Напишите программу для Arduino (или аналога), которая мигает встроенным светодиодом с периодом 1 секунда (0.5 с горит, 0.5 с не горит). Приложите код и короткое видео или фото работающего устройства.	practice	""	100	2026-04-20 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 09:27:30.959052	2026-05-21 09:27:30.959052	10	\N	\N
22	Кнопка и светодиод	Подключите тактовую кнопку к цифровому входу. При нажатии кнопки светодиод должен загораться, при отпускании — гаснуть. Реализуйте программный антидребезг. Приложите код и схему подключения.	practice	""	100	2026-05-03 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:32:46.468729	2026-05-21 11:32:46.468729	10	\N	\N
23	ШИМ-управление яркостью	Реализуйте плавное изменение яркости светодиода с помощью ШИМ. Используйте потенциометр, подключённый к аналоговому входу, для регулировки скважности ШИМ-сигнала. Приложите код и осциллограмму ШИМ при минимальной и максимальной яркости.	practice	""	100	2026-05-10 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:33:25.690306	2026-05-21 11:33:25.690306	10	\N	\N
24	Датчик температуры и дисплей	Подключите цифровой датчик температуры (например, DS18B20 или DHT11) и выведите показания на LCD-дисплей (16x2) или семисегментный индикатор. Приложите код и схему подключения.	practice	""	100	2026-05-17 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:34:08.743296	2026-05-21 11:34:08.743296	10	\N	\N
25	Ультразвуковой дальномер	Подключите ультразвуковой датчик расстояния HC-SR04. Выведите измеренное расстояние в сантиметрах в Serial Monitor. При расстоянии меньше 20 см включайте зуммер. Приложите код и схему.	practice	""	100	2026-05-24 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:34:41.534114	2026-05-21 11:34:41.534114	10	\N	\N
26	Серводвигатель и потенциометр	Управляйте положением серводвигателя с помощью потенциометра. Отображайте угол поворота в Serial Monitor. Приложите код и короткое видео работы.	practice	""	100	2026-05-31 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:35:22.674845	2026-05-21 11:35:22.674845	10	\N	\N
27	Прерывания по таймеру	Настройте таймер на генерацию прерывания каждые 100 мс. В обработчике прерывания инкрементируйте счётчик и выводите его значение в Serial Monitor каждую секунду. Основной цикл должен выполнять другую задачу (например, мигать светодиодом).	practice	""	100	2026-06-07 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:36:03.477156	2026-05-21 11:36:03.477156	10	\N	\N
28	UART-коммуникация	Реализуйте обмен данными между двумя микроконтроллерами по UART. Первый отправляет значение потенциометра, второй принимает и управляет яркостью светодиода. Приложите код для обоих устройств и схему соединения.	practice	""	100	2026-06-14 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:36:41.90407	2026-05-21 11:36:41.90407	10	\N	\N
29	EEPROM: хранение настроек	Реализуйте устройство, которое запоминает последнее положение потенциометра в энергонезависимую память. При включении восстанавливает последнее сохранённое значение. Используйте EEPROM или эмуляцию во Flash.	practice	""	100	2026-06-21 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:37:35.751886	2026-05-21 11:37:35.751886	10	\N	\N
46	Debate: Remote Work vs Office	Подготовьте аргументированную речь (напишите текст + запишите аудио на 2–3 минуты) в защиту одной из позиций: удалённая работа или работа в офисе. Приведите минимум 3 аргумента с примерами. Обозначьте и опровергните один контраргумент.	practice	""	100	2026-02-22 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:20:39.535385	2026-05-21 12:20:39.535385	12	\N	\N
30	Итоговый проект: умный ночник	Спроектируйте автономный ночник. Используйте фоторезистор для определения освещённости и датчик движения (PIR). Светодиод включается, если темно и есть движение. Реализуйте плавное включение/выключение через ШИМ. Приложите полный код, схему и видео демонстрации.	practice	""	100	2026-07-05 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:38:14.631132	2026-05-21 11:38:14.631132	10	\N	\N
31	My Learning Space	Напишите текст (100–150 слов) о своём учебном месте. Опишите, что находится на столе, какие предметы вас окружают. Используйте конструкцию there is/there are и предлоги места. Приложите фото своего рабочего места.	practice	""	100	2025-09-28 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:48:59.406235	2026-05-21 11:48:59.406235	11	\N	\N
32	My Daily Routine	Опишите свой типичный день от пробуждения до отхода ко сну. Используйте Present Simple. Минимум 10 различных глаголов. Добавьте время для каждого действия. Объём: 120–180 слов.	practice	""	100	2025-10-05 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:54:13.160408	2026-05-21 11:54:13.160408	11	\N	\N
33	My Family Portrait	Опишите свою семью или близких друзей. Для каждого человека укажите имя, возраст, род занятий и одно хобби. Используйте притяжательный падеж и прилагательные для описания характера. Объём: 150–200 слов.	practice	""	100	2025-10-12 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:54:55.744325	2026-05-21 11:54:55.744325	11	\N	\N
34	Last Weekend Story	Расскажите, что вы делали в прошлые выходные. Используйте Past Simple. Минимум 8 правильных и 5 неправильных глаголов. Выделите их в тексте жирным шрифтом. Объём: 130–180 слов.	practice	""	100	2025-10-19 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:55:40.564228	2026-05-21 11:55:40.564228	11	\N	\N
35	Ordering Food: Audio Dialogue	Запишите аудио (1–2 минуты), в котором вы заказываете еду в ресторане или кафе. Сценарий: приветствие, заказ двух блюд и напитка, вопрос о цене, прощание. Приложите текстовую расшифровку диалога.	practice	""	100	2025-10-26 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:56:27.035601	2026-05-21 11:56:27.035601	11	\N	\N
36	Comparative Shopping	Сравните три любых гаджета (телефоны, ноутбуки, наушники). Используйте сравнительную и превосходную степень прилагательных. Оформите в виде таблицы сравнения и текстового вывода (какой лучше и почему). Объём: 150–200 слов.	practice	""	100	2025-11-02 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:57:10.006402	2026-05-21 11:57:10.006402	11	\N	\N
37	Future Plans	Напишите о своих планах на ближайший год. Используйте конструкцию to be going to и Present Continuous для будущих договорённостей. Минимум 5 планов с пояснениями. Объём: 120–160 слов.	practice	""	100	2025-11-09 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 11:57:43.959884	2026-05-21 11:57:43.959884	11	\N	\N
38	Future Plans	Напишите о своих планах на ближайший год. Используйте конструкцию to be going to и Present Continuous для будущих договорённостей. Минимум 5 планов с пояснениями. Объём: 120–160 слов.	practice	""	100	2025-11-09 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:01:18.574054	2026-05-21 12:01:18.574054	11	\N	\N
39	Giving Directions: Video Task	Запишите короткое видео (1–2 минуты), в котором вы объясняете, как пройти от вашего дома до ближайшего парка или магазина. Используйте повелительное наклонение и предлоги направления. Приложите текстовую расшифровку.	practice	""	100	2025-11-16 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:10:06.299932	2026-05-21 12:10:06.299932	11	\N	\N
40	Reading Response: Short Story	Прочитайте короткий рассказ (предоставляется преподавателем). Напишите отзыв: главные герои, основная идея, что понравилось/не понравилось и почему. Объём: 150–200 слов. Используйте Present Simple для пересказа сюжета.	practice	""	100	2025-11-23 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:10:48.793623	2026-05-21 12:10:48.793623	11	\N	\N
41	Final Portfolio: About Me Presentation	Подготовьте презентацию (5–7 слайдов) о себе на английском языке. Включите разделы: Introduction, Hobbies, Education/Work, Goals, Fun Fact. Запишите голосовое сопровождение к слайдам. Загрузите файл презентации и аудио.	practice	""	100	2025-12-19 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:11:30.82821	2026-05-21 12:11:30.82821	11	\N	\N
42	Discussion: Social Media Impact	Напишите эссе (200–250 слов) о влиянии социальных сетей на общество. Приведите два аргумента «за» и два «против». Используйте linking words (however, moreover, on the other hand). Чётко сформулируйте свою позицию в заключении.	practice	""	100	2026-02-01 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:12:26.697226	2026-05-21 12:12:26.697226	12	\N	\N
43	Role-play: Job Interview	Запишите аудио (3–4 минуты) — симуляцию собеседования на работу. Один человек — интервьюер, второй — кандидат (вы можете сыграть обе роли или пригласить партнёра). Осветите: опыт работы, сильные стороны, ожидания по зарплате. Приложите скрипт.	practice	""	100	2026-02-08 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:13:13.884502	2026-05-21 12:13:13.884502	12	\N	\N
44	Role-play: Job Interview	Запишите аудио (3–4 минуты) — симуляцию собеседования на работу. Один человек — интервьюер, второй — кандидат (вы можете сыграть обе роли или пригласить партнёра). Осветите: опыт работы, сильные стороны, ожидания по зарплате. Приложите скрипт.	practice	""	100	2026-02-08 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:19:14.910691	2026-05-21 12:19:14.910691	12	\N	\N
45	Formal Email Writing	Напишите официальное письмо (email) по одной из ситуаций на выбор: жалоба на некачественный товар, запрос информации о курсе, письмо-благодарность после собеседования. Используйте формальный стиль, тему письма, приветствие и подпись.	practice	""	100	2026-02-15 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:19:54.077731	2026-05-21 12:19:54.077731	12	\N	\N
47	Debate: Remote Work vs Office	Подготовьте аргументированную речь (напишите текст + запишите аудио на 2–3 минуты) в защиту одной из позиций: удалённая работа или работа в офисе. Приведите минимум 3 аргумента с примерами. Обозначьте и опровергните один контраргумент.	practice	""	100	2026-02-22 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:32:40.067846	2026-05-21 12:32:40.067846	12	\N	\N
48	Storytelling: A Memorable Trip	Расскажите устно (аудио, 3–4 минуты) о запоминающейся поездке. Используйте Past Simple, Past Continuous и Past Perfect. Опишите эмоции, неожиданные ситуации и урок, который вы извлекли. Приложите краткий план рассказа.	practice	""	100	2026-03-01 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:33:15.910533	2026-05-21 12:33:15.910533	12	\N	\N
49	News Summary & Opinion	Выберите новостную статью на английском языке (укажите источник). Напишите краткое изложение (100 слов) и ваш анализ/мнение (150 слов). Используйте Reported Speech для передачи слов автора.	practice	""	100	2026-03-08 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:33:55.052778	2026-05-21 12:33:55.052778	12	\N	\N
50	Conflict Resolution Dialogue	Напишите и запишите диалог (аудио, 2–3 минуты) — разрешение конфликтной ситуации (с соседом, коллегой, в магазине). Покажите активное слушание, эмпатию и поиск компромисса. Приложите текстовый скрипт.	practice	""	100	2026-03-15 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:34:39.843558	2026-05-21 12:34:39.843558	12	\N	\N
51	Elevator Pitch: Your Idea	Запишите видео (60–90 секунд) — питч вашей бизнес-идеи или проекта. Объясните проблему, решение, целевую аудиторию и почему это будет работать. Речь должна быть энергичной и убедительной. Приложите текст.	practice	""	100	2026-03-22 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:35:15.753714	2026-05-21 12:35:15.753714	12	\N	\N
52	Group Discussion Summary	Примите участие в групповой дискуссии (онлайн или очно, тема определяется группой). Запишите аудио фрагмента (5–7 минут) с вашим активным участием. Напишите summary дискуссии: основные точки зрения, к какому выводу пришли, ваша роль.	practice	""	100	2026-03-29 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:35:56.372363	2026-05-21 12:35:56.372363	12	\N	\N
53	Final: TED-style Talk	Подготовьте и запишите видео-презентацию (5–7 минут) в стиле TED на любую интересную вам тему. Структура: захватывающее вступление, основная часть с примерами, запоминающееся заключение. Загрузите видео и текст выступления.	practice	""	100	2026-04-24 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:36:33.394629	2026-05-21 12:36:33.394629	12	\N	\N
54	Critical Analysis: Opinion Article	Прочитайте статью из The Economist или The Guardian (выбрать самостоятельно, указать источник). Напишите критический анализ (300–400 слов): основная аргументация автора, сильные и слабые стороны, наличие логических ошибок или предвзятости. Используйте продвинутую лексику.	practice	""	100	2026-05-24 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:47:51.501693	2026-05-21 12:47:51.501693	13	\N	\N
55	Academic Essay: Technology & Privacy	Напишите академическое эссе (400–500 слов) на тему «Does technology threaten personal privacy?». Соблюдайте академический стиль: тезис во введении, параграфы с topic sentences, ссылки на источники (минимум 2), formal register.	practice	""	100	2026-05-31 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:50:45.518227	2026-05-21 12:50:45.518227	13	\N	\N
56	Research Summary & Paraphrasing	Найдите научную статью (abstract) по интересующей вас теме на английском. Напишите её summary (150 слов) своими словами, полностью перефразируя оригинал. Затем напишите критический комментарий (150 слов). Приложите оригинальный abstract.	practice	""	100	2026-06-07 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:51:17.972974	2026-05-21 12:51:17.972974	13	\N	\N
57	Advanced Grammar: Inversion & Emphasis	Напишите текст (250–300 слов) на любую тему, демонстрирующий использование инверсии (Not only..., Never have I..., etc.) и эмфатических конструкций (It is... that..., What... is...). Минимум 8 примеров инверсии/эмфазиса. Подчеркните их в тексте.	practice	""	100	2026-06-14 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:51:50.963807	2026-05-21 12:51:50.963807	13	\N	\N
58	Podcast Episode: Expert Interview	Запишите подкаст (7–10 минут) в формате интервью с экспертом (роль эксперта можете сыграть вы или партнёр). Тема — любая профессиональная сфера. Демонстрируйте spontaneous speech, уточняющие вопросы и перефразирование. Приложите план интервью.	practice	""	100	2026-06-21 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:52:21.847109	2026-05-21 12:52:21.847109	13	\N	\N
59	Persuasive Speech: Policy Proposal	Подготовьте убеждающую речь (видео, 5–6 минут) — предложение политики или реформы в любой сфере (образование, экология, технологии). Используйте риторические приёмы: rhetorical questions, rule of three, antithesis. Приложите текст речи.	practice	""	100	2026-06-28 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:52:54.557845	2026-05-21 12:52:54.557845	13	\N	\N
60	Stylistic Analysis: Literary Excerpt	Проанализируйте отрывок из англоязычного литературного произведения (выбрать самостоятельно, приложить текст отрывка). Анализ (350–400 слов): стилистические приёмы автора, тон, регистр, образные средства и их эффект на читателя.	practice	""	100	2026-07-05 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:53:28.055591	2026-05-21 12:53:28.055591	13	\N	\N
61	IELTS/CAE Writing Task Simulation	Выполните письменное задание в формате IELTS Academic Writing Task 2 или CAE Essay (на выбор). Тема предоставляется преподавателем. Строго соблюдайте тайминг (40 минут на написание). Укажите фактическое время выполнения.	practice	""	100	2026-07-12 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:54:01.362396	2026-05-21 12:54:01.362396	13	\N	\N
62	Debate Moderation	Организуйте и проведите дебаты в группе (3×3 или 4×4). Ваша роль — модератор. Запишите видео дебатов (15–20 минут). Напишите рефлексивный отчёт (200–250 слов): как вы управляли ходом дискуссии, как справлялись с доминирующими участниками.	practice	""	100	2026-07-19 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:54:40.745302	2026-05-21 12:54:40.745302	13	\N	\N
63	Capstone Project: Research Paper	Напишите мини-исследовательскую работу (600–800 слов) на тему, согласованную с преподавателем. Включите: abstract, introduction, literature review (краткий), discussion, conclusion, references (минимум 4 академических источника). Оформление — академический стиль.	practice	""	100	2026-08-14 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 12:55:16.859808	2026-05-21 12:55:16.859808	13	\N	\N
64	Первое устройство: сборка и тест	Соберите базовое IoT-устройство на ESP32 или аналоге: подключите датчик (любой, на выбор) и выведите сырые данные в Serial Monitor. Приложите код, схему подключения и скриншот вывода. Объясните назначение каждого пина.	practice	""	100	2025-10-05 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:05:13.419791	2026-05-21 13:05:13.419791	14	\N	\N
65	Цифровой датчик температуры и влажности	Подключите DHT11 или DHT22 к микроконтроллеру. Считайте показания температуры и влажности каждые 2 секунды. Выведите данные в Serial Monitor с временными метками. Приложите код, схему и скриншот вывода (20+ строк).	practice	""	100	2025-10-12 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:06:00.784244	2026-05-21 13:06:00.784244	14	\N	\N
66	Датчик освещённости и автоматический свет	Подключите фоторезистор и светодиод. Если освещённость падает ниже порога — светодиод включается. Порог должен настраиваться через переменную в коде. Приложите код, схему и демонстрацию работы при разных условиях освещения.	practice	""	100	2025-10-19 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:06:47.017765	2026-05-21 13:06:47.017765	14	\N	\N
67	Реле и управление нагрузкой	Подключите релейный модуль к микроконтроллеру. Реализуйте управление реле по команде из Serial Monitor (вкл/выкл). В качестве нагрузки используйте светодиод или лампочку. Приложите код, схему и скриншот Serial-коммуникации.	practice	""	100	2025-10-26 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:07:43.280474	2026-05-21 13:07:43.280474	13	\N	\N
68	Реле и управление нагрузкой	Подключите релейный модуль к микроконтроллеру. Реализуйте управление реле по команде из Serial Monitor (вкл/выкл). В качестве нагрузки используйте светодиод или лампочку. Приложите код, схему и скриншот Serial-коммуникации.	practice	""	100	2025-10-26 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:16:22.871332	2026-05-21 13:16:22.871332	14	\N	\N
69	Датчик движения PIR	Подключите PIR-датчик движения. При обнаружении движения отправляйте сообщение в Serial Monitor и включайте светодиод на 3 секунды. Реализуйте защиту от ложных срабатываний (debounce). Приложите код и видео демонстрации.	practice	""	100	2025-11-02 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:17:53.139517	2026-05-21 13:17:53.139517	14	\N	\N
70	Комбинированная система: температура + реле	Объедините датчик температуры и реле. Если температура превышает установленный порог, реле включается (имитация вентилятора). Если падает ниже другого порога — выключается. Реализуйте гистерезис. Приложите код и демонстрацию.	practice	""	100	2025-11-09 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:18:36.065004	2026-05-21 13:18:36.065004	14	\N	\N
71	Устройство с локальной индикацией	Подключите OLED-дисплей (SSD1306 или аналог) и датчик на ваш выбор. Выводите показания датчика на дисплей в реальном времени. Добавьте индикацию статуса (например, «NORMAL» / «ALERT»). Приложите код и фото дисплея.	practice	""	100	2025-11-16 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:19:11.836087	2026-05-21 13:19:11.836087	14	\N	\N
72	Управление по кнопке с режимами	Подключите кнопку. Реализуйте циклическое переключение режимов устройства при каждом нажатии (минимум 3 режима). Текущий режим отображайте на дисплее или через Serial. Кнопка должна иметь программный антидребезг.	practice	""	100	2025-11-23 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:19:48.414911	2026-05-21 13:19:48.414911	14	\N	\N
73	Логгирование данных на SD-карту	Подключите модуль SD-карты. Сохраняйте показания датчика температуры раз в 10 секунд в CSV-файл на карте. Формат строки: timestamp, temperature, humidity. Приложите код и пример CSV-файла с 20+ записями.	practice	""	100	2025-11-30 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:20:24.045371	2026-05-21 13:20:24.045371	14	\N	\N
74	Итоговый проект: подключённый дата-логгер	Спроектируйте устройство, которое считывает минимум 2 параметра среды, отображает их локально и сохраняет на SD-карту. Реализуйте индикацию состояния и настройку порогов через кнопки. Приложите полный код, схему, фото устройства и пример CSV-файла.	practice	""	100	2025-12-15 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:21:06.847491	2026-05-21 13:21:06.847491	14	\N	\N
75	Wi-Fi подключение ESP32	Настройте подключение ESP32 к Wi-Fi сети. Выведите в Serial Monitor: IP-адрес, MAC-адрес, уровень сигнала (RSSI). Реализуйте автоматическое переподключение при обрыве связи. Приложите код и скриншот успешного подключения.	practice	""	100	2026-02-08 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:40:37.067566	2026-05-21 13:40:37.067566	15	\N	\N
76	HTTP GET-запрос к публичному API	Отправьте HTTP GET-запрос к любому публичному API (например, погода, курсы валют). Разберите JSON-ответ и выведите осмысленный результат в Serial Monitor. Обработайте возможные ошибки подключения. Приложите код и скриншот вывода.	practice	""	100	2026-02-15 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:41:22.197983	2026-05-21 13:41:22.197983	15	\N	\N
77	MQTT: первый publish	Настройте MQTT-клиент на ESP32. Подключитесь к публичному брокеру (test.mosquitto.org или аналог). Отправляйте показания датчика температуры в топик с интервалом 5 секунд. Приложите код и скриншот из MQTT-клиента (например MQTTX), где видны сообщения.	practice	""	100	2026-02-22 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:42:26.302428	2026-05-21 13:42:26.302428	15	\N	\N
78	MQTT: subscribe и управление	Добавьте к устройству из задания 8.3 возможность подписки на управляющий топик. Команда «ON» должна включать светодиод, «OFF» — выключать. Приложите код и скриншоты: отправка команды в MQTTX и реакция устройства.	practice	""	100	2026-03-01 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:43:00.989629	2026-05-21 13:43:00.989629	15	\N	\N
79	QoS и retained-сообщения	Исследуйте разницу между QoS 0, 1, 2 в MQTT. Проведите эксперимент с отключением и подключением клиента. Объясните поведение retained-сообщений. Напишите отчёт с выводами. Приложите код для тестирования.	practice	""	100	2026-03-08 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:43:41.747617	2026-05-21 13:43:41.747617	15	\N	\N
80	Отправка данных в облачную платформу	Зарегистрируйте устройство в облачной IoT-платформе (ThingSpeak, Blynk, Arduino Cloud или аналог). Отправляйте туда показания датчика температуры. Приложите код и скриншот дашборда с графиком за последние 30 минут.	practice	""	100	2026-03-15 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:44:15.194794	2026-05-21 13:44:15.194794	15	\N	\N
81	Webhook-интеграция	Настройте webhook: при достижении порогового значения датчика отправляйте HTTP POST-запрос на сервер (можно использовать сервисы типа Zapier, IFTTT или свой вебхук). Приложите код, схему и скриншот полученного уведомления.	practice	""	100	2026-03-22 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:45:08.55703	2026-05-21 13:45:08.55703	15	\N	\N
82	Сравнение протоколов: MQTT vs HTTP	Проведите сравнительный тест отправки 100 сообщений через MQTT и HTTP. Измерьте задержку и объём переданных данных для каждого протокола. Оформите результаты в виде таблицы и напишите вывод о преимуществах каждого подхода.	practice	""	100	2026-03-29 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:45:46.603267	2026-05-21 13:45:46.603267	15	\N	\N
83	CoAP-запросы	Изучите протокол CoAP. Реализуйте отправку данных с устройства на CoAP-сервер (публичный или локальный). Сравните с MQTT по простоте реализации. Напишите отчёт и приложите код.	practice	""	100	2026-04-05 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:46:16.999127	2026-05-21 13:46:16.999127	15	\N	\N
84	Итоговый проект: IoT-мониторинг с алертами	Создайте систему мониторинга: устройство считывает данные, отправляет их в облачную платформу и через MQTT, при превышении порога — уведомление через webhook/email. Приложите полный код, скриншоты дашборда и пример уведомления.	practice	""	100	2026-04-20 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:46:53.913096	2026-05-21 13:46:53.913096	15	\N	\N
85	Локальная обработка: фильтрация шума	Реализуйте на устройстве алгоритм скользящего среднего для фильтрации зашумлённых показаний аналогового датчика. Сравните сырые и отфильтрованные данные. Постройте графики. Приложите код.	practice	""	100	2026-05-17 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:47:36.250658	2026-05-21 13:47:36.250658	16	\N	\N
86	Обнаружение аномалий на устройстве	Запрограммируйте простое правило обнаружения аномалий: если значение выходит за пределы [среднее ± 2×σ], устройство помечает точку как аномальную и отправляет alert. Приложите код и логи с примерами нормальных и аномальных точек.	practice	""	100	2026-05-24 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:48:16.465163	2026-05-21 13:48:16.465163	16	\N	\N
87	Локальное хранение и пакетная отправка	Реализуйте буферизацию показаний датчика на устройстве (в оперативной памяти или Flash). При накоплении 20 записей отправляйте их пачкой по MQTT. При отсутствии подключения данные сохраняются. Приложите код и логи.	practice	""	100	2026-05-31 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:48:53.328062	2026-05-21 13:48:53.328062	16	\N	\N
88	Принятие решений на edge	Реализуйте конечный автомат на устройстве: в зависимости от показаний датчика и истории состояний устройство переходит между режимами (NORMAL, WARNING, CRITICAL). Для каждого режима — своё поведение. Приложите диаграмму состояний и код.	practice	""	100	2026-06-07 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:49:34.517663	2026-05-21 13:49:34.517663	16	\N	\N
89	Over-the-Air обновление (OTA)	Настройте OTA-обновление прошивки ESP32. Продемонстрируйте процесс: устройство подключается к Wi-Fi, получает новую прошивку и перезагружается. Напишите краткую инструкцию по настройке OTA. Приложите код и скриншоты процесса.	practice	""	100	2026-06-14 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:50:13.871926	2026-05-21 13:50:13.871926	16	\N	\N
90	Устройство в режиме глубокого сна	Настройте режим глубокого сна (deep sleep) на ESP32. Устройство просыпается раз в 5 минут, считывает датчик, отправляет данные и снова засыпает. Измерьте ток потребления в активном режиме и во сне. Приложите код и измерения.	practice	""	100	2026-06-21 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:50:49.023176	2026-05-21 13:50:49.023176	16	\N	\N
91	BLE-коммуникация между устройствами	Настройте BLE-сервер на одном ESP32 и BLE-клиент на другом. Передавайте данные датчика с сервера на клиент. Клиент выводит полученные данные в Serial Monitor. Приложите код для обоих устройств и скриншоты.	practice	""	100	2026-06-28 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:51:24.88215	2026-05-21 13:51:24.88215	16	\N	\N
92	Mesh-сеть на основе ESP-NOW	Создайте простую mesh-сеть из двух устройств на ESP-NOW. Одно устройство — датчик, второе — ретранслятор к MQTT-брокеру. Приложите код для обеих ролей, схему сети и скриншоты успешной передачи данных.	practice	""	100	2026-07-05 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:52:11.772091	2026-05-21 13:52:11.772091	16	\N	\N
93	Локальный REST API на устройстве	Поднимите простой HTTP-сервер на ESP32. Реализуйте endpoint /sensor, возвращающий текущие показания датчика в JSON. Реализуйте endpoint /control?state=on|off для управления реле. Приложите код и скриншоты ответов.	practice	""	100	2026-07-12 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:52:48.970204	2026-05-21 13:52:48.970204	16	\N	\N
94	Итоговый проект: автономный edge-контроллер	Спроектируйте устройство, которое работает автономно: собирает данные, фильтрует, обнаруживает аномалии, хранит данные локально при обрыве связи и синхронизируется при восстановлении. Используйте deep sleep для энергосбережения. Приложите полный код, схему и отчёт с диаграммой состояний.	practice	""	100	2026-07-27 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 13:53:20.985273	2026-05-21 13:53:20.985273	16	\N	\N
125	Системы счисления: перевод чисел	Переведите 5 чисел из десятичной системы в двоичную, восьмеричную и шестнадцатеричную. Выполните обратный перевод. Оформите в виде таблицы. Приложите ручные расчёты (скан или фото).	practice	""	100	2025-09-14 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:00:13.568949	2026-05-21 16:00:13.568949	17	\N	\N
126	Арифметика в двоичной системе	Выполните сложение, вычитание и умножение трёх пар двоичных чисел (8-битных). Покажите сложение в дополнительном коде для отрицательных чисел. Приложите пошаговые вычисления.	practice	""	100	2025-09-21 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:00:46.927447	2026-05-21 16:00:46.927447	17	\N	\N
127	Булева алгебра: таблицы истинности	Для трёх логических выражений (содержащих AND, OR, NOT, XOR) постройте таблицы истинности. Упростите каждое выражение, используя законы булевой алгебры. Проверьте эквивалентность таблицами истинности.	practice	""	100	2025-09-28 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:01:16.357474	2026-05-21 16:01:16.357474	17	\N	\N
128	Логические схемы	Спроектируйте логическую схему по заданному выражению. Минимизируйте выражение с помощью карт Карно. Нарисуйте схему до и после минимизации. Подсчитайте количество элементов в каждой версии.	practice	""	100	2025-10-05 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:01:44.044201	2026-05-21 16:01:44.044201	17	\N	\N
129	Алгоритм Евклида: реализация и анализ	Реализуйте алгоритм Евклида для нахождения НОД (на любом языке программирования или псевдокоде). Примените его к трём парам чисел. Для каждой пары запишите последовательность шагов. Оцените сложность алгоритма.	practice	""	100	2025-10-12 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:02:14.50226	2026-05-21 16:02:14.50226	17	\N	\N
130	Сортировка массива: три метода	Реализуйте три алгоритма сортировки: пузырьковую, выбором и вставками. Отсортируйте один и тот же массив из 15 элементов каждым методом. Сравните количество сравнений и перестановок. Оформите таблицу.	practice	""	100	2025-10-19 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:02:41.293844	2026-05-21 16:02:41.293844	17	\N	\N
131	Бинарный поиск	Реализуйте бинарный поиск в отсортированном массиве. Продемонстрируйте работу на примере поиска 5 элементов (3 присутствующих, 2 отсутствующих). Для каждого случая покажите последовательность обращений к элементам массива.	practice	""	100	2025-10-26 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:03:08.548056	2026-05-21 16:03:08.548056	17	\N	\N
132	Рекурсия: Ханойские башни	Реализуйте рекурсивное решение задачи о Ханойских башнях для N = 4 дисков. Выведите последовательность перемещений. Объясните принцип работы рекурсии на этом примере. Оцените количество перемещений.	practice	""	100	2025-11-02 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:03:38.962972	2026-05-21 16:03:38.962972	17	\N	\N
133	Стек и очередь: реализация	Реализуйте стек и очередь (на массиве или списке). Продемонстрируйте операции push, pop (для стека) и enqueue, dequeue (для очереди) на примере последовательности из 10 операций. Объясните разницу между LIFO и FIFO.	practice	""	100	2025-11-09 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:04:12.641524	2026-05-21 16:04:12.641524	17	\N	\N
134	Итоговая работа: анализ алгоритма	Выберите любой алгоритм (можно из пройденных). Проведите полный анализ: описание, псевдокод, временная сложность (лучший/средний/худший случаи), пространственная сложность. Приведите пример выполнения на конкретных данных. Объём: 400–500 слов.	practice	""	100	2025-11-24 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:04:41.967164	2026-05-21 16:04:41.967164	17	\N	\N
135	Процессор: регистры и команды	Изучите упрощённую модель процессора (например, учебный симулятор или описание архитектуры). Напишите отчёт: какие регистры есть, их назначение, как выполняется цикл выборки-декодирования-исполнения. Приложите схему.	practice	""	100	2026-01-18 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:05:21.992512	2026-05-21 16:05:21.992512	18	\N	\N
136	Ассемблер: простейшая программа	Напишите программу на ассемблере (любая учебная архитектура, например MIPS или x86-упрощённый) для сложения двух чисел и вывода результата. Приложите листинг с комментариями к каждой строке и скриншот выполнения.	practice	""	100	2026-01-25 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:05:53.374767	2026-05-21 16:05:53.374767	18	\N	\N
137	Иерархия памяти: кэш	Объясните принцип работы кэш-памяти. Рассчитайте время доступа к данным при попадании в кэш (hit) и промахе (miss) для заданных параметров. Постройте график зависимости среднего времени доступа от hit rate.	practice	""	100	2026-02-01 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:06:19.842319	2026-05-21 16:06:19.842319	18	\N	\N
138	Конвейер процессора	Объясните принцип конвейеризации выполнения команд. Приведите пример 5 команд, проходящих через 5-стадийный конвейер. Покажите на диаграмме ситуации конфликтов (data hazard, control hazard) и способы их разрешения.	practice	""	100	2026-02-08 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:06:46.941101	2026-05-21 16:06:46.941101	18	\N	\N
139	Виртуальная память и страничная организация	Объясните, как работает виртуальная память. Преобразуйте 5 виртуальных адресов в физические, используя заданную таблицу страниц. Рассчитайте размер страницы и количество записей в таблице страниц для заданных параметров.	practice	""	100	2026-02-15 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:07:13.230163	2026-05-21 16:07:13.230163	18	\N	\N
140	Управление процессами в ОС	Напишите программу, создающую 3 дочерних процесса (на C/Python с fork или аналог). Каждый процесс выполняет свою задачу. Объясните, как ОС управляет процессами: таблица процессов, контекст, планировщик. Приложите код и вывод.	practice	""	100	2026-02-22 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:07:39.630333	2026-05-21 16:07:39.630333	18	\N	\N
141	Взаимодействие процессов: каналы и сигналы	Реализуйте взаимодействие двух процессов через неименованный канал (pipe) или сигналы. Один процесс отправляет данные, второй принимает и обрабатывает. Объясните механизм работы каналов. Приложите код и вывод.	practice	""	100	2026-03-01 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:08:07.112245	2026-05-21 16:08:07.112245	18	\N	\N
142	Файловая система: структура и анализ	Изучите структуру файловой системы (FAT32, ext4 или NTFS на выбор). Объясните: суперблок, таблица файлов, блоки данных. Рассчитайте максимальный размер файла и тома для заданных параметров кластера.	practice	""	100	2026-03-08 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:08:33.731001	2026-05-21 16:08:33.731001	18	\N	\N
143	Сетевой стек TCP/IP	Создайте простое клиент-серверное приложение на сокетах. Клиент отправляет сообщение, сервер отвечает. С помощью Wireshark перехватите пакеты и проанализируйте заголовки Ethernet, IP, TCP. Приложите код и скриншоты анализа.	practice	""	100	2026-03-15 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:08:59.653658	2026-05-21 16:08:59.653658	18	\N	\N
144	Итоговая работа: профилирование системы	Проведите профилирование вашего компьютера: загрузка CPU, использование памяти, дисковый I/O, сетевые соединения. Соберите данные с помощью системных утилит (top, perf, диспетчер задач). Напишите отчёт с графиками и выводами.	practice	""	100	2026-03-30 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:09:26.080916	2026-05-21 16:09:26.080916	18	\N	\N
145	SQL: создание базы данных	Спроектируйте базу данных для учёта студентов и курсов (3 таблицы: Students, Courses, Enrollments). Напишите SQL-скрипт создания таблиц с первичными и внешними ключами. Приложите ER-диаграмму и скрипт.\n	practice	""	100	2026-04-19 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:10:08.191308	2026-05-21 16:10:08.191308	19	\N	\N
146	SQL: запросы выборки	Заполните базу из задания 12.1 тестовыми данными (минимум 5 студентов, 3 курса, 8 записей о записи). Напишите 5 SELECT-запросов с использованием WHERE, JOIN, GROUP BY, HAVING, ORDER BY. Приложите запросы и результаты.	practice	""	100	2026-04-26 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:10:34.154629	2026-05-21 16:10:34.154629	19	\N	\N
147	Индексы и производительность	Создайте таблицу с 100 000 строками тестовых данных. Выполните один и тот же SELECT-запрос без индекса и с индексом. Измерьте время выполнения (EXPLAIN/ANALYZE). Напишите отчёт о влиянии индексов на производительность.	practice	""	100	2026-05-03 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:10:59.140322	2026-05-21 16:10:59.140322	19	\N	\N
148	Анализ данных с Pandas	Загрузите любой открытый датасет (CSV, не менее 500 строк). Выполните базовый анализ: описательная статистика, группировка по категориальной переменной, построение трёх различных графиков. Приложите код и графики.	practice	""	100	2026-05-10 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:11:31.854868	2026-05-21 16:11:31.854868	19	\N	\N
149	Визуализация данных	Используя датасет из задания 12.4 или новый, создайте дашборд из минимум 4 визуализаций в любом инструменте (Matplotlib, Seaborn, Tableau Public, Power BI). Дашборд должен рассказывать историю данных. Приложите скриншоты и код/файл.	practice	""	100	2026-05-17 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:11:58.656382	2026-05-21 16:11:58.656382	19	\N	\N
150	Веб-скрапинг	Напишите скрипт для сбора данных с любого публичного веб-сайта (например, курсы валют, погода, новости). Сохраните собранные данные в CSV. Приложите код и файл с данными (минимум 20 записей). Укажите источник.	practice	""	100	2026-05-24 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:12:23.411369	2026-05-21 16:12:23.411369	19	\N	\N
151	Основы кибербезопасности: анализ уязвимости	Выберите известную уязвимость из базы CVE (последние 2 года). Опишите: тип уязвимости, механизм эксплуатации, последствия и методы защиты. Напишите отчёт (300–400 слов) с ссылками на источники.	practice	""	100	2026-05-31 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:12:53.105511	2026-05-21 16:12:53.105511	19	\N	\N
152	Автоматизация: bash/PowerShell скрипт	Напишите скрипт для автоматизации рутинной задачи (бэкап файлов, мониторинг дискового пространства, очистка временных файлов). Добавьте логирование. Приложите скрипт, пример вывода и краткую инструкцию по использованию.	practice	""	100	2026-06-07 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:13:23.838896	2026-05-21 16:13:23.838896	19	\N	\N
153	Хеширование и целостность данных	Реализуйте программу, которая вычисляет хеш-сумму файла (SHA-256). Проверьте целостность файла после передачи (имитация: измените один байт и сравните хеши). Объясните принцип работы криптографических хеш-функций.	practice	""	100	2026-06-14 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:13:50.23706	2026-05-21 16:13:50.23706	19	\N	\N
154	Итоговый проект: мини-аналитическая система	Создайте проект, объединяющий несколько технологий: сбор данных (скрапинг или API), хранение в БД, анализ (Pandas/SQL), визуализация (графики/дашборд). Приложите полный код, схему архитектуры и краткий отчёт с выводами.	practice	""	100	2026-06-29 23:59:00	t	\N	\N	\N	5	\N	2026-05-21 16:14:24.088988	2026-05-21 16:14:24.088988	19	\N	\N
155	Ульразвуковой дальномер	Описание задания	practice_review	""	100	2026-05-26 23:59:00	t	\N	\N	\N	5	\N	2026-05-22 08:53:27.910304	2026-05-22 08:53:27.910304	10	\N	\N
158	Собрать схему OR-NOT	Соберите логическую схему из элементов OR и NOT	practice	\N	10	2026-06-15 23:59:59	t	\N	\N	\N	5	\N	2026-05-22 12:22:44.430633	2026-05-22 12:22:44.430633	\N	\N	\N
159	Задание	Описание задания	practice	""	100	2026-12-12 12:12:00	t	\N	\N	\N	5	\N	2026-06-09 10:33:05.665603	2026-06-09 10:33:05.665603	8	\N	\N
\.


--
-- Data for Name: career_tests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.career_tests (id, type, title, description, duration, "answerFormat", questions, "categoryMeta", "isActive", "createdAt", "updatedAt") FROM stdin;
2	klimov	Методика ДДО Е.А. Климова	Разделяет профессии на 5 типов по объекту труда: Человек–Техника, Человек–Человек и другие.	5–10 минут	choice	[{"a": {"text": "Проводить обучение и тренинги для сотрудников", "category": "ЧЧ"}, "b": {"text": "Настраивать сетевую инфраструктуру и серверы", "category": "ЧТ"}, "id": 1}, {"a": {"text": "Анализировать данные с помощью SQL и Python", "category": "ЧЗ"}, "b": {"text": "Создавать визуальный дизайн продукта", "category": "ЧХ"}, "id": 2}, {"a": {"text": "Консультировать пользователей по техническим вопросам", "category": "ЧЧ"}, "b": {"text": "Разрабатывать экологические системы мониторинга", "category": "ЧП"}, "id": 3}, {"a": {"text": "Разрабатывать встроенные системы и прошивки", "category": "ЧТ"}, "b": {"text": "Создавать алгоритмы обработки данных", "category": "ЧЗ"}, "id": 4}, {"a": {"text": "Планировать проекты и взаимодействовать с командой", "category": "ЧЧ"}, "b": {"text": "Разрабатывать программный код самостоятельно", "category": "ЧЗ"}, "id": 5}, {"a": {"text": "Разрабатывать пользовательские интерфейсы", "category": "ЧХ"}, "b": {"text": "Проводить технические интервью и менторинг", "category": "ЧЧ"}, "id": 6}, {"a": {"text": "Проектировать аппаратное обеспечение и схемы", "category": "ЧТ"}, "b": {"text": "Разрабатывать ПО для анализа медицинских данных", "category": "ЧП"}, "id": 7}, {"a": {"text": "Моделировать бизнес-процессы и строить архитектуры", "category": "ЧЗ"}, "b": {"text": "Управлять командой разработчиков", "category": "ЧЧ"}, "id": 8}, {"a": {"text": "Создавать системы мониторинга окружающей среды", "category": "ЧП"}, "b": {"text": "Разрабатывать интерактивные медиа-проекты", "category": "ЧХ"}, "id": 9}, {"a": {"text": "Программировать микроконтроллеры и IoT-устройства", "category": "ЧТ"}, "b": {"text": "Заниматься 3D-моделированием и анимацией", "category": "ЧХ"}, "id": 10}, {"a": {"text": "Разрабатывать системы управления и хранения данных", "category": "ЧЗ"}, "b": {"text": "Разрабатывать биоинформатические алгоритмы", "category": "ЧП"}, "id": 11}, {"a": {"text": "Вести технические переговоры с клиентами", "category": "ЧЧ"}, "b": {"text": "Создавать контент и визуальные материалы", "category": "ЧХ"}, "id": 12}, {"a": {"text": "Разрабатывать драйверы и системное ПО", "category": "ЧТ"}, "b": {"text": "Поддерживать пользователей и решать их проблемы", "category": "ЧЧ"}, "id": 13}, {"a": {"text": "Работать над UX-исследованиями и прототипами", "category": "ЧХ"}, "b": {"text": "Разрабатывать автотесты и системы QA", "category": "ЧЗ"}, "id": 14}, {"a": {"text": "Разрабатывать ПО для анализа экологических данных", "category": "ЧП"}, "b": {"text": "Создавать роботизированные и автоматизированные системы", "category": "ЧТ"}, "id": 15}, {"a": {"text": "Проектировать архитектуру программных систем", "category": "ЧЗ"}, "b": {"text": "Обслуживать и модернизировать серверное оборудование", "category": "ЧТ"}, "id": 16}, {"a": {"text": "Исследовать применение технологий в науке и природе", "category": "ЧП"}, "b": {"text": "Обучать пользователей работе с системами", "category": "ЧЧ"}, "id": 17}, {"a": {"text": "Разрабатывать игры и интерактивные приложения", "category": "ЧХ"}, "b": {"text": "Настраивать облачные сервисы и CI/CD", "category": "ЧТ"}, "id": 18}, {"a": {"text": "Разрабатывать алгоритмы машинного обучения", "category": "ЧЗ"}, "b": {"text": "Руководить командой и проводить планёрки", "category": "ЧЧ"}, "id": 19}, {"a": {"text": "Создавать ПО для научных и природных исследований", "category": "ЧП"}, "b": {"text": "Строить системы обработки и хранения больших данных", "category": "ЧЗ"}, "id": 20}]	{"ЧЗ": {"label": "Человек — Знаковая система", "careers": ["Backend-разработчик", "Data Engineer", "Системный архитектор", "QA-автоматизатор", "Аналитик данных"], "description": "Вы склонны к работе с абстрактными системами: кодом, данными, формулами и структурированной информацией."}, "ЧП": {"label": "Человек — Природа", "careers": ["Биоинформатик", "Data Scientist в науке", "Эколог-аналитик", "Медицинский разработчик ПО"], "description": "Вам близки задачи, связанные с природными процессами, биологией и исследованиями в естественных науках."}, "ЧТ": {"label": "Человек — Техника", "careers": ["DevOps-инженер", "IoT-инженер", "Embedded-разработчик", "SRE", "Инженер-электронщик"], "description": "Вас привлекает работа с техническими системами, оборудованием и физической инфраструктурой."}, "ЧХ": {"label": "Человек — Художественный образ", "careers": ["UX/UI дизайнер", "Frontend-разработчик", "Game Designer", "Motion Designer", "Технический писатель"], "description": "Вам близко творческое создание продуктов: дизайн, анимация, интерфейсы и визуальные решения."}, "ЧЧ": {"label": "Человек — Человек", "careers": ["Product Manager", "Developer Advocate", "Tech Lead", "Agile Coach", "Customer Success Manager"], "description": "Вы ориентированы на взаимодействие с людьми: общение, обучение, помощь и командная работа — ваша стихия."}}	t	2026-05-09 16:20:54.408165	2026-05-09 16:20:54.408165
1	holland	Тест Голланда (обновлён)	Обновлённое описание профориентационного теста Голланда	15–20 минут	yes_no	[{"id": 1, "text": "Собирать и настраивать компьютерное оборудование", "category": "R"}, {"id": 2, "text": "Устранять технические неисправности в системах", "category": "R"}, {"id": 3, "text": "Работать с электронными схемами и устройствами", "category": "R"}, {"id": 4, "text": "Устанавливать и настраивать операционные системы", "category": "R"}, {"id": 5, "text": "Проектировать физические компоненты устройств", "category": "R"}, {"id": 6, "text": "Исследовать данные и выявлять закономерности", "category": "I"}, {"id": 7, "text": "Разрабатывать и тестировать алгоритмы", "category": "I"}, {"id": 8, "text": "Изучать новые технологии и научные методы", "category": "I"}, {"id": 9, "text": "Решать сложные логические и математические задачи", "category": "I"}, {"id": 10, "text": "Проводить статистический или машинный анализ данных", "category": "I"}, {"id": 11, "text": "Разрабатывать визуальный дизайн интерфейсов", "category": "A"}, {"id": 12, "text": "Создавать пользовательские сценарии и прототипы", "category": "A"}, {"id": 13, "text": "Писать техническую документацию и статьи", "category": "A"}, {"id": 14, "text": "Разрабатывать анимации и графические элементы", "category": "A"}, {"id": 15, "text": "Работать над концепцией и стилем продукта", "category": "A"}, {"id": 16, "text": "Обучать и наставлять коллег или студентов", "category": "S"}, {"id": 17, "text": "Проводить презентации и технические демонстрации", "category": "S"}, {"id": 18, "text": "Помогать пользователям решать технические проблемы", "category": "S"}, {"id": 19, "text": "Координировать работу команды разработчиков", "category": "S"}, {"id": 20, "text": "Проводить код-ревью и давать развёрнутую обратную связь", "category": "S"}, {"id": 21, "text": "Управлять проектами и принимать стратегические решения", "category": "E"}, {"id": 22, "text": "Убеждать команду и стейкхолдеров в правильности решений", "category": "E"}, {"id": 23, "text": "Вести переговоры с клиентами и партнёрами", "category": "E"}, {"id": 24, "text": "Разрабатывать стратегию развития технического продукта", "category": "E"}, {"id": 25, "text": "Запускать новые инициативы и технологические стартапы", "category": "E"}, {"id": 26, "text": "Систематизировать и структурировать данные в БД", "category": "C"}, {"id": 27, "text": "Тестировать программное обеспечение по чек-листам", "category": "C"}, {"id": 28, "text": "Вести техническую документацию и регламенты", "category": "C"}, {"id": 29, "text": "Анализировать требования и составлять спецификации", "category": "C"}, {"id": 30, "text": "Разрабатывать SQL-запросы и работать с реляционными БД", "category": "C"}]	{"A": {"label": "Артистический", "careers": ["UX/UI дизайнер", "Frontend-разработчик", "Технический писатель", "Game Developer", "Motion Designer"], "description": "Вы любите творческую свободу, создание уникальных вещей и самовыражение через работу."}, "C": {"label": "Конвентциональный", "careers": ["QA-автоматизатор", "Системный аналитик", "DBA", "Data Engineer", "Бизнес-аналитик"], "description": "Вы цените порядок, точность и работу с чёткими правилами и структурами."}, "E": {"label": "Предпринимательский", "careers": ["Product Manager", "CTO", "Tech Lead", "Менеджер по продукту", "Технический предприниматель"], "description": "Вы стремитесь к лидерству, влиянию и реализации амбициозных целей."}, "I": {"label": "Исследовательский", "careers": ["Data Scientist", "AI/ML-инженер", "Backend-разработчик", "Исследователь кибербезопасности", "Биоинформатик"], "description": "Вас привлекают аналитические задачи, исследования и решение сложных интеллектуальных проблем."}, "R": {"label": "Реалистичный", "careers": ["IoT-инженер", "DevOps-инженер", "Инженер-электронщик", "Embedded-разработчик", "Системный администратор"], "description": "Вам нравится работать с техникой и физическими объектами. Вы предпочитаете конкретные, ощутимые результаты."}, "S": {"label": "Социальный", "careers": ["Технический менеджер", "Developer Advocate", "QA-инженер", "Tech Lead", "Agile Coach"], "description": "Вам важно работать с людьми, помогать им и строить взаимодействие в команде."}}	t	2026-05-09 16:20:54.408165	2026-05-24 17:36:05.922457
\.


--
-- Data for Name: circuit_element_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.circuit_element_types (type, metadata) FROM stdin;
\.


--
-- Data for Name: circuit_solutions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.circuit_solutions (id, "circuitData", "simulationResults", score, "maxScore", feedback, "submittedAt", "assignmentId") FROM stdin;
\.


--
-- Data for Name: circuit_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.circuit_submissions (id, "circuitData", score, "maxScore", feedback, "isPassed", submitted_at, "assignmentId", "userId") FROM stdin;
\.


--
-- Data for Name: course_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.course_groups (id, name, year, semester, "maxStudents", "isActive", "startDate", "endDate", "createdAt", "updatedAt", "courseId") FROM stdin;
8	Базовые цепи	2025	1	20	t	2025-09-08 00:00:00	2025-11-28 00:00:00	2026-05-21 08:22:28.188843	2026-05-21 08:22:28.188843	4
9	Аналоговый мир	2026	1	20	t	2026-01-12 00:00:00	2026-04-03 00:00:00	2026-05-21 08:23:13.303082	2026-05-21 08:23:13.303082	4
10	Микроконтроллерная	2026	1	20	t	2026-04-13 00:00:00	2026-07-05 00:00:00	2026-05-21 08:24:04.261998	2026-05-21 08:24:04.261998	4
11	Foundation	2026	1	20	t	2025-09-15 00:00:00	2025-12-19 00:00:00	2026-05-21 08:24:58.556446	2026-05-21 08:24:58.556446	5
12	Communication Hub	2026	1	20	t	2026-01-19 00:00:00	2026-04-24 00:00:00	2026-05-21 08:25:32.921914	2026-05-21 08:25:32.921914	5
13	Proficient Lab	2026	1	20	t	2026-05-11 00:00:00	2026-08-14 00:00:00	2026-05-21 08:26:07.856613	2026-05-21 08:26:07.856613	5
14	Connected Devices	2026	1	20	t	2025-09-22 00:00:00	2025-12-15 00:00:00	2026-05-21 08:26:55.166443	2026-05-21 08:26:55.166443	7
15	Data Stream	2026	1	20	t	2026-01-26 00:00:00	2026-04-20 00:00:00	2026-05-21 08:27:34.381474	2026-05-21 08:27:34.381474	7
16	Edge & Fog	2026	1	20	t	2026-05-04 00:00:00	2026-06-27 00:00:00	2026-05-21 08:28:05.673462	2026-05-21 08:28:05.673462	7
17	Теоретический минимум	2026	1	20	t	2025-09-01 00:00:00	2025-11-24 00:00:00	2026-05-21 08:28:49.128137	2026-05-21 08:28:49.128137	6
18	Архитектура и системы	2026	1	20	t	2026-01-05 00:00:00	2026-03-30 00:00:00	2026-05-21 08:29:20.381301	2026-05-21 08:29:20.381301	6
19	Прикладная информатика	2026	1	20	t	2026-04-06 00:00:00	2026-06-29 00:00:00	2026-05-21 08:29:57.234874	2026-05-21 08:29:57.234874	6
\.


--
-- Data for Name: course_materials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.course_materials (id, title, description, type, "fileUrl", "thumbnailUrl", "isPublic", "createdAt", "updatedAt", "courseId", "uploadedById") FROM stdin;
1	Основы электрических цепей: конспект лекции	Конспект первой лекции. Содержит определения тока, напряжения, сопротивления, закон Ома, правила последовательного и параллельного соединения резисторов, примеры расчёта эквивалентного сопротивления.	document	https://example.com/basic-circuits-lecture1.pdf	https://example.com/preview/basic-circuits-lecture1.jpg	t	2026-05-21 17:07:36.372272	2026-05-21 17:07:36.372272	4	1
2	Конденсаторы и RC-цепи: теория и примеры	Подробный материал по конденсаторам: устройство, заряд/разряд, постоянная времени, осциллограммы. Включает примеры расчёта RC-цепей, диодных мостов и сглаживающих конденсаторов.	document	https://example.com/basic-circuits-capacitors.pdf	https://example.com/preview/basic-circuits-capacitors.jpg	t	2026-05-21 17:08:31.233542	2026-05-21 17:08:31.233542	4	1
3	Операционные усилители: схемы включения и расчёт	Конспект по операционным усилителям. Повторитель, неинвертирующий и инвертирующий усилитель, сумматор. Формулы расчёта, примеры с номиналами резисторов, типовые ошибки при проектировании.	document	https://example.com/analog-opamps.pdf	https://example.com/preview/analog-opamps.jpg	t	2026-05-21 17:08:49.048491	2026-05-21 17:08:49.048491	4	1
4	Компараторы, триггер Шмитта и активные фильтры	Теоретический материал по компараторам на ОУ, расчёт порогов триггера Шмитта, петля гистерезиса. Активные фильтры первого порядка: ФНЧ и ФВЧ, расчёт частоты среза. Схемы генераторов сигналов.	document	https://example.com/analog-comparators-filters.pdf	https://example.com/preview/analog-comparators-filters.jpg	t	2026-05-21 17:09:07.094794	2026-05-21 17:09:07.094794	4	1
5	Введение в Arduino и ESP32: GPIO, кнопки, ШИМ	Материал по архитектуре микроконтроллеров, среде разработки Arduino IDE, работе с цифровыми входами/выходами. Примеры кода: Blink, чтение кнопки с антидребезгом, ШИМ-управление яркостью.	document	https://example.com/mcu-intro-gpio.pdf	https://example.com/preview/mcu-intro-gpio.jpg	t	2026-05-21 17:09:24.806103	2026-05-21 17:09:24.806103	4	1
6	Таймеры, прерывания и протоколы связи	Материал по аппаратным таймерам, обработке прерываний, UART-коммуникации между устройствами. Работа с EEPROM для хранения настроек. Примеры кода для ESP32.	document	https://example.com/mcu-timers-uart.pdf	https://example.com/preview/mcu-timers-uart.jpg	t	2026-05-21 17:09:40.041788	2026-05-21 17:09:40.041788	4	1
7	Present Simple, There is/are, Prepositions: Grammar Reference	Грамматический справочник по темам: Present Simple (утверждение, отрицание, вопрос), конструкция there is/there are, предлоги места и направления. Включает таблицы спряжения и упражнения для самопроверки.	document	https://example.com/english-foundation-grammar1.pdf	https://example.com/preview/english-foundation-grammar1.jpg	t	2026-05-21 17:09:56.460703	2026-05-21 17:09:56.460703	5	1
8	Past Simple, Future Plans, Comparatives: Grammar Reference	Грамматический справочник по темам: Past Simple (правильные и неправильные глаголы), конструкция to be going to, сравнительная и превосходная степень прилагательных, повелительное наклонение.	document	https://example.com/english-foundation-grammar2.pdf	https://example.com/preview/english-foundation-grammar2.jpg	t	2026-05-21 17:10:14.460229	2026-05-21 17:10:14.460229	5	1
9	Formal & Informal Writing: Emails, Linking Words	Руководство по формальному и неформальному стилю. Структура официального email (subject, salutation, body, closing). Список linking words с примерами использования. Шаблоны писем: жалоба, запрос, благодарность.	document	https://example.com/english-comm-formal-writing.pdf	https://example.com/preview/english-comm-formal-writing.jpg	t	2026-05-21 17:10:31.975601	2026-05-21 17:10:31.975601	5	1
10	Storytelling, Debates & Elevator Pitch: Techniques	Техники эффективного сторителлинга: структура истории, времена для повествования. Основы дебатов: построение аргумента, контраргумент, опровержение. Формула elevator pitch. Примеры и шаблоны.	document	https://example.com/english-comm-speaking.pdf	https://example.com/preview/english-comm-speaking.jpg	t	2026-05-21 17:10:48.367514	2026-05-21 17:10:48.367514	5	1
11	Academic Writing: Essays, Paraphrasing, Critical Analysis	Полное руководство по академическому письму. Структура эссе, thesis statement, topic sentences. Техники парафраза и суммаризации. Как писать critical analysis: оценка аргументов, выявление bias. Оформление references.	document	https://example.com/english-proficient-academic.pdf	https://example.com/preview/english-proficient-academic.jpg	t	2026-05-21 17:11:05.198144	2026-05-21 17:11:05.198144	5	1
12	Rhetoric & Persuasion: Speechwriting and Stylistic Analysis	Риторические приёмы: rhetorical questions, rule of three, antithesis, anaphora. Методика стилистического анализа текста. Подготовка убеждающей речи. Критерии оценки IELTS/CAE Writing. Примеры анализа речей TED.	document	https://example.com/english-proficient-rhetoric.pdf	https://example.com/preview/english-proficient-rhetoric.jpg	t	2026-05-21 17:11:23.804634	2026-05-21 17:11:23.804634	5	1
13	IoT-устройства: датчики и актуаторы — справочник	Справочник по основным датчикам (DHT11/DHT22, фоторезистор, PIR, HC-SR04) и актуаторам (реле, MOSFET, серводвигатель). Схемы подключения к ESP32, примеры кода для считывания данных и управления.	document	https://example.com/iot-devices-sensors.pdf	https://example.com/preview/iot-devices-sensors.jpg	t	2026-05-21 17:11:42.352983	2026-05-21 17:11:42.352983	7	1
14	Локальное взаимодействие: дисплеи, SD-карты, конечные автоматы	Руководство по подключению OLED-дисплеев (SSD1306), работе с SD-картами по SPI, форматированию CSV-файлов. Проектирование конечных автоматов для управления режимами устройства. Примеры кода.	document	https://example.com/iot-devices-local.pdf	https://example.com/preview/iot-devices-local.jpg	t	2026-05-21 17:11:56.623192	2026-05-21 17:11:56.623192	7	1
15	MQTT и HTTP для IoT: протоколы и примеры	Подробное руководство по MQTT: брокер, топики, publish/subscribe, QoS, retained-сообщения. HTTP-запросы с ESP32. Работа с JSON. Подключение к облачным платформам (ThingSpeak, Blynk). Примеры кода.	document	https://example.com/iot-stream-mqtt-http.pdf	https://example.com/preview/iot-stream-mqtt-http.jpg	t	2026-05-21 17:12:13.686923	2026-05-21 17:12:13.686923	7	1
16	Интеграции и альтернативные протоколы: Webhook, CoAP	Настройка webhook-интеграций (Zapier, IFTTT, собственный сервер). Протокол CoAP: особенности, отличия от MQTT. Сравнение протоколов по задержке, объёму данных, энергопотреблению. Критерии выбора.	document	https://example.com/iot-stream-webhook-coap.pdf	https://example.com/preview/iot-stream-webhook-coap.jpg	t	2026-05-21 17:12:29.714155	2026-05-21 17:12:29.714155	7	1
17	Edge Computing: фильтрация, аномалии и конечные автоматы	Материал по edge-обработке: алгоритмы фильтрации сигналов (скользящее среднее, медианный), обнаружение аномалий (метод среднего и стандартного отклонения), буферизация данных. Проектирование конечных автоматов.	document	https://example.com/iot-edge-processing.pdf	https://example.com/preview/iot-edge-processing.jpg	t	2026-05-21 17:12:45.986191	2026-05-21 17:12:45.986191	7	1
18	Автономные устройства: Deep Sleep, OTA, BLE, ESP-NOW	Руководство по энергосбережению (deep sleep), OTA-обновлению прошивки, BLE-коммуникации (сервер/клиент) и созданию mesh-сетей на ESP-NOW. Локальный HTTP-сервер на ESP32. Примеры кода.	document	https://example.com/iot-edge-autonomous.pdf	https://example.com/preview/iot-edge-autonomous.jpg	t	2026-05-21 17:13:01.285275	2026-05-21 17:13:01.285275	7	1
19	Системы счисления и булева алгебра: теория и примеры	Материал по системам счисления (двоичная, восьмеричная, шестнадцатеричная), переводу между ними, двоичной арифметике. Булева алгебра: таблицы истинности, законы, упрощение выражений, карты Карно.	document	https://example.com/cs-theory-numeration-boolean.pdf	https://example.com/preview/cs-theory-numeration-boolean.jpg	t	2026-05-21 17:13:17.192577	2026-05-21 17:13:17.192577	6	1
20	Алгоритмы и структуры данных: от сортировки до O-нотации	Конспект по базовым алгоритмам сортировки, бинарному поиску, рекурсии. Стек и очередь. Введение в анализ сложности: O-нотация, лучший/средний/худший случай. Примеры на псевдокоде.	document	https://example.com/cs-theory-algorithms.pdf	https://example.com/preview/cs-theory-algorithms.jpg	t	2026-05-21 17:13:33.066996	2026-05-21 17:13:33.066996	6	1
21	Архитектура компьютера: процессор, память, конвейер	Материал по организации процессора (АЛУ, регистры, устройство управления), циклу выборки-декодирования-исполнения, конвейеризации. Иерархия памяти: кэш, ОЗУ. Виртуальная память. Введение в ассемблер.	document	https://example.com/cs-arch-processor-memory.pdf	https://example.com/preview/cs-arch-processor-memory.jpg	t	2026-05-21 17:13:49.751394	2026-05-21 17:13:49.751394	6	1
22	Операционные системы и сети: процессы, файлы, TCP/IP	Материал по управлению процессами, межпроцессному взаимодействию (каналы, сигналы, сокеты), файловым системам. Сетевой стек TCP/IP: инкапсуляция, IP-адресация, TCP handshake. Анализ трафика в Wireshark.	document	https://example.com/cs-arch-os-networks.pdf	https://example.com/preview/cs-arch-os-networks.jpg	t	2026-05-21 17:14:05.550871	2026-05-21 17:14:05.550871	6	1
23	Базы данных и SQL: проектирование и запросы	Руководство по проектированию реляционных БД, нормализации, ER-диаграммам. SQL: CREATE TABLE, SELECT, JOIN, GROUP BY, подзапросы. Индексы и EXPLAIN. Примеры запросов для учебной БД студентов и курсов.	document	https://example.com/cs-applied-sql.pdf	https://example.com/preview/cs-applied-sql.jpg	t	2026-05-21 17:14:18.902683	2026-05-21 17:14:18.902683	6	1
24	Анализ данных, скрапинг и кибербезопасность	Материал по анализу данных с Pandas, визуализации (Matplotlib, Seaborn), веб-скрапингу (requests, BeautifulSoup). Основы кибербезопасности: хеширование, типовые уязвимости (OWASP Top 10), автоматизация скриптами.	document	https://example.com/cs-applied-data-security.pdf	https://example.com/preview/cs-applied-data-security.jpg	t	2026-05-21 17:14:35.136559	2026-05-21 17:14:35.136559	6	1
\.


--
-- Data for Name: course_registrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.course_registrations (id, "userId", "courseGroupId", status, "registeredAt", "approvedAt", "approvedBy") FROM stdin;
5	7	10	approved	2026-05-21 13:55:12.333909	2026-05-21 13:55:12.328	7
38	8	10	approved	2026-05-22 08:32:56.309704	2026-05-22 08:32:56.307	8
39	13	10	approved	2026-05-22 08:43:07.037384	2026-05-22 08:43:07.036	13
40	14	10	approved	2026-05-22 08:43:25.54594	2026-05-22 08:43:25.545	14
41	15	10	approved	2026-05-22 08:43:43.39525	2026-05-22 08:43:43.393	15
42	16	10	approved	2026-05-22 08:44:02.071242	2026-05-22 08:44:02.07	16
43	17	10	approved	2026-05-22 08:44:17.877532	2026-05-22 08:44:17.876	17
44	18	10	approved	2026-05-22 08:44:34.757055	2026-05-22 08:44:34.756	18
45	19	10	approved	2026-05-22 08:44:49.527214	2026-05-22 08:44:49.526	19
46	20	10	approved	2026-05-22 08:45:04.275851	2026-05-22 08:45:04.275	20
47	21	10	approved	2026-05-22 08:45:19.034906	2026-05-22 08:45:19.033	21
48	22	10	approved	2026-05-22 08:45:34.916632	2026-05-22 08:45:34.916	22
49	1	15	approved	2026-05-22 11:53:14.982354	2026-05-22 11:53:14.981	1
50	1	14	approved	2026-05-24 10:12:59.327299	2026-05-24 10:12:59.326	1
51	1	16	approved	2026-05-24 10:13:33.804312	2026-05-24 10:13:33.803	1
52	73	19	approved	2026-05-24 10:14:28.852992	2026-05-24 10:14:28.852	73
53	73	18	approved	2026-05-24 10:14:30.832444	2026-05-24 10:14:30.831	73
54	73	17	approved	2026-05-24 10:14:48.359431	2026-05-24 10:14:48.358	73
55	8	8	approved	2026-06-09 09:23:16.675598	2026-06-09 09:23:16.673	8
56	23	9	approved	2026-06-09 09:24:17.776572	2026-06-09 09:24:17.775	23
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.courses (id, name, type, description, duration, "isActive", "imageUrl", "createdAt", "updatedAt") FROM stdin;
4	Электроника с нуля: От лампочки до робота	electronics	Боитесь слова «транзистор» и не знаете, с какой стороны браться за паяльник? Этот курс создан для тех, кто хочет войти в мир электроники без сложных формул и страха что-то сжечь.\nВы начнете с самого основ: поймете, что такое ток, напряжение и сопротивление (и как их не путать), научитесь читать простейшие схемы и управлять светодиодами. Мы перейдем от теории к практике уже на первом занятии, собрав ваше первое устройство. Это курс-приключение, где вы превратите груду радиодеталей в мигающие, жужжащие и движущиеся гаджеты.	12	t	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjQ_qoaLN2M7hanUrhfRbAEjmWK865qCFY-w&s	2026-05-09 16:58:28.347512	2026-05-09 16:58:28.347512
6	Информатика. Перезагрузка	computer_science	Курс, который превращает информатику из «урока за компьютером» в понятную и захватывающую науку. Мы уходим от сухой теории и разбираем главное: как работают алгоритмы, что такое системы счисления без скуки, и почему программирование — это не магия, а логика. Ребенок перестанет бояться задач на кодирование, освоит азы работы с данными и поймет, что компьютер — его главный инструмент в будущем.	12	t	https://linchakin.com/files/word/1000/437/1.jpg	2026-05-13 06:45:24.572041	2026-05-21 07:43:02.176147
7	Железо, которое думает	iot	Хотите, чтобы ваши схемы ожили? Курс для тех, кто любит паять, прошивать и вдыхать интеллект в микроконтроллеры. Мы начнем с мигающего светодиода, а закончим развертыванием полноценной сети датчиков с передачей данных в облако. Научитесь работать с Arduino и ESP32, программировать конечные автоматы устройств и дружить «железо» с веб-интерфейсами. Чистый хардкор для будущих создателей умных домов и городов.	12	t	https://www.cellhire.com/_next/image/?url=%2Fimg%2Ffr-fr%2Fblog%2Fquest-ce-que-liot.webp&w=3840&q=75	2026-05-21 07:46:06.675456	2026-05-21 07:46:06.675456
5	Code in English	english	Вы пишете чистый код, но до сих пор теряетесь на дейли-митингах с заказчиком? Курс «Code in English» стирает границу между вашим техническим скиллом и свободным общением. Мы не учим временам по учебникам — мы учим защищать архитектуру, читать документацию без переводчика, проходить интервью в FAANG и писать лаконичные письма коллегам. Отныне английский — это не барьер, а еще один язык программирования в вашем арсенале.	12	t	https://elbrusboot.camp/blog/content/images/2024/01/---------------IT--1-.png	2026-05-13 06:42:32.045582	2026-05-21 07:46:51.62227
\.


--
-- Data for Name: elective_enrollments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.elective_enrollments (id, "electiveId", "userId", status, "enrolledAt") FROM stdin;
1	6	1	cancelled	2026-06-04 23:21:39.998655
2	9	73	cancelled	2026-06-05 07:40:07.116687
\.


--
-- Data for Name: electives; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.electives (id, title, description, "imageUrl", "courseGroupId", "instructorId", "startDate", "endDate", "maxParticipants", "isActive", "createdAt", "updatedAt") FROM stdin;
1	PlatformIO: профессиональная среда для embedded-разработки	Установка и настройка PlatformIO. Структура проекта. Работа с библиотеками. Отладка кода. Поддержка разных платформ: Arduino, ESP32, STM32. Сравнение с Arduino IDE: плюсы и минусы. Миграция проектов.	\N	10	\N	2026-04-13 00:00:00	2026-05-04 23:59:00	\N	t	2026-05-21 17:57:29.20151	2026-05-21 18:05:49.762338
2	FreeRTOS на ESP32: многозадачность в embedded	Введение в RTOS. Задачи, очереди, семафоры, мьютексы. Создание многозадачного приложения. Практический проект: датчик + дисплей + сетевая отправка, работающие параллельно в разных задачах.	\N	10	\N	2026-06-08 00:00:00	2026-06-29 23:59:00	\N	t	2026-05-21 18:06:23.140007	2026-05-21 18:06:23.140007
3	English Pronunciation Workshop: звуки и интонация	Практический воркшоп по произношению. Трудные звуки (th, r, w, гласные), ударение, интонация. Скороговорки, упражнения на дикцию. Запись речи студентов и индивидуальный разбор ошибок. Для уровней A1–B1.	\N	11	\N	2025-09-15 00:00:00	2025-10-06 23:59:00	\N	t	2026-05-21 18:06:58.646993	2026-05-21 18:06:58.646993
4	Cross-Cultural Communication: как общаться с разными культурами	Особенности делового общения с представителями разных культур. Прямой и непрямой стиль. High-context vs low-context культуры. Разбор типичных ошибок. Для тех, кто работает в международных командах.	\N	12	\N	2026-01-19 00:00:00	2026-02-09 23:59:00	\N	t	2026-05-21 18:07:34.356161	2026-05-21 18:07:34.356161
5	Academic Publishing: как писать и публиковать статьи на английском	Структура научной статьи, выбор журнала, оформление references. Процесс peer review: как отвечать рецензентам. Практика: пишем abstract и introduction по своей теме. Для C1–C2.	\N	13	\N	2026-05-11 00:00:00	2026-06-01 23:59:00	\N	t	2026-05-21 18:08:00.959821	2026-05-21 18:08:00.959821
6	3D-печать корпусов для IoT-устройств	Основы 3D-моделирования в Tinkercad и Fusion 360. Проектирование корпуса с учётом датчиков и разъёмов. Подготовка к печати, слайсинг, обзор материалов. Итог — готовый корпус для вашего устройства.	\N	14	\N	2025-09-22 00:00:00	2025-10-13 23:59:00	\N	t	2026-05-21 18:08:32.628886	2026-05-21 18:08:32.628886
7	Визуализация IoT-данных в Grafana	Установка Grafana, подключение источников (InfluxDB, MQTT). Создание дашбордов: графики, gauges, heatmaps. Настройка алертов. Итог — красивый дашборд для ваших IoT-данных.	\N	15	\N	2026-01-26 00:00:00	2026-02-16 23:59:00	\N	t	2026-05-21 18:09:05.911416	2026-05-21 18:09:05.911416
8	TinyML: машинное обучение на микроконтроллерах	Обучение простой модели, конвертация в TensorFlow Lite for Microcontrollers, запуск на ESP32. Практика: распознавание жестов или звуковых событий. ML на границе сети.	\N	16	\N	2026-05-04 00:00:00	2026-05-25 23:59:00	\N	t	2026-05-21 18:09:38.834133	2026-05-21 18:09:38.834133
9	Python для решения алгоритмических задач	Быстрый старт в Python. Синтаксис, списки, словари, функции. Реализация алгоритмов курса на Python вместо псевдокода. Для тех, кто хочет не только понимать алгоритмы, но и кодить их.	\N	17	\N	2025-09-01 00:00:00	2025-09-22 23:59:00	\N	t	2026-05-21 18:10:08.89108	2026-05-21 18:10:08.89108
10	Linux для разработчика: командная строка и скрипты	Терминал Linux: навигация, файлы, права, процессы. Bash-скрипты: переменные, циклы, условия. Автоматизация задач. Практика на виртуальной машине. Must-have для будущего разработчика.	\N	18	\N	2026-01-05 00:00:00	2026-01-26 23:59:00	\N	t	2026-05-21 18:10:39.22236	2026-05-21 18:10:39.22236
11	Git и GitHub: контроль версий для проектов	Git: init, add, commit, branch, merge, rebase. GitHub: clone, push, pull, pull request. Решение конфликтов. Командная работа по Git-flow. Навык, необходимый каждому разработчику.	\N	19	\N	2026-04-06 00:00:00	2026-04-27 23:59:00	\N	t	2026-05-21 18:11:06.625907	2026-05-21 18:11:06.625907
\.


--
-- Data for Name: forum_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forum_posts (id, "topicId", "authorId", content, "isEdited", "createdAt", "updatedAt") FROM stdin;
2	2	13	В твоём бюджете — ANENG AN870 или ZOYI ZT-219. Оба с True RMS, автоотключением и подсветкой. True RMS тебе пока не критично, но пусть будет — вдруг синус несинусоидальный мерить придётся. Главное — НЕ покупай DT830B за 300₽, это инструмент самоубийцы. Я таким когда-то 220В мерил на прозвонке. До сих пор брови отращиваю.	f	2026-05-22 08:59:09.629044	2026-05-22 08:59:09.629044
5	2	8	спасибо! А что значит «на прозвонке 220В мерил»? Реально так нельзя? 😅	f	2026-05-22 09:02:25.205887	2026-05-22 09:02:25.205887
6	2	14	реально. Прозвонка — это режим измерения сопротивления. Если сунуть щупы в розетку в этом режиме, внутри что-то громко хлопнет, а мультиметр превратится в тыкву. Хорошо, если только мультиметр. У хороших приборов есть защита, у дешёвых — плавкий предохранитель размером с ресничку. Совет: перед каждым измерением смотри на положение ручки. Три раза.	f	2026-05-22 09:02:57.302162	2026-05-22 09:02:57.302162
7	2	8	Понял, принял, осознал. А ANENG AN870 на Aliexpress нормально брать или подделки есть?	f	2026-05-22 09:03:07.673481	2026-05-22 09:03:07.673481
10	2	13	У официального магазина ANENG — норм. У перекупов — может прийти без поверки. И докупи сразу нормальные щупы, родные — мусор, через месяц отвалятся. Бери с силиконовой изоляцией, типа этих: [ссылка]. И не благодари 😸	f	2026-05-22 09:04:53.514059	2026-05-22 09:04:53.514059
11	2	8	Всем спасибо! Заказал AN870 и щупы. Жду, скоро начну измерять всё подряд. Обещаю не лезть в розетку на прозвонке 😄	f	2026-05-22 09:05:08.445103	2026-05-22 09:05:08.445103
13	5	8	Всем привет!	t	2026-06-04 22:24:44.097699	2026-06-04 22:24:46.124
14	6	8	Всем привет!	f	2026-06-04 22:25:39.562975	2026-06-04 22:25:39.562975
15	4	8	Всем привет"	f	2026-06-04 22:27:56.113384	2026-06-04 22:27:56.113384
17	3	8	Всем привет	f	2026-06-04 22:34:53.887026	2026-06-04 22:34:53.887026
\.


--
-- Data for Name: forum_sections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forum_sections (id, "courseId", title, description, "orderIndex", "isActive", "createdAt") FROM stdin;
1	4	ЭлектроДвор	Дружеская свалка для тех, кто любит запах розетки утром. Схемы, компоненты, лайфхаки по пайке и мемы про индуктивности. Подключайся, только антипригарные коврики с собой!	0	t	2026-05-18 09:12:34.873282
2	7	Умный Хаос	Тут чайник спорит с холодильником, а ты пытаешься понять, почему датчик влажности ушёл в MQTT-брокер и не вернулся. ESP8266, Home Assistant, беспроводные протоколы и боль от китайских прошивок.	1	t	2026-05-21 08:09:11.268644
3	6	Биты и Байты	От булевой алгебры до багов в проде. Алгоритмы, структуры данных, архитектура ПК, операционные системы и вечный вопрос: «а почему это работает, если я ничего не менял?»	2	t	2026-05-21 08:10:10.281093
4	5	Language Overflow	Когда слов больше, чем нейронных связей для их использования. Разговорная практика, разбор кино/сериалов, подготовка к экзаменам, айтишный английский и взаимопомощь. No judgment, только прогресс!	3	t	2026-05-21 08:10:39.712375
\.


--
-- Data for Name: forum_topics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.forum_topics (id, "sectionId", "authorId", title, content, "isPinned", "isClosed", "viewsCount", "lastPostAt", "createdAt") FROM stdin;
5	1	15	Макетная плата vs перфорированная: на чём собирать прототипы?	Плюсы и минусы. Личный опыт: что удобнее для каких задач. Покажите свои стенды — у кого самый эпичный?	f	f	5	2026-06-04 22:24:44.105	2026-05-22 09:07:08.93374
6	1	8	Вопрос по схеме AND-OR	Как правильно соединить AND и OR для реализации функции?	f	f	8	2026-06-04 22:25:39.571	2026-05-22 12:05:56.295687
2	1	8	Мультиметр для новичка: какой выбрать и как не спалить?	Всем привет! Начинающий, только купил Arduino, теперь нужен мультиметр. Бюджет до 3000₽. Посоветуйте, что взять? И что там с True RMS — оно мне надо? А то читаю обзоры и голова кругом. Спасибо!	f	f	34	2026-06-09 10:02:08.784	2026-05-22 08:58:35.160002
4	1	14	Борьба с шумами и наводками в аналоговых схемах	Как вы разводите землю? Звезда или полигон? Экранирование, синфазные фильтры, питание. Делимся военными хитростями.	f	f	8	2026-06-04 22:27:56.117	2026-05-22 09:06:36.635732
3	1	13	Фильтры своими руками: активные vs пассивные	Что реально лучше для аудио, для датчиков, для радио? Личный опыт расчёта и сборки. Давайте схемы и графики АЧХ.	f	f	8	2026-06-04 22:34:53.89	2026-05-22 09:06:05.21263
\.


--
-- Data for Name: hackathon_grades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hackathon_grades (id, "submissionId", "judgeId", "innovationScore", "functionalityScore", "presentationScore", "teamworkScore", "totalScore", feedback, "judgingCriteriaScores", "judgedAt") FROM stdin;
\.


--
-- Data for Name: hackathon_stage_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hackathon_stage_submissions (id, stage_id, team_id, "projectUrl", note, "submittedAt", "updatedAt") FROM stdin;
2	4	1	-	-	2026-06-10 18:45:10.428547	2026-06-10 18:45:10.428547
\.


--
-- Data for Name: hackathon_stages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hackathon_stages (id, "hackathonId", title, description, "order", "startDate", "endDate", "createdAt") FROM stdin;
1	1	Концепция и архитектура	Команды формулируют идею, описывают сценарий использования, проектируют архитектуру системы: какие датчики, микроконтроллеры, протоколы связи и облачные сервисы будут использованы.	0	2026-01-12 06:00:00	2026-01-19 17:09:00	2026-05-21 18:21:06.159164
2	1	Прототипирование и код	Команды собирают прототип и пишут код: чтение датчиков, локальная индикация, передача данных в облако. Код должен быть загружен в GitHub-репозиторий команды.	1	2026-01-20 06:00:00	2026-02-01 17:09:00	2026-05-21 18:21:06.168632
3	1	Дашборд и финальная защита	Команды создают дашборд для визуализации данных, готовят финальную презентацию и защищают проект перед жюри.	2	2026-02-02 06:00:00	2026-02-08 17:09:00	2026-05-21 18:21:06.173679
4	2	Проектирование и сборка устройства	Команды проектируют схему, рассчитывают номиналы, собирают на макетной плате или паяют, настраивают и отлаживают. Доступны менторы по схемотехнике, измерительные приборы (осциллографы, генераторы, мультиметры).	0	2026-06-20 07:00:00	2026-06-21 07:00:00	2026-06-04 22:45:04.72565
5	2	Поверка и демонстрация	Команды демонстрируют работу схемы жюри, проводят измерения параметров на месте, отвечают на вопросы по схемотехнике.	1	2026-06-22 07:00:00	2026-06-22 07:00:00	2026-06-04 22:45:04.738355
\.


--
-- Data for Name: hackathon_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hackathon_submissions (id, "teamId", "circuitProjectId", "documentationUrl", "presentationUrl", "videoDemoUrl", "sourceCodeUrl", "archiveUrl", "submissionNote", "submittedAt") FROM stdin;
\.


--
-- Data for Name: hackathon_task_grades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hackathon_task_grades (id, task_id, team_id, reviewer_id, score, feedback, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: hackathon_task_reviewers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hackathon_task_reviewers (id, task_id, user_id, "assignedAt") FROM stdin;
\.


--
-- Data for Name: hackathon_tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hackathon_tasks (id, "stageId", title, description, "maxScore", "scoringCriteria", "order") FROM stdin;
1	1	Презентация концепции умного дома	Подготовьте презентацию (5–7 слайдов), описывающую: проблему, которую решает система; сценарий использования; схему архитектуры (устройства, протоколы, облако); распределение ролей в команде.	100	Чёткость формулировки проблемы (20 баллов), реалистичность сценария (20 баллов), проработанность архитектуры (30 баллов), качество презентации (20 баллов), распределение ролей (10 баллов).	0
2	1	Схема подключения компонентов	Нарисуйте детальную схему подключения всех компонентов: датчики, микроконтроллер, дисплеи, реле. Укажите пины, питание, интерфейсы (I²C, SPI, GPIO).	100	Полнота схемы (30 баллов), корректность подключения (30 баллов), учёт питания (20 баллов), читаемость и оформление (20 баллов).	1
3	2	Код прошивки микроконтроллера	Напишите и загрузите код прошивки: чтение минимум 2 датчиков, вывод на дисплей, передача данных по MQTT или HTTP. Код должен быть хорошо прокомментирован.	100	Работоспособность (40 баллов), качество кода (25 баллов), комментарии и документация (20 баллов), обработка ошибок (15 баллов).	0
4	2	Видео демонстрации прототипа	Запишите видео (2–4 минуты), демонстрирующее: собранное устройство, работу датчиков в реальном времени, передачу данных (Serial Monitor или дашборд), реакцию системы на изменение параметров.	100	Наглядность демонстрации (30 баллов), соответствие заявленной концепции (30 баллов), качество видео (20 баллов), комментарии в видео (20 баллов).	1
5	3	Дашборд в Grafana или облачной платформе	Создайте дашборд для визуализации данных с вашего устройства. Минимум 3 панели (график, gauge, таблица). Дашборд должен обновляться в реальном времени. Приложите скриншоты и JSON-модель.	100	Функциональность дашборда (35 баллов), дизайн и читаемость (25 баллов), обновление в реальном времени (20 баллов), наличие алертов (20 баллов).	0
6	3	Финальная презентация и защита	Подготовьте финальную презентацию (7–10 слайдов). Опишите: проблему, решение, архитектуру, демонстрацию работы, возникшие трудности и пути их решения, возможности масштабирования.	100	Полнота описания проекта (25 баллов), качество демонстрации (25 баллов), анализ трудностей и решений (20 баллов), перспективы масштабирования (15 баллов), качество выступления (15 баллов).	1
7	4	Разработка усилителя низкой частоты	Спроектируйте и соберите двухкаскадный усилитель НЧ на биполярных транзисторах или операционном усилителе с выходным каскадом. Усилитель должен работать на нагрузке 8 Ом (динамик), иметь регулировку громкости, вход для сигнала с телефона или генератора. Напряжение питания — не более ±15 В или однополярное 12 В.	100	Работоспособность и чистота звука (30), расчёт номиналов и обоснование схемы (20), качество монтажа и пайки (15), измеренные параметры (коэффициент усиления, полоса частот) (20), документация (15)	0
8	4	Линейный стабилизатор с регулировкой	Соберите регулируемый источник питания с входом 220 В через готовый трансформатор (предоставляется организаторами) или с входом 12 В постоянного тока. Выход: стабильное напряжение 1,5–12 В с регулировкой, ток до 1 А, индикация на светодиодах или цифровом вольтметре. Защита от короткого замыкания — приветствуется.	100	Стабильность выходного напряжения (25), диапазон регулировки (15), качество монтажа (15), наличие защитных функций (20), измерения пульсаций и КПД (15), документация (10)	1
9	4	Функциональный генератор на дискретных элементах	Разработайте генератор, выдающий хотя бы два типа сигналов: синусоидальный и прямоугольный. Частота регулируется потенциометром в диапазоне 100 Гц – 10 кГц. Амплитуда — до 5 В. Допустимо использование микросхемы таймера 555, операционных усилителей, RC-цепей.	100	Форма сигналов на осциллографе (30), диапазон и линейность регулировки частоты (20), стабильность амплитуды (15), качество схемы и монтажа (15), измерения и документация (20)	2
10	5	Демонстрация и поверка параметров	Покажите работу устройства на осциллографе и мультиметре. Продемонстрируйте заявленные параметры: коэффициент усиления, частоту, напряжение, форму сигнала. Объясните, как работает схема, укажите узкие места и возможности улучшения.	100	Совпадение заявленных и измеренных параметров (30), глубина понимания схемы (25), качество проведения измерений (20), ответы на вопросы (15), презентация (10)	0
\.


--
-- Data for Name: hackathon_team_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hackathon_team_members (id, "teamId", "userId", role, "joinedAt") FROM stdin;
1	1	1	leader	2026-06-04 23:39:25.285827
\.


--
-- Data for Name: hackathon_teams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hackathon_teams (id, name, "hackathonId", "leaderId", "projectName", "projectDescription", status, "createdAt") FROM stdin;
1	цкк	2	1	цук	цук	forming	2026-06-04 23:39:25.28089
\.


--
-- Data for Name: hackathons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hackathons (id, "courseId", title, description, theme, "startDate", "endDate", "registrationDeadline", "maxTeamSize", "minTeamSize", "prizePool", "isActive", "judgingCriteria", "createdAt", rules) FROM stdin;
1	\N	IoT Challenge: Умный дом	Хакатон для студентов направлений IoT и Электроника. За 2 недели участники проектируют и прототипируют систему умного дома: сбор данных с датчиков, передача в облако, визуализация и автоматизация. Можно использовать ESP32, Arduino, Raspberry Pi, облачные платформы (ThingSpeak, Blynk) и open-source решения.\n\nФормат: онлайн, командный (2–5 человек). Участники получают задания поэтапно. Победители определяются по сумме баллов за все этапы. Работы оценивают менторы по заранее объявленным критериям.	IoT, Умный дом, Embedded	2026-01-12 06:00:00	2026-02-08 17:09:00	2026-01-11 17:09:00	5	2	15000.00	f	\N	2026-05-21 18:21:06.152362	Участвовать могут студенты групп Connected Devices, Data Stream, Edge & Fog, Базовые цепи, Аналоговый мир, Микроконтроллерная.\n\nКоманда обязана использовать систему контроля версий (GitHub), репозиторий должен быть публичным.\n\nКод должен быть оригинальным, заимствования из открытых источников допустимы с указанием авторства.\n\nЗапрещено копировать работы других команд.\n\nВсе работы сдаются через загрузку на платформу (код, схемы, видео демонстрации).\n\nСроки этапов строгие, опоздания не принимаются.
2	\N	ElectroHack 2026	48-часовой хакатон по разработке аппаратно-программных решений. Участники проектируют и собирают электронные устройства на базе микроконтроллеров, сенсоров и модулей связи. Тематика: IoT-устройства, системы автоматизации, wearable-электроника, робототехника. Формат включает этап проектирования схем, пайку прототипа, программирование прошивки и финальную демонстрацию работающего устройства. Организаторы предоставляют базовый набор компонентов, паяльное оборудование и измерительные приборы.	Электроника и embedded-системы	2026-06-20 07:00:00	2026-06-22 07:00:00	2026-06-15 17:09:00	5	2	10.00	t	\N	2026-06-04 22:45:04.709175	Участники: студенты технических специальностей (радиотехника, электроника, робототехника, ИТ), а также самоучки и хобби-инженеры. Возраст 18–30 лет.\nКоманда: 2–4 человека. Обязательно наличие хотя бы одного участника с опытом пайки или программирования микроконтроллеров.\nОборудование: базовый набор компонентов выдаётся организаторами (Arduino/STM32, сенсоры, макетные платы, провода, элементы питания). Разрешён свой инструмент и дополнительные модули (нужно декларировать при регистрации).\nЗапрещено: приносить заранее собранные платы или готовые прошивки. Все схемы и код пишутся в рамках хакатона. Запрещено использование готовых коммерческих модулей «в корпусе» без доработки.\nТребования к результату: работающий прототип устройства, схема подключения (фото/чертёж), исходный код прошивки на GitHub, краткая документация (README с описанием, фото/видео демо).\nБезопасность: обязательное использование защитных очков при пайке, запрет на работу с сетевым напряжением 220В, организаторы проводят инструктаж.\nИнтеллектуальная собственность: устройства и код остаются у команд. Организаторы вправе фотографировать прототипы для отчётности.
\.


--
-- Data for Name: internship_applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.internship_applications (id, "userId", "internshipId", "appliedAt", comment) FROM stdin;
1	1	1	2026-06-01 00:03:30.965173	Уважаемые коллеги, прошу рассмотреть мою кандидатуру на позицию IoT-разработчика. Имею опыт работы с ESP32 и протоколом MQTT в рамках учебных проектов.
35	1	37	2026-06-04 23:37:57.644029	\N
36	1	52	2026-06-10 18:46:51.200644	\N
37	1	61	2026-06-10 18:47:11.395278	\N
\.


--
-- Data for Name: internship_views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.internship_views (id, "userId", "internshipId", "viewedAt", "viewCount") FROM stdin;
1	1	37	2026-05-31 21:56:33.344327	3
2	1	59	2026-06-08 11:36:27.842113	1
3	1	61	2026-06-08 11:42:49.327782	3
4	1	52	2026-06-10 18:46:47.695884	4
\.


--
-- Data for Name: internships; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.internships (id, title, company, "companyDescription", description, requirements, prospects, location, format, duration, salary, "applicationEmail", "applicationUrl", "imageUrl", "isActive", deadline, tags, "externalId", source, "createdAt", "updatedAt") FROM stdin;
1	Senior Independent Software Developer	A.Team	\N	You must be located in the Americas, Europe, or Israel to apply. A·Team is a VC-backed, stealth, application-only home on the internet for senior independent software builders to team up with hand-picked, high-growth companies on their next big thing. After talking with hundreds of independent engineers, designers, and product folks, we heard over and over that finding vetted, high-quality, consistent clients is hard, and projects are often too small to be rewarding. A·Team matches small teams of the most talented builders in the world with companies backed by a16z, YC, Softbank, General Catalyst, etc. on a contract basis for many of their most important initiatives. We quietly launched in May 2020, and have helped A·Teamers earn $85+ million since. As part of A·Team, you can expect: High-paying, meaningful missions with the most audacious companies sent your way; generally $90-$150+/hr, with vetted, fascinating clients doing work that matters. We're picky about who we partner with; new clients only come in via trusted referral. We've worked with Lyft, McGraw Hill, ClearCo, Pepsi, Walmart, the former CEO of Waze, the leading vaccine production software, several new unicorns we can't say here, and dozens of startups backed by a16z/YC/Softbank/Insight/Tiger/etc. Work alongside friends old &amp; new: our niche is small/diverse product teams, since clients with larger budgets and higher-impact work tell us they want teams, not individuals. Of course, we keep friends together whenever we can. Full autonomy: say "no" to things that don't excite you. The most talented builders often juggle a few things at once, so there's never pressure to join an A·Team mission if you don't have the bandwidth. If we're no longer a fit, it's easy to leave or pause too. Small, curated, off-the-record gatherings: for conversations hard to have elsewhere. Long-term, we're creating micro-communities for the world's top builders to become friends around the things they care about. Keep 100% of 	\N	\N	Americas, Europe, Israel	remote	\N	$90 - $150 /hour	\N	https://remotive.com/remote-jobs/software-development/senior-independent-software-developer-1919265	https://remotive.com/job/1919265/logo	t	\N	["go", "wordpress", "chat", "apple", "testing", "catalyst"]	\N	\N	2026-05-18 12:31:19.69266	2026-05-18 12:31:19.69266
2	Senior Independent AI Engineer / Architect	A.Team	\N	Location: Americas, Europe, or Israel The Opportunity Join A.Team’s invite-only network of senior builders and access exclusive missions with Fortune 500s and top startups. This isn’t client work or employment—it’s a vetted collective where you’re matched to impactful projects. At A.Team, you won’t just implement someone else’s plan. You’ll be the technical decision-maker, owning everything from model design to enterprise integration. Why A.Team Elite peers : ex-OpenAI, Google, Meta, Amazon. Precision matching : Missions in LLMs, CV, NLP, ML infra, fine-tuning. Compensation : $120–$170/hr, biweekly payouts, you keep 100%. Autonomy : Choose only missions that excite you—no small gigs, no chasing. What You’ll Do Lead the design, deployment, and scaling of production AI systems. Build ambitious software 0→1 in small, senior teams (3–5 people). Scope, propose, and execute solutions with real ownership. Partner with founders, CTOs, and product leaders to deliver outcomes that matter. Who Thrives Here Senior AI/ML Engineers with production systems live. AI Architects who’ve built enterprise AI stacks. Tech Leaders balancing architecture with business outcomes. Specialists in LLMs, CV, NLP, or infra with proven depth. Not a fit : under 4 years’ experience, simple website builders, or small gig seekers. Proof in the Network Your peers have scaled apps to millions, built enterprise AI platforms, shipped AI at unicorns, and deployed infra handling billions/day. How to Apply Apply once at build.a.team/apply-ai . Short, rigorous process—we care more about what you’ve built than lengthy forms.	\N	\N	Americas, Europe, Israel	remote	\N	$120 - $170 /hour	\N	https://remotive.com/remote-jobs/software-development/senior-independent-ai-engineer-architect-1919266	https://remotive.com/job/1919266/logo	t	\N	["go", "UI/UX", "wordpress", "chat", "apple", "testing"]	\N	\N	2026-05-18 12:31:19.765227	2026-05-18 12:31:19.765227
3	Senior Full-stack React Developer	Lemon.io	\N	Are you a talented Senior Developer looking for a remote job that lets you show your skills and get decent compensation? Look no further than Lemon.io — the marketplace that connects you with hand-picked startups in the US and Europe. What we offer: The rate depends on your seniority level, skills and experience. We've already paid out over $11M to our engineers. No more hunting for clients or negotiating rates — let us handle the business side of things so you can focus on what you do best. We'll manually find the best project for you according to your skills and preferences. Choose a schedule that works best for you. It’s possible to communicate async or minimally overlap within team working hours. We respect your seniority so you can expect no micromanagement or screen trackers. Communicate directly with the clients. Most of them have technical backgrounds. Sounds good, yeah? We will support you from the time you submit the application throughout all cooperation stages. Most of our projects involve working in a fast-paced startup environment. We hope you like it as much as we do. Through our community, we will connect you with the best developers from more than 71 countries. We have several open positions for Full-Stack React.js Developers - please see the details below. We also have some backend positions; the full list is included below as well. Requirements for the Senior React &amp; Python Position: 4+ years of software development experience Commercial experience: React.js 3+ years and Python 3+ years OR React.js 2+ years and Python 5+ years OR React.js 5+ years and Python 2+ years Experience with AWS, GCP, or Azure is required Requirements for the Senior Python Position: 5+ years of software development experience 5+ years of commercial experience with Python 3+ years of commercial experience with Flask Requirements for the Senior Golang &amp; React Position: 4+ years of software development experience React.js 3+ years and Golang 3+ years OR React.js 2+ ye	\N	\N	Americas, Europe, Asia, Oceania	remote	\N	\N	\N	https://remotive.com/remote-jobs/software-development/senior-full-stack-react-developer-2088711	https://remotive.com/job/2088711/logo	t	\N	[".Net", "android", "AWS", "azure", "backend", "C"]	\N	\N	2026-05-18 12:31:19.820612	2026-05-18 12:31:19.820612
4	Marketing Manager, Content & AI Enablement	Expion Health	\N	Title : Marketing Manager, Content &amp; AI Enablement Location : Fully Remote Reports To: VP, Marketing &amp; Communications Pharmacy benefit management is a $500B+ industry most people have never heard of — but it has a major impact on how prescription drugs are priced, accessed, and paid for. Expion Health is at the forefront of changing how that system works. We sit at the intersection of data, technology, and pharmacy economics, helping clients stay ahead of a rapidly evolving market. We are also in the middle of a company-wide AI transformation, with teams across the business rethinking how work gets done. The Role We are looking for a Marketing Manager, Content &amp; AI Enablement to help our marketing team create stronger work faster by combining AI ingenuity with marketing fundamentals. This is not a role for someone who wants to use AI around the edges. It is for someone who wants to help build a more modern, faster, smarter marketing function from the inside. You do not need to be a professional copywriter, designer, developer, or digital media expert. But you do need to know what strong marketing looks like: clear writing, sharp messaging, smart design, audience relevance, brand consistency, and content that actually gets people to pay attention. You should already be using AI tools beyond basic experimentation. You are not just asking ChatGPT for a caption once in a while. You are using AI to draft, edit, ideate, summarize, repurpose, design, produce, test, and improve how work gets done. You are curious about what comes next: smarter prompts, reusable workflows, AI skills, agents, automations, AI-assisted video creation, presentation development, and content systems that make marketing faster and better. Most importantly, you are leaning into how AI can evolve marketing. You are not scared of new tools. You are curious, hands-on, self-directed, and excited to figure things out. What You’ll Do Enhance Creative Excellence and Marketing Content Production	\N	\N	USA	remote	\N	$75k - $95k	\N	https://remotive.com/remote-jobs/marketing/marketing-manager-content-ai-enablement-2090883	https://remotive.com/job/2090883/logo	t	\N	["react", "seo", "video", "AI/ML", "product marketing", "project management"]	\N	\N	2026-05-18 12:31:19.876143	2026-05-18 12:31:19.876143
5	Tech Lead Full-Stack Rails Engineer	Mitre Media	\N	About Mitre Media Mitre Media is redefining FinTech with AI-driven tools that empower millions of investors. Our portfolio, including Dividend.com and MutualFunds.com, leverages LLMs to deliver novel data insights and visually rich user experiences. For over a decade, we’ve served individual investors, financial advisors, and top asset managers like BlackRock and Vanguard through our premium data, tools, and advertising solutions. Join our lean, entrepreneurial team to shape the future of AI-powered investing from your location ±3 hours from Eastern Time. Our users are deeply engaged, spending over 5 minutes per visit with a bounce rate below 10%, researching investments across hundreds of different categories. With 40 million brokerage accounts in the U.S., we take pride in building tools that make a real impact, fostering a culture of trust, innovation, and dynamism. If you’re passionate about financial technology and AI, we’d love to connect! About the Role As a Full-Stack Rails Tech Lead, you’ll architect and implement LLM-powered web applications within our microservices-based Rails 8 platform. Reporting directly to our CTO, you’ll collaborate with a small, high-impact team to deliver user experiences across Dividend.com, MutualFunds.com and other brands within our portfolio. This role combines expert Ruby on Rails skills with AI integration expertise, requiring you to leverage LLMs in your development workflow, state management and user interactions. You’ll work in a remote-first hybrid environment, which encourages in person collaboration, using ShapeUp to manage projects that trade-off on-time delivery for de-scoped outcomes. As a technical leader, you'll have a seat at the table shaping system architecture, implementing core features all while embracing an entrepreneurial mindset and a “get things done” mentality. Responsibilities Architect and maintain Rails applications (Rails 8) Integrate LLMs into our microservices architecture for state management and 	\N	\N	USA, Canada, USA timezones	remote	\N	$170k - $200k	\N	https://remotive.com/remote-jobs/software-development/tech-lead-full-stack-rails-engineer-2069746	https://remotive.com/job/2069746/logo	t	\N	["api", "CSS", "docker", "elasticsearch", "fullstack", "html"]	\N	\N	2026-05-18 12:31:19.928894	2026-05-18 12:31:19.928894
6	Business Transformation Lead	Expion Health	\N	Title : Business Transformation Lead Location : Fully Remote Reports To : President, Service &amp; Growth Expion Health is building the future of pharmacy economics. As architects of prescription economics, we design how pharmacy value is created, aligning cost, clinical decisions, and performance into one accountable system that moves beyond rebates. We help organizations stay ahead of pharmacy market change with clear insight, bold thinking, and strategies built for what's next-leading the next era of prescription economics. The Role As our Business Transformation Lead , you'll be the architect and driver of how we embed AI into the way every team in our company works. This isn't a slide-deck strategy role. You'll be on the ground with department leaders, identifying real workflow opportunities, turning them into real solutions, and building the internal capability that makes the transformation stick. You'll lead our AI Champions program, partner directly with executive leadership, and own the roadmap that takes Expion Health from an organization that uses AI tools to one that runs on AI intelligence. If you've spent time figuring out how to make AI work in the real world - not just in theory - and you want to do it at a company that's fast, innovative, and genuinely committed to this, this role was built for you. What You'll Own Drive Transformation (65%) Own the AI transformation roadmap end-to-end - from strategy to execution - and keep it moving in a fast-paced environment Run discovery sessions with department leaders across Sales, Client Management, Clinical, Finance, Operations, IT, and Trade to surface high-impact AI opportunities Design and lead our AI Champions program - recruiting, training, and developing a network of department-level AI advocates across the organization Build and deliver role-based AI learning pathways tailored to the specific needs of each department Partner with the executive team to ensure AI initiatives are prioritized, resourced,	\N	\N	USA	remote	\N	$175k - $225k	\N	https://remotive.com/remote-jobs/artificial-intelligence/business-transformation-lead-2090881	https://remotive.com/job/2090881/logo	t	\N	["api", "AI/ML", "automation", "healthcare", "spark", "startup"]	\N	\N	2026-05-18 12:31:19.984062	2026-05-18 12:31:19.984062
7	Office Assistant	Coalition Technologies 	\N	WHY YOU SHOULD APPLY: Coalition Technologies is devoted to delivering clients the highest quality work while providing our team a fun, thriving, and innovative environment. Along with the opportunity for tremendous career growth and rapid advancement, CT offers: The most competitive profit-sharing bonus plan in the industry, paying up to 50% of company profits to full-time employees each month! A highly competitive Paid Time Off plan, promoting quality work-life balance. Subsidized gym memberships to help team members feel their best. Medical, dental, vision, and life insurance packages for all US-based team members. International Health Insurance Reimbursement Program for all international team members, a benefit unique to Coalition. Device upgrade and learning reimbursement programs. Motivating career development plans with clearly defined goals and rewards. Additional job-specific incentives and bonuses. Plus, 100% of our team works remotely with the support of time tracking software. Our company culture specializes in supporting remote team members, and we’ve been doing so for more than a decade. CT welcomes your application, wherever in the world it's coming from! YOU SHOULD HAVE: Willingness to learn, grow, and collaborate with the team and company as a whole. Excellent verbal and written communication skills. A high level of discretion, ethics, and trustworthiness. Intermediate spreadsheet skills (preferred) Innovative thinking and a willingness to challenge existing methods where improvement is possible. Experience in bookkeeping / financial record keeping (preferred). Experience with Google Sheets or Excel, Quickbooks Online, and G-Suite (preferred). The availability to work 40 hours per week from 9:00 am to 6:00 pm PST. A reliable space to work remotely with a fast computer, quality internet, camera, microphone, and speakers. YOUR DUTIES AND TASKS: Answering phones and emails. Completing entry-level bookkeeping, including recording expenses, organizing rec	\N	\N	Worldwide	remote	\N	$31,2k- $52k	\N	https://remotive.com/remote-jobs/marketing/office-assistant-1680495	https://remotive.com/job/1680495/logo	t	\N	["CSS", "excel", "frontend", "git", "html", "illustrator"]	\N	\N	2026-05-18 12:31:20.035934	2026-05-18 12:31:20.035934
8	Director of Revenue Systems and AI Automation (Offshore) 	Caul Group	\N	This search is open exclusively to candidates based in Latin America. Preference for Uruguay, Costa Rica, or Colombia. BACKGROUND CONTEXT Every department at Caul Group is generating AI and automation ideas faster than they can be built. This role turns those ideas into operational reality — and finds the ones nobody thought to ask about yet. You are not advising. You are not consulting. You own the systems layer of this business and make it faster, cleaner, and more profitable — auditing what we have, identifying what is broken, redundant, or missing, and building the infrastructure that fixes it permanently. This is a deeply technical, execution-focused role for someone who thinks in system connections. When someone says "our Google LSA leads are not showing up correctly in Follow Up Boss," you trace the integration chain, find where the handoff failed, and build the fix. You do not wait to be asked. Your primary collaborators: the Founder, the Broker in Charge, the Director of Marketing, and the Founder's Chief of Staff. The defining partnership is with the Director of Marketing. They own creative, campaigns, and the team. You own the infrastructure — attribution architecture, lead pipeline connections, systems tracking what works from first ad impression through closed transaction. They read the output. You build and tune the machine. If you worked here last week, you might have: Scoped and deployed a Zapier integration between Follow Up Boss and ClickFunnels so new leads from Ylopo automatically get tagged, assigned, and entered into the correct pipeline, eliminating the daily manual lead routing the team was doing every morning and stopping revenue from falling through the cracks Built an automated coaching intelligence system that pulls agent call data from Follow Up Boss, breaks it down by agent, and delivers a weekly report to each coach using Claude to analyze call patterns, flag agents avoiding follow-ups, identify cold databases, and surface conversion g	\N	\N	LATAM	remote	\N	$60k–$72k	\N	https://remotive.com/remote-jobs/artificial-intelligence/director-of-revenue-systems-and-ai-automation-offshore-2090878	https://remotive.com/job/2090878/logo	t	\N	["api", "AI/ML", "automation", "documentation", "CRM", "analytics"]	\N	\N	2026-05-18 12:31:20.091884	2026-05-18 12:31:20.091884
9	iOS Developer	nooro	\N	WHO ARE WE? At nooro, we're revolutionizing pain management for seniors. Our platform is transforming how older adults engage with pain management at home. We're on a mission to make wellness more accessible and effective through technology. Check our website here: https://nooro-us.com/ We're a fast-moving startup that works on quick iteration and bold decisions. Our team is lean, agile, and empowered to make meaningful impacts daily. If you enjoy a dynamic environment where ideas become a reality at lightning speed and you're not afraid to wear multiple hats, you'll fit right in. WHAT WILL YOU DO? - Own and drive the development of our iOS application - Build elegant, performant features using **Swift (We’re 100% Swift!)** and **SwiftUI** - Implement complex UI/UX designs from **Figma** with pixel-perfect accuracy - Ensure app performance, quality, and responsiveness - Collaborate with our backend team on API integration - Write clean, modular, and reusable code - Participate in code reviews and architectural decisions - Help shape our mobile development practices HOW TO APPLY? If you believe we're the right fit, please fill in this form: https://forms.gle/xeL6pPbdjMHo11A28 WHAT ARE THE REQUIREMENTS? - 5+ years of professional iOS development experience - Strong expertise in Swift and SwiftUI - Deep understanding of iOS platform capabilities and limitations - Experience with iOS app architecture (MVVM preferred) - Experience with Core Data and local storage solutions - Proficiency in making RESTful API calls and handling responses - Experience with dependency injection on iOS - Strong version control skills with Git/GitHub - Experience with App Store deployment and TestFlight - Knowledge of iOS security best practices APPLYING PROCESS STEP 1 | QUESTIONNAIRE: If you believe we're the right fit, please fill in this form: https://forms.gle/xeL6pPbdjMHo11A28 STEP 2 | TEST: Once we review your form submission, we will send you a test STEP 3 | TECHNICAL INTERVIEW: Once w	\N	\N	USA	remote	\N	$60k-$130k (depending on experience)	\N	https://remotive.com/remote-jobs/software-development/ios-developer-1956455	https://remotive.com/job/1956455/logo	t	\N	["api", "backend", "git", "ios", "security", "swift"]	\N	\N	2026-05-18 12:31:20.144347	2026-05-18 12:31:20.144347
10	Inside Sales Contractor	Credit Wellness, LLC	\N	About Us We are a financial services start up focusing on helping to improve consumer credit profiles. We are currently seeking KPI driven sales representatives looking to earn up to 45K in their first year while working remotely. We offer comprehensive training and continuous sales coaching to help you meet your financial goals. During our training period we offer a guaranteed training stipend while our trainees are acclimating to the position (*see weekly pay below). If you are a seasoned sales professional looking for the autonomy of a remote position combined with great compensation, we want to hear from you! Compensation Structure This role is 100% commission-based , which means your earning potential is unlimited. In addition, we regularly offer competitive performance-based bonuses to reward hard work and results. Training Period (Weeks 1–4) We invest in your success and want to make sure you’re supported as you get up to speed: Week 1: Commission-only (a chance to start earning right away while learning the ropes). Weeks 2–4: Guaranteed training stipend of $1,000 total – or your commission if it’s higher. You’ll always receive whichever amount benefits you most. Week 2: $250 guaranteed minimum Week 3: $325 guaranteed minimum Week 4: $425 guaranteed minimum By the end of training, you’ll have the skills to maximize commissions, with the safety net of a guaranteed base during your ramp-up period. Post Training Period: Average first year OTE: 25K-35K (US) Annually Top Rep first year OTE: 35K-45K (US) Annually *The above is the average pay you can expect, however, there is unlimited earning potential for those who are financially motivated top performers looking to exceed sales targets. What will you be doing? Educating inbound callers on their credit standing by providing consultations with the goal of enrolling them in one of our services should they be a good fit. We are looking for team members who are: Tech savvy with the ability to navigate digital tools s	\N	\N	Worldwide	remote	\N	OTE $25k - $35k	\N	https://remotive.com/remote-jobs/sales/inside-sales-contractor-2086540	https://remotive.com/job/2086540/logo	t	\N	["CRM", "google sheets", "financial services", "Inside Sales"]	\N	\N	2026-05-18 12:31:20.200669	2026-05-18 12:31:20.200669
11	Freelance Writer	IAPWE	\N	Our organization is seeking content writers to create articles and blog posts on a variety of topics. The rate of pay is $20 per 100 words (this comes out to approximately $100 per article or $50 per hour). Some topics you may be asked to write about include the following (you can always turn down a topic if you do not feel comfortable writing about it, however if you have experience or expertise in a specific area, please let us know): Health &amp; beauty Fitness Home Decor Fashion Sports Do it yourself Finance Legal Medical Family/Parenting Relationships Real Estate Restaurants Contracting (plumbing, pool building, remodeling, etc.) These are just some of the more general industries and topics that we cover. Requirements : We ask that all work be completed using a word processor such as Microsoft Word or Open Office A reliable internet connection and the ability to meet deadlines Good communication skills and respond in a timely manner to editorial staff when they ask for updates on tasks, etc Work well as a team member with the rest of our content management and editorial staff Note : Applicants to this job signaled that accessing some writing tasks may require payment.	\N	\N	Worldwide	remote	\N	$50-$75 /hour	\N	https://remotive.com/remote-jobs/writing/freelance-writer-1185979	https://remotive.com/job/1185979/logo	t	\N	["REST"]	\N	\N	2026-05-18 12:31:20.253006	2026-05-18 12:31:20.253006
12	🇩🇪Customer Support Manager	Parkosecure GmbH	\N	🇩🇪 This job ad is written in German. 🇩🇪 Die Parkosecure GmbH ist ein innovatives Unternehmen im Bereich Parkraummanagement in der Schweiz. Für die Betreuung unserer Kunden in der französischen Schweiz suchen wir eine zuverlässige und selbständig arbeitende Persönlichkeit im 100% Remote-Modell. Du arbeitest vollständig ortsunabhängig und bist die zentrale Ansprechperson für unsere französischsprachigen Kunden. Vos missions Bearbeitung von Kundenanfragen per Telefon und E-Mail Professionelle Behandlung von Kundenreaktionen und Einsprachen Unterstützung im administrativen Bereich Mitarbeit bei Projekten (bei vorhandenen Ressourcen) Sicherstellung einer hohen Kundenzufriedenheit Vos compétences Französisch Muttersprache (zwingend) Sehr gute schriftliche und mündliche Ausdrucksweise Deutsch und oder Englisch von Vorteil Erfahrung im Kundendienst oder Administration Sehr gute EDV Kenntnisse (MS Office zwingend) Selbständige, strukturierte Arbeitsweise Belastbar und lösungsorientiert Avantages 100% Remote Arbeit weltweit möglich Flexible Arbeitsgestaltung Dynamisches wachsendes Unternehmen Möglichkeit zur Weiterentwicklung Direkter Einfluss auf Prozesse und Kundenzufriedenheit 5 Wochen Ferien Fixer, überdurchschnittlicher Lohn (kein Bonus, keine Provision) Wir bieten dir eine stabile und verantwortungsvolle Tätigkeit in einem wachsenden Unternehmen, in dem deine Arbeit geschätzt wird. Du arbeitest selbständig, bist Teil eines engagierten Teams und übernimmst eine wichtige Rolle in der Betreuung unserer französischsprachigen Kunden. Wenn du zuverlässig bist, gerne Verantwortung übernimmst und Wert auf eine langfristige Zusammenarbeit legst, freuen wir uns darauf, dich kennenzulernen.	\N	\N	Switzerland	remote	\N	\N	\N	https://remotive.com/remote-jobs/customer-service/customer-support-manager-2090874	https://remotive.com/job/2090874/logo	t	\N	["MS Office"]	\N	\N	2026-05-18 12:31:20.304132	2026-05-18 12:31:20.304132
13	Copywriter	Coalition Technologies 	\N	WHO WE'RE LOOKING FOR The ideal copywriter has excellent English writing skills and is excited to write high-quality, SEO-driven content that aligns with detailed, client-specific guidelines. Projects most commonly include writing web pages for eCommerce and lead generation business sites such as category pages, product descriptions, and blog posts. Our clientele is constantly evolving. We produce content for these and many other industry verticals: Fashion (both mass-market and luxury) Skincare &amp; Beauty Tech &amp; Software** Finance &amp; Investing** Law (family law, product liability, divorce, etc.)** Education Home Improvement Automobiles &amp; Motorcycles (OEM and aftermarket accessories) Health and Wellness** Medical / Clinical** Digital Marketing SEO / PR / Advertising / Marketing** **Writers with a background in these highly specialized fields are strongly encouraged to apply. The ideal candidate for this position is a multifaceted technical and creative writer with at least two to four years of professional, non-academic experience. Candidates should understand how to write content that effortlessly blends SEO best practices and brand priorities for finished work that’s engaging, creative, and ROI-driven. Candidates should also be willing and able to complete careful research in order to gain a strong understanding of various industries. Candidates should be prepared to provide portfolios featuring published work. Once an offer has been extended, writers will be asked to take a brief training course. Compensation Writers are paid on a per-word basis. The rate is assessed according to our KPI rubric (key performance indicators) with an automatic raise after 400 and 800 pages have gone live on our client's websites. Initial compensation is up to $0.06 per word with $0.034 per word being the most typical compensation level. This is $30 or $17 per page of 500 words. After 400 pages live, the top marginal rate increases to $0.064 per word with the most typica	\N	\N	Worldwide	remote	\N	$20k -$35k	\N	https://remotive.com/remote-jobs/writing/copywriter-1749306	https://remotive.com/job/1749306/logo	t	\N	["accounting", "excel", "research", "data analysis", "bookkeeping", "google sheets"]	\N	\N	2026-05-18 12:31:20.356761	2026-05-18 12:31:20.356761
32	Copywriter	Coalition Technologies 	\N	WHO WE'RE LOOKING FOR The ideal copywriter has excellent English writing skills and is excited to write high-quality, SEO-driven content that aligns with detailed, client-specific guidelines. Projects most commonly include writing web pages for eCommerce and lead generation business sites such as category pages, product descriptions, and blog posts. Our clientele is constantly evolving. We produce content for these and many other industry verticals: Fashion (both mass-market and luxury) Skincare &amp; Beauty Tech &amp; Software** Finance &amp; Investing** Law (family law, product liability, divorce, etc.)** Education Home Improvement Automobiles &amp; Motorcycles (OEM and aftermarket accessories) Health and Wellness** Medical / Clinical** Digital Marketing SEO / PR / Advertising / Marketing** **Writers with a background in these highly specialized fields are strongly encouraged to apply. The ideal candidate for this position is a multifaceted technical and creative writer with at least two to four years of professional, non-academic experience. Candidates should understand how to write content that effortlessly blends SEO best practices and brand priorities for finished work that’s engaging, creative, and ROI-driven. Candidates should also be willing and able to complete careful research in order to gain a strong understanding of various industries. Candidates should be prepared to provide portfolios featuring published work. Once an offer has been extended, writers will be asked to take a brief training course. Compensation Writers are paid on a per-word basis. The rate is assessed according to our KPI rubric (key performance indicators) with an automatic raise after 400 and 800 pages have gone live on our client's websites. Initial compensation is up to $0.06 per word with $0.034 per word being the most typical compensation level. This is $30 or $17 per page of 500 words. After 400 pages live, the top marginal rate increases to $0.064 per word with the most typica	\N	\N	Worldwide	remote	\N	$20k -$35k	\N	https://remotive.com/remote-jobs/writing/copywriter-1749306	https://remotive.com/job/1749306/logo	t	\N	["accounting", "excel", "research", "data analysis", "bookkeeping", "google sheets"]	\N	\N	2026-05-21 08:11:15.653786	2026-05-21 08:11:15.653786
14	Senior DevOps Engineer	Lemon.io	\N	Are you a talented Senior DevOps looking for a remote job that lets you show your skills and get decent compensation? Look no further than Lemon.io — the marketplace that connects you with hand-picked startups in the US and Europe. What we offer: The rate depends on your seniority level, skills and experience. We've already paid out over $11M to our engineers. No more hunting for clients or negotiating rates — let us handle the business side of things so you can focus on what you do best. We'll manually find the best project for you according to your skills and preferences. Choose a schedule that works best for you. It’s possible to communicate async or minimally overlap within team working hours. We respect your seniority so you can expect no micromanagement or screen trackers. Communicate directly with the clients. Most of them have technical backgrounds. Sounds good, yeah? We will support you from the time you submit the application throughout all cooperation stages. Most of our projects involve working in a fast-paced startup environment. We hope you like it as much as we do. Through our community, we will connect you with the best developers from more than 71 countries. We have several openings for Senior DevOps Engineers, with two types of requirements. Requirements – DevOps with Azure DevOps: 4+ years of experience as a DevOps Engineer At least 3 years of experience with Azure DevOps Experience in at least 2 commercial projects using Microsoft Azure or Kubernetes is required Requirements – DevOps with AWS/GCP/SQL: 4+ years of experience as a DevOps Engineer At least 3 years of experience with AWS, GCP, or SQL At least 3 years of commercial experience with Python Experience in at least 2 commercial projects using Terraform or Kubernetes is required Strong technical skills: as a Senior DevOps, you are expected to be able to create projects from scratch and have a deep understanding of application architecture. Clear and effective communication in English — adva	\N	\N	Americas, Europe, Asia, Oceania	remote	\N	\N	\N	https://remotive.com/remote-jobs/devops/senior-devops-engineer-2090002	https://remotive.com/job/2090002/logo	t	\N	[".Net", "android", "AWS", "azure", "C", "C#"]	\N	\N	2026-05-18 12:31:20.412016	2026-05-18 12:31:20.412016
15	Head of Engineering	Lemon.io	\N	About Lemon.io Lemon.io is a profitable, growing talent marketplace that connects vetted senior engineers with companies that need them. We’ve been in business for 10 years, have 60 people across Ukraine, Europe, Canada, and the US, and process over $16M in annual GMV. We compress the traditional 2–5 week hiring timeline down to 24–48 hours through a curated, pre-vetted supply of developers. Hiring is still broken. Recruiters spend weeks building candidate pipelines on traditional platforms, burning energy on unqualified leads. We’re building the product that changes that. Giving recruiters qualified, vetted candidates within 24 hours without the grind. This is a pivotal moment: we’re transitioning from a services-driven marketplace to a technology-driven platform. We need an engineering leader who can drive that transformation. The Role You will own engineering at Lemon.io. You’ll lead a growing team of engineers, make critical architecture and prioritization decisions, and be directly accountable for the speed and quality of what we ship. This is not a management-layer role. You’ll be hands-on, deeply involved in product decisions, and working side by side with the founder. What You’ll Do: Own the technical roadmap and make sure every engineering effort maps directly to business impact. No features for features’ sake. Lead and grow an engineering team that ships fast, iterates constantly, and treats complexity as a cost. Tackle the hard, multi-layered problem: automated vetting, intelligent matching at scale, demand-side bottlenecks. And figure out where the real leverage is. Make hard prioritization calls. Decide what we build, what we skip, and what we kill. Work directly with the founder and product team to define what success looks like before writing a single line of code. Build the engineering culture: high ownership, high speed, low bureaucracy. Who You Are: Product-minded, business-first Obsessed with simplicity First principles thinker Fast. Bias toward a	\N	\N	USA timezones, European timezones	remote	\N	\N	\N	https://remotive.com/remote-jobs/software-development/head-of-engineering-2089995	https://remotive.com/job/2089995/logo	t	\N	["AI/ML", "startup", "marketplace", "fundraising"]	\N	\N	2026-05-18 12:31:20.468496	2026-05-18 12:31:20.468496
16	Mid/Senior AI Video Artist	EverAI	\N	Our Vision &amp; Products 🚀 EverAI — Building the Future of AI Companionship One of the Top 15 Largest &amp; Fastest-Growing AI Companies in the World 50 Million Users in 2 years — Help Us Reach 100M first, 500M next At EverAI , we’re shaping what it means to connect with AI. With 50 million users and counting , we're not just building products — we're creating entirely new categories. Our flagship product is the world’s largest AI companionship platform , redefining relationships for millions. It is governed by our proprietary moderation system, EverGuard — an internal AI designed to ensure everything we build is safe, ethical, and human-first . And we’re only just getting started! Our Team We are an enthusiastic, passionate and hardworking team of ≈ 75 people. Our founding team has strong entrepreneurial experience building and scaling web products from 0 to IPO. Alexis Soulopoulos [CEO] • 10+ years in Tech Executive Leadership • Co-Founder Mad Paws Holdings (from 0 to IPO) • Forbes 30 under 30 + Deloitte TechFast50 ’22 &amp; ‘23 Michael Monin [Co-founder &amp; CTO] • 10+ years as CTO / COO (web2/web3), 1+ year in AI/LLM • Serial-entrepreneur: MTK Digital (exited / 0-&gt;$20m revenue) and Zipchat (AI Chatbot for E-commerce brands) Thomas Lacroix [Co-founder &amp; CMO] • 8+ years in Customer Acquisition &amp; E-commerce Growth • Serial-entrepreneur: Curatible (sold to Blackstone) and MTK Digital (exited / 0-&gt;$20m revenue) Maruša Fasano [CFO/Legal] • 25+ years in Finance, Strategy, M&amp;A • Ex-CFO/M&amp;A @Curatible (exited to Blackstone) • Ex-President of the Board @SotremoSA (exited) • Co-founder/CFO @SoftOne (exited) Your Role We are looking for a Mid/Senior AI Video Artist who is comfortable editing engaging videos in a fast-paced environment and thrives when managing their production pipeline independently: from idea inception to audio, graphics and colour grading. Reporting directly to our CMO Thomas, this is what you'll be doing: Key Responsibilities Cr	\N	\N	Worldwide	remote	\N	-	\N	https://remotive.com/remote-jobs/marketing/mid-senior-ai-video-artist-2089994	https://remotive.com/job/2089994/logo	t	\N	["excel", "video", "AI/ML", "customer acquisition", "advertising", "paid marketing"]	\N	\N	2026-05-18 12:31:20.519722	2026-05-18 12:31:20.519722
17	Content Reviewer - US	TELUS Digital	\N	Looking for a freelance opportunity where you can make an impact on technology from the comfort of your home? If you are dynamic, tech-savvy, and always online to learn more, this part-time flexible project is the perfect fit for you! A Day in the Life of a Content Reviewer - US : In this role, you’ll be analyzing and providing feedback on texts, pages, images, and other types of information for top search engines, using an online tool Through reviewing and rating search results for relevance and quality, you’ll be helping to improve the overall user experience for millions of search engine users, including yourself. Join our team today and start putting your skills to work for one of the world's leading search engines. The estimated hourly earnings for this role are 14 USD per hour. Please note only one member per household can work on this program. If at a later stage it is identified that more than one person in your household is working on the TELUS Digital Rating Program, it will result in removal from the program. TELUS Digital AI Community Our global AI Community is a vibrant network of 1 million+ contributors from diverse backgrounds who help our customers collect, enhance, train, translate, and localize content to build better AI models. Become part of our growing community and make an impact supporting the machine learning models of some of the world’s largest brands. Qualification path No previous professional experience is required to apply to this role, however, working on this project will require you to pass the basic requirements and go through a standard assessment process. This is a part-time long-term project and your work will be subject to our standard quality assurance checks during the term of this agreement. Basic Requirements Working as a freelancer with excellent communication skills in English Bein g a resident in the United States for the last 3 consecutive years and having familiarity with current and historical business, media, sport, n	\N	\N	USA	remote	\N	$14/hour	\N	https://remotive.com/remote-jobs/all-others/content-reviewer-us-2089990	https://remotive.com/job/2089990/logo	t	\N	["android", "go", "ios", "social media", "AI/ML", "diversity"]	\N	\N	2026-05-18 12:31:20.571575	2026-05-18 12:31:20.571575
18	AI Engineer	Dry Ground AI	\N	We are seeking a versatile and highly skilled AI Engineer to join our fast-growing Full-Stack AI Solutions company. This role blends the expertise of building cutting-edge AI/ML models with the practical know-how of automation and agentic system integrations. You will design, develop, deploy, and optimize intelligent solutions that leverage the power of generative AI, automation platforms, and agent-based systems to enhance client operations, streamline workflows, and deliver measurable results. This is a unique opportunity to work across a diverse range of technologies—from fine-tuning transformer models to building real-world AI-powered automation stacks. If you’re passionate about pushing the boundaries of AI while creating real value through systems thinking and practical implementation, this role is for you. Key Responsibilities AI/ML Development: Design, build, and deploy machine learning and generative AI models for custom use cases. Fine-tune and optimize large language models (e.g., GPT, BERT) using frameworks like Hugging Face Transformers. Conduct ongoing research to stay ahead of advancements in AI/ML, including LLMs, generative AI, and transformer-based architectures. Develop data pipelines for preprocessing, feature engineering, and model training. Test, validate, and monitor model performance in real-world scenarios; iterate for reliability and accuracy. Collaborate with cross-functional teams to embed AI into products, platforms, and services. Mentor junior engineers and contribute to technical leadership. Automation &amp; Agentic Systems: Design, implement, and maintain automation workflows using tools such as: LangChain, LangGraph, LangSmith, LangFuse n8n, ElevenLabs, and CMS integrations. Engineer system-to-system integrations using APIs to enable intelligent process automation. Apply prompt and context engineering techniques to enhance the performance of conversational AI tools. Implement prompt management and QA processes for agents and assistan	\N	\N	Brazil, Colombia, Philippines	remote	\N	$40- $60k	\N	https://remotive.com/remote-jobs/artificial-intelligence/ai-engineer-2089958	https://remotive.com/job/2089958/logo	t	\N	["api", "cloud", "fullstack", "python", "AI/ML", "automation"]	\N	\N	2026-05-18 12:31:20.623653	2026-05-18 12:31:20.623653
19	Paid Media Specialist	Noventra Group Europe	\N	Noventra Group Europe works with selected brands, suppliers, and retail partners across the European market, with a focus on product sourcing, procurement support, and commercial retail collaboration. As our partner brands continue to expand their presence across European retail channels, we are looking for a Remote Paid Media Specialist to support campaign coordination, audience research, paid advertising, and market development activities across Meta Ads and Google Ads. In this role, you will help promote selected brand and product initiatives, support campaign setup, analyze performance data, research audiences, and provide clear recommendations to improve campaign results. Key responsibilities: - Plan, launch, and optimize paid campaigns on Meta Ads and Google Ads - Support product and brand campaign research for European markets - Research audiences, competitors, and campaign angles across retail categories - Monitor campaign performance and identify opportunities for improvement - Test creatives, ad copy, landing pages, and targeting strategies - Prepare clear performance reports with actionable recommendations - Work with the internal team to improve campaign structure, budget allocation, and conversion performance Requirements: - Hands-on experience with Meta Ads and/or Google Ads - Understanding of campaign structure, conversion tracking, retargeting, and A/B testing - Ability to read campaign data and make practical optimization decisions - Good written English for reports and internal communication - Reliable, detail-oriented, and comfortable working remotely - Experience with eCommerce, retail, lead generation, procurement, or European markets is a plus This is a fully remote role open to candidates worldwide. We are looking for someone who can work independently, communicate clearly, and support brand growth across European retail and digital channels. Full role details, compensation information, and the application process are available on our official	\N	\N	Worldwide	remote	\N	$65k - $85k	\N	https://remotive.com/remote-jobs/marketing/paid-media-specialist-2090885	https://remotive.com/job/2090885/logo	t	\N	["ecommerce", "research", "advertising", "retail", "A/B Testing", "lead generation"]	\N	\N	2026-05-21 08:11:14.970524	2026-05-21 08:11:14.970524
20	Senior Independent Software Developer	A.Team	\N	You must be located in the Americas, Europe, or Israel to apply. A·Team is a VC-backed, stealth, application-only home on the internet for senior independent software builders to team up with hand-picked, high-growth companies on their next big thing. After talking with hundreds of independent engineers, designers, and product folks, we heard over and over that finding vetted, high-quality, consistent clients is hard, and projects are often too small to be rewarding. A·Team matches small teams of the most talented builders in the world with companies backed by a16z, YC, Softbank, General Catalyst, etc. on a contract basis for many of their most important initiatives. We quietly launched in May 2020, and have helped A·Teamers earn $85+ million since. As part of A·Team, you can expect: High-paying, meaningful missions with the most audacious companies sent your way; generally $90-$150+/hr, with vetted, fascinating clients doing work that matters. We're picky about who we partner with; new clients only come in via trusted referral. We've worked with Lyft, McGraw Hill, ClearCo, Pepsi, Walmart, the former CEO of Waze, the leading vaccine production software, several new unicorns we can't say here, and dozens of startups backed by a16z/YC/Softbank/Insight/Tiger/etc. Work alongside friends old &amp; new: our niche is small/diverse product teams, since clients with larger budgets and higher-impact work tell us they want teams, not individuals. Of course, we keep friends together whenever we can. Full autonomy: say "no" to things that don't excite you. The most talented builders often juggle a few things at once, so there's never pressure to join an A·Team mission if you don't have the bandwidth. If we're no longer a fit, it's easy to leave or pause too. Small, curated, off-the-record gatherings: for conversations hard to have elsewhere. Long-term, we're creating micro-communities for the world's top builders to become friends around the things they care about. Keep 100% of 	\N	\N	Americas, Europe, Israel	remote	\N	$90 - $150 /hour	\N	https://remotive.com/remote-jobs/software-development/senior-independent-software-developer-1919265	https://remotive.com/job/1919265/logo	t	\N	["go", "wordpress", "chat", "apple", "testing", "catalyst"]	\N	\N	2026-05-21 08:11:15.029835	2026-05-21 08:11:15.029835
21	Senior Independent AI Engineer / Architect	A.Team	\N	Location: Americas, Europe, or Israel The Opportunity Join A.Team’s invite-only network of senior builders and access exclusive missions with Fortune 500s and top startups. This isn’t client work or employment—it’s a vetted collective where you’re matched to impactful projects. At A.Team, you won’t just implement someone else’s plan. You’ll be the technical decision-maker, owning everything from model design to enterprise integration. Why A.Team Elite peers : ex-OpenAI, Google, Meta, Amazon. Precision matching : Missions in LLMs, CV, NLP, ML infra, fine-tuning. Compensation : $120–$170/hr, biweekly payouts, you keep 100%. Autonomy : Choose only missions that excite you—no small gigs, no chasing. What You’ll Do Lead the design, deployment, and scaling of production AI systems. Build ambitious software 0→1 in small, senior teams (3–5 people). Scope, propose, and execute solutions with real ownership. Partner with founders, CTOs, and product leaders to deliver outcomes that matter. Who Thrives Here Senior AI/ML Engineers with production systems live. AI Architects who’ve built enterprise AI stacks. Tech Leaders balancing architecture with business outcomes. Specialists in LLMs, CV, NLP, or infra with proven depth. Not a fit : under 4 years’ experience, simple website builders, or small gig seekers. Proof in the Network Your peers have scaled apps to millions, built enterprise AI platforms, shipped AI at unicorns, and deployed infra handling billions/day. How to Apply Apply once at build.a.team/apply-ai . Short, rigorous process—we care more about what you’ve built than lengthy forms.	\N	\N	Americas, Europe, Israel	remote	\N	$120 - $170 /hour	\N	https://remotive.com/remote-jobs/software-development/senior-independent-ai-engineer-architect-1919266	https://remotive.com/job/1919266/logo	t	\N	["go", "UI/UX", "wordpress", "chat", "apple", "testing"]	\N	\N	2026-05-21 08:11:15.081559	2026-05-21 08:11:15.081559
22	Senior Full-stack React Developer	Lemon.io	\N	Are you a talented Senior Developer looking for a remote job that lets you show your skills and get decent compensation? Look no further than Lemon.io — the marketplace that connects you with hand-picked startups in the US and Europe. What we offer: The rate depends on your seniority level, skills and experience. We've already paid out over $11M to our engineers. No more hunting for clients or negotiating rates — let us handle the business side of things so you can focus on what you do best. We'll manually find the best project for you according to your skills and preferences. Choose a schedule that works best for you. It’s possible to communicate async or minimally overlap within team working hours. We respect your seniority so you can expect no micromanagement or screen trackers. Communicate directly with the clients. Most of them have technical backgrounds. Sounds good, yeah? We will support you from the time you submit the application throughout all cooperation stages. Most of our projects involve working in a fast-paced startup environment. We hope you like it as much as we do. Through our community, we will connect you with the best developers from more than 71 countries. We have several open positions for Full-Stack React.js Developers - please see the details below. We also have some backend positions; the full list is included below as well. Requirements for the Senior React &amp; Python Position: 4+ years of software development experience Commercial experience: React.js 3+ years and Python 3+ years OR React.js 2+ years and Python 5+ years OR React.js 5+ years and Python 2+ years Experience with AWS, GCP, or Azure is required Requirements for the Senior Python Position: 5+ years of software development experience 5+ years of commercial experience with Python 3+ years of commercial experience with Flask Requirements for the Senior Golang &amp; React Position: 4+ years of software development experience React.js 3+ years and Golang 3+ years OR React.js 2+ ye	\N	\N	Americas, Europe, Asia, Oceania	remote	\N	\N	\N	https://remotive.com/remote-jobs/software-development/senior-full-stack-react-developer-2088711	https://remotive.com/job/2088711/logo	t	\N	[".Net", "android", "AWS", "azure", "backend", "C"]	\N	\N	2026-05-21 08:11:15.133848	2026-05-21 08:11:15.133848
23	Marketing Manager, Content & AI Enablement	Expion Health	\N	Title : Marketing Manager, Content &amp; AI Enablement Location : Fully Remote Reports To: VP, Marketing &amp; Communications Pharmacy benefit management is a $500B+ industry most people have never heard of — but it has a major impact on how prescription drugs are priced, accessed, and paid for. Expion Health is at the forefront of changing how that system works. We sit at the intersection of data, technology, and pharmacy economics, helping clients stay ahead of a rapidly evolving market. We are also in the middle of a company-wide AI transformation, with teams across the business rethinking how work gets done. The Role We are looking for a Marketing Manager, Content &amp; AI Enablement to help our marketing team create stronger work faster by combining AI ingenuity with marketing fundamentals. This is not a role for someone who wants to use AI around the edges. It is for someone who wants to help build a more modern, faster, smarter marketing function from the inside. You do not need to be a professional copywriter, designer, developer, or digital media expert. But you do need to know what strong marketing looks like: clear writing, sharp messaging, smart design, audience relevance, brand consistency, and content that actually gets people to pay attention. You should already be using AI tools beyond basic experimentation. You are not just asking ChatGPT for a caption once in a while. You are using AI to draft, edit, ideate, summarize, repurpose, design, produce, test, and improve how work gets done. You are curious about what comes next: smarter prompts, reusable workflows, AI skills, agents, automations, AI-assisted video creation, presentation development, and content systems that make marketing faster and better. Most importantly, you are leaning into how AI can evolve marketing. You are not scared of new tools. You are curious, hands-on, self-directed, and excited to figure things out. What You’ll Do Enhance Creative Excellence and Marketing Content Production	\N	\N	USA	remote	\N	$75k - $95k	\N	https://remotive.com/remote-jobs/marketing/marketing-manager-content-ai-enablement-2090883	https://remotive.com/job/2090883/logo	t	\N	["react", "seo", "video", "AI/ML", "product marketing", "project management"]	\N	\N	2026-05-21 08:11:15.185921	2026-05-21 08:11:15.185921
24	Tech Lead Full-Stack Rails Engineer	Mitre Media	\N	About Mitre Media Mitre Media is redefining FinTech with AI-driven tools that empower millions of investors. Our portfolio, including Dividend.com and MutualFunds.com, leverages LLMs to deliver novel data insights and visually rich user experiences. For over a decade, we’ve served individual investors, financial advisors, and top asset managers like BlackRock and Vanguard through our premium data, tools, and advertising solutions. Join our lean, entrepreneurial team to shape the future of AI-powered investing from your location ±3 hours from Eastern Time. Our users are deeply engaged, spending over 5 minutes per visit with a bounce rate below 10%, researching investments across hundreds of different categories. With 40 million brokerage accounts in the U.S., we take pride in building tools that make a real impact, fostering a culture of trust, innovation, and dynamism. If you’re passionate about financial technology and AI, we’d love to connect! About the Role As a Full-Stack Rails Tech Lead, you’ll architect and implement LLM-powered web applications within our microservices-based Rails 8 platform. Reporting directly to our CTO, you’ll collaborate with a small, high-impact team to deliver user experiences across Dividend.com, MutualFunds.com and other brands within our portfolio. This role combines expert Ruby on Rails skills with AI integration expertise, requiring you to leverage LLMs in your development workflow, state management and user interactions. You’ll work in a remote-first hybrid environment, which encourages in person collaboration, using ShapeUp to manage projects that trade-off on-time delivery for de-scoped outcomes. As a technical leader, you'll have a seat at the table shaping system architecture, implementing core features all while embracing an entrepreneurial mindset and a “get things done” mentality. Responsibilities Architect and maintain Rails applications (Rails 8) Integrate LLMs into our microservices architecture for state management and 	\N	\N	USA, Canada, USA timezones	remote	\N	$170k - $200k	\N	https://remotive.com/remote-jobs/software-development/tech-lead-full-stack-rails-engineer-2069746	https://remotive.com/job/2069746/logo	t	\N	["api", "CSS", "docker", "elasticsearch", "fullstack", "html"]	\N	\N	2026-05-21 08:11:15.238417	2026-05-21 08:11:15.238417
25	Business Transformation Lead	Expion Health	\N	Title : Business Transformation Lead Location : Fully Remote Reports To : President, Service &amp; Growth Expion Health is building the future of pharmacy economics. As architects of prescription economics, we design how pharmacy value is created, aligning cost, clinical decisions, and performance into one accountable system that moves beyond rebates. We help organizations stay ahead of pharmacy market change with clear insight, bold thinking, and strategies built for what's next-leading the next era of prescription economics. The Role As our Business Transformation Lead , you'll be the architect and driver of how we embed AI into the way every team in our company works. This isn't a slide-deck strategy role. You'll be on the ground with department leaders, identifying real workflow opportunities, turning them into real solutions, and building the internal capability that makes the transformation stick. You'll lead our AI Champions program, partner directly with executive leadership, and own the roadmap that takes Expion Health from an organization that uses AI tools to one that runs on AI intelligence. If you've spent time figuring out how to make AI work in the real world - not just in theory - and you want to do it at a company that's fast, innovative, and genuinely committed to this, this role was built for you. What You'll Own Drive Transformation (65%) Own the AI transformation roadmap end-to-end - from strategy to execution - and keep it moving in a fast-paced environment Run discovery sessions with department leaders across Sales, Client Management, Clinical, Finance, Operations, IT, and Trade to surface high-impact AI opportunities Design and lead our AI Champions program - recruiting, training, and developing a network of department-level AI advocates across the organization Build and deliver role-based AI learning pathways tailored to the specific needs of each department Partner with the executive team to ensure AI initiatives are prioritized, resourced,	\N	\N	USA	remote	\N	$175k - $225k	\N	https://remotive.com/remote-jobs/artificial-intelligence/business-transformation-lead-2090881	https://remotive.com/job/2090881/logo	t	\N	["api", "AI/ML", "automation", "healthcare", "spark", "startup"]	\N	\N	2026-05-21 08:11:15.290795	2026-05-21 08:11:15.290795
26	Office Assistant	Coalition Technologies 	\N	WHY YOU SHOULD APPLY: Coalition Technologies is devoted to delivering clients the highest quality work while providing our team a fun, thriving, and innovative environment. Along with the opportunity for tremendous career growth and rapid advancement, CT offers: The most competitive profit-sharing bonus plan in the industry, paying up to 50% of company profits to full-time employees each month! A highly competitive Paid Time Off plan, promoting quality work-life balance. Subsidized gym memberships to help team members feel their best. Medical, dental, vision, and life insurance packages for all US-based team members. International Health Insurance Reimbursement Program for all international team members, a benefit unique to Coalition. Device upgrade and learning reimbursement programs. Motivating career development plans with clearly defined goals and rewards. Additional job-specific incentives and bonuses. Plus, 100% of our team works remotely with the support of time tracking software. Our company culture specializes in supporting remote team members, and we’ve been doing so for more than a decade. CT welcomes your application, wherever in the world it's coming from! YOU SHOULD HAVE: Willingness to learn, grow, and collaborate with the team and company as a whole. Excellent verbal and written communication skills. A high level of discretion, ethics, and trustworthiness. Intermediate spreadsheet skills (preferred) Innovative thinking and a willingness to challenge existing methods where improvement is possible. Experience in bookkeeping / financial record keeping (preferred). Experience with Google Sheets or Excel, Quickbooks Online, and G-Suite (preferred). The availability to work 40 hours per week from 9:00 am to 6:00 pm PST. A reliable space to work remotely with a fast computer, quality internet, camera, microphone, and speakers. YOUR DUTIES AND TASKS: Answering phones and emails. Completing entry-level bookkeeping, including recording expenses, organizing rec	\N	\N	Worldwide	remote	\N	$31,2k- $52k	\N	https://remotive.com/remote-jobs/marketing/office-assistant-1680495	https://remotive.com/job/1680495/logo	t	\N	["CSS", "excel", "frontend", "git", "html", "illustrator"]	\N	\N	2026-05-21 08:11:15.341957	2026-05-21 08:11:15.341957
27	Director of Revenue Systems and AI Automation (Offshore) 	Caul Group	\N	This search is open exclusively to candidates based in Latin America. Preference for Uruguay, Costa Rica, or Colombia. BACKGROUND CONTEXT Every department at Caul Group is generating AI and automation ideas faster than they can be built. This role turns those ideas into operational reality — and finds the ones nobody thought to ask about yet. You are not advising. You are not consulting. You own the systems layer of this business and make it faster, cleaner, and more profitable — auditing what we have, identifying what is broken, redundant, or missing, and building the infrastructure that fixes it permanently. This is a deeply technical, execution-focused role for someone who thinks in system connections. When someone says "our Google LSA leads are not showing up correctly in Follow Up Boss," you trace the integration chain, find where the handoff failed, and build the fix. You do not wait to be asked. Your primary collaborators: the Founder, the Broker in Charge, the Director of Marketing, and the Founder's Chief of Staff. The defining partnership is with the Director of Marketing. They own creative, campaigns, and the team. You own the infrastructure — attribution architecture, lead pipeline connections, systems tracking what works from first ad impression through closed transaction. They read the output. You build and tune the machine. If you worked here last week, you might have: Scoped and deployed a Zapier integration between Follow Up Boss and ClickFunnels so new leads from Ylopo automatically get tagged, assigned, and entered into the correct pipeline, eliminating the daily manual lead routing the team was doing every morning and stopping revenue from falling through the cracks Built an automated coaching intelligence system that pulls agent call data from Follow Up Boss, breaks it down by agent, and delivers a weekly report to each coach using Claude to analyze call patterns, flag agents avoiding follow-ups, identify cold databases, and surface conversion g	\N	\N	LATAM	remote	\N	$60k–$72k	\N	https://remotive.com/remote-jobs/artificial-intelligence/director-of-revenue-systems-and-ai-automation-offshore-2090878	https://remotive.com/job/2090878/logo	t	\N	["api", "AI/ML", "automation", "documentation", "CRM", "analytics"]	\N	\N	2026-05-21 08:11:15.394481	2026-05-21 08:11:15.394481
28	iOS Developer	nooro	\N	WHO ARE WE? At nooro, we're revolutionizing pain management for seniors. Our platform is transforming how older adults engage with pain management at home. We're on a mission to make wellness more accessible and effective through technology. Check our website here: https://nooro-us.com/ We're a fast-moving startup that works on quick iteration and bold decisions. Our team is lean, agile, and empowered to make meaningful impacts daily. If you enjoy a dynamic environment where ideas become a reality at lightning speed and you're not afraid to wear multiple hats, you'll fit right in. WHAT WILL YOU DO? - Own and drive the development of our iOS application - Build elegant, performant features using **Swift (We’re 100% Swift!)** and **SwiftUI** - Implement complex UI/UX designs from **Figma** with pixel-perfect accuracy - Ensure app performance, quality, and responsiveness - Collaborate with our backend team on API integration - Write clean, modular, and reusable code - Participate in code reviews and architectural decisions - Help shape our mobile development practices HOW TO APPLY? If you believe we're the right fit, please fill in this form: https://forms.gle/xeL6pPbdjMHo11A28 WHAT ARE THE REQUIREMENTS? - 5+ years of professional iOS development experience - Strong expertise in Swift and SwiftUI - Deep understanding of iOS platform capabilities and limitations - Experience with iOS app architecture (MVVM preferred) - Experience with Core Data and local storage solutions - Proficiency in making RESTful API calls and handling responses - Experience with dependency injection on iOS - Strong version control skills with Git/GitHub - Experience with App Store deployment and TestFlight - Knowledge of iOS security best practices APPLYING PROCESS STEP 1 | QUESTIONNAIRE: If you believe we're the right fit, please fill in this form: https://forms.gle/xeL6pPbdjMHo11A28 STEP 2 | TEST: Once we review your form submission, we will send you a test STEP 3 | TECHNICAL INTERVIEW: Once w	\N	\N	USA	remote	\N	$60k-$130k (depending on experience)	\N	https://remotive.com/remote-jobs/software-development/ios-developer-1956455	https://remotive.com/job/1956455/logo	t	\N	["api", "backend", "git", "ios", "security", "swift"]	\N	\N	2026-05-21 08:11:15.445993	2026-05-21 08:11:15.445993
29	Inside Sales Contractor	Credit Wellness, LLC	\N	About Us We are a financial services start up focusing on helping to improve consumer credit profiles. We are currently seeking KPI driven sales representatives looking to earn up to 45K in their first year while working remotely. We offer comprehensive training and continuous sales coaching to help you meet your financial goals. During our training period we offer a guaranteed training stipend while our trainees are acclimating to the position (*see weekly pay below). If you are a seasoned sales professional looking for the autonomy of a remote position combined with great compensation, we want to hear from you! Compensation Structure This role is 100% commission-based , which means your earning potential is unlimited. In addition, we regularly offer competitive performance-based bonuses to reward hard work and results. Training Period (Weeks 1–4) We invest in your success and want to make sure you’re supported as you get up to speed: Week 1: Commission-only (a chance to start earning right away while learning the ropes). Weeks 2–4: Guaranteed training stipend of $1,000 total – or your commission if it’s higher. You’ll always receive whichever amount benefits you most. Week 2: $250 guaranteed minimum Week 3: $325 guaranteed minimum Week 4: $425 guaranteed minimum By the end of training, you’ll have the skills to maximize commissions, with the safety net of a guaranteed base during your ramp-up period. Post Training Period: Average first year OTE: 25K-35K (US) Annually Top Rep first year OTE: 35K-45K (US) Annually *The above is the average pay you can expect, however, there is unlimited earning potential for those who are financially motivated top performers looking to exceed sales targets. What will you be doing? Educating inbound callers on their credit standing by providing consultations with the goal of enrolling them in one of our services should they be a good fit. We are looking for team members who are: Tech savvy with the ability to navigate digital tools s	\N	\N	Worldwide	remote	\N	OTE $25k - $35k	\N	https://remotive.com/remote-jobs/sales/inside-sales-contractor-2086540	https://remotive.com/job/2086540/logo	t	\N	["CRM", "google sheets", "financial services", "Inside Sales"]	\N	\N	2026-05-21 08:11:15.497592	2026-05-21 08:11:15.497592
30	Freelance Writer	IAPWE	\N	Our organization is seeking content writers to create articles and blog posts on a variety of topics. The rate of pay is $20 per 100 words (this comes out to approximately $100 per article or $50 per hour). Some topics you may be asked to write about include the following (you can always turn down a topic if you do not feel comfortable writing about it, however if you have experience or expertise in a specific area, please let us know): Health &amp; beauty Fitness Home Decor Fashion Sports Do it yourself Finance Legal Medical Family/Parenting Relationships Real Estate Restaurants Contracting (plumbing, pool building, remodeling, etc.) These are just some of the more general industries and topics that we cover. Requirements : We ask that all work be completed using a word processor such as Microsoft Word or Open Office A reliable internet connection and the ability to meet deadlines Good communication skills and respond in a timely manner to editorial staff when they ask for updates on tasks, etc Work well as a team member with the rest of our content management and editorial staff Note : Applicants to this job signaled that accessing some writing tasks may require payment.	\N	\N	Worldwide	remote	\N	$50-$75 /hour	\N	https://remotive.com/remote-jobs/writing/freelance-writer-1185979	https://remotive.com/job/1185979/logo	t	\N	["REST"]	\N	\N	2026-05-21 08:11:15.549887	2026-05-21 08:11:15.549887
31	🇩🇪Customer Support Manager	Parkosecure GmbH	\N	🇩🇪 This job ad is written in German. 🇩🇪 Die Parkosecure GmbH ist ein innovatives Unternehmen im Bereich Parkraummanagement in der Schweiz. Für die Betreuung unserer Kunden in der französischen Schweiz suchen wir eine zuverlässige und selbständig arbeitende Persönlichkeit im 100% Remote-Modell. Du arbeitest vollständig ortsunabhängig und bist die zentrale Ansprechperson für unsere französischsprachigen Kunden. Vos missions Bearbeitung von Kundenanfragen per Telefon und E-Mail Professionelle Behandlung von Kundenreaktionen und Einsprachen Unterstützung im administrativen Bereich Mitarbeit bei Projekten (bei vorhandenen Ressourcen) Sicherstellung einer hohen Kundenzufriedenheit Vos compétences Französisch Muttersprache (zwingend) Sehr gute schriftliche und mündliche Ausdrucksweise Deutsch und oder Englisch von Vorteil Erfahrung im Kundendienst oder Administration Sehr gute EDV Kenntnisse (MS Office zwingend) Selbständige, strukturierte Arbeitsweise Belastbar und lösungsorientiert Avantages 100% Remote Arbeit weltweit möglich Flexible Arbeitsgestaltung Dynamisches wachsendes Unternehmen Möglichkeit zur Weiterentwicklung Direkter Einfluss auf Prozesse und Kundenzufriedenheit 5 Wochen Ferien Fixer, überdurchschnittlicher Lohn (kein Bonus, keine Provision) Wir bieten dir eine stabile und verantwortungsvolle Tätigkeit in einem wachsenden Unternehmen, in dem deine Arbeit geschätzt wird. Du arbeitest selbständig, bist Teil eines engagierten Teams und übernimmst eine wichtige Rolle in der Betreuung unserer französischsprachigen Kunden. Wenn du zuverlässig bist, gerne Verantwortung übernimmst und Wert auf eine langfristige Zusammenarbeit legst, freuen wir uns darauf, dich kennenzulernen.	\N	\N	Switzerland	remote	\N	\N	\N	https://remotive.com/remote-jobs/customer-service/customer-support-manager-2090874	https://remotive.com/job/2090874/logo	t	\N	["MS Office"]	\N	\N	2026-05-21 08:11:15.601523	2026-05-21 08:11:15.601523
33	Senior DevOps Engineer	Lemon.io	\N	Are you a talented Senior DevOps looking for a remote job that lets you show your skills and get decent compensation? Look no further than Lemon.io — the marketplace that connects you with hand-picked startups in the US and Europe. What we offer: The rate depends on your seniority level, skills and experience. We've already paid out over $11M to our engineers. No more hunting for clients or negotiating rates — let us handle the business side of things so you can focus on what you do best. We'll manually find the best project for you according to your skills and preferences. Choose a schedule that works best for you. It’s possible to communicate async or minimally overlap within team working hours. We respect your seniority so you can expect no micromanagement or screen trackers. Communicate directly with the clients. Most of them have technical backgrounds. Sounds good, yeah? We will support you from the time you submit the application throughout all cooperation stages. Most of our projects involve working in a fast-paced startup environment. We hope you like it as much as we do. Through our community, we will connect you with the best developers from more than 71 countries. We have several openings for Senior DevOps Engineers, with two types of requirements. Requirements – DevOps with Azure DevOps: 4+ years of experience as a DevOps Engineer At least 3 years of experience with Azure DevOps Experience in at least 2 commercial projects using Microsoft Azure or Kubernetes is required Requirements – DevOps with AWS/GCP/SQL: 4+ years of experience as a DevOps Engineer At least 3 years of experience with AWS, GCP, or SQL At least 3 years of commercial experience with Python Experience in at least 2 commercial projects using Terraform or Kubernetes is required Strong technical skills: as a Senior DevOps, you are expected to be able to create projects from scratch and have a deep understanding of application architecture. Clear and effective communication in English — adva	\N	\N	Americas, Europe, Asia, Oceania	remote	\N	\N	\N	https://remotive.com/remote-jobs/devops/senior-devops-engineer-2090002	https://remotive.com/job/2090002/logo	t	\N	[".Net", "android", "AWS", "azure", "C", "C#"]	\N	\N	2026-05-21 08:11:15.70559	2026-05-21 08:11:15.70559
34	Head of Engineering	Lemon.io	\N	About Lemon.io Lemon.io is a profitable, growing talent marketplace that connects vetted senior engineers with companies that need them. We’ve been in business for 10 years, have 60 people across Ukraine, Europe, Canada, and the US, and process over $16M in annual GMV. We compress the traditional 2–5 week hiring timeline down to 24–48 hours through a curated, pre-vetted supply of developers. Hiring is still broken. Recruiters spend weeks building candidate pipelines on traditional platforms, burning energy on unqualified leads. We’re building the product that changes that. Giving recruiters qualified, vetted candidates within 24 hours without the grind. This is a pivotal moment: we’re transitioning from a services-driven marketplace to a technology-driven platform. We need an engineering leader who can drive that transformation. The Role You will own engineering at Lemon.io. You’ll lead a growing team of engineers, make critical architecture and prioritization decisions, and be directly accountable for the speed and quality of what we ship. This is not a management-layer role. You’ll be hands-on, deeply involved in product decisions, and working side by side with the founder. What You’ll Do: Own the technical roadmap and make sure every engineering effort maps directly to business impact. No features for features’ sake. Lead and grow an engineering team that ships fast, iterates constantly, and treats complexity as a cost. Tackle the hard, multi-layered problem: automated vetting, intelligent matching at scale, demand-side bottlenecks. And figure out where the real leverage is. Make hard prioritization calls. Decide what we build, what we skip, and what we kill. Work directly with the founder and product team to define what success looks like before writing a single line of code. Build the engineering culture: high ownership, high speed, low bureaucracy. Who You Are: Product-minded, business-first Obsessed with simplicity First principles thinker Fast. Bias toward a	\N	\N	USA timezones, European timezones	remote	\N	\N	\N	https://remotive.com/remote-jobs/software-development/head-of-engineering-2089995	https://remotive.com/job/2089995/logo	t	\N	["AI/ML", "startup", "marketplace", "fundraising"]	\N	\N	2026-05-21 08:11:15.757897	2026-05-21 08:11:15.757897
35	Senior AI Video Artist	EverAI	\N	Our Vision &amp; Products 🚀 EverAI — Building the Future of AI Companionship One of the Top 15 Largest &amp; Fastest-Growing AI Companies in the World 50 Million Users in 2 years — Help Us Reach 100M first, 500M next At EverAI , we’re shaping what it means to connect with AI. With 50 million users and counting , we're not just building products — we're creating entirely new categories. Our flagship product is the world’s largest AI companionship platform , redefining relationships for millions. It is governed by our proprietary moderation system, EverGuard — an internal AI designed to ensure everything we build is safe, ethical, and human-first . And we’re only just getting started! Our Team We are an enthusiastic, passionate and hardworking team of ≈ 75 people. Our founding team has strong entrepreneurial experience building and scaling web products from 0 to IPO. Alexis Soulopoulos [CEO] • 10+ years in Tech Executive Leadership • Co-Founder Mad Paws Holdings (from 0 to IPO) • Forbes 30 under 30 + Deloitte TechFast50 ’22 &amp; ‘23 Michael Monin [Co-founder &amp; CTO] • 10+ years as CTO / COO (web2/web3), 1+ year in AI/LLM • Serial-entrepreneur: MTK Digital (exited / 0-&gt;$20m revenue) and Zipchat (AI Chatbot for E-commerce brands) Thomas Lacroix [Co-founder &amp; CMO] • 8+ years in Customer Acquisition &amp; E-commerce Growth • Serial-entrepreneur: Curatible (sold to Blackstone) and MTK Digital (exited / 0-&gt;$20m revenue) Maruša Fasano [CFO/Legal] • 25+ years in Finance, Strategy, M&amp;A • Ex-CFO/M&amp;A @Curatible (exited to Blackstone) • Ex-President of the Board @SotremoSA (exited) • Co-founder/CFO @SoftOne (exited) Your Role We are looking for a Senior AI Video Artist who is comfortable editing engaging videos in a fast-paced environment and thrives when managing their production pipeline independently: from idea inception to audio, graphics and colour grading. Reporting directly to our CMO Thomas, this is what you'll be doing: Key Responsibilities Create	\N	\N	Worldwide	remote	\N	-	\N	https://remotive.com/remote-jobs/marketing/senior-ai-video-artist-2089994	https://remotive.com/job/2089994/logo	t	\N	["excel", "video", "AI/ML", "customer acquisition", "advertising", "paid marketing"]	\N	\N	2026-05-21 08:11:15.81016	2026-05-21 08:11:15.81016
36	Content Reviewer - US	TELUS Digital	\N	Looking for a freelance opportunity where you can make an impact on technology from the comfort of your home? If you are dynamic, tech-savvy, and always online to learn more, this part-time flexible project is the perfect fit for you! A Day in the Life of a Content Reviewer - US : In this role, you’ll be analyzing and providing feedback on texts, pages, images, and other types of information for top search engines, using an online tool Through reviewing and rating search results for relevance and quality, you’ll be helping to improve the overall user experience for millions of search engine users, including yourself. Join our team today and start putting your skills to work for one of the world's leading search engines. The estimated hourly earnings for this role are 14 USD per hour. Please note only one member per household can work on this program. If at a later stage it is identified that more than one person in your household is working on the TELUS Digital Rating Program, it will result in removal from the program. TELUS Digital AI Community Our global AI Community is a vibrant network of 1 million+ contributors from diverse backgrounds who help our customers collect, enhance, train, translate, and localize content to build better AI models. Become part of our growing community and make an impact supporting the machine learning models of some of the world’s largest brands. Qualification path No previous professional experience is required to apply to this role, however, working on this project will require you to pass the basic requirements and go through a standard assessment process. This is a part-time long-term project and your work will be subject to our standard quality assurance checks during the term of this agreement. Basic Requirements Working as a freelancer with excellent communication skills in English Bein g a resident in the United States for the last 3 consecutive years and having familiarity with current and historical business, media, sport, n	\N	\N	USA	remote	\N	$14/hour	\N	https://remotive.com/remote-jobs/all-others/content-reviewer-us-2089990	https://remotive.com/job/2089990/logo	t	\N	["android", "go", "ios", "social media", "AI/ML", "diversity"]	\N	\N	2026-05-21 08:11:15.862307	2026-05-21 08:11:15.862307
37	AI Engineer	Dry Ground AI	\N	We are seeking a versatile and highly skilled AI Engineer to join our fast-growing Full-Stack AI Solutions company. This role blends the expertise of building cutting-edge AI/ML models with the practical know-how of automation and agentic system integrations. You will design, develop, deploy, and optimize intelligent solutions that leverage the power of generative AI, automation platforms, and agent-based systems to enhance client operations, streamline workflows, and deliver measurable results. This is a unique opportunity to work across a diverse range of technologies—from fine-tuning transformer models to building real-world AI-powered automation stacks. If you’re passionate about pushing the boundaries of AI while creating real value through systems thinking and practical implementation, this role is for you. Key Responsibilities AI/ML Development: Design, build, and deploy machine learning and generative AI models for custom use cases. Fine-tune and optimize large language models (e.g., GPT, BERT) using frameworks like Hugging Face Transformers. Conduct ongoing research to stay ahead of advancements in AI/ML, including LLMs, generative AI, and transformer-based architectures. Develop data pipelines for preprocessing, feature engineering, and model training. Test, validate, and monitor model performance in real-world scenarios; iterate for reliability and accuracy. Collaborate with cross-functional teams to embed AI into products, platforms, and services. Mentor junior engineers and contribute to technical leadership. Automation &amp; Agentic Systems: Design, implement, and maintain automation workflows using tools such as: LangChain, LangGraph, LangSmith, LangFuse n8n, ElevenLabs, and CMS integrations. Engineer system-to-system integrations using APIs to enable intelligent process automation. Apply prompt and context engineering techniques to enhance the performance of conversational AI tools. Implement prompt management and QA processes for agents and assistan	\N	\N	Brazil, Colombia, Philippines	remote	\N	$40- $60k	\N	https://remotive.com/remote-jobs/artificial-intelligence/ai-engineer-2089958	https://remotive.com/job/2089958/logo	t	\N	["api", "cloud", "fullstack", "python", "AI/ML", "automation"]	\N	\N	2026-05-21 08:11:15.918021	2026-05-21 08:11:15.918021
38	Copywriter	Coalition Technologies 	\N	WHO WE'RE LOOKING FOR The ideal copywriter has excellent English writing skills and is excited to write high-quality, SEO-driven content that aligns with detailed, client-specific guidelines. Projects most commonly include writing web pages for eCommerce and lead generation business sites such as category pages, product descriptions, and blog posts. Our clientele is constantly evolving. We produce content for these and many other industry verticals: Fashion (both mass-market and luxury) Skincare &amp; Beauty Tech &amp; Software** Finance &amp; Investing** Law (family law, product liability, divorce, etc.)** Education Home Improvement Automobiles &amp; Motorcycles (OEM and aftermarket accessories) Health and Wellness** Medical / Clinical** Digital Marketing SEO / PR / Advertising / Marketing** **Writers with a background in these highly specialized fields are strongly encouraged to apply. The ideal candidate for this position is a multifaceted technical and creative writer with at least two to four years of professional, non-academic experience. Candidates should understand how to write content that effortlessly blends SEO best practices and brand priorities for finished work that’s engaging, creative, and ROI-driven. Candidates should also be willing and able to complete careful research in order to gain a strong understanding of various industries. Candidates should be prepared to provide portfolios featuring published work. Once an offer has been extended, writers will be asked to take a brief training course. Compensation Writers are paid on a per-word basis. The rate is assessed according to our KPI rubric (key performance indicators) with an automatic raise after 400 and 800 pages have gone live on our client's websites. Initial compensation is up to $0.06 per word with $0.034 per word being the most typical compensation level. This is $30 or $17 per page of 500 words. After 400 pages live, the top marginal rate increases to $0.064 per word with the most typica	\N	\N	Worldwide	remote	\N	$20k -$35k	\N	https://remotive.com/remote-jobs/writing/copywriter-1749306	https://remotive.com/job/1749306/logo	t	\N	["accounting", "excel", "research", "data analysis", "bookkeeping", "google sheets"]	\N	\N	2026-06-04 23:40:16.017382	2026-06-04 23:40:16.017382
39	Staff Software Engineer, Product (Belo Horizonte)	LawnStarter	\N	This is a remote role for candidates located in Belo Horizonte, Brazil About LawnStarter LawnStarter is the nation's leading on-demand marketplace for lawn care and outdoor services, with over $100M in annual bookings. We're expanding beyond lawn care to become the one-stop shop for all home services — operating across three brands (LawnStarter, Lawn Love, Home Gnome) on a single shared platform. About Engineering at LawnStarter We build in small, focused initiative teams: a Product Engineer working alongside a PM and a designer, supported by an Engineering Manager who helps you grow. You'll also work shoulder-to-shoulder with engineering peers across initiatives in a shared codebase. The whole team owns whether the work moves its metric. AI coding agents are a force multiplier here — they give a small, senior team the leverage to ship more, faster, and at a higher bar for quality. We hire engineers who are wired for ownership and energized by shipping to a real marketplace with customers and pros on both sides. The Role You're the engineering anchor of an initiative — working as part of a tight team with your PM and designer, and alongside engineering peers on adjacent initiatives. You have a hand in the full lifecycle: shaping the problem, deciding the technical approach, directing AI agents to implement much of the code, shipping to production, and — with your team — owning the outcome. You're measured by impact, not by lines of code merged. When an agent can ship something safely, your job is to make sure it's done right and the metric moves. When the work calls for careful, hand-written code in a sensitive area, you write it yourself. What makes this role exciting: You ship end-to-end. From problem-framing through production to the post-launch metric review — you see the whole arc and own the result with your team. You work as a true product partner. You sit at the table with PM and design, bringing engineering judgment to product calls and product sense to eng	\N	\N	Brazil	remote	\N	$80k - $100k	\N	https://remotive.com/remote-jobs/software-development/staff-software-engineer-product-belo-horizonte-2090910	https://remotive.com/job/2090910/logo	t	\N	["AWS", "backend", "frontend", "php", "react", "security"]	\N	\N	2026-06-04 23:40:16.077791	2026-06-04 23:40:16.077791
40	Staff Software Engineer, Product (Florianópolis)	LawnStarter	\N	This is a remote role for candidates located in Florianópolis, Brazil About LawnStarter LawnStarter is the nation's leading on-demand marketplace for lawn care and outdoor services, with over $100M in annual bookings. We're expanding beyond lawn care to become the one-stop shop for all home services — operating across three brands (LawnStarter, Lawn Love, Home Gnome) on a single shared platform. About Engineering at LawnStarter We build in small, focused initiative teams: a Product Engineer working alongside a PM and a designer, supported by an Engineering Manager who helps you grow. You'll also work shoulder-to-shoulder with engineering peers across initiatives in a shared codebase. The whole team owns whether the work moves its metric. AI coding agents are a force multiplier here — they give a small, senior team the leverage to ship more, faster, and at a higher bar for quality. We hire engineers who are wired for ownership and energized by shipping to a real marketplace with customers and pros on both sides. The Role You're the engineering anchor of an initiative — working as part of a tight team with your PM and designer, and alongside engineering peers on adjacent initiatives. You have a hand in the full lifecycle: shaping the problem, deciding the technical approach, directing AI agents to implement much of the code, shipping to production, and — with your team — owning the outcome. You're measured by impact, not by lines of code merged. When an agent can ship something safely, your job is to make sure it's done right and the metric moves. When the work calls for careful, hand-written code in a sensitive area, you write it yourself. What makes this role exciting: You ship end-to-end. From problem-framing through production to the post-launch metric review — you see the whole arc and own the result with your team. You work as a true product partner. You sit at the table with PM and design, bringing engineering judgment to product calls and product sense to engi	\N	\N	Brazil	remote	\N	$80k - $100k	\N	https://remotive.com/remote-jobs/software-development/staff-software-engineer-product-florianopolis-2090911	https://remotive.com/job/2090911/logo	t	\N	["AWS", "backend", "frontend", "php", "react", "security"]	\N	\N	2026-06-04 23:40:16.129322	2026-06-04 23:40:16.129322
41	Staff Software Engineer, Product (Porto Alegre)	LawnStarter	\N	This is a remote role for candidates located in Porto Alegre, Brazil. About LawnStarter LawnStarter is the nation's leading on-demand marketplace for lawn care and outdoor services, with over $100M in annual bookings. We're expanding beyond lawn care to become the one-stop shop for all home services — operating across three brands (LawnStarter, Lawn Love, Home Gnome) on a single shared platform. About Engineering at LawnStarter We build in small, focused initiative teams: a Product Engineer working alongside a PM and a designer, supported by an Engineering Manager who helps you grow. You'll also work shoulder-to-shoulder with engineering peers across initiatives in a shared codebase. The whole team owns whether the work moves its metric. AI coding agents are a force multiplier here — they give a small, senior team the leverage to ship more, faster, and at a higher bar for quality. We hire engineers who are wired for ownership and energized by shipping to a real marketplace with customers and pros on both sides. The Role You're the engineering anchor of an initiative — working as part of a tight team with your PM and designer, and alongside engineering peers on adjacent initiatives. You have a hand in the full lifecycle: shaping the problem, deciding the technical approach, directing AI agents to implement much of the code, shipping to production, and — with your team — owning the outcome. You're measured by impact, not by lines of code merged. When an agent can ship something safely, your job is to make sure it's done right and the metric moves. When the work calls for careful, hand-written code in a sensitive area, you write it yourself. What makes this role exciting: You ship end-to-end. From problem-framing through production to the post-launch metric review — you see the whole arc and own the result with your team. You work as a true product partner. You sit at the table with PM and design, bringing engineering judgment to product calls and product sense to engi	\N	\N	Brazil	remote	\N	$80k - $100k	\N	https://remotive.com/remote-jobs/software-development/staff-software-engineer-product-porto-alegre-2090909	https://remotive.com/job/2090909/logo	t	\N	["AWS", "backend", "frontend", "php", "react", "security"]	\N	\N	2026-06-04 23:40:16.181469	2026-06-04 23:40:16.181469
42	Staff Software Engineer, Product (São Paulo)	LawnStarter	\N	This is a remote role for candidates located in São Paulo. About LawnStarter LawnStarter is the nation's leading on-demand marketplace for lawn care and outdoor services, with over $100M in annual bookings. We're expanding beyond lawn care to become the one-stop shop for all home services — operating across three brands (LawnStarter, Lawn Love, Home Gnome) on a single shared platform. About Engineering at LawnStarter We build in small, focused initiative teams: a Product Engineer working alongside a PM and a designer, supported by an Engineering Manager who helps you grow. You'll also work shoulder-to-shoulder with engineering peers across initiatives in a shared codebase. The whole team owns whether the work moves its metric. AI coding agents are a force multiplier here — they give a small, senior team the leverage to ship more, faster, and at a higher bar for quality. We hire engineers who are wired for ownership and energized by shipping to a real marketplace with customers and pros on both sides. The Role You're the engineering anchor of an initiative — working as part of a tight team with your PM and designer, and alongside engineering peers on adjacent initiatives. You have a hand in the full lifecycle: shaping the problem, deciding the technical approach, directing AI agents to implement much of the code, shipping to production, and — with your team — owning the outcome. You're measured by impact, not by lines of code merged. When an agent can ship something safely, your job is to make sure it's done right and the metric moves. When the work calls for careful, hand-written code in a sensitive area, you write it yourself. What makes this role exciting: You ship end-to-end. From problem-framing through production to the post-launch metric review — you see the whole arc and own the result with your team. You work as a true product partner. You sit at the table with PM and design, bringing engineering judgment to product calls and product sense to engineering cal	\N	\N	Brazil	remote	\N	$80k - $100k	\N	https://remotive.com/remote-jobs/software-development/staff-software-engineer-product-sao-paulo-2090912	https://remotive.com/job/2090912/logo	t	\N	["AWS", "backend", "frontend", "php", "react", "security"]	\N	\N	2026-06-04 23:40:16.233343	2026-06-04 23:40:16.233343
43	Customer Operations & Writing Specialist	Clerky, Inc.	\N	Here at Clerky, we build software to make legal paperwork easier for startups and their attorneys. We're profitable and growing sustainably. We're the most popular way for high-growth technology startups to form, and are also used by many top-tier startups for hiring and fundraising. As a Customer Operations &amp; Writing Specialist at Clerky, you will be the voice of the company to thousands of startup founders, investors, and attorneys. These customers use Clerky to get critical legal paperwork done, often on a tight timeline. Our success is based on word-of-mouth, so we have a strong culture of providing world-class service (ask us about our satisfaction ratings!). We are rabidly customer-centric. What Makes Customer Operations Different at Clerky It’s a lot harder here. Helping our customers can be unusually challenging due to the nuanced and specialized nature of their questions. Doing the job well can require a lot of iterative feedback, so we're looking for someone who thinks critically about their writing and is always looking for ways to improve. Along the way, you'll also pick up a lot of knowledge about startups and startup law. The challenges never stop. The level of learning and craftsmanship that goes into writing responses to our customers requires intense focus. If you’re looking for the kind of position where you can easily master all the information at the beginning and work in a way that does not require intense focus, this position will probably not be a good fit for you. On the other hand, if you love learning and constantly challenging yourself, this position could be a good fit for you. There are often no right answers. We’re often not able to provide definitive answers to the questions we receive. In many cases, the best we can do is to equip our customers with the information they need to be able to figure out the right answer on their own, or to understand that it isn’t possible to figure out what the right answer is. If you prefer an envir	\N	\N	Worldwide	remote	\N	$12K	\N	https://remotive.com/remote-jobs/customer-service/customer-operations-writing-specialist-2090942	https://remotive.com/job/2090942/logo	t	\N	["AI/ML", "startup", "fundraising", "testing"]	\N	\N	2026-06-04 23:40:16.286718	2026-06-04 23:40:16.286718
44	Staff Software Engineer, Product (Campinas)	LawnStarter	\N	This is a remote role for candidates located in Campinas (Brazil) About LawnStarter LawnStarter is the nation's leading on-demand marketplace for lawn care and outdoor services, with over $100M in annual bookings. We're expanding beyond lawn care to become the one-stop shop for all home services — operating across three brands (LawnStarter, Lawn Love, Home Gnome) on a single shared platform. About Engineering at LawnStarter We build in small, focused initiative teams: a Product Engineer working alongside a PM and a designer, supported by an Engineering Manager who helps you grow. You'll also work shoulder-to-shoulder with engineering peers across initiatives in a shared codebase. The whole team owns whether the work moves its metric. AI coding agents are a force multiplier here — they give a small, senior team the leverage to ship more, faster, and at a higher bar for quality. We hire engineers who are wired for ownership and energized by shipping to a real marketplace with customers and pros on both sides. The Role You're the engineering anchor of an initiative — working as part of a tight team with your PM and designer, and alongside engineering peers on adjacent initiatives. You have a hand in the full lifecycle: shaping the problem, deciding the technical approach, directing AI agents to implement much of the code, shipping to production, and — with your team — owning the outcome. You're measured by impact, not by lines of code merged. When an agent can ship something safely, your job is to make sure it's done right and the metric moves. When the work calls for careful, hand-written code in a sensitive area, you write it yourself. What makes this role exciting: You ship end-to-end. From problem-framing through production to the post-launch metric review — you see the whole arc and own the result with your team. You work as a true product partner. You sit at the table with PM and design, bringing engineering judgment to product calls and product sense to engineer	\N	\N	Brazil	remote	\N	$80k - $100k	\N	https://remotive.com/remote-jobs/software-development/staff-software-engineer-product-campinas-2090913	https://remotive.com/job/2090913/logo	t	\N	["AWS", "backend", "frontend", "php", "react", "security"]	\N	\N	2026-06-04 23:40:16.338647	2026-06-04 23:40:16.338647
45	Staff Product Engineer (Florianópolis)	LawnStarter	\N	This is a remote role for candidates located in Florianópolis, Brazil About LawnStarter LawnStarter is the nation's leading on-demand marketplace for lawn care and outdoor services, with over $100M in annual bookings. We're expanding beyond lawn care to become the one-stop shop for all home services — operating across three brands (LawnStarter, Lawn Love, Home Gnome) on a single shared platform. About Engineering at LawnStarter We're restructuring engineering around initiative teams : a Product Engineer paired with a PM and a designer, with an Engineering Manager who covers a couple of initiatives and supports your growth. The engineer leads AI agents like a team, ships the work, and is accountable — with the rest of the triangle — for whether the initiative moves its metric. We're betting that 1–2 strong engineers running AI agents can outship the labor-team model that defined the last decade of software. That bet only works if the engineers we hire are wired for ownership and can ship to a marketplace with real customers and pros on both sides. The Role You're the engineering anchor of one initiative at a time. The initiative is a team effort — an iron triangle of you, your PM, and your designer — and you have key participation across the full lifecycle: shaping the problem, deciding the technical approach, leading the AI agents that implement most of the code, shipping to production, and answering for the outcome alongside the rest of the triangle. You're accountable for the outcome — not for the volume of code merged. If an agent can ship it safely, your job is to make sure the agent does it right and the metric moves. If the initiative needs hand-written code in a sensitive area, you write it yourself. What makes this role different: You lead AI agents, not humans. Claude Code, Cursor, Codex, and our internal agent stack are your team. You own the quality, safety, and velocity of what they produce. You own an outcome, not a ticket queue. Problem-framing through	\N	\N	Brazil	remote	\N	$80k - $100k	\N	https://remotive.com/remote-jobs/product/staff-product-engineer-florianopolis-2090899	https://remotive.com/job/2090899/logo	t	\N	["AWS", "backend", "frontend", "php", "react", "security"]	\N	\N	2026-06-04 23:40:16.399422	2026-06-04 23:40:16.399422
46	Staff Product Engineer (Belo Horizonte)	LawnStarter	\N	This is a remote role for candidates located in Belo Horizonte, Brazil. About LawnStarter LawnStarter is the nation's leading on-demand marketplace for lawn care and outdoor services, with over $100M in annual bookings. We're expanding beyond lawn care to become the one-stop shop for all home services — operating across three brands (LawnStarter, Lawn Love, Home Gnome) on a single shared platform. About Engineering at LawnStarter We're restructuring engineering around initiative teams : a Product Engineer paired with a PM and a designer, with an Engineering Manager who covers a couple of initiatives and supports your growth. The engineer leads AI agents like a team, ships the work, and is accountable — with the rest of the triangle — for whether the initiative moves its metric. We're betting that 1–2 strong engineers running AI agents can outship the labor-team model that defined the last decade of software. That bet only works if the engineers we hire are wired for ownership and can ship to a marketplace with real customers and pros on both sides. The Role You're the engineering anchor of one initiative at a time. The initiative is a team effort — an iron triangle of you, your PM, and your designer — and you have key participation across the full lifecycle: shaping the problem, deciding the technical approach, leading the AI agents that implement most of the code, shipping to production, and answering for the outcome alongside the rest of the triangle. You're accountable for the outcome — not for the volume of code merged. If an agent can ship it safely, your job is to make sure the agent does it right and the metric moves. If the initiative needs hand-written code in a sensitive area, you write it yourself. What makes this role different: You lead AI agents, not humans. Claude Code, Cursor, Codex, and our internal agent stack are your team. You own the quality, safety, and velocity of what they produce. You own an outcome, not a ticket queue. Problem-framing throu	\N	\N	Brazil	remote	\N	$80k - $100k	\N	https://remotive.com/remote-jobs/product/staff-product-engineer-belo-horizonte-2090900	https://remotive.com/job/2090900/logo	t	\N	["AWS", "backend", "frontend", "php", "react", "security"]	\N	\N	2026-06-04 23:40:16.469696	2026-06-04 23:40:16.469696
47	Staff Product Engineer (Porto Alegre)	LawnStarter	\N	This is a remote role for candidates located in Porto Alegre, Brazil. About LawnStarter LawnStarter is the nation's leading on-demand marketplace for lawn care and outdoor services, with over $100M in annual bookings. We're expanding beyond lawn care to become the one-stop shop for all home services — operating across three brands (LawnStarter, Lawn Love, Home Gnome) on a single shared platform. About Engineering at LawnStarter We're restructuring engineering around initiative teams : a Product Engineer paired with a PM and a designer, with an Engineering Manager who covers a couple of initiatives and supports your growth. The engineer leads AI agents like a team, ships the work, and is accountable — with the rest of the triangle — for whether the initiative moves its metric. We're betting that 1–2 strong engineers running AI agents can outship the labor-team model that defined the last decade of software. That bet only works if the engineers we hire are wired for ownership and can ship to a marketplace with real customers and pros on both sides. The Role You're the engineering anchor of one initiative at a time. The initiative is a team effort — an iron triangle of you, your PM, and your designer — and you have key participation across the full lifecycle: shaping the problem, deciding the technical approach, leading the AI agents that implement most of the code, shipping to production, and answering for the outcome alongside the rest of the triangle. You're accountable for the outcome — not for the volume of code merged. If an agent can ship it safely, your job is to make sure the agent does it right and the metric moves. If the initiative needs hand-written code in a sensitive area, you write it yourself. What makes this role different: You lead AI agents, not humans. Claude Code, Cursor, Codex, and our internal agent stack are your team. You own the quality, safety, and velocity of what they produce. You own an outcome, not a ticket queue. Problem-framing through	\N	\N	Brazil	remote	\N	$80k - $100k	\N	https://remotive.com/remote-jobs/product/staff-product-engineer-porto-alegre-2090901	https://remotive.com/job/2090901/logo	t	\N	["AWS", "backend", "frontend", "php", "react", "security"]	\N	\N	2026-06-04 23:40:16.542035	2026-06-04 23:40:16.542035
48	Data Labeling Specialists	Workada	\N	Who We Are Workada creates high-quality labeled data for advanced technology systems. Our team reviews, organizes, categorizes, evaluates, and quality-checks digital content so those systems can better understand information and perform real-world tasks. We believe careful data work matters. Every reviewed item, categorized example, and quality-checked task helps improve how technology interprets information, follows instructions, and responds in practical settings. About You We're hiring detail-oriented individuals who are comfortable working on a computer and interested in careful, focused digital work. We're especially interested in: People who can carefully review written information, images, documents, or other digital content Strong readers and writers with good judgment People who can follow detailed instructions consistently Individuals who are comfortable using web-based tools and online platforms People who take quality seriously and can spot mistakes or inconsistencies Those who enjoy focused, independent work while contributing to a larger project Strong character matters — we value integrity, reliability, curiosity, and a commitment to high-quality work Qualifications Comfortable using a computer for extended periods Reliable internet connection Strong attention to detail Ability to follow written guidelines and project instructions Clear written communication skills Basic familiarity with spreadsheets, online forms, or web-based work tools Ability to work independently and meet deadlines Prior experience in data labeling, annotation, quality review, research, writing, customer support, operations, or administrative work is helpful but not required Compensation Compensation is $18- $22 an hour and a max of 40 hours a week. A Place to Do Meaningful Work Data labeling may sound simple, but it plays an important role in improving the technology people use every day. At Workada, your work helps create the examples and feedback that make advanced systems mor	\N	\N	USA	remote	\N	$18 - $22/hr	\N	https://remotive.com/remote-jobs/data/data-labeling-specialists-2090903	https://remotive.com/job/2090903/logo	t	\N	["research", "digital content", "spreadsheets"]	\N	\N	2026-06-04 23:40:16.597503	2026-06-04 23:40:16.597503
49	Staff Product Engineer (Campinas)	LawnStarter	\N	This is a remote role for candidates located in Campinas, Brazil. About LawnStarter LawnStarter is the nation's leading on-demand marketplace for lawn care and outdoor services, with over $100M in annual bookings. We're expanding beyond lawn care to become the one-stop shop for all home services — operating across three brands (LawnStarter, Lawn Love, Home Gnome) on a single shared platform. About Engineering at LawnStarter We're restructuring engineering around initiative teams : a Product Engineer paired with a PM and a designer, with an Engineering Manager who covers a couple of initiatives and supports your growth. The engineer leads AI agents like a team, ships the work, and is accountable — with the rest of the triangle — for whether the initiative moves its metric. We're betting that 1–2 strong engineers running AI agents can outship the labor-team model that defined the last decade of software. That bet only works if the engineers we hire are wired for ownership and can ship to a marketplace with real customers and pros on both sides. The Role You're the engineering anchor of one initiative at a time. The initiative is a team effort — an iron triangle of you, your PM, and your designer — and you have key participation across the full lifecycle: shaping the problem, deciding the technical approach, leading the AI agents that implement most of the code, shipping to production, and answering for the outcome alongside the rest of the triangle. You're accountable for the outcome — not for the volume of code merged. If an agent can ship it safely, your job is to make sure the agent does it right and the metric moves. If the initiative needs hand-written code in a sensitive area, you write it yourself. What makes this role different: You lead AI agents, not humans. Claude Code, Cursor, Codex, and our internal agent stack are your team. You own the quality, safety, and velocity of what they produce. You own an outcome, not a ticket queue. Problem-framing through pro	\N	\N	Brazil	remote	\N	$80k - $100k	\N	https://remotive.com/remote-jobs/product/staff-product-engineer-campinas-2090902	https://remotive.com/job/2090902/logo	t	\N	["AWS", "backend", "frontend", "php", "react", "security"]	\N	\N	2026-06-04 23:40:16.654073	2026-06-04 23:40:16.654073
50	Staff Product Engineer (São Paulo)	LawnStarter	\N	This is a remote role for candidates located in São Paulo (Brazil) About LawnStarter LawnStarter is the nation's leading on-demand marketplace for lawn care and outdoor services, with over $100M in annual bookings. We're expanding beyond lawn care to become the one-stop shop for all home services — operating across three brands (LawnStarter, Lawn Love, Home Gnome) on a single shared platform. About Engineering at LawnStarter We're restructuring engineering around initiative teams : a Product Engineer paired with a PM and a designer, with an Engineering Manager who covers a couple of initiatives and supports your growth. The engineer leads AI agents like a team, ships the work, and is accountable — with the rest of the triangle — for whether the initiative moves its metric. We're betting that 1–2 strong engineers running AI agents can outship the labor-team model that defined the last decade of software. That bet only works if the engineers we hire are wired for ownership and can ship to a marketplace with real customers and pros on both sides. The Role You're the engineering anchor of one initiative at a time. The initiative is a team effort — an iron triangle of you, your PM, and your designer — and you have key participation across the full lifecycle: shaping the problem, deciding the technical approach, leading the AI agents that implement most of the code, shipping to production, and answering for the outcome alongside the rest of the triangle. You're accountable for the outcome — not for the volume of code merged. If an agent can ship it safely, your job is to make sure the agent does it right and the metric moves. If the initiative needs hand-written code in a sensitive area, you write it yourself. What makes this role different: You lead AI agents, not humans. Claude Code, Cursor, Codex, and our internal agent stack are your team. You own the quality, safety, and velocity of what they produce. You own an outcome, not a ticket queue. Problem-framing through pr	\N	\N	Brazil	remote	\N	$80k - $100k	\N	https://remotive.com/remote-jobs/product/staff-product-engineer-sao-paulo-2090890	https://remotive.com/job/2090890/logo	t	\N	["AWS", "backend", "frontend", "php", "react", "security"]	\N	\N	2026-06-04 23:40:16.709667	2026-06-04 23:40:16.709667
51	Mid/Senior AI Cinematic Video Editor	EverAI	\N	Our Vision &amp; Products 🚀 EverAI — Building the Future of AI Companionship One of the Top 15 Largest &amp; Fastest-Growing AI Companies in the World 50 Million Users in 2 years — Help Us Reach 100M first, 500M next At EverAI , we’re shaping what it means to connect with AI. With 50 million users and counting , we're not just building products — we're creating entirely new categories. Our flagship product is the world’s largest AI companionship platform , redefining relationships for millions. It is governed by our proprietary moderation system, EverGuard — an internal AI designed to ensure everything we build is safe, ethical, and human-first . And we’re only just getting started! Our Team We are an enthusiastic, passionate and hardworking team of ≈ 75 people. Our founding team has strong entrepreneurial experience building and scaling web products from 0 to IPO. Alexis Soulopoulos [CEO] • 10+ years in Tech Executive Leadership • Co-Founder Mad Paws Holdings (from 0 to IPO) • Forbes 30 under 30 + Deloitte TechFast50 ’22 &amp; ‘23 Michael Monin [Co-founder &amp; CTO] • 10+ years as CTO / COO (web2/web3), 1+ year in AI/LLM • Serial-entrepreneur: MTK Digital (exited / 0-&gt;$20m revenue) and Zipchat (AI Chatbot for E-commerce brands) Thomas Lacroix [Co-founder &amp; CMO] • 8+ years in Customer Acquisition &amp; E-commerce Growth • Serial-entrepreneur: Curatible (sold to Blackstone) and MTK Digital (exited / 0-&gt;$20m revenue) Maruša Fasano [CFO/Legal] • 25+ years in Finance, Strategy, M&amp;A • Ex-CFO/M&amp;A @Curatible (exited to Blackstone) • Ex-President of the Board @SotremoSA (exited) • Co-founder/CFO @SoftOne (exited) Your Role We are looking for a Mid/Senior AI Cinematic Video Editor who is deeply embedded in generative video workflows and can independently craft high-quality, narrative-driven content from concept to final output. You are a sharp-eyed video editor comfortable operating at the intersection of creativity and emerging technology, building visu	\N	\N	Worldwide	remote	\N	\N	\N	https://remotive.com/remote-jobs/artificial-intelligence/mid-senior-ai-cinematic-video-editor-2090887	https://remotive.com/job/2090887/logo	t	\N	["excel", "video", "AI/ML", "customer acquisition", "graphic design", "video production"]	\N	\N	2026-06-04 23:40:16.766317	2026-06-04 23:40:16.766317
52	Senior Independent Software Developer	A.Team	\N	You must be located in the Americas, Europe, or Israel to apply. A·Team is a VC-backed, stealth, application-only home on the internet for senior independent software builders to team up with hand-picked, high-growth companies on their next big thing. After talking with hundreds of independent engineers, designers, and product folks, we heard over and over that finding vetted, high-quality, consistent clients is hard, and projects are often too small to be rewarding. A·Team matches small teams of the most talented builders in the world with companies backed by a16z, YC, Softbank, General Catalyst, etc. on a contract basis for many of their most important initiatives. We quietly launched in May 2020, and have helped A·Teamers earn $85+ million since. As part of A·Team, you can expect: High-paying, meaningful missions with the most audacious companies sent your way; generally $90-$150+/hr, with vetted, fascinating clients doing work that matters. We're picky about who we partner with; new clients only come in via trusted referral. We've worked with Lyft, McGraw Hill, ClearCo, Pepsi, Walmart, the former CEO of Waze, the leading vaccine production software, several new unicorns we can't say here, and dozens of startups backed by a16z/YC/Softbank/Insight/Tiger/etc. Work alongside friends old &amp; new: our niche is small/diverse product teams, since clients with larger budgets and higher-impact work tell us they want teams, not individuals. Of course, we keep friends together whenever we can. Full autonomy: say "no" to things that don't excite you. The most talented builders often juggle a few things at once, so there's never pressure to join an A·Team mission if you don't have the bandwidth. If we're no longer a fit, it's easy to leave or pause too. Small, curated, off-the-record gatherings: for conversations hard to have elsewhere. Long-term, we're creating micro-communities for the world's top builders to become friends around the things they care about. Keep 100% of 	\N	\N	Americas, Europe, Israel	remote	\N	$90 - $150 /hour	\N	https://remotive.com/remote-jobs/software-development/senior-independent-software-developer-1919265	https://remotive.com/job/1919265/logo	t	\N	["go", "wordpress", "chat", "apple", "testing", "catalyst"]	\N	\N	2026-06-04 23:40:16.821811	2026-06-04 23:40:16.821811
53	Senior Independent AI Engineer / Architect	A.Team	\N	Senior Independent AI Engineer / Architect Remote | Americas, Europe, or Israel Most AI engineers can find work. Finding work worth doing is harder. A.Team is an invite-only network of senior AI engineers, ML engineers, and AI architects building production AI systems for startups, enterprises, and global companies. Since 2020, builders in the network have earned more than $200M working with companies including Lyft, Google X, HCA, Unilever, Sightful, D-ID, and others. The Work You'll join small teams solving real problems. Not demos. Not proof-of-concepts that never ship. Not another thin wrapper around an API. Recent work has included: AI-native products built from 0→1 Agent architectures and orchestration systems Enterprise AI deployments Retrieval, evaluation, and reliability infrastructure LLM-powered workflows and products Machine learning platforms operating at scale You'll work directly with founders, CTOs, and product leaders, helping shape both technical direction and execution. Why Builders Join The best opportunities rarely make it to the open market. A.Team exists to solve that. No bidding. No prospecting. No race to the bottom. Just ambitious companies, difficult problems, and experienced peers. Who Thrives Here People who have already shipped. Engineers who have deployed AI systems into production, understand the tradeoffs behind the hype, and know how to turn technical complexity into business value. What matters is a track record of building and shipping. The Details Typical rates: $120-$170/hr Remote You keep 100% of your rate Not a Fit Early-career engineers People without production AI experience Small gig seekers Developers focused primarily on simple AI wrappers or templated implementations Apply Tell us what you've built. 👉 build.a.team/apply-ai . We'll take it from there.	\N	\N	Americas, Europe, Israel	remote	\N	$120 - $170 /hour	\N	https://remotive.com/remote-jobs/software-development/senior-independent-ai-engineer-architect-1919266	https://remotive.com/job/1919266/logo	t	\N	["go", "UI/UX", "wordpress", "chat", "apple", "testing"]	\N	\N	2026-06-04 23:40:16.8778	2026-06-04 23:40:16.8778
54	Senior Full-stack React Developer	Lemon.io	\N	Are you a talented Senior Developer looking for a remote job that lets you show your skills and get decent compensation? Look no further than Lemon.io — the marketplace that connects you with hand-picked startups in the US and Europe. What we offer: The rate depends on your seniority level, skills and experience. We've already paid out over $11M to our engineers. No more hunting for clients or negotiating rates — let us handle the business side of things so you can focus on what you do best. We'll manually find the best project for you according to your skills and preferences. Choose a schedule that works best for you. It’s possible to communicate async or minimally overlap within team working hours. We respect your seniority so you can expect no micromanagement or screen trackers. Communicate directly with the clients. Most of them have technical backgrounds. Sounds good, yeah? We will support you from the time you submit the application throughout all cooperation stages. Most of our projects involve working in a fast-paced startup environment. We hope you like it as much as we do. Through our community, we will connect you with the best developers from more than 71 countries. We have several open positions for Full-Stack React.js Developers - please see the details below. We also have some backend positions; the full list is included below as well. Requirements for the Senior React &amp; Python Position: 4+ years of software development experience Commercial experience: React.js 3+ years and Python 3+ years OR React.js 2+ years and Python 5+ years OR React.js 5+ years and Python 2+ years Experience with AWS, GCP, or Azure is required Requirements for the Senior Python Position: 5+ years of software development experience 5+ years of commercial experience with Python 3+ years of commercial experience with Flask Requirements for the Senior Golang &amp; React Position: 4+ years of software development experience React.js 3+ years and Golang 3+ years OR React.js 2+ ye	\N	\N	Americas, Europe, Asia, Oceania	remote	\N	\N	\N	https://remotive.com/remote-jobs/software-development/senior-full-stack-react-developer-2088711	https://remotive.com/job/2088711/logo	t	\N	[".Net", "android", "AWS", "azure", "backend", "C"]	\N	\N	2026-06-04 23:40:16.95348	2026-06-04 23:40:16.95348
55	Tech Lead Full-Stack Rails Engineer	Mitre Media	\N	About Mitre Media Mitre Media is redefining FinTech with AI-driven tools that empower millions of investors. Our portfolio, including Dividend.com and MutualFunds.com, leverages LLMs to deliver novel data insights and visually rich user experiences. For over a decade, we’ve served individual investors, financial advisors, and top asset managers like BlackRock and Vanguard through our premium data, tools, and advertising solutions. Join our lean, entrepreneurial team to shape the future of AI-powered investing from your location ±3 hours from Eastern Time. Our users are deeply engaged, spending over 5 minutes per visit with a bounce rate below 10%, researching investments across hundreds of different categories. With 40 million brokerage accounts in the U.S., we take pride in building tools that make a real impact, fostering a culture of trust, innovation, and dynamism. If you’re passionate about financial technology and AI, we’d love to connect! About the Role As a Full-Stack Rails Tech Lead, you’ll architect and implement LLM-powered web applications within our microservices-based Rails 8 platform. Reporting directly to our CTO, you’ll collaborate with a small, high-impact team to deliver user experiences across Dividend.com, MutualFunds.com and other brands within our portfolio. This role combines expert Ruby on Rails skills with AI integration expertise, requiring you to leverage LLMs in your development workflow, state management and user interactions. You’ll work in a remote-first hybrid environment, which encourages in person collaboration, using ShapeUp to manage projects that trade-off on-time delivery for de-scoped outcomes. As a technical leader, you'll have a seat at the table shaping system architecture, implementing core features all while embracing an entrepreneurial mindset and a “get things done” mentality. Responsibilities Architect and maintain Rails applications (Rails 8) Integrate LLMs into our microservices architecture for state management and 	\N	\N	USA, Canada, USA timezones	remote	\N	$170k - $200k	\N	https://remotive.com/remote-jobs/software-development/tech-lead-full-stack-rails-engineer-2069746	https://remotive.com/job/2069746/logo	t	\N	["api", "CSS", "docker", "elasticsearch", "fullstack", "html"]	\N	\N	2026-06-04 23:40:17.010101	2026-06-04 23:40:17.010101
56	Business Transformation Lead	Expion Health	\N	Title : Business Transformation Lead Location : Fully Remote Reports To : President, Service &amp; Growth Expion Health is building the future of pharmacy economics. As architects of prescription economics, we design how pharmacy value is created, aligning cost, clinical decisions, and performance into one accountable system that moves beyond rebates. We help organizations stay ahead of pharmacy market change with clear insight, bold thinking, and strategies built for what's next-leading the next era of prescription economics. The Role As our Business Transformation Lead , you'll be the architect and driver of how we embed AI into the way every team in our company works. This isn't a slide-deck strategy role. You'll be on the ground with department leaders, identifying real workflow opportunities, turning them into real solutions, and building the internal capability that makes the transformation stick. You'll lead our AI Champions program, partner directly with executive leadership, and own the roadmap that takes Expion Health from an organization that uses AI tools to one that runs on AI intelligence. If you've spent time figuring out how to make AI work in the real world - not just in theory - and you want to do it at a company that's fast, innovative, and genuinely committed to this, this role was built for you. What You'll Own Drive Transformation (65%) Own the AI transformation roadmap end-to-end - from strategy to execution - and keep it moving in a fast-paced environment Run discovery sessions with department leaders across Sales, Client Management, Clinical, Finance, Operations, IT, and Trade to surface high-impact AI opportunities Design and lead our AI Champions program - recruiting, training, and developing a network of department-level AI advocates across the organization Build and deliver role-based AI learning pathways tailored to the specific needs of each department Partner with the executive team to ensure AI initiatives are prioritized, resourced,	\N	\N	USA	remote	\N	$175k - $225k	\N	https://remotive.com/remote-jobs/artificial-intelligence/business-transformation-lead-2090881	https://remotive.com/job/2090881/logo	t	\N	["api", "AI/ML", "automation", "healthcare", "spark", "startup"]	\N	\N	2026-06-04 23:40:17.0774	2026-06-04 23:40:17.0774
57	Office Assistant	Coalition Technologies 	\N	WHY YOU SHOULD APPLY: Coalition Technologies is devoted to delivering clients the highest quality work while providing our team a fun, thriving, and innovative environment. Along with the opportunity for tremendous career growth and rapid advancement, CT offers: The most competitive profit-sharing bonus plan in the industry, paying up to 50% of company profits to full-time employees each month! A highly competitive Paid Time Off plan, promoting quality work-life balance. Subsidized gym memberships to help team members feel their best. Medical, dental, vision, and life insurance packages for all US-based team members. International Health Insurance Reimbursement Program for all international team members, a benefit unique to Coalition. Device upgrade and learning reimbursement programs. Motivating career development plans with clearly defined goals and rewards. Additional job-specific incentives and bonuses. Plus, 100% of our team works remotely with the support of time tracking software. Our company culture specializes in supporting remote team members, and we’ve been doing so for more than a decade. CT welcomes your application, wherever in the world it's coming from! YOU SHOULD HAVE: Willingness to learn, grow, and collaborate with the team and company as a whole. Excellent verbal and written communication skills. A high level of discretion, ethics, and trustworthiness. Intermediate spreadsheet skills (preferred) Innovative thinking and a willingness to challenge existing methods where improvement is possible. Experience in bookkeeping / financial record keeping (preferred). Experience with Google Sheets or Excel, Quickbooks Online, and G-Suite (preferred). The availability to work 40 hours per week from 9:00 am to 6:00 pm PST. A reliable space to work remotely with a fast computer, quality internet, camera, microphone, and speakers. YOUR DUTIES AND TASKS: Answering phones and emails. Completing entry-level bookkeeping, including recording expenses, organizing rec	\N	\N	Worldwide	remote	\N	$31,2k- $52k	\N	https://remotive.com/remote-jobs/marketing/office-assistant-1680495	https://remotive.com/job/1680495/logo	t	\N	["CSS", "excel", "frontend", "git", "html", "illustrator"]	\N	\N	2026-06-04 23:40:17.1344	2026-06-04 23:40:17.1344
58	Director of Revenue Systems and AI Automation (Offshore) 	Caul Group	\N	This search is open exclusively to candidates based in Latin America. Preference for Uruguay, Costa Rica, or Colombia. BACKGROUND CONTEXT Every department at Caul Group is generating AI and automation ideas faster than they can be built. This role turns those ideas into operational reality — and finds the ones nobody thought to ask about yet. You are not advising. You are not consulting. You own the systems layer of this business and make it faster, cleaner, and more profitable — auditing what we have, identifying what is broken, redundant, or missing, and building the infrastructure that fixes it permanently. This is a deeply technical, execution-focused role for someone who thinks in system connections. When someone says "our Google LSA leads are not showing up correctly in Follow Up Boss," you trace the integration chain, find where the handoff failed, and build the fix. You do not wait to be asked. Your primary collaborators: the Founder, the Broker in Charge, the Director of Marketing, and the Founder's Chief of Staff. The defining partnership is with the Director of Marketing. They own creative, campaigns, and the team. You own the infrastructure — attribution architecture, lead pipeline connections, systems tracking what works from first ad impression through closed transaction. They read the output. You build and tune the machine. If you worked here last week, you might have: Scoped and deployed a Zapier integration between Follow Up Boss and ClickFunnels so new leads from Ylopo automatically get tagged, assigned, and entered into the correct pipeline, eliminating the daily manual lead routing the team was doing every morning and stopping revenue from falling through the cracks Built an automated coaching intelligence system that pulls agent call data from Follow Up Boss, breaks it down by agent, and delivers a weekly report to each coach using Claude to analyze call patterns, flag agents avoiding follow-ups, identify cold databases, and surface conversion g	\N	\N	LATAM	remote	\N	$60k–$72k	\N	https://remotive.com/remote-jobs/artificial-intelligence/director-of-revenue-systems-and-ai-automation-offshore-2090878	https://remotive.com/job/2090878/logo	t	\N	["api", "AI/ML", "automation", "documentation", "CRM", "analytics"]	\N	\N	2026-06-04 23:40:17.1984	2026-06-04 23:40:17.1984
59	iOS Developer	nooro	\N	WHO ARE WE? At nooro, we're revolutionizing pain management for seniors. Our platform is transforming how older adults engage with pain management at home. We're on a mission to make wellness more accessible and effective through technology. Check our website here: https://nooro-us.com/ We're a fast-moving startup that works on quick iteration and bold decisions. Our team is lean, agile, and empowered to make meaningful impacts daily. If you enjoy a dynamic environment where ideas become a reality at lightning speed and you're not afraid to wear multiple hats, you'll fit right in. WHAT WILL YOU DO? - Own and drive the development of our iOS application - Build elegant, performant features using **Swift (We’re 100% Swift!)** and **SwiftUI** - Implement complex UI/UX designs from **Figma** with pixel-perfect accuracy - Ensure app performance, quality, and responsiveness - Collaborate with our backend team on API integration - Write clean, modular, and reusable code - Participate in code reviews and architectural decisions - Help shape our mobile development practices HOW TO APPLY? If you believe we're the right fit, please fill in this form: https://forms.gle/xeL6pPbdjMHo11A28 WHAT ARE THE REQUIREMENTS? - 5+ years of professional iOS development experience - Strong expertise in Swift and SwiftUI - Deep understanding of iOS platform capabilities and limitations - Experience with iOS app architecture (MVVM preferred) - Experience with Core Data and local storage solutions - Proficiency in making RESTful API calls and handling responses - Experience with dependency injection on iOS - Strong version control skills with Git/GitHub - Experience with App Store deployment and TestFlight - Knowledge of iOS security best practices APPLYING PROCESS STEP 1 | QUESTIONNAIRE: If you believe we're the right fit, please fill in this form: https://forms.gle/xeL6pPbdjMHo11A28 STEP 2 | TEST: Once we review your form submission, we will send you a test STEP 3 | TECHNICAL INTERVIEW: Once w	\N	\N	USA	remote	\N	$60k-$130k (depending on experience)	\N	https://remotive.com/remote-jobs/software-development/ios-developer-1956455	https://remotive.com/job/1956455/logo	t	\N	["api", "backend", "git", "ios", "security", "swift"]	\N	\N	2026-06-04 23:40:17.263043	2026-06-04 23:40:17.263043
60	Inside Sales Contractor	Credit Wellness, LLC	\N	About Us We are a financial services start up focusing on helping to improve consumer credit profiles. We are currently seeking KPI driven sales representatives looking to earn up to 45K in their first year while working remotely. We offer comprehensive training and continuous sales coaching to help you meet your financial goals. During our training period we offer a guaranteed training stipend while our trainees are acclimating to the position (*see weekly pay below). If you are a seasoned sales professional looking for the autonomy of a remote position combined with great compensation, we want to hear from you! Compensation Structure This role is 100% commission-based , which means your earning potential is unlimited. In addition, we regularly offer competitive performance-based bonuses to reward hard work and results. Training Period (Weeks 1–4) We invest in your success and want to make sure you’re supported as you get up to speed: Week 1: Commission-only (a chance to start earning right away while learning the ropes). Weeks 2–4: Guaranteed training stipend of $1,000 total – or your commission if it’s higher. You’ll always receive whichever amount benefits you most. Week 2: $250 guaranteed minimum Week 3: $325 guaranteed minimum Week 4: $425 guaranteed minimum By the end of training, you’ll have the skills to maximize commissions, with the safety net of a guaranteed base during your ramp-up period. Post Training Period: Average first year OTE: 25K-35K (US) Annually Top Rep first year OTE: 35K-45K (US) Annually *The above is the average pay you can expect, however, there is unlimited earning potential for those who are financially motivated top performers looking to exceed sales targets. What will you be doing? Educating inbound callers on their credit standing by providing consultations with the goal of enrolling them in one of our services should they be a good fit. We are looking for team members who are: Tech savvy with the ability to navigate digital tools s	\N	\N	Worldwide	remote	\N	OTE $25k - $35k	\N	https://remotive.com/remote-jobs/sales/inside-sales-contractor-2086540	https://remotive.com/job/2086540/logo	t	\N	["CRM", "google sheets", "financial services", "Inside Sales"]	\N	\N	2026-06-04 23:40:17.329292	2026-06-04 23:40:17.329292
61	Freelance Writer	IAPWE	\N	Our organization is seeking content writers to create articles and blog posts on a variety of topics. The rate of pay is $20 per 100 words (this comes out to approximately $100 per article or $50 per hour). Some topics you may be asked to write about include the following (you can always turn down a topic if you do not feel comfortable writing about it, however if you have experience or expertise in a specific area, please let us know): Health &amp; beauty Fitness Home Decor Fashion Sports Do it yourself Finance Legal Medical Family/Parenting Relationships Real Estate Restaurants Contracting (plumbing, pool building, remodeling, etc.) These are just some of the more general industries and topics that we cover. Requirements : We ask that all work be completed using a word processor such as Microsoft Word or Open Office A reliable internet connection and the ability to meet deadlines Good communication skills and respond in a timely manner to editorial staff when they ask for updates on tasks, etc Work well as a team member with the rest of our content management and editorial staff Note : Applicants to this job signaled that accessing some writing tasks may require payment.	\N	\N	Worldwide	remote	\N	$50-$75 /hour	\N	https://remotive.com/remote-jobs/writing/freelance-writer-1185979	https://remotive.com/job/1185979/logo	t	\N	["REST"]	\N	\N	2026-06-04 23:40:17.381164	2026-06-04 23:40:17.381164
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, "userId", type, title, message, "isRead", metadata, "createdAt") FROM stdin;
1	1	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-09 16:25:17.125885
2	1	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-09 17:18:38.54168
3	1	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-09 17:18:38.55459
4	5	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-13 06:43:29.907714
5	6	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-13 07:09:04.414499
6	6	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-13 07:09:22.096319
7	6	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-13 07:09:22.107944
8	7	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-13 09:46:16.321667
9	7	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-13 09:46:33.361878
10	7	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-13 09:46:33.376211
14	9	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-13 11:58:26.984132
13	8	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	t	{"achievementId":15,"points":40}	2026-05-13 09:48:36.06176
12	8	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	t	{"achievementId":2,"points":10}	2026-05-13 09:48:36.05581
11	8	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	t	{"achievementId":1,"points":5}	2026-05-13 09:48:23.853525
15	1	achievement	Новое достижение!	💬 Вы получили достижение «Участник форума»: Написал первое сообщение на форуме (+10 очков)	f	{"achievementId":7,"points":10}	2026-05-18 09:13:30.414294
16	10	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 08:35:46.852458
17	11	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 08:36:23.217248
18	12	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 08:37:00.463079
20	14	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:49:20.357524
21	15	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:49:36.340483
22	16	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:49:57.478526
23	17	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:50:17.257166
24	18	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:50:34.285501
25	19	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:50:51.822231
26	20	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:51:12.050038
19	13	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	t	{"achievementId":1,"points":5}	2026-05-21 09:49:00.022589
27	21	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:51:31.454732
28	22	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:51:48.764048
29	23	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:52:04.189496
30	24	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:52:19.997924
31	25	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:52:36.895324
32	26	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:52:53.406614
33	27	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:53:09.853696
34	28	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:53:28.68588
35	29	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:53:44.571935
36	30	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:54:02.598454
37	31	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:54:21.785925
38	32	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:54:47.821328
39	33	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:55:07.424845
40	34	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:55:26.347601
41	35	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:55:52.571481
42	36	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:56:14.47157
43	37	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:56:31.751802
44	38	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:56:48.542856
45	39	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:57:06.332477
46	40	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:57:25.277337
47	41	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:57:44.836725
48	42	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:58:02.546839
49	43	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:58:18.775591
50	44	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:58:37.573565
51	45	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:58:58.715167
52	46	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:59:16.822215
53	47	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 09:59:42.651172
54	48	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:00:01.85926
55	49	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:00:19.274928
56	50	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:00:38.347894
57	51	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:00:54.068828
58	52	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:01:31.620634
59	53	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:01:50.588322
60	54	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:02:07.533046
61	55	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:02:26.621875
62	56	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:02:45.832899
63	57	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:03:04.869813
64	58	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:03:23.037581
65	59	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:03:42.652677
66	60	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:06:32.035054
67	61	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:06:48.641807
68	62	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:07:05.848496
69	63	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:07:24.501724
70	64	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:07:43.283983
71	65	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:08:02.245413
72	66	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:08:21.634788
73	67	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:08:40.39784
74	68	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:08:59.82472
75	69	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:09:23.602054
76	70	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:09:43.425143
77	71	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:10:02.934556
78	72	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-21 10:10:21.019525
79	8	achievement	Новое достижение!	✏️ Вы получили достижение «Первые шаги»: Сдал первое задание (+15 очков)	f	{"achievementId":3,"points":15}	2026-05-22 08:42:19.076664
82	14	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-22 08:43:25.57864
83	14	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-22 08:43:25.584547
84	15	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-22 08:43:43.426015
80	13	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	t	{"achievementId":2,"points":10}	2026-05-22 08:43:07.082272
85	15	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-22 08:43:43.430992
86	16	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-22 08:44:02.107471
87	16	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-22 08:44:02.109882
88	17	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-22 08:44:17.910237
89	17	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-22 08:44:17.917401
90	18	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-22 08:44:34.787332
91	18	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-22 08:44:34.793219
92	19	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-22 08:44:49.55769
93	19	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-22 08:44:49.559519
94	20	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-22 08:45:04.303152
95	20	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-22 08:45:04.307468
96	21	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-22 08:45:19.088588
97	21	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-22 08:45:19.093733
98	22	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-22 08:45:34.949365
99	22	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-22 08:45:34.950403
101	14	achievement	Новое достижение!	✏️ Вы получили достижение «Первые шаги»: Сдал первое задание (+15 очков)	f	{"achievementId":3,"points":15}	2026-05-22 08:47:01.923636
103	8	achievement	Новое достижение!	💬 Вы получили достижение «Участник форума»: Написал первое сообщение на форуме (+10 очков)	f	{"achievementId":7,"points":10}	2026-05-22 09:02:25.238974
104	14	achievement	Новое достижение!	💬 Вы получили достижение «Участник форума»: Написал первое сообщение на форуме (+10 очков)	f	{"achievementId":7,"points":10}	2026-05-22 09:02:57.331894
105	8	achievement	Новое достижение!	🔍 Вы получили достижение «Рецензент»: Выполнил первую взаимооценку (+15 очков)	f	{"achievementId":10,"points":15}	2026-05-22 12:02:23.795895
106	73	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-24 10:14:19.41159
107	73	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-05-24 10:14:28.883244
108	73	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-05-24 10:14:28.888769
109	74	achievement	Новое достижение!	🎉 Вы получили достижение «Добро пожаловать!»: Зарегистрировался на сайте (+5 очков)	f	{"achievementId":1,"points":5}	2026-05-24 17:32:20.865925
110	7	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.32272
111	8	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.344365
113	14	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.362078
100	13	achievement	Новое достижение!	✏️ Вы получили достижение «Первые шаги»: Сдал первое задание (+15 очков)	t	{"achievementId":3,"points":15}	2026-05-22 08:46:35.971227
114	15	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.369612
115	16	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.380874
116	17	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.388815
117	18	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.394029
118	19	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.399766
119	20	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.406667
120	21	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.4126
121	22	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.422422
122	1	assignment	⏰ Дедлайн через 1 час	Задание «Локальное хранение и пакетная отправка» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":87,"reminderLabel":"1 час"}	2026-05-31 23:00:00.43318
123	73	assignment	⏰ Дедлайн через 1 час	Задание «Основы кибербезопасности: анализ уязвимости» истекает 31 мая в 23:59. Не забудьте сдать работу!	f	{"assignmentId":151,"reminderLabel":"1 час"}	2026-05-31 23:00:00.44141
124	23	achievement	Новое достижение!	📚 Вы получили достижение «Студент»: Записался на первый курс (+10 очков)	f	{"achievementId":2,"points":10}	2026-06-09 09:24:17.844003
125	23	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	f	{"achievementId":15,"points":40}	2026-06-09 09:24:17.903045
81	13	achievement	Новое достижение!	🎓 Вы получили достижение «Активный студент»: Записан хотя бы на один курс (+40 очков)	t	{"achievementId":15,"points":40}	2026-05-22 08:43:07.083271
102	13	achievement	Новое достижение!	💬 Вы получили достижение «Участник форума»: Написал первое сообщение на форуме (+10 очков)	t	{"achievementId":7,"points":10}	2026-05-22 08:59:09.684235
112	13	assignment	⏰ Дедлайн через 1 час	Задание «Серводвигатель и потенциометр» истекает 31 мая в 23:59. Не забудьте сдать работу!	t	{"assignmentId":26,"reminderLabel":"1 час"}	2026-05-31 23:00:00.353528
126	13	achievement	Новое достижение!	🔍 Вы получили достижение «Рецензент»: Выполнил первую взаимооценку (+15 очков)	t	{"achievementId":10,"points":15}	2026-06-09 09:34:47.131367
\.


--
-- Data for Name: olympiad_problems; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.olympiad_problems (id, olympiad_id, title, description, input_description, output_description, examples, difficulty, points, order_index) FROM stdin;
1	3	Сумма двух чисел	Даны два целых числа a и b. Найдите их сумму.	В единственной строке входных данных через пробел записаны два целых числа a и b (−10⁹ ≤ a, b ≤ 10⁹).	Выведите одно целое число — сумму a и b.	[{"input": "5 3", "output": "8", "explanation": "5 + 3 = 8"}, {"input": "-10 5", "output": "-5", "explanation": "-10 + 5 = -5"}, {"input": "0 0", "output": "0", "explanation": "0 + 0 = 0"}]	easy	100	0
2	3	Максимальный подмассив	Дан массив из n целых чисел. Найдите непрерывный подмассив с максимальной суммой. Выведите эту сумму.	В первой строке дано целое число n (1 ≤ n ≤ 10⁵) — размер массива. Во второй строке через пробел записаны n целых чисел aᵢ (−10⁴ ≤ aᵢ ≤ 10⁴).	Выведите одно целое число — максимальную сумму непрерывного подмассива.	[{"input": "5\\n-2 1 -3 4 -1", "output": "4", "explanation": "Подмассив [4] даёт максимальную сумму 4"}, {"input": "4\\n1 2 3 4", "output": "10", "explanation": "Весь массив даёт сумму 10"}, {"input": "3\\n-1 -2 -3", "output": "-1", "explanation": "Максимальная сумма — один элемент -1"}]	medium	250	0
3	3	Кратчайший путь в лабиринте	Дан лабиринт размером n×m клеток. Найдите длину кратчайшего пути от старта до финиша, двигаясь только вверх, вниз, влево, вправо по проходимым клеткам (.).	В первой строке даны n и m (2 ≤ n, m ≤ 1000). Далее n строк по m символов: '.' — проход, '#' — стена, 'S' — старт, 'F' — финиш. Гарантируется, что S и F ровно по одному.	Выведите длину кратчайшего пути в клетках. Если пути нет — выведите -1.	[{"input": "3 3\\nS..\\n.#.\\n..F", "output": "4", "explanation": "Путь: вправо, вправо, вниз, вниз — 4 шага"}, {"input": "2 2\\nS#\\n#F", "output": "-1", "explanation": "Путь заблокирован стенами"}]	hard	500	0
\.


--
-- Data for Name: olympiad_submissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.olympiad_submissions (id, olympiad_id, problem_id, user_id, code, language, status, score, output, error_message, "createdAt") FROM stdin;
1	3	2	73	n = int(input())\na = list(map(int, input().split()))\n\nmax_sum = a[0]      \ncurrent = a[0]      \n\nfor i in range(1, n):\n    current = max(a[i], current + a[i])\n    max_sum = max(max_sum, current)\n\nprint(max_sum)	python	accepted	250	-1	\N	2026-06-05 07:45:26.828671
2	3	1	73	# Python\nprint("Hello World")	python	wrong_answer	0	Hello World	\N	2026-06-09 11:03:04.753607
\.


--
-- Data for Name: olympiads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.olympiads (id, title, description, "startDate", "endDate", "registrationDeadline", "allowedLanguages", "isActive", course_id, "createdAt") FROM stdin;
3	Код Будущего	Региональная олимпиада для студентов технических вузов. Задания на алгоритмы, структуры данных и оптимизацию. 5 задач разного уровня сложности, автоматическая проверка решений. Призовой фонд — сертификаты и стажировки у партнёров.	2026-05-15 12:12:00	2026-06-14 12:12:00	2026-05-25 12:12:00	["js", "python", "cpp", "java"]	t	\N	2026-05-24 14:46:30.80199
\.


--
-- Data for Name: peer_review_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.peer_review_sessions (id, title, description, "assignmentId", "courseGroupId", "startDate", "endDate", "reviewsPerStudent", criteria, "isDistributed", "isActive", "createdAt", "updatedAt") FROM stdin;
1	Проверка задачи "Ультразвуковой дальномер"	Проверить, выстовить соответсвующую оценку, пояснить за что такой балл.	25	10	2026-05-22 11:00:00	2026-05-26 11:00:00	2	[{"name": "Подключен ультразвуковой датчик", "maxScore": 40}, {"name": "Симуляция происходит меньше чем за 5 сек.", "maxScore": 40}, {"name": "Аккуратно составлена схема", "maxScore": 20}]	t	t	2026-05-22 08:50:35.209248	2026-05-22 11:28:30.118393
2	Пир ревью	Описание	30	10	2026-12-12 12:12:00	2027-12-12 12:12:00	5	[{"name": "цук", "maxScore": 100}, {"name": "цук", "maxScore": 100}, {"name": "цук", "maxScore": 100}]	f	t	2026-06-09 10:33:30.248918	2026-06-09 10:33:30.248918
\.


--
-- Data for Name: peer_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.peer_reviews (id, "reviewerId", "submissionId", score, "criteriaScores", feedback, "isCompleted", "createdAt", "updatedAt") FROM stdin;
1	13	3	\N	\N	\N	f	2026-05-22 11:28:30.107123	2026-05-22 11:28:30.107123
4	14	2	\N	\N	\N	f	2026-05-22 11:28:30.107123	2026-05-22 11:28:30.107123
5	14	1	\N	\N	\N	f	2026-05-22 11:28:30.107123	2026-05-22 11:28:30.107123
3	8	2	8.50	\N	Логика изложена верно, расчёты корректны	t	2026-05-22 11:28:30.107123	2026-05-22 12:03:24.252594
2	8	3	69.00	[{"name": "Подключен ультразвуковой датчик", "score": 31, "maxScore": 40}, {"name": "Симуляция происходит меньше чем за 5 сек.", "score": 22, "maxScore": 40}, {"name": "Аккуратно составлена схема", "score": 16, "maxScore": 20}]	В	t	2026-05-22 11:28:30.107123	2026-06-04 22:35:33.149975
6	13	1	62.00	[{"name": "Подключен ультразвуковой датчик", "score": 31, "maxScore": 40}, {"name": "Симуляция происходит меньше чем за 5 сек.", "score": 13, "maxScore": 40}, {"name": "Аккуратно составлена схема", "score": 18, "maxScore": 20}]	да	t	2026-05-22 11:28:30.107123	2026-06-09 09:55:52.550637
\.


--
-- Data for Name: professional_orientations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.professional_orientations (id, "userId", "testResult", "recommendedProfession", "expertResult", "createdAt", "updatedAt") FROM stdin;
4	74	{"holland":{"scores":{"A":3,"C":3,"E":2,"I":3,"R":3,"S":3},"topType":"A","topTypeLabel":"Артистический","topTypeDescription":"Вы любите творческую свободу, создание уникальных вещей и самовыражение через работу.","topCareers":["UX/UI дизайнер","Frontend-разработчик","Технический писатель","Game Developer","Motion Designer"],"allTypes":[{"type":"A","label":"Артистический","score":3,"maxScore":5},{"type":"C","label":"Конвентциональный","score":3,"maxScore":5},{"type":"I","label":"Исследовательский","score":3,"maxScore":5},{"type":"R","label":"Реалистичный","score":3,"maxScore":5},{"type":"S","label":"Социальный","score":3,"maxScore":5},{"type":"E","label":"Предпринимательский","score":2,"maxScore":5}]},"klimov":{"scores":{"ЧЗ":0,"ЧП":0,"ЧТ":0,"ЧХ":0,"ЧЧ":0},"topType":"ЧЗ","topTypeLabel":"Человек — Знаковая система","topTypeDescription":"Вы склонны к работе с абстрактными системами: кодом, данными, формулами и структурированной информацией.","topCareers":["Backend-разработчик","Data Engineer","Системный архитектор","QA-автоматизатор","Аналитик данных"],"allTypes":[{"type":"ЧЗ","label":"Человек — Знаковая система","score":0,"maxScore":8},{"type":"ЧП","label":"Человек — Природа","score":0,"maxScore":8},{"type":"ЧТ","label":"Человек — Техника","score":0,"maxScore":8},{"type":"ЧХ","label":"Человек — Художественный образ","score":0,"maxScore":8},{"type":"ЧЧ","label":"Человек — Человек","score":0,"maxScore":8}]}}	Backend-разработчик	\N	2026-05-24 17:34:00.656622	2026-05-24 17:34:14.714344
1	73	{"holland":{"scores":{"A":4,"C":4,"E":4,"I":1,"R":3,"S":3},"topType":"A","topTypeLabel":"Артистический","topTypeDescription":"Вы любите творческую свободу, создание уникальных вещей и самовыражение через работу.","topCareers":["UX/UI дизайнер","Frontend-разработчик","Технический писатель","Game Developer","Motion Designer"],"allTypes":[{"type":"A","label":"Артистический","score":4,"maxScore":5},{"type":"C","label":"Конвентциональный","score":4,"maxScore":5},{"type":"E","label":"Предпринимательский","score":4,"maxScore":5},{"type":"R","label":"Реалистичный","score":3,"maxScore":5},{"type":"S","label":"Социальный","score":3,"maxScore":5},{"type":"I","label":"Исследовательский","score":1,"maxScore":5}]},"klimov":{"scores":{"ЧЗ":9,"ЧП":3,"ЧТ":2,"ЧХ":2,"ЧЧ":4},"topType":"ЧЗ","topTypeLabel":"Человек — Знаковая система","topTypeDescription":"Вы склонны к работе с абстрактными системами: кодом, данными, формулами и структурированной информацией.","topCareers":["Backend-разработчик","Data Engineer","Системный архитектор","QA-автоматизатор","Аналитик данных"],"allTypes":[{"type":"ЧЗ","label":"Человек — Знаковая система","score":9,"maxScore":8},{"type":"ЧЧ","label":"Человек — Человек","score":4,"maxScore":8},{"type":"ЧП","label":"Человек — Природа","score":3,"maxScore":8},{"type":"ЧТ","label":"Человек — Техника","score":2,"maxScore":8},{"type":"ЧХ","label":"Человек — Художественный образ","score":2,"maxScore":8}]}}	Backend-разработчик	{"profileTitle":"Коммуникатор","profileDescription":"Ты умеешь строить отношения и работать с людьми.","dominantTraits":["social","research","creative"],"traitScores":{"logical":8,"research":9,"technical":8.2,"detail":6.8,"analytical":7.9,"social":9.2,"creative":8.7,"risk":8.1,"managerial":7.7},"topMatches":[{"careerId":"backend-dev","careerTitle":"Backend-разработчик","confidence":99},{"careerId":"ux-ui","careerTitle":"UX/UI-дизайнер","confidence":98},{"careerId":"iot-engineer","careerTitle":"IoT / Embedded-инженер","confidence":98},{"careerId":"frontend-dev","careerTitle":"Frontend-разработчик","confidence":97},{"careerId":"product-manager","careerTitle":"Product Manager","confidence":97},{"careerId":"business-analyst","careerTitle":"Бизнес-аналитик / System Analyst","confidence":97}]}	2026-05-24 10:17:54.340565	2026-06-09 11:13:32.447799
2	1	{"klimov":{"scores":{"ЧЗ":4,"ЧП":5,"ЧТ":2,"ЧХ":4,"ЧЧ":5},"topType":"ЧП","topTypeLabel":"Человек — Природа","topTypeDescription":"Вам близки задачи, связанные с природными процессами, биологией и исследованиями в естественных науках.","topCareers":["Биоинформатик","Data Scientist в науке","Эколог-аналитик","Медицинский разработчик ПО"],"allTypes":[{"type":"ЧП","label":"Человек — Природа","score":5,"maxScore":8},{"type":"ЧЧ","label":"Человек — Человек","score":5,"maxScore":8},{"type":"ЧЗ","label":"Человек — Знаковая система","score":4,"maxScore":8},{"type":"ЧХ","label":"Человек — Художественный образ","score":4,"maxScore":8},{"type":"ЧТ","label":"Человек — Техника","score":2,"maxScore":8}]}}	Биоинформатик	{"profileTitle":"Системный аналитик","profileDescription":"Ты мыслишь логически и системно. Сложные задачи — твоя стихия.","dominantTraits":["logical","research","technical"],"traitScores":{"logical":10,"research":10,"technical":10,"detail":10,"analytical":10,"social":10,"creative":10,"risk":10,"managerial":10},"topMatches":[{"careerId":"ux-ui","careerTitle":"UX/UI-дизайнер","confidence":100},{"careerId":"data-scientist","careerTitle":"Data Scientist / ML-инженер","confidence":99},{"careerId":"backend-dev","careerTitle":"Backend-разработчик","confidence":99},{"careerId":"qa-engineer","careerTitle":"QA-инженер","confidence":98},{"careerId":"devops","careerTitle":"DevOps / Cloud-инженер","confidence":98},{"careerId":"iot-engineer","careerTitle":"IoT / Embedded-инженер","confidence":98}]}	2026-05-24 14:09:08.632525	2026-06-04 23:22:29.656082
3	8	{"klimov":{"scores":{"ЧЗ":6,"ЧП":4,"ЧТ":4,"ЧХ":4,"ЧЧ":2},"topType":"ЧЗ","topTypeLabel":"Человек — Знаковая система","topTypeDescription":"Вы склонны к работе с абстрактными системами: кодом, данными, формулами и структурированной информацией.","topCareers":["Backend-разработчик","Data Engineer","Системный архитектор","QA-автоматизатор","Аналитик данных"],"allTypes":[{"type":"ЧЗ","label":"Человек — Знаковая система","score":6,"maxScore":8},{"type":"ЧП","label":"Человек — Природа","score":4,"maxScore":8},{"type":"ЧТ","label":"Человек — Техника","score":4,"maxScore":8},{"type":"ЧХ","label":"Человек — Художественный образ","score":4,"maxScore":8},{"type":"ЧЧ","label":"Человек — Человек","score":2,"maxScore":8}]},"holland":{"scores":{"A":4,"C":2,"E":5,"I":4,"R":3,"S":2},"topType":"E","topTypeLabel":"Предпринимательский","topTypeDescription":"Вы стремитесь к лидерству, влиянию и реализации амбициозных целей.","topCareers":["Product Manager","CTO","Tech Lead","Менеджер по продукту","Технический предприниматель"],"allTypes":[{"type":"E","label":"Предпринимательский","score":5,"maxScore":5},{"type":"A","label":"Артистический","score":4,"maxScore":5},{"type":"I","label":"Исследовательский","score":4,"maxScore":5},{"type":"R","label":"Реалистичный","score":3,"maxScore":5},{"type":"C","label":"Конвентциональный","score":2,"maxScore":5},{"type":"S","label":"Социальный","score":2,"maxScore":5}]}}	Product Manager	{"profileTitle":"Перфекционист","profileDescription":"Ты внимателен к деталям и не терпишь поверхностных решений.","dominantTraits":["detail","research","technical"],"traitScores":{"logical":8.2,"research":9.1,"technical":8.4,"detail":10,"analytical":8.1,"social":6.7,"creative":7.3,"risk":7.3,"managerial":8.3},"topMatches":[{"careerId":"data-scientist","careerTitle":"Data Scientist / ML-инженер","confidence":99},{"careerId":"backend-dev","careerTitle":"Backend-разработчик","confidence":99},{"careerId":"qa-engineer","careerTitle":"QA-инженер","confidence":98},{"careerId":"devops","careerTitle":"DevOps / Cloud-инженер","confidence":98},{"careerId":"iot-engineer","careerTitle":"IoT / Embedded-инженер","confidence":98},{"careerId":"project-manager","careerTitle":"Project Manager / Scrum Master","confidence":98}]}	2026-05-24 14:51:02.739151	2026-06-05 07:36:04.978792
\.


--
-- Data for Name: room_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.room_members (id, room_id, user_id, role, "joinedAt") FROM stdin;
1	1	7	owner	2026-05-13 09:47:17.989518
2	1	8	editor	2026-05-13 09:49:56.230729
3	2	1	owner	2026-05-31 21:55:26.534885
4	3	1	owner	2026-06-01 00:00:11.322963
5	4	1	owner	2026-06-04 23:37:08.652528
6	5	1	owner	2026-06-10 18:40:53.251111
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rooms (id, name, description, type, owner_id, state, "inviteCode", "isPublic", hackathon_team_id, "createdAt", "updatedAt") FROM stdin;
1	Лютый вайбкодинг	Вайбкодим вместе	circuit	7	{"nodes": {"mp3vlofr_bsfhgl2": {"x": 218, "y": 193, "id": "mp3vlofr_bsfhgl2", "type": "CLOCK", "label": "CLOCK", "inputs": [], "clockSpeed": 1000, "clockActive": false}, "mp3vlqhd_bkfge99": {"x": 481, "y": 291, "id": "mp3vlqhd_bkfge99", "type": "NOT", "label": "NOT", "inputs": [{"id": null}]}, "mp3vls1a_j4cubmx": {"x": 767, "y": 560, "id": "mp3vls1a_j4cubmx", "type": "FULL_ADDER", "label": "FULL_ADDER", "inputs": [{"id": null}, {"id": null}, {"id": null}], "outputValues": [false, false]}}, "wires": {}}	f7221ea20ce2ce51e6518715	t	\N	2026-05-13 09:47:17.982541	2026-05-13 18:49:24.134181
2	Комната для хакатона!	Присоединяйся	iot	1	\N	f04e648e75e551cca0298e18	f	\N	2026-05-31 21:55:26.515943	2026-05-31 21:55:26.515943
3	IoT Lab Alpha	Совместная работа над IoT-сенсорами	iot	1	{"meta": {"scale": 1, "offsetX": 0, "offsetY": 0}, "nodes": [], "wires": []}	e35d7d0f031f65e7c7057ef6	t	\N	2026-06-01 00:00:11.291171	2026-06-01 00:01:49.434605
4	ывви	варав	iot	1	\N	aacf9d46d7f6771d7ebfe0cf	t	\N	2026-06-04 23:37:08.643429	2026-06-04 23:37:08.643429
5	Комната	Вау	iot	1	\N	d5501ad1a3c612c68a82dc99	f	\N	2026-06-10 18:40:53.229781	2026-06-10 18:40:53.229781
\.


--
-- Data for Name: schedule_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schedule_items (id, title, description, type, content, "videoUrl", "materialsUrl", "assignmentDescription", "startTime", "endTime", location, "meetingUrl", "createdAt", "updatedAt", "courseGroupId", "instructorId", "electiveId", "linkedScheduleItemId") FROM stdin;
1	Введение в электрические цепи: ток, напряжение, сопротивление	Базовые понятия электричества. Закон Ома для участка цепи. Последовательное и параллельное соединение резисторов. Расчёт эквивалентного сопротивления. Измерительные приборы: вольтметр, амперметр. Обзор симуляторов (Falstad, EveryCircuit).	lecture	Книга: Хоровиц, Хилл «Искусство схемотехники», глава 1.	https://www.youtube.com/watch?v=GEy-eJfNwIg	https://drive.google.com/	К лекции прилагается практическое задание 1.1 «Закон Ома в деле».	2025-09-08 10:00:00	2026-09-08 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:34:34.962773	2026-05-21 16:34:34.962773	8	10	\N	\N
2	Конденсаторы, RC-цепи и переходные процессы	Устройство и принцип работы конденсатора. Заряд и разряд через резистор. Постоянная времени τ = RC. Осциллограммы заряда/разряда. Применение конденсаторов в фильтрах и сглаживающих цепях. Введение в диоды и выпрямление.	lecture	\N	https://www.youtube.com/watch?v=7Jxn0pLavGU	https://drive.google.com/	К лекции прилагаются задания 1.6 «RC-цепь и постоянная времени», 1.7 «Диодный мост», 1.8 «Сглаживающий конденсатор».	2025-10-20 10:00:00	2025-10-20 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:35:56.964681	2026-05-21 16:35:56.964681	8	10	\N	\N
3	Операционный усилитель: идеальный и реальный	Принцип работы ОУ. Основные схемы включения: повторитель, неинвертирующий и инвертирующий усилитель. Понятие обратной связи. Золотые правила идеального ОУ. Реальные характеристики: input offset voltage, bias current, slew rate.	lecture	Datasheet LM358. Статья: "Op Amps for Everyone" (Texas Instruments).	https://www.youtube.com/watch?v=8OCfDwCgSiY	https://drive.google.com/	К лекции прилагаются задания 2.1–2.4 (повторитель, усилители, сумматор).	2026-01-12 10:00:00	2026-01-12 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:37:36.475093	2026-05-21 16:37:36.475093	9	10	\N	\N
4	Компараторы, триггер Шмитта и активные фильтры	ОУ без обратной связи как компаратор. Проблема дребезга. Триггер Шмитта: расчёт порогов, петля гистерезиса. Активные фильтры первого порядка: ФНЧ, ФВЧ. Частота среза. Переход к генераторам сигналов.	lecture	Статья о подавлении дребезга контактов.	https://www.youtube.com/watch?v=wvZuIS2VCB4	https://drive.google.com/	К лекции прилагаются задания 2.5–2.9 (компаратор, триггер Шмитта, фильтры, генератор).	2026-02-16 10:00:00	2026-02-16 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:38:56.816299	2026-05-21 16:38:56.816299	9	10	\N	\N
5	Введение в микроконтроллеры: архитектура и GPIO	Что такое микроконтроллер. Архитектура Arduino/ESP32: процессор, память, периферия. Среда разработки (Arduino IDE, PlatformIO). GPIO: digitalWrite, digitalRead. Работа с кнопкой: подтягивающие резисторы, антидребезг. Первая программа: Blink.	lecture	Справочник по функциям Arduino. Статья: "Debouncing a Button".	https://www.youtube.com/watch?v=7TmHCDgX5GY&list=PL9lkEHy8EJU8_vZRGUw_uwXdEsSjTL-8o	https://drive.google.com/	К лекции прилагаются задания 3.1–3.3 (Blink, кнопка, ШИМ)	2026-04-13 10:00:00	2026-04-13 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:40:44.464865	2026-05-21 16:40:44.464865	10	10	\N	\N
6	Таймеры, прерывания и протоколы связи	Аппаратные таймеры и прерывания. Настройка прерывания по таймеру. UART: передача и приём данных. I²C и SPI — краткий обзор. Работа с EEPROM. Энергонезависимое хранение настроек.	lecture	Документация ESP32 по таймерам. Примеры кода для UART-коммуникации.	https://www.youtube.com/watch?v=cKfTFDDwXMo	https://drive.google.com/	К лекции прилагаются задания 3.7–3.9 (прерывания по таймеру, UART, EEPROM).	2026-06-01 10:00:00	2026-06-01 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:42:03.571289	2026-05-21 16:42:03.571289	10	10	\N	\N
7	Building Blocks: Present Simple, There is/are, Prepositions	Грамматическая основа для описания. Present Simple для фактов и рутины. Конструкция there is/there are. Предлоги места (in, on, under, next to, between). Базовая лексика: предметы в комнате, семья, повседневные действия.	lecture	Интерактивные упражнения на предлоги: British Council. Список 100 самых употребляемых глаголов.	https://www.youtube.com/watch?v=skJyU84zdEs	https://drive.google.com/	К лекции прилагаются задания 4.1–4.3 (My Learning Space, Daily Routine, Family Portrait).	2026-09-15 10:00:00	2026-09-15 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:43:23.65001	2026-05-21 16:43:23.65001	11	5	\N	\N
8	Talking About the Past and Future: Past Simple, Going to, Comparatives	Past Simple: правильные и неправильные глаголы, маркеры времени. Конструкция to be going to для планов. Сравнительная и превосходная степень прилагательных. Повелительное наклонение для инструкций.	lecture	Таблица неправильных глаголов. Аудио-диалоги для тренировки заказа еды.	https://www.youtube.com/watch?v=-5ILaiHWY8g	https://drive.google.com/	К лекции прилагаются задания 4.4–4.8 (Last Weekend, Ordering Food, Shopping, Future Plans, Directions).	2026-10-27 10:00:00	2026-10-27 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:44:43.50145	2026-05-21 16:44:43.50145	11	5	\N	\N
9	Formal vs Informal: Email, Interview & Linking Words	Регистры общения: формальный и неформальный стиль. Структура официального email. Типичные вопросы на собеседовании и как на них отвечать. Слова-связки (linking words) для построения связного текста: however, therefore, in addition, on the contrary.	lecture	Примеры сопроводительных писем. Видео: типичные ошибки на собеседовании.	https://www.youtube.com/watch?v=nwMI97hDTJk	https://drive.google.com/	К лекции прилагаются задания 5.1–5.3 (Discussion Essay, Job Interview, Formal Email).	2026-01-19 10:00:00	2026-01-19 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:45:53.786291	2026-05-21 16:45:53.786291	12	5	\N	\N
10	Advanced Speaking: Storytelling, Debate & Presentation Skills	Структура хорошей истории: контекст, конфликт, разрешение. Времена для повествования: Past Simple, Continuous, Perfect. Основы дебатов: аргумент — контраргумент — опровержение. Elevator pitch: формула 60 секунд. Невербальная коммуникация.	lecture	TED Talks для анализа структуры выступления. Шаблон для elevator pitch.	https://www.youtube.com/watch?v=hNuAv-42jzY	https://drive.google.com/	К лекции прилагаются задания 5.4–5.8 (Debate, Storytelling, News, Conflict, Elevator Pitch).	2026-02-23 10:00:00	2026-02-23 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:47:06.582137	2026-05-21 16:47:06.582137	12	5	\N	\N
11	Academic Writing: Essay Structure, Paraphrasing & Critical Analysis	Структура академического эссе: thesis statement, topic sentences, supporting evidence. Техники парафраза и суммаризации. Как писать critical analysis: оценка аргументов, выявление bias, логические ошибки. Оформление ссылок и references.	lecture	Purdue OWL — руководство по академическому письму. Список академических linking words.	https://www.youtube.com/watch?v=UvsH5y91Eoo	https://drive.google.com/	К лекции прилагаются задания 6.1–6.4 (Critical Analysis, Academic Essay, Research Summary, Advanced Grammar).	2026-05-11 10:00:00	2026-05-11 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:48:29.381577	2026-05-21 16:48:29.381577	13	5	\N	\N
12	Rhetoric & Persuasion: Speechwriting, Stylistic Analysis & Debate Moderation	Риторические приёмы: rhetorical questions, rule of three, antithesis, anaphora. Стилистический анализ текста: выявление приёмов и их эффекта. Модерация дебатов: управление временем, вовлечение участников, работа с доминирующими спикерами. Подготовка к экзаменационным форматам (IELTS/CAE Writing).	lecture	Анализ речей TED. Критерии оценки IELTS Writing Task 2.	https://www.youtube.com/watch?v=od6qjkO8JNE	https://drive.google.com/	К лекции прилагаются задания 6.5–6.9 (Podcast, Persuasive Speech, Stylistic Analysis, IELTS Simulation, Debate Moderation).	2026-06-22 10:00:00	2026-06-22 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:49:37.067605	2026-05-21 16:49:37.067605	13	5	\N	\N
13	Архитектура IoT-устройства: сенсоры и актуаторы	Обзор архитектуры Интернета вещей. Уровни: устройство, сеть, облако. Типы датчиков: аналоговые и цифровые, активные и пассивные. Чтение данных с DHT11, фоторезистора, PIR. Управление нагрузкой: реле, MOSFET. Подключение периферии к ESP32.	lecture	Распиновка ESP32. Датчики: DHT11 datasheet, HC-SR04 datasheet.	https://www.youtube.com/watch?v=2oZxrR1DIwg	https://drive.google.com/	К лекции прилагаются задания 7.1–7.5 (сборка, датчики, реле, PIR).	2025-09-22 10:00:00	2025-09-22 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:52:58.450487	2026-05-21 16:52:58.450487	14	11	\N	\N
14	Локальное взаимодействие: дисплеи, кнопки и хранение	Подключение OLED-дисплеев по I²C. Меню и навигация с помощью кнопок. Конечные автоматы для управления режимами. Локальное хранение данных: SD-карта и SPI. Формат CSV для логгирования.	lecture	Библиотека Adafruit SSD1306. Пример форматирования CSV для временных рядов.	https://www.youtube.com/watch?v=yg0KK8kmke0	https://drive.google.com/	К лекции прилагаются задания 7.6–7.10 (комбинированная система, OLED, кнопка с режимами, SD-карта, итоговый проект).	2025-11-10 10:00:00	2025-11-10 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:55:05.830751	2026-05-21 16:55:05.830751	14	11	\N	\N
15	Сетевые протоколы IoT: Wi-Fi, MQTT и HTTP	Подключение ESP32 к Wi-Fi. MQTT: брокер, топик, publish/subscribe, QoS. Публичные брокеры. HTTP-запросы с микроконтроллера. Разбор JSON-ответов на устройстве. Облачные IoT-платформы: ThingSpeak, Blynk, Arduino Cloud.	lecture	MQTTX — удобный клиент для тестирования. Документация ThingSpeak API.	https://www.youtube.com/watch?v=Rv79n5ueZro	https://drive.google.com/	К лекции прилагаются задания 8.1–8.4 (Wi-Fi, HTTP GET, MQTT publish, MQTT subscribe).	2026-01-26 10:00:00	2026-01-26 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:56:19.305381	2026-05-21 16:56:19.305381	14	11	\N	\N
16	Интеграция и альтернативные протоколы: Webhook, CoAP, сравнение	Webhook-интеграции для уведомлений (Zapier, IFTTT, собственный сервер). CoAP: особенности протокола для constrained devices. Сравнение MQTT vs HTTP по задержке, объёму данных, энергопотреблению. Критерии выбора протокола для проекта.	lecture	RFC 7252 (CoAP). Статья: "MQTT vs HTTP for IoT".	https://www.youtube.com/watch?v=KhuZdeuF6kw	https://drive.google.com/	К лекции прилагаются задания 8.5–8.10 (QoS, облачная платформа, webhook, сравнение, CoAP, итоговый проект).	2026-03-09 10:00:00	2026-03-09 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:57:31.469664	2026-05-21 16:57:31.469664	15	11	\N	\N
17	Edge Computing: обработка на устройстве	Что такое Edge и Fog Computing. Преимущества локальной обработки. Фильтрация сигналов: скользящее среднее, медианный фильтр. Обнаружение аномалий: метод среднего и стандартного отклонения. Буферизация и пакетная отправка данных. Конечные автоматы на устройстве.	lecture	Статья: "Edge Computing: Vision and Challenges". Библиотека Arduino Finite State Machine.	https://www.youtube.com/watch?v=mWoEA-YaE7o	https://drive.google.com/	К лекции прилагаются задания 9.1–9.4 (фильтрация, аномалии, буферизация, конечный автомат).	2026-05-04 10:00:00	2026-05-04 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 16:59:01.374388	2026-05-21 16:59:01.374388	16	11	\N	\N
18	Автономность и коммуникация: Deep Sleep, OTA, BLE, Mesh	Энергосбережение: deep sleep на ESP32, расчёт времени автономной работы. OTA-обновление прошивки: настройка и безопасность. Беспроводная коммуникация: BLE-сервер и клиент. ESP-NOW для mesh-сетей. Локальный HTTP-сервер на устройстве.	lecture	ESP32 Deep Sleep Guide. Пример OTA-обновления от Espressif.	https://www.youtube.com/watch?v=4zld0jS-3wM	https://drive.google.com/	К лекции прилагаются задания 9.5–9.10 (OTA, deep sleep, BLE, ESP-NOW, REST API, итоговый проект).	2026-06-15 10:00:00	2026-06-15 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 17:00:00.795961	2026-05-21 17:00:00.795961	16	11	\N	\N
19	Системы счисления и булева алгебра	Позиционные системы счисления. Перевод между десятичной, двоичной, восьмеричной, шестнадцатеричной. Двоичная арифметика. Булевы переменные и операции. Таблицы истинности. Законы булевой алгебры. Упрощение логических выражений.	lecture	Онлайн-калькулятор систем счисления. Карты Карно: интерактивный тренажёр.	https://www.youtube.com/watch?v=kG_ipMygRUc&t=46s	https://drive.google.com/	К лекции прилагаются задания 10.1–10.4 (системы счисления, двоичная арифметика, булева алгебра, логические схемы).	2025-09-01 10:00:00	2025-09-01 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 17:01:05.04883	2026-05-21 17:01:05.04883	17	12	\N	\N
20	Алгоритмы и структуры данных: от сортировки до дерева	Понятие алгоритма и его свойств. Базовые алгоритмы сортировки. Бинарный поиск. Рекурсия: принцип работы, примеры. Стек и очередь как абстрактные типы данных. Введение в анализ сложности: O-нотация.	lecture	Визуализатор алгоритмов: Visualgo.net. Книга: "Grokking Algorithms"	https://www.youtube.com/watch?v=hXYHZVMHec0	https://drive.google.com/	К лекции прилагаются задания 10.5–10.10 (алгоритм Евклида, сортировка, бинарный поиск, Ханойские башни, стек/очередь, итоговый анализ).	2025-10-13 10:00:00	2025-10-13 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 17:02:18.798499	2026-05-21 17:02:18.798499	17	12	\N	\N
21	Архитектура компьютера: процессор, память, конвейер	Организация процессора: АЛУ, регистры, устройство управления. Цикл выполнения команды. Конвейеризация. Иерархия памяти: кэш L1/L2/L3, оперативная память. Виртуальная память и страничная организация. Ассемблер: краткое введение.	lecture	Симулятор MIPS-процессора. Книга: Таненбаум "Архитектура компьютера".	https://www.youtube.com/watch?v=fKStG9GrWLw	https://drive.google.com/	К лекции прилагаются задания 11.1–11.5 (процессор, ассемблер, кэш, конвейер, виртуальная память).	2026-01-05 10:00:00	2026-01-05 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 17:03:22.791936	2026-05-21 17:03:22.791936	18	12	\N	\N
22	Операционные системы и сети	Управление процессами: создание, планирование, контекст. Межпроцессное взаимодействие: каналы, сигналы, сокеты. Файловые системы: структура, журналирование. Сетевой стек TCP/IP: инкапсуляция, IP-адресация, TCP handshake. Wireshark для анализа трафика.	lecture	Руководство по Wireshark. Книга: Стивенс "UNIX. Профессиональное программирование".	https://www.youtube.com/watch?v=inEFG-Zk5DE	https://drive.google.com/	К лекции прилагаются задания 11.6–11.10 (процессы, каналы, файловая система, сокеты, профилирование).	2026-02-16 10:00:00	2026-02-16 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 17:04:19.868729	2026-05-21 17:04:19.868729	18	12	\N	\N
23	Базы данных и SQL	Реляционная модель данных. Проектирование БД: нормализация, ER-диаграммы. SQL: CREATE TABLE, SELECT, JOIN, GROUP BY, подзапросы. Индексы: как работают и когда применять. EXPLAIN для анализа запросов.	lecture	SQLite online editor. Визуализатор SQL-запросов.	https://www.youtube.com/watch?v=uGKIXTUjZbc	https://drive.google.com/	К лекции прилагаются задания 12.1–12.3 (создание БД, запросы, индексы).	2026-04-06 10:00:00	2026-04-06 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 17:05:18.017431	2026-05-21 17:05:18.017431	19	12	\N	\N
24	Анализ данных, автоматизация и кибербезопасность	Анализ данных с Pandas: загрузка, очистка, агрегация. Визуализация: выбор типа графика, дашборды. Веб-скрапинг: requests, BeautifulSoup. Автоматизация скриптами. Основы кибербезопасности: хеширование, типовые уязвимости, CVE.	lecture	Kaggle — датасеты для практики. OWASP Top 10.	https://www.youtube.com/watch?v=_HcACxBsBLg&list=PLMiVLClzZDbTWSsxWfVvrvdyHgSa7Wvaw	https://drive.google.com/	К лекции прилагаются задания 12.4–12.10 (Pandas, визуализация, скрапинг, CVE, автоматизация, хеширование, итоговый проект).	2026-05-11 10:00:00	2026-05-11 11:30:00	online	https://meet.google.com/xxx-xxxx-xxx	2026-05-21 17:06:27.021718	2026-05-21 17:06:27.021718	19	12	\N	\N
25	Установка Git и первый коммит	Установите Git на ваш компьютер. Настройте глобальные параметры: user.name и user.email. Создайте локальный репозиторий, добавьте файл README.md с кратким описанием вашего проекта (2–3 предложения). Сделайте первый коммит с осмысленным сообщением. Проверьте историю коммитов командой git log.\nТребования:\n\nФайл README.md должен содержать заголовок и текстовое описание проекта.\n\nСообщение коммита должно следовать соглашению: краткий заголовок (до 72 символов) и, при необходимости, развёрнутое описание.\n\nПриложите скриншот вывода команд git log и git status.	practice	\N	\N	\N	\N	2026-04-06 09:00:00	2026-04-12 23:59:00	online	\N	2026-05-21 18:12:33.066222	2026-05-21 18:12:33.066222	\N	\N	11	\N
26	Ветвление и слияние без конфликтов	В вашем локальном репозитории создайте новую ветку feature/readme-enhance. Переключитесь на неё. Внесите изменения в README.md: добавьте раздел «Установка» и «Использование» (по 2–3 предложения). Сделайте минимум 2 коммита в этой ветке. Вернитесь в main и выполните слияние ветки feature/readme-enhance (fast-forward или merge commit — на ваш выбор).\n\nТребования:\n\nПокажите историю коммитов до и после слияния с помощью git log --graph --oneline --all.\n\nОбъясните, какой тип слияния произошёл и почему.\n\nПриложите скриншоты.	practice	\N	\N	\N	\N	2026-04-07 09:00:00	2026-04-13 23:59:00	online	\N	2026-05-21 18:13:08.344	2026-05-21 18:13:08.344	\N	\N	11	\N
27	Разрешение конфликтов слияния	Смоделируйте конфликт слияния. Создайте две ветки из main: feature/add-contacts и feature/add-license. В каждой ветке измените одну и ту же строку в README.md (например, последнюю строку файла). В одной ветке напишите «Контакты: email@example.com», в другой — «Лицензия: MIT». Слейте первую ветку в main, затем попытайтесь слить вторую. Разрешите возникший конфликт вручную так, чтобы в файле остались обе строки.\n\nТребования:\n\nПокажите файл с маркерами конфликта (до разрешения) и финальную версию.\n\nОпишите, как вы разрешили конфликт.\n\nПриложите скриншоты.	lecture	\N	\N	\N	\N	2026-04-08 09:00:00	2026-04-14 23:59:00	online	\N	2026-05-21 18:13:39.433589	2026-05-21 18:13:39.433589	\N	\N	11	\N
28	Создание репозитория на GitHub и синхронизация	Создайте новый публичный репозиторий на GitHub. Свяжите ваш локальный репозиторий с удалённым (команда git remote add origin). Отправьте локальные ветки main и feature/readme-enhance на GitHub. Убедитесь, что коммиты и ветки отображаются корректно.\n\nТребования:\n\nВ репозитории должно быть минимум 2 ветки.\n\nВетка main должна содержать все слитые изменения из предыдущих заданий.\n\nПриложите ссылку на репозиторий и скриншот страницы с ветками на GitHub.	practice	\N	\N	\N	\N	2026-04-09 09:00:00	2026-04-16 23:59:00	online	\N	2026-05-21 18:14:15.988312	2026-05-21 18:14:15.988312	\N	\N	11	\N
29	Pull Request и Code Review	В вашем GitHub-репозитории создайте новую ветку feature/gitignore. Добавьте файл .gitignore, подходящий для вашего проекта (например, для Python, Node.js или другого стека). Сделайте коммит и отправьте ветку на GitHub. Создайте Pull Request из feature/gitignore в main. Попросите одногруппника (или проверьте сами от другого аккаунта) оставить комментарий к Pull Request. Внесите правки по комментарию (например, добавьте ещё одно правило в .gitignore), запушьте изменения. Убедитесь, что PR обновился. Слейте PR.\n\nТребования:\n\nПриложите ссылку на Pull Request.\n\nПокажите скриншот с комментарием и ответным коммитом.\n\nОпишите, что вы добавили в .gitignore и почему.	practice	\N	\N	\N	\N	2026-04-12 09:00:00	2026-04-19 23:59:00	online	\N	2026-05-21 18:14:44.890619	2026-05-21 18:14:44.890619	\N	\N	11	\N
30	Лекция: Протоколы IoT — MQTT и CoAP	Разбор протоколов IoT: MQTT и CoAP — особенности, сравнение, применение в реальных системах	lecture	\N	\N	\N	\N	2025-09-15 10:00:00	2025-09-15 11:30:00	Ауд. 301	\N	2026-06-01 00:05:26.032228	2026-06-01 00:05:26.032228	\N	\N	\N	\N
\.


--
-- Data for Name: site_visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_visits (id, path, "userId", "userDisplayName", "visitedAt") FROM stdin;
1	/	2	admin@asoi.edu	2026-05-09 16:45:27.290507
2	/profile	2	admin@asoi.edu	2026-05-09 16:45:32.583467
3	/	1	admin@gmail.com	2026-05-09 16:46:10.501129
4	/profile	1	admin@gmail.com	2026-05-09 16:46:16.309465
5	/	1	admin@gmail.com	2026-05-09 16:56:13.917014
6	/profile	1	admin@gmail.com	2026-05-09 16:56:17.652827
7	/courses	1	admin@gmail.com	2026-05-09 16:58:32.371714
8	/courses	1	admin@gmail.com	2026-05-09 17:03:50.245501
41	/courses	1	admin@gmail.com	2026-05-09 17:09:47.163271
42	/profile	1	admin@gmail.com	2026-05-09 17:09:53.164432
43	/courses	1	admin@gmail.com	2026-05-09 17:18:26.995099
44	/	1	admin@gmail.com	2026-05-09 17:18:53.640408
45	/profile	1	admin@gmail.com	2026-05-09 17:18:58.491462
46	/circuit	1	admin@gmail.com	2026-05-09 17:19:33.731137
47	/circuit	1	admin@gmail.com	2026-05-09 17:34:18.735398
48	/circuit	1	admin@gmail.com	2026-05-09 18:09:14.27843
49	/circuit	1	admin@gmail.com	2026-05-09 20:46:26.43842
50	/	1	admin@gmail.com	2026-05-13 05:43:58.322685
51	/circuit	1	admin@gmail.com	2026-05-13 05:44:18.624081
52	/circuit	1	admin@gmail.com	2026-05-13 05:46:33.892426
53	/circuit	1	admin@gmail.com	2026-05-13 05:46:41.879543
54	/circuit	1	admin@gmail.com	2026-05-13 05:46:42.508824
55	/circuit	1	admin@gmail.com	2026-05-13 05:46:42.919219
56	/circuit	1	admin@gmail.com	2026-05-13 05:46:43.154123
57	/circuit	1	admin@gmail.com	2026-05-13 05:46:43.312999
58	/circuit	1	admin@gmail.com	2026-05-13 05:51:26.979996
59	/shematic	1	admin@gmail.com	2026-05-13 05:52:04.317714
60	/shematic	1	admin@gmail.com	2026-05-13 05:56:33.096971
61	/shematic	1	admin@gmail.com	2026-05-13 06:00:33.65211
62	/courses	1	admin@gmail.com	2026-05-13 06:01:39.663579
63	/	1	admin@gmail.com	2026-05-13 06:01:41.910281
64	/	1	admin@gmail.com	2026-05-13 06:41:19.208775
65	/	1	admin@gmail.com	2026-05-13 06:41:29.52634
66	/	5	menrotAngl@gmail.com	2026-05-13 06:43:36.076612
67	/	1	admin@gmail.com	2026-05-13 06:43:44.824565
68	/profile	1	admin@gmail.com	2026-05-13 06:43:49.443133
69	/	5	menrotAngl@gmail.com	2026-05-13 06:46:09.77638
70	/mentor	5	menrotAngl@gmail.com	2026-05-13 06:46:13.906489
71	/mentor/groups	5	menrotAngl@gmail.com	2026-05-13 06:46:15.490531
72	/mentor/schedule	5	menrotAngl@gmail.com	2026-05-13 06:46:51.342841
73	/mentor/assignments	5	menrotAngl@gmail.com	2026-05-13 06:47:05.48945
74	/mentor/materials	5	menrotAngl@gmail.com	2026-05-13 06:47:17.665678
75	/mentor/hackathons	5	menrotAngl@gmail.com	2026-05-13 06:47:23.18954
76	/mentor/electives	5	menrotAngl@gmail.com	2026-05-13 06:48:02.926067
77	/mentor/groups	5	menrotAngl@gmail.com	2026-05-13 06:48:11.483019
78	/mentor/schedule	5	menrotAngl@gmail.com	2026-05-13 06:48:16.086469
79	/mentor/schedule	5	menrotAngl@gmail.com	2026-05-13 07:05:37.405951
80	/	6	studenAngl@gmail.com	2026-05-13 07:09:09.186301
81	/courses	6	studenAngl@gmail.com	2026-05-13 07:09:12.345778
82	/	6	studenAngl@gmail.com	2026-05-13 07:09:34.279519
83	/courses	6	studenAngl@gmail.com	2026-05-13 07:09:41.57371
84	/courses/english-vocab	6	studenAngl@gmail.com	2026-05-13 07:09:45.118892
85	/profile	6	studenAngl@gmail.com	2026-05-13 07:10:03.594233
86	/dashboard	6	studenAngl@gmail.com	2026-05-13 07:10:12.838675
87	/courses	6	studenAngl@gmail.com	2026-05-13 07:10:20.981347
88	/	6	studenAngl@gmail.com	2026-05-13 07:10:22.255344
89	/courses	6	studenAngl@gmail.com	2026-05-13 07:13:05.944607
90	/courses/english-vocab	6	studenAngl@gmail.com	2026-05-13 07:13:07.343881
91	/courses/english-vocab	6	studenAngl@gmail.com	2026-05-13 07:22:35.014701
92	/	6	studenAngl@gmail.com	2026-05-13 07:22:37.49863
93	/courses	6	studenAngl@gmail.com	2026-05-13 07:22:42.406478
94	/courses/english-vocab	6	studenAngl@gmail.com	2026-05-13 07:22:43.330948
95	/	1	admin@gmail.com	2026-05-13 07:22:58.600152
96	/profile	1	admin@gmail.com	2026-05-13 07:23:03.977394
97	/courses	1	admin@gmail.com	2026-05-13 07:23:25.563646
98	/library	1	admin@gmail.com	2026-05-13 07:23:27.671132
99	/courses	1	admin@gmail.com	2026-05-13 07:23:30.846351
100	/courses/english-vocab	1	admin@gmail.com	2026-05-13 07:23:32.334482
101	/mentor	1	admin@gmail.com	2026-05-13 07:24:34.159806
102	/courses	1	admin@gmail.com	2026-05-13 07:24:51.385641
103	/courses/english-vocab	1	admin@gmail.com	2026-05-13 07:24:52.236567
104	/courses/english-vocab	1	admin@gmail.com	2026-05-13 09:39:18.969053
105	/library	1	admin@gmail.com	2026-05-13 09:39:22.493033
106	/courses	1	admin@gmail.com	2026-05-13 09:39:28.655271
107	/	1	admin@gmail.com	2026-05-13 09:39:30.636677
108	/library	1	admin@gmail.com	2026-05-13 09:39:31.955054
109	/profile	1	admin@gmail.com	2026-05-13 09:39:36.690232
110	/	1	admin@gmail.com	2026-05-13 09:39:58.406552
111	/circuit	1	admin@gmail.com	2026-05-13 09:40:07.521756
112	/profile	1	admin@gmail.com	2026-05-13 09:40:16.008565
113	/profile	1	admin@gmail.com	2026-05-13 09:44:29.255666
114	/library	1	admin@gmail.com	2026-05-13 09:44:32.770041
115	/rooms	1	admin@gmail.com	2026-05-13 09:45:36.275805
116	/courses	1	admin@gmail.com	2026-05-13 09:45:38.558948
117	/	7	studenEl@gmail.com	2026-05-13 09:46:22.672244
118	/courses	7	studenEl@gmail.com	2026-05-13 09:46:23.782832
119	/rooms	7	studenEl@gmail.com	2026-05-13 09:46:24.7217
120	/courses	7	studenEl@gmail.com	2026-05-13 09:46:25.640795
121	/	7	studenEl@gmail.com	2026-05-13 09:46:46.02032
122	/library	7	studenEl@gmail.com	2026-05-13 09:46:50.65621
123	/courses	7	studenEl@gmail.com	2026-05-13 09:46:53.740123
124	/	7	studenEl@gmail.com	2026-05-13 09:46:57.53416
125	/rooms	7	studenEl@gmail.com	2026-05-13 09:46:58.477973
126	/circuit	7	studenEl@gmail.com	2026-05-13 09:46:59.680452
127	/rooms	7	studenEl@gmail.com	2026-05-13 09:47:04.16042
128	/rooms/1/editor	7	studenEl@gmail.com	2026-05-13 09:47:21.292071
129	/	7	studenEl@gmail.com	2026-05-13 09:47:37.02046
130	/	1	admin@gmail.com	2026-05-13 09:47:48.029971
131	/rooms	1	admin@gmail.com	2026-05-13 09:47:50.890281
132	/	8	studenEl1@gmail.com	2026-05-13 09:48:28.63404
133	/courses	8	studenEl1@gmail.com	2026-05-13 09:48:31.673242
134	/	8	studenEl1@gmail.com	2026-05-13 09:48:49.341895
135	/rooms	8	studenEl1@gmail.com	2026-05-13 09:48:51.778786
136	/	7	studenEl@gmail.com	2026-05-13 09:49:05.003641
137	/rooms	7	studenEl@gmail.com	2026-05-13 09:49:06.691561
138	/rooms/1/editor	7	studenEl@gmail.com	2026-05-13 09:49:11.833571
139	/rooms/1	7	studenEl@gmail.com	2026-05-13 09:49:15.493294
140	/rooms/1/editor	7	studenEl@gmail.com	2026-05-13 09:49:22.960962
141	/rooms/1	7	studenEl@gmail.com	2026-05-13 09:49:24.85893
142	/rooms	7	studenEl@gmail.com	2026-05-13 09:49:26.510114
143	/rooms/1	7	studenEl@gmail.com	2026-05-13 09:49:27.645016
144	/	8	studenEl1@gmail.com	2026-05-13 09:49:48.541615
145	/rooms/join/f7221ea20ce2ce51e6518715	8	studenEl1@gmail.com	2026-05-13 09:49:51.166611
146	/rooms/1	8	studenEl1@gmail.com	2026-05-13 09:49:56.287897
147	/library	8	studenEl1@gmail.com	2026-05-13 09:55:27.970607
148	/	8	studenEl1@gmail.com	2026-05-13 09:55:33.236853
149	/	8	studenEl1@gmail.com	2026-05-13 11:57:54.069383
150	/	9	nestudent@gmail.com	2026-05-13 11:58:37.730062
151	/library	9	nestudent@gmail.com	2026-05-13 11:58:42.462936
152	/courses	9	nestudent@gmail.com	2026-05-13 11:59:50.222868
153	/	9	nestudent@gmail.com	2026-05-13 11:59:51.346992
154	/profile	9	nestudent@gmail.com	2026-05-13 11:59:53.645685
155	/	9	nestudent@gmail.com	2026-05-13 11:59:58.731892
156	/	1	admin@gmail.com	2026-05-13 12:06:13.395041
157	/library	1	admin@gmail.com	2026-05-13 12:06:27.169838
158	/courses	1	admin@gmail.com	2026-05-13 12:06:44.955935
159	/courses/english-vocab	1	admin@gmail.com	2026-05-13 12:06:46.593167
160	/	1	admin@gmail.com	2026-05-13 12:07:04.044112
161	/library	1	admin@gmail.com	2026-05-13 12:08:30.337467
162	/forum	1	admin@gmail.com	2026-05-13 12:08:33.95826
163	/courses	1	admin@gmail.com	2026-05-13 12:08:35.981315
164	/career	1	admin@gmail.com	2026-05-13 12:08:39.09646
165	/hackathons	1	admin@gmail.com	2026-05-13 12:08:41.195045
166	/prof-orientation	1	admin@gmail.com	2026-05-13 12:08:43.157464
167	/complilier	1	admin@gmail.com	2026-05-13 12:08:44.780512
168	/circuit	1	admin@gmail.com	2026-05-13 12:08:45.390178
169	/profile	1	admin@gmail.com	2026-05-13 12:08:48.319308
170	/	1	admin@gmail.com	2026-05-13 12:09:11.59234
171	/	1	admin@gmail.com	2026-05-13 12:29:18.904416
172	/library	1	admin@gmail.com	2026-05-13 12:29:29.313643
173	/courses	1	admin@gmail.com	2026-05-13 12:29:30.189523
174	/forum	1	admin@gmail.com	2026-05-13 12:29:30.834227
175	/rooms	1	admin@gmail.com	2026-05-13 12:29:31.619089
176	/career	1	admin@gmail.com	2026-05-13 12:29:32.602614
177	/hackathons	1	admin@gmail.com	2026-05-13 12:29:33.190388
178	/prof-orientation	1	admin@gmail.com	2026-05-13 12:29:33.789908
179	/complilier	1	admin@gmail.com	2026-05-13 12:29:35.190105
180	/circuit	1	admin@gmail.com	2026-05-13 12:29:36.454073
181	/profile	1	admin@gmail.com	2026-05-13 12:29:39.606355
182	/profile	1	admin@gmail.com	2026-05-13 12:43:49.013447
183	/courses	1	admin@gmail.com	2026-05-13 12:43:50.579833
184	/	1	admin@gmail.com	2026-05-13 12:43:52.278638
185	/library	1	admin@gmail.com	2026-05-13 12:43:59.356141
186	/courses	1	admin@gmail.com	2026-05-13 12:44:00.325981
187	/forum	1	admin@gmail.com	2026-05-13 12:44:03.399112
188	/career	1	admin@gmail.com	2026-05-13 12:44:04.964614
189	/hackathons	1	admin@gmail.com	2026-05-13 12:44:05.572414
190	/complilier	1	admin@gmail.com	2026-05-13 12:44:42.938538
191	/circuit	1	admin@gmail.com	2026-05-13 12:44:43.860232
192	/complilier	1	admin@gmail.com	2026-05-13 12:51:03.93368
193	/prof-orientation	1	admin@gmail.com	2026-05-13 12:51:06.06314
194	/profile	1	admin@gmail.com	2026-05-13 13:01:54.547239
195	/mentor	1	admin@gmail.com	2026-05-13 13:02:05.699899
196	/mentor/schedule	1	admin@gmail.com	2026-05-13 13:02:07.461897
197	/mentor/assignments	1	admin@gmail.com	2026-05-13 13:02:08.325751
198	/mentor/materials	1	admin@gmail.com	2026-05-13 13:02:09.179603
199	/mentor/hackathons	1	admin@gmail.com	2026-05-13 13:02:09.87759
200	/mentor/electives	1	admin@gmail.com	2026-05-13 13:02:10.544995
201	/circuit	1	admin@gmail.com	2026-05-13 13:04:44.695963
202	/courses	1	admin@gmail.com	2026-05-13 13:04:46.682549
203	/library	1	admin@gmail.com	2026-05-13 13:04:48.708525
204	/	1	admin@gmail.com	2026-05-13 13:04:52.576034
205	/courses	1	admin@gmail.com	2026-05-13 13:06:34.983913
206	/	1	admin@gmail.com	2026-05-13 13:18:41.580065
207	/	1	admin@gmail.com	2026-05-13 13:36:34.050871
208	/profile	1	admin@gmail.com	2026-05-13 13:36:41.696704
209	/mentor	1	admin@gmail.com	2026-05-13 13:36:49.641588
210	/courses	1	admin@gmail.com	2026-05-13 13:37:17.706168
211	/library	1	admin@gmail.com	2026-05-13 13:37:24.570803
212	/	1	admin@gmail.com	2026-05-13 13:37:33.820638
213	/	8	studenEl1@gmail.com	2026-05-13 13:37:58.206693
214	/dashboard	8	studenEl1@gmail.com	2026-05-13 13:38:01.487295
215	/schedule	8	studenEl1@gmail.com	2026-05-13 13:38:42.921628
216	/	8	studenEl1@gmail.com	2026-05-13 13:39:38.427496
217	/	8	studenEl1@gmail.com	2026-05-13 13:56:19.619806
218	/	8	studenEl1@gmail.com	2026-05-13 13:59:09.48925
219	/	8	studenEl1@gmail.com	2026-05-13 13:59:22.477913
220	/profile	8	studenEl1@gmail.com	2026-05-13 14:03:17.826229
221	/profile	8	studenEl1@gmail.com	2026-05-13 14:05:05.6356
222	/profile	8	studenEl1@gmail.com	2026-05-13 14:08:03.593645
223	/	8	studenEl1@gmail.com	2026-05-13 14:08:05.317869
224	/	8	studenEl1@gmail.com	2026-05-13 14:10:46.069099
225	/dashboard	8	studenEl1@gmail.com	2026-05-13 14:11:12.894204
226	/profile	8	studenEl1@gmail.com	2026-05-13 14:11:19.425535
227	/dashboard	8	studenEl1@gmail.com	2026-05-13 14:11:22.267658
228	/schedule	8	studenEl1@gmail.com	2026-05-13 14:11:25.204655
229	/dashboard	8	studenEl1@gmail.com	2026-05-13 14:11:29.71416
230	/	8	studenEl1@gmail.com	2026-05-13 15:40:24.259949
231	/rooms	8	studenEl1@gmail.com	2026-05-13 15:40:37.876288
232	/rooms/1	8	studenEl1@gmail.com	2026-05-13 15:41:04.763779
233	/rooms/1/editor	8	studenEl1@gmail.com	2026-05-13 15:41:08.749677
234	/	7	studenEl@gmail.com	2026-05-13 15:43:04.120822
235	/rooms	7	studenEl@gmail.com	2026-05-13 15:43:28.0427
236	/rooms/1/editor	7	studenEl@gmail.com	2026-05-13 15:43:29.93617
237	/profile	8	studenEl1@gmail.com	2026-05-13 15:50:08.961513
238	/dashboard	8	studenEl1@gmail.com	2026-05-13 15:50:12.377004
239	/peer-review	8	studenEl1@gmail.com	2026-05-13 15:50:17.373268
240	/profile	8	studenEl1@gmail.com	2026-05-13 15:50:19.858884
241	/courses	8	studenEl1@gmail.com	2026-05-13 15:50:27.810366
242	/library	8	studenEl1@gmail.com	2026-05-13 15:50:28.365998
243	/courses	8	studenEl1@gmail.com	2026-05-13 15:50:28.996054
244	/library	8	studenEl1@gmail.com	2026-05-13 15:50:29.635229
245	/courses	8	studenEl1@gmail.com	2026-05-13 15:50:30.277541
246	/courses/english-vocab	8	studenEl1@gmail.com	2026-05-13 15:50:30.998251
247	/forum	8	studenEl1@gmail.com	2026-05-13 15:50:33.371351
794	/	1	admin@gmail.com	2026-05-22 08:51:22.922412
248	/rooms	8	studenEl1@gmail.com	2026-05-13 15:50:34.148504
249	/forum	8	studenEl1@gmail.com	2026-05-13 15:51:36.690971
250	/career	8	studenEl1@gmail.com	2026-05-13 15:51:38.722697
251	/hackathons	8	studenEl1@gmail.com	2026-05-13 15:51:40.211129
252	/prof-orientation	8	studenEl1@gmail.com	2026-05-13 15:51:40.953898
253	/circuit	8	studenEl1@gmail.com	2026-05-13 15:51:41.799113
254	/profile	8	studenEl1@gmail.com	2026-05-13 15:51:45.647705
255	/dashboard	8	studenEl1@gmail.com	2026-05-13 15:51:47.071048
256	/peer-review	8	studenEl1@gmail.com	2026-05-13 15:51:49.194684
257	/dashboard	8	studenEl1@gmail.com	2026-05-13 15:51:50.456487
258	/electives	8	studenEl1@gmail.com	2026-05-13 15:51:51.002273
259	/circuit	8	studenEl1@gmail.com	2026-05-13 15:51:52.98464
260	/prof-orientation	8	studenEl1@gmail.com	2026-05-13 15:51:53.703587
261	/circuit	8	studenEl1@gmail.com	2026-05-13 15:51:56.462174
262	/prof-orientation	8	studenEl1@gmail.com	2026-05-13 15:51:57.36683
263	/circuit	8	studenEl1@gmail.com	2026-05-13 15:52:21.190956
264	/prof-orientation	8	studenEl1@gmail.com	2026-05-13 15:52:21.742425
265	/hackathons	8	studenEl1@gmail.com	2026-05-13 15:52:22.400227
266	/career	8	studenEl1@gmail.com	2026-05-13 15:52:23.615686
267	/rooms	8	studenEl1@gmail.com	2026-05-13 15:52:24.879236
268	/forum	8	studenEl1@gmail.com	2026-05-13 15:52:26.025468
269	/library	8	studenEl1@gmail.com	2026-05-13 15:52:27.901666
270	/courses	8	studenEl1@gmail.com	2026-05-13 15:52:28.990015
271	/profile	8	studenEl1@gmail.com	2026-05-13 15:52:30.838451
272	/dashboard	8	studenEl1@gmail.com	2026-05-13 15:52:32.273339
273	/dashboard	8	studenEl1@gmail.com	2026-05-13 16:12:17.420964
274	/hackathons	8	studenEl1@gmail.com	2026-05-13 16:12:20.850883
275	/prof-orientation	8	studenEl1@gmail.com	2026-05-13 16:12:21.941803
276	/prof-orientation	8	studenEl1@gmail.com	2026-05-13 16:12:24.104131
277	/courses	8	studenEl1@gmail.com	2026-05-13 16:12:27.4871
278	/circuit	8	studenEl1@gmail.com	2026-05-13 16:12:28.210795
279	/profile	8	studenEl1@gmail.com	2026-05-13 16:12:29.72123
280	/courses	8	studenEl1@gmail.com	2026-05-13 16:12:36.188009
281	/rooms	8	studenEl1@gmail.com	2026-05-13 16:12:36.803951
282	/rooms	8	studenEl1@gmail.com	2026-05-13 16:12:38.63528
283	/rooms	8	studenEl1@gmail.com	2026-05-13 16:12:39.546486
284	/rooms	8	studenEl1@gmail.com	2026-05-13 16:12:40.026843
285	/rooms	8	studenEl1@gmail.com	2026-05-13 16:17:38.321994
286	/career	8	studenEl1@gmail.com	2026-05-13 16:17:41.251932
287	/hackathons	8	studenEl1@gmail.com	2026-05-13 16:17:41.931674
288	/prof-orientation	8	studenEl1@gmail.com	2026-05-13 16:17:42.786428
289	/	8	studenEl1@gmail.com	2026-05-13 16:17:49.240573
290	/circuit	8	studenEl1@gmail.com	2026-05-13 16:21:05.363741
291	/prof-orientation	8	studenEl1@gmail.com	2026-05-13 16:21:05.799236
292	/hackathons	8	studenEl1@gmail.com	2026-05-13 16:21:06.538594
293	/career	8	studenEl1@gmail.com	2026-05-13 16:21:07.018935
294	/rooms	8	studenEl1@gmail.com	2026-05-13 16:21:07.811877
295	/forum	8	studenEl1@gmail.com	2026-05-13 16:21:08.21642
296	/library	8	studenEl1@gmail.com	2026-05-13 16:21:08.97502
297	/courses	8	studenEl1@gmail.com	2026-05-13 16:21:09.645422
298	/profile	8	studenEl1@gmail.com	2026-05-13 16:21:11.532476
299	/dashboard	8	studenEl1@gmail.com	2026-05-13 16:21:13.332099
300	/profile	8	studenEl1@gmail.com	2026-05-13 16:29:52.290467
301	/profile	8	studenEl1@gmail.com	2026-05-13 16:55:41.781566
302	/profile	8	studenEl1@gmail.com	2026-05-13 16:57:07.994734
303	/profile	8	studenEl1@gmail.com	2026-05-13 17:04:44.38843
304	/	8	studenEl1@gmail.com	2026-05-13 17:32:29.535265
305	/profile	8	studenEl1@gmail.com	2026-05-13 17:32:34.85641
306	/achivments	8	studenEl1@gmail.com	2026-05-13 17:37:49.632439
307	/achivments	8	studenEl1@gmail.com	2026-05-13 17:40:13.208038
308	/profile	8	studenEl1@gmail.com	2026-05-13 17:40:14.900345
309	/profile	8	studenEl1@gmail.com	2026-05-13 17:53:52.301485
310	/	8	studenEl1@gmail.com	2026-05-13 17:54:12.623129
311	/courses	8	studenEl1@gmail.com	2026-05-13 17:54:32.462386
312	/courses	8	studenEl1@gmail.com	2026-05-13 18:02:14.567839
313	/courses/4	8	studenEl1@gmail.com	2026-05-13 18:02:20.803564
314	/	8	studenEl1@gmail.com	2026-05-13 18:02:25.645663
315	/	8	studenEl1@gmail.com	2026-05-13 18:12:40.648373
316	/	8	studenEl1@gmail.com	2026-05-13 18:21:24.318724
317	/	8	studenEl1@gmail.com	2026-05-13 18:28:46.444148
318	/	8	studenEl1@gmail.com	2026-05-13 18:32:17.816811
319	/	8	studenEl1@gmail.com	2026-05-13 18:36:31.545536
320	/	8	studenEl1@gmail.com	2026-05-13 18:51:23.16325
321	/dashboard	8	studenEl1@gmail.com	2026-05-13 18:52:31.712393
322	/	8	studenEl1@gmail.com	2026-05-13 18:52:34.120656
323	/	1	admin@gmail.com	2026-05-13 19:13:16.375014
324	/	1	admin@gmail.com	2026-05-18 08:18:03.153897
325	/complilier	1	admin@gmail.com	2026-05-18 08:18:10.776005
326	/course-access	1	admin@gmail.com	2026-05-18 08:18:10.822521
327	/circuit	1	admin@gmail.com	2026-05-18 08:18:14.316147
328	/circuit	1	admin@gmail.com	2026-05-18 08:22:52.384741
329	/circuit	1	admin@gmail.com	2026-05-18 08:23:59.27435
330	/circuit	1	admin@gmail.com	2026-05-18 08:25:56.097962
331	/courses	1	admin@gmail.com	2026-05-18 08:33:28.660778
332	/	1	admin@gmail.com	2026-05-18 08:33:29.661681
333	/library	1	admin@gmail.com	2026-05-18 08:33:43.720319
334	/forum	1	admin@gmail.com	2026-05-18 08:33:59.538685
335	/courses	1	admin@gmail.com	2026-05-18 08:42:17.946174
336	/	1	admin@gmail.com	2026-05-18 08:42:18.831284
337	/	1	admin@gmail.com	2026-05-18 08:51:23.797961
338	/	1	admin@gmail.com	2026-05-18 08:54:01.304005
339	/terms	1	admin@gmail.com	2026-05-18 08:55:42.583288
340	/	1	admin@gmail.com	2026-05-18 08:55:44.235516
341	/	1	admin@gmail.com	2026-05-18 09:00:20.386601
342	/courses	1	admin@gmail.com	2026-05-18 09:00:40.265958
343	/forum	1	admin@gmail.com	2026-05-18 09:00:46.683602
344	/forum	1	admin@gmail.com	2026-05-18 09:09:23.106536
345	/forum/1	1	admin@gmail.com	2026-05-18 09:12:51.326667
346	/forum	1	admin@gmail.com	2026-05-18 09:12:56.909677
347	/forum/1	1	admin@gmail.com	2026-05-18 09:12:58.188639
348	/forum/topic/1	1	admin@gmail.com	2026-05-18 09:13:17.869705
349	/forum/1	1	admin@gmail.com	2026-05-18 09:13:22.92231
350	/forum/topic/1	1	admin@gmail.com	2026-05-18 09:13:24.769763
351	/forum/1	1	admin@gmail.com	2026-05-18 09:13:25.776989
352	/forum/topic/1	1	admin@gmail.com	2026-05-18 09:13:26.883354
353	/forum/1	1	admin@gmail.com	2026-05-18 09:13:32.680892
354	/forum	1	admin@gmail.com	2026-05-18 09:13:34.810356
355	/forum/1	1	admin@gmail.com	2026-05-18 09:13:50.939045
356	/forum	1	admin@gmail.com	2026-05-18 09:13:58.218637
357	/library	1	admin@gmail.com	2026-05-18 09:14:02.058976
358	/courses	1	admin@gmail.com	2026-05-18 09:14:05.131793
359	/forum	1	admin@gmail.com	2026-05-18 09:14:19.317173
360	/forum/1	1	admin@gmail.com	2026-05-18 09:14:22.369332
361	/courses	1	admin@gmail.com	2026-05-18 09:14:25.369375
362	/complilier	1	admin@gmail.com	2026-05-18 09:41:49.412298
363	/course-access	1	admin@gmail.com	2026-05-18 09:41:49.474989
364	/circuit	1	admin@gmail.com	2026-05-18 09:41:50.249149
365	/circuit	1	admin@gmail.com	2026-05-18 10:49:17.00995
366	/	1	admin@gmail.com	2026-05-18 10:49:20.630755
367	/courses	1	admin@gmail.com	2026-05-18 10:49:23.541588
368	/circuit	1	admin@gmail.com	2026-05-18 10:49:33.686443
369	/courses	1	admin@gmail.com	2026-05-18 10:49:35.284695
370	/library	1	admin@gmail.com	2026-05-18 10:49:45.932119
371	/forum	1	admin@gmail.com	2026-05-18 10:49:47.217483
372	/rooms	1	admin@gmail.com	2026-05-18 10:49:47.858279
373	/career	1	admin@gmail.com	2026-05-18 10:49:48.814878
374	/rooms	1	admin@gmail.com	2026-05-18 10:50:22.719858
375	/career	1	admin@gmail.com	2026-05-18 10:50:23.351786
376	/hackathons	1	admin@gmail.com	2026-05-18 10:50:23.906955
377	/prof-orientation	1	admin@gmail.com	2026-05-18 10:50:28.716423
378	/complilier	1	admin@gmail.com	2026-05-18 10:50:33.865614
379	/course-access	1	admin@gmail.com	2026-05-18 10:50:33.902187
380	/circuit	1	admin@gmail.com	2026-05-18 10:50:37.702966
381	/	1	admin@gmail.com	2026-05-18 10:50:49.565536
382	/complilier	1	admin@gmail.com	2026-05-18 10:50:51.883169
383	/course-access	1	admin@gmail.com	2026-05-18 10:50:51.928098
384	/complilier	1	admin@gmail.com	2026-05-18 10:51:00.432566
385	/course-access	1	admin@gmail.com	2026-05-18 10:51:00.460976
386	/complilier	1	admin@gmail.com	2026-05-18 10:51:01.27788
387	/course-access	1	admin@gmail.com	2026-05-18 10:51:01.317655
388	/	1	admin@gmail.com	2026-05-18 10:51:03.593371
389	/circuit	1	admin@gmail.com	2026-05-18 10:51:33.84948
390	/schedule/37	1	admin@gmail.com	2026-05-18 10:51:38.071912
391	/shematic	1	admin@gmail.com	2026-05-18 10:51:45.956673
392	/	1	admin@gmail.com	2026-05-18 10:51:50.620019
393	/	1	admin@gmail.com	2026-05-18 10:55:48.136486
394	/complilier	1	admin@gmail.com	2026-05-18 10:55:51.638408
395	/prof-orientation	1	admin@gmail.com	2026-05-18 10:55:57.533646
396	/hackathons	1	admin@gmail.com	2026-05-18 10:55:58.701123
397	/career	1	admin@gmail.com	2026-05-18 10:55:59.608776
398	/hackathons	1	admin@gmail.com	2026-05-18 10:56:45.708499
399	/prof-orientation	1	admin@gmail.com	2026-05-18 10:56:46.864226
400	/complilier	1	admin@gmail.com	2026-05-18 10:56:47.508395
401	/profile	1	admin@gmail.com	2026-05-18 10:57:03.766138
402	/complilier	1	admin@gmail.com	2026-05-18 10:57:10.659979
403	/	1	admin@gmail.com	2026-05-18 10:57:13.03807
404	/	1	admin@gmail.com	2026-05-18 11:04:32.739912
405	/complilier	1	admin@gmail.com	2026-05-18 11:04:35.923565
406	/prof-orientation	1	admin@gmail.com	2026-05-18 11:05:01.416534
407	/hackathons	1	admin@gmail.com	2026-05-18 11:05:02.3069
408	/career	1	admin@gmail.com	2026-05-18 11:05:03.215686
409	/complilier	1	admin@gmail.com	2026-05-18 11:05:27.348969
410	/	7	studenEl@gmail.com	2026-05-18 11:06:01.573372
411	/prof-orientation	7	studenEl@gmail.com	2026-05-18 11:06:04.561502
412	/dashboard	7	studenEl@gmail.com	2026-05-18 11:06:07.482492
413	/schedule	7	studenEl@gmail.com	2026-05-18 11:06:28.725337
414	/schedule	7	studenEl@gmail.com	2026-05-18 11:14:19.520905
415	/dashboard	7	studenEl@gmail.com	2026-05-18 11:14:31.024433
416	/electives	7	studenEl@gmail.com	2026-05-18 11:14:42.054044
417	/dashboard	7	studenEl@gmail.com	2026-05-18 11:14:46.846452
418	/schedule	7	studenEl@gmail.com	2026-05-18 11:14:49.21173
419	/dashboard	7	studenEl@gmail.com	2026-05-18 11:14:50.762547
420	/electives	7	studenEl@gmail.com	2026-05-18 11:14:52.247918
421	/dashboard	7	studenEl@gmail.com	2026-05-18 11:14:58.530541
422	/internships	7	studenEl@gmail.com	2026-05-18 11:14:59.738766
423	/dashboard	7	studenEl@gmail.com	2026-05-18 11:15:05.935034
424	/hackathons	7	studenEl@gmail.com	2026-05-18 11:15:07.273226
425	/dashboard	7	studenEl@gmail.com	2026-05-18 11:15:09.357455
426	/peer-review	7	studenEl@gmail.com	2026-05-18 11:15:10.436254
427	/peer-review	7	studenEl@gmail.com	2026-05-18 11:25:29.766556
428	/dashboard	7	studenEl@gmail.com	2026-05-18 11:25:40.354958
429	/electives	7	studenEl@gmail.com	2026-05-18 11:25:41.522452
430	/dashboard	7	studenEl@gmail.com	2026-05-18 11:25:44.506505
431	/internships	7	studenEl@gmail.com	2026-05-18 11:25:45.833965
432	/dashboard	7	studenEl@gmail.com	2026-05-18 11:25:47.879433
433	/hackathons	7	studenEl@gmail.com	2026-05-18 11:25:54.350465
434	/dashboard	7	studenEl@gmail.com	2026-05-18 11:25:55.84248
435	/	7	studenEl@gmail.com	2026-05-18 11:29:57.689112
436	/career	7	studenEl@gmail.com	2026-05-18 11:30:01.444269
437	/rooms	7	studenEl@gmail.com	2026-05-18 11:30:03.047364
438	/forum	7	studenEl@gmail.com	2026-05-18 11:30:06.79378
439	/rooms	7	studenEl@gmail.com	2026-05-18 11:30:07.913507
440	/library	7	studenEl@gmail.com	2026-05-18 11:30:08.951832
441	/forum	7	studenEl@gmail.com	2026-05-18 11:30:10.23162
442	/rooms	7	studenEl@gmail.com	2026-05-18 11:30:10.858827
443	/profile	7	studenEl@gmail.com	2026-05-18 11:30:32.995179
444	/dashboard	7	studenEl@gmail.com	2026-05-18 11:30:36.560832
445	/dashboard	7	studenEl@gmail.com	2026-05-18 11:37:56.971499
446	/rooms	7	studenEl@gmail.com	2026-05-18 11:37:59.441767
447	/	1	admin@gmail.com	2026-05-18 11:38:33.899457
448	/mentor	1	admin@gmail.com	2026-05-18 11:38:44.609681
449	/mentor/groups	1	admin@gmail.com	2026-05-18 11:38:46.137325
450	/mentor/schedule	1	admin@gmail.com	2026-05-18 11:38:51.079127
451	/mentor/assignments	1	admin@gmail.com	2026-05-18 11:39:01.30559
452	/mentor/materials	1	admin@gmail.com	2026-05-18 11:39:12.477933
453	/mentor/hackathons	1	admin@gmail.com	2026-05-18 11:39:16.503352
454	/mentor/electives	1	admin@gmail.com	2026-05-18 11:45:24.717037
455	/	1	admin@gmail.com	2026-05-18 11:49:10.754536
456	/courses	1	admin@gmail.com	2026-05-18 11:49:51.083847
457	/courses/english-vocab	1	admin@gmail.com	2026-05-18 11:49:52.121721
458	/courses/english-vocab	1	admin@gmail.com	2026-05-18 12:02:51.972084
459	/courses	1	admin@gmail.com	2026-05-18 12:05:23.09268
460	/courses/english-vocab	1	admin@gmail.com	2026-05-18 12:05:23.990758
461	/courses/english-vocab	1	admin@gmail.com	2026-05-18 12:19:03.606041
462	/library	1	admin@gmail.com	2026-05-18 12:20:08.631802
463	/courses	1	admin@gmail.com	2026-05-18 12:20:09.329317
464	/courses/english-vocab	1	admin@gmail.com	2026-05-18 12:20:10.731592
465	/courses/english-vocab	1	admin@gmail.com	2026-05-18 12:25:49.759798
466	/career	1	admin@gmail.com	2026-05-18 12:31:24.828122
467	/profile	1	admin@gmail.com	2026-05-18 12:31:38.050277
468	/	1	admin@gmail.com	2026-05-18 12:32:11.622597
469	/mentor	1	admin@gmail.com	2026-05-19 07:40:56.408375
470	/mentor	1	admin@gmail.com	2026-05-19 07:47:40.650614
471	/mentor/vocabulary	1	admin@gmail.com	2026-05-19 07:47:43.345654
472	/mentor	1	admin@gmail.com	2026-05-19 07:49:37.550424
473	/mentor/hackathons	1	admin@gmail.com	2026-05-19 08:03:17.420387
474	/mentor/electives	1	admin@gmail.com	2026-05-19 08:05:43.626185
475	/mentor/forum	1	admin@gmail.com	2026-05-19 08:05:44.928872
476	/mentor/materials	1	admin@gmail.com	2026-05-19 08:05:45.829685
477	/mentor/assignments	1	admin@gmail.com	2026-05-19 08:05:46.729794
478	/mentor/schedule	1	admin@gmail.com	2026-05-19 08:05:47.488176
479	/mentor/groups	1	admin@gmail.com	2026-05-19 08:05:48.863695
480	/mentor	1	admin@gmail.com	2026-05-19 08:05:50.942389
481	/mentor	1	admin@gmail.com	2026-05-19 08:06:07.582826
482	/mqtt-expert	1	admin@gmail.com	2026-05-19 08:06:10.026616
483	/shematic	1	admin@gmail.com	2026-05-19 08:06:17.606307
484	/mqtt-expert	1	admin@gmail.com	2026-05-19 08:06:18.350442
485	/shematic	1	admin@gmail.com	2026-05-19 08:06:19.391179
486	/mqtt-expert	1	admin@gmail.com	2026-05-19 08:06:36.405149
487	/shematic	1	admin@gmail.com	2026-05-19 08:38:44.147997
488	/shematic	1	admin@gmail.com	2026-05-19 08:50:12.848919
489	/shematic	1	admin@gmail.com	2026-05-19 08:56:40.91199
490	/profile	1	admin@gmail.com	2026-05-19 08:56:43.502679
491	/mentor	1	admin@gmail.com	2026-05-19 08:57:11.575181
492	/mentor/groups	1	admin@gmail.com	2026-05-19 08:57:12.907252
493	/mentor/schedule	1	admin@gmail.com	2026-05-19 08:57:14.086349
494	/mentor/assignments	1	admin@gmail.com	2026-05-19 08:57:17.193793
495	/mentor/materials	1	admin@gmail.com	2026-05-19 08:57:17.932758
496	/mentor/electives	1	admin@gmail.com	2026-05-19 08:57:18.762346
497	/mentor/forum	1	admin@gmail.com	2026-05-19 08:57:19.894361
498	/mentor/vocabulary	1	admin@gmail.com	2026-05-19 08:57:20.895172
499	/mentor/olympiads	1	admin@gmail.com	2026-05-19 08:57:21.869237
500	/mentor/olympiads	1	admin@gmail.com	2026-05-19 08:58:21.951544
501	/mentor/groups	1	admin@gmail.com	2026-05-19 08:58:37.095919
502	/mentor/groups	1	admin@gmail.com	2026-05-19 08:59:09.234259
503	/mentor/schedule	1	admin@gmail.com	2026-05-19 08:59:22.307303
504	/mentor/assignments	1	admin@gmail.com	2026-05-19 08:59:23.815488
505	/mentor	1	admin@gmail.com	2026-05-19 09:01:35.278386
506	/mentor	1	admin@gmail.com	2026-05-19 09:08:21.951047
507	/mentor/groups	1	admin@gmail.com	2026-05-19 09:08:25.195479
508	/mentor	1	admin@gmail.com	2026-05-19 09:08:28.023384
509	/mentor/assignments	1	admin@gmail.com	2026-05-19 09:08:31.814188
510	/mentor/groups	1	admin@gmail.com	2026-05-19 09:08:32.591097
511	/mentor/schedule	1	admin@gmail.com	2026-05-19 09:08:40.194356
512	/profile/2	1	admin@gmail.com	2026-05-19 09:09:51.170748
513	/profile	1	admin@gmail.com	2026-05-19 09:09:59.161783
514	/profile	1	admin@gmail.com	2026-05-19 09:15:33.204123
515	/mentor	1	admin@gmail.com	2026-05-19 09:15:49.640073
516	/mentor/groups	1	admin@gmail.com	2026-05-19 09:15:51.933838
517	/mentor	1	admin@gmail.com	2026-05-19 09:15:53.226382
518	/mentor	1	admin@gmail.com	2026-05-19 09:22:14.910969
519	/mentor/groups	1	admin@gmail.com	2026-05-19 09:22:26.176355
520	/mentor/schedule	1	admin@gmail.com	2026-05-19 09:22:27.965893
521	/mentor/assignments	1	admin@gmail.com	2026-05-19 09:22:28.804539
522	/mentor/groups	1	admin@gmail.com	2026-05-19 09:22:30.03251
523	/mentor	1	admin@gmail.com	2026-05-19 09:22:32.103879
524	/mentor	1	admin@gmail.com	2026-05-19 09:26:57.312797
525	/mentor	1	admin@gmail.com	2026-05-19 09:28:47.167345
526	/mentor/groups	1	admin@gmail.com	2026-05-19 09:28:49.020209
527	/mentor	1	admin@gmail.com	2026-05-19 09:28:50.089835
528	/mentor/schedule	1	admin@gmail.com	2026-05-19 09:29:06.291908
529	/mentor/assignments	1	admin@gmail.com	2026-05-19 09:29:07.502927
530	/mentor/groups	1	admin@gmail.com	2026-05-19 09:29:08.428121
531	/mentor	1	admin@gmail.com	2026-05-19 09:29:13.901865
532	/mentor/forum	1	admin@gmail.com	2026-05-19 09:29:27.406673
533	/mentor/electives	1	admin@gmail.com	2026-05-19 09:29:29.502565
534	/mentor/hackathons	1	admin@gmail.com	2026-05-19 09:29:31.257379
535	/mentor/materials	1	admin@gmail.com	2026-05-19 09:29:32.707881
536	/mentor/assignments	1	admin@gmail.com	2026-05-19 09:29:33.615993
537	/shematic	1	admin@gmail.com	2026-05-19 09:31:18.363708
538	/mqtt-expert	1	admin@gmail.com	2026-05-19 09:31:19.240759
539	/shematic	1	admin@gmail.com	2026-05-19 09:31:25.802193
540	/mqtt-expert	1	admin@gmail.com	2026-05-19 09:31:28.021376
541	/shematic	1	admin@gmail.com	2026-05-19 09:31:44.263835
542	/mqtt-expert	1	admin@gmail.com	2026-05-19 09:31:45.66185
543	/mqtt-expert	1	admin@gmail.com	2026-05-19 09:32:29.286811
544	/	1	admin@gmail.com	2026-05-19 13:13:48.632671
545	/	1	admin@gmail.com	2026-05-21 07:38:23.426965
546	/mentor	1	admin@gmail.com	2026-05-21 07:38:33.615966
547	/courses	1	admin@gmail.com	2026-05-21 07:46:09.139553
548	/shematic	1	admin@gmail.com	2026-05-21 07:46:26.199909
549	/courses	1	admin@gmail.com	2026-05-21 07:46:28.42147
550	/	1	admin@gmail.com	2026-05-21 07:56:54.349225
551	/forum	1	admin@gmail.com	2026-05-21 07:57:07.030778
552	/forum/1	1	admin@gmail.com	2026-05-21 07:57:10.225563
553	/library	1	admin@gmail.com	2026-05-21 07:57:13.859128
554	/courses	1	admin@gmail.com	2026-05-21 07:57:26.874337
555	/rooms	1	admin@gmail.com	2026-05-21 07:57:33.189046
556	/career	1	admin@gmail.com	2026-05-21 07:57:43.557809
557	/hackathons	1	admin@gmail.com	2026-05-21 07:57:55.708068
558	/olympiads	1	admin@gmail.com	2026-05-21 07:57:59.144638
559	/prof-orientation	1	admin@gmail.com	2026-05-21 07:58:01.856104
560	/complilier	1	admin@gmail.com	2026-05-21 07:58:10.148242
561	/circuit	1	admin@gmail.com	2026-05-21 07:58:15.731917
562	/mqtt-expert	1	admin@gmail.com	2026-05-21 07:58:30.951207
563	/shematic	1	admin@gmail.com	2026-05-21 07:58:31.725902
564	/mqtt-expert	1	admin@gmail.com	2026-05-21 07:58:47.924576
565	/mentor	1	admin@gmail.com	2026-05-21 07:59:03.402669
566	/mentor/materials	1	admin@gmail.com	2026-05-21 07:59:05.619633
567	/mentor/electives	1	admin@gmail.com	2026-05-21 07:59:06.280398
568	/mentor/assignments	1	admin@gmail.com	2026-05-21 07:59:07.164485
569	/mentor/schedule	1	admin@gmail.com	2026-05-21 07:59:07.842996
795	/mentor	1	admin@gmail.com	2026-05-22 08:51:30.891331
570	/mentor/groups	1	admin@gmail.com	2026-05-21 07:59:08.48133
571	/profile	1	admin@gmail.com	2026-05-21 07:59:16.721776
572	/	1	admin@gmail.com	2026-05-21 07:59:31.380693
573	/about	1	admin@gmail.com	2026-05-21 07:59:34.644484
574	/contacts	1	admin@gmail.com	2026-05-21 07:59:44.611847
575	/faq	1	admin@gmail.com	2026-05-21 07:59:50.438114
576	/terms	1	admin@gmail.com	2026-05-21 07:59:55.512579
577	/privacy	1	admin@gmail.com	2026-05-21 07:59:58.231271
578	/	1	admin@gmail.com	2026-05-21 08:00:01.534917
579	/mentor	1	admin@gmail.com	2026-05-21 08:11:42.169616
580	/mentor/groups	1	admin@gmail.com	2026-05-21 08:11:45.143829
581	/mentor	1	admin@gmail.com	2026-05-21 08:11:46.391681
582	/mentor/groups	1	admin@gmail.com	2026-05-21 08:11:47.219427
583	/mentor	1	admin@gmail.com	2026-05-21 08:18:07.021891
584	/mentor/groups	1	admin@gmail.com	2026-05-21 08:18:08.335582
585	/mentor	1	admin@gmail.com	2026-05-21 08:30:05.960108
586	/mentor/groups	1	admin@gmail.com	2026-05-21 08:32:06.133142
587	/mentor/schedule	1	admin@gmail.com	2026-05-21 08:32:07.190073
588	/	10	mentorElec@gmail.com	2026-05-21 08:35:52.992395
589	/	1	admin@gmail.com	2026-05-21 08:37:12.986179
590	/	12	mentorInf@gmail.com	2026-05-21 08:38:35.507712
591	/mentor	12	mentorInf@gmail.com	2026-05-21 08:38:39.489702
592	/mentor/groups	12	mentorInf@gmail.com	2026-05-21 08:38:41.936835
593	/mentor/schedule	12	mentorInf@gmail.com	2026-05-21 08:38:44.646355
594	/	1	admin@gmail.com	2026-05-21 08:39:27.666073
595	/mentor	1	admin@gmail.com	2026-05-21 08:39:32.106312
596	/mentor/groups	1	admin@gmail.com	2026-05-21 08:39:33.758387
597	/mentor/schedule	1	admin@gmail.com	2026-05-21 08:39:34.4907
598	/mentor/assignments	1	admin@gmail.com	2026-05-21 08:40:53.173535
599	/mentor/assignments	1	admin@gmail.com	2026-05-21 08:52:45.238254
600	/mentor/assignments	1	admin@gmail.com	2026-05-21 08:53:55.325879
601	/mentor/assignments	1	admin@gmail.com	2026-05-21 08:56:30.579208
602	/mentor/assignments	1	admin@gmail.com	2026-05-21 08:57:29.832248
603	/mentor/assignments	1	admin@gmail.com	2026-05-21 08:59:16.644284
604	/mentor/assignments	1	admin@gmail.com	2026-05-21 09:02:45.188775
605	/mentor/assignments	1	admin@gmail.com	2026-05-21 09:27:33.013422
606	/mentor/assignments	1	admin@gmail.com	2026-05-21 09:27:37.540841
607	/mentor/assignments	1	admin@gmail.com	2026-05-21 09:28:03.044125
608	/	1	admin@gmail.com	2026-05-21 09:28:17.533933
609	/mentor/assignments	1	admin@gmail.com	2026-05-21 09:31:29.664661
610	/mentor/assignments	1	admin@gmail.com	2026-05-21 09:47:11.964057
611	/	1	admin@gmail.com	2026-05-21 11:01:08.270846
612	/mentor	1	admin@gmail.com	2026-05-21 11:01:16.673713
613	/mentor/groups	1	admin@gmail.com	2026-05-21 11:01:18.810409
614	/mentor/schedule	1	admin@gmail.com	2026-05-21 11:01:19.690747
615	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:01:20.590904
616	/mentor/materials	1	admin@gmail.com	2026-05-21 11:01:45.763229
617	/mentor/materials	1	admin@gmail.com	2026-05-21 11:07:35.444024
618	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:07:37.187907
619	/mentor/hackathons	1	admin@gmail.com	2026-05-21 11:07:47.838982
620	/mentor/materials	1	admin@gmail.com	2026-05-21 11:07:48.557591
621	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:07:49.171957
622	/mentor/schedule	1	admin@gmail.com	2026-05-21 11:07:49.79783
623	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:07:50.610252
624	/mentor/materials	1	admin@gmail.com	2026-05-21 11:07:51.825363
625	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:08:26.389067
626	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:08:54.049973
627	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:08:54.603954
628	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:08:55.84306
629	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:14:35.043775
630	/mentor/groups	1	admin@gmail.com	2026-05-21 11:14:45.463443
631	/mentor/schedule	1	admin@gmail.com	2026-05-21 11:18:07.137744
632	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:18:08.526852
633	/mentor/assignments	1	admin@gmail.com	2026-05-21 11:38:17.4249
634	/mentor/assignments	1	admin@gmail.com	2026-05-21 12:01:22.56342
635	/mentor/assignments	1	admin@gmail.com	2026-05-21 12:36:37.198859
636	/mentor/assignments	1	admin@gmail.com	2026-05-21 12:44:27.247804
637	/mentor/assignments	1	admin@gmail.com	2026-05-21 12:44:28.053377
638	/mentor/assignments	1	admin@gmail.com	2026-05-21 12:55:48.559475
639	/mentor/assignments	1	admin@gmail.com	2026-05-21 13:21:09.495053
640	/mentor/assignments	1	admin@gmail.com	2026-05-21 13:46:56.061228
641	/mentor/assignments	1	admin@gmail.com	2026-05-21 13:53:26.753973
642	/	12	mentorInf@gmail.com	2026-05-21 13:53:55.576946
643	/mentor	12	mentorInf@gmail.com	2026-05-21 13:53:58.315303
644	/mentor/schedule	12	mentorInf@gmail.com	2026-05-21 13:54:01.934218
645	/mentor/assignments	12	mentorInf@gmail.com	2026-05-21 13:54:02.841676
646	/mentor/assignments	12	mentorInf@gmail.com	2026-05-21 13:54:04.726481
647	/mentor/assignments	12	mentorInf@gmail.com	2026-05-21 13:54:05.528572
648	/mentor/assignments	12	mentorInf@gmail.com	2026-05-21 13:54:06.324475
649	/mentor/assignments	12	mentorInf@gmail.com	2026-05-21 13:54:06.61063
650	/dashboard	12	mentorInf@gmail.com	2026-05-21 13:54:19.863183
651	/	7	studenEl@gmail.com	2026-05-21 13:54:46.482846
652	/dashboard	7	studenEl@gmail.com	2026-05-21 13:54:48.958795
653	/	7	studenEl@gmail.com	2026-05-21 13:54:58.843384
654	/	7	studenEl@gmail.com	2026-05-21 13:54:59.541712
655	/courses	7	studenEl@gmail.com	2026-05-21 13:55:00.919194
656	/	7	studenEl@gmail.com	2026-05-21 13:55:22.116772
657	/dashboard	7	studenEl@gmail.com	2026-05-21 13:55:25.079326
658	/schedule	7	studenEl@gmail.com	2026-05-21 13:55:26.841523
674	/schedule	7	studenEl@gmail.com	2026-05-21 15:58:39.243962
675	/assignments/24	7	studenEl@gmail.com	2026-05-21 15:58:45.353921
676	/schedule	7	studenEl@gmail.com	2026-05-21 15:58:56.759991
677	/	1	admin@gmail.com	2026-05-21 15:59:06.049369
678	/mentor	1	admin@gmail.com	2026-05-21 15:59:11.970981
679	/mentor/schedule	1	admin@gmail.com	2026-05-21 15:59:14.390149
680	/mentor/assignments	1	admin@gmail.com	2026-05-21 15:59:15.858049
681	/mentor/assignments	1	admin@gmail.com	2026-05-21 16:14:28.81692
682	/mentor/schedule	1	admin@gmail.com	2026-05-21 16:14:30.2779
683	/mentor/schedule	1	admin@gmail.com	2026-05-21 16:38:59.216283
684	/mentor/assignments	1	admin@gmail.com	2026-05-21 17:06:31.019644
685	/mentor/materials	1	admin@gmail.com	2026-05-21 17:06:31.51552
686	/library	1	admin@gmail.com	2026-05-21 17:07:37.883586
687	/mentor	1	admin@gmail.com	2026-05-21 17:08:10.428461
900	/mentor	1	admin@gmail.com	2026-05-22 11:27:18.154052
688	/mentor/materials	1	admin@gmail.com	2026-05-21 17:08:13.199563
689	/mentor/hackathons	1	admin@gmail.com	2026-05-21 17:14:39.874127
690	/mentor/electives	1	admin@gmail.com	2026-05-21 17:14:42.283951
691	/mentor/forum	1	admin@gmail.com	2026-05-21 17:14:51.360708
692	/mentor/vocabulary	1	admin@gmail.com	2026-05-21 17:14:56.648264
693	/mentor/olympiads	1	admin@gmail.com	2026-05-21 17:15:00.477486
694	/mentor/electives	1	admin@gmail.com	2026-05-21 17:15:02.397856
695	/mentor/electives	1	admin@gmail.com	2026-05-21 17:52:49.166062
696	/mentor	1	admin@gmail.com	2026-05-21 18:15:04.583418
697	/mentor/hackathons	1	admin@gmail.com	2026-05-21 18:15:06.213044
698	/mentor/materials	1	admin@gmail.com	2026-05-21 18:15:10.7161
699	/mentor/electives	1	admin@gmail.com	2026-05-21 18:15:13.106715
700	/mentor/forum	1	admin@gmail.com	2026-05-21 18:15:14.37096
701	/mentor/vocabulary	1	admin@gmail.com	2026-05-21 18:15:15.333565
702	/mentor/hackathons	1	admin@gmail.com	2026-05-21 18:15:15.891925
703	/hackathons	1	admin@gmail.com	2026-05-21 18:21:15.597958
704	/hackathons/1	1	admin@gmail.com	2026-05-21 18:21:17.16803
705	/hackathons	1	admin@gmail.com	2026-05-21 18:21:40.399193
706	/mentor	1	admin@gmail.com	2026-05-21 18:22:00.795459
707	/mentor/olympiads	1	admin@gmail.com	2026-05-21 18:22:02.834991
708	/mentor/electives	1	admin@gmail.com	2026-05-21 18:22:04.006611
709	/mentor/hackathons	1	admin@gmail.com	2026-05-21 18:22:08.460124
710	/privacy	1	admin@gmail.com	2026-05-22 05:15:23.73674
711	/mentor/hackathons	1	admin@gmail.com	2026-05-22 05:21:09.061779
712	/mentor/hackathons	1	admin@gmail.com	2026-05-22 08:25:53.556707
713	/mentor/schedule	1	admin@gmail.com	2026-05-22 08:25:56.262757
714	/mentor/assignments	1	admin@gmail.com	2026-05-22 08:25:57.333609
715	/mentor/schedule	1	admin@gmail.com	2026-05-22 08:26:06.742726
716	/mentor/groups	1	admin@gmail.com	2026-05-22 08:26:07.562137
717	/courses	1	admin@gmail.com	2026-05-22 08:26:10.175683
718	/courses	1	admin@gmail.com	2026-05-22 08:28:26.306532
719	/library	1	admin@gmail.com	2026-05-22 08:29:38.876058
720	/circuit	1	admin@gmail.com	2026-05-22 08:31:34.32469
721	/	8	studenEl1@gmail.com	2026-05-22 08:32:28.981762
722	/dashboard	8	studenEl1@gmail.com	2026-05-22 08:32:33.060467
723	/	8	studenEl1@gmail.com	2026-05-22 08:32:43.489117
724	/courses	8	studenEl1@gmail.com	2026-05-22 08:32:45.260145
725	/	8	studenEl1@gmail.com	2026-05-22 08:35:20.794664
726	/dashboard	8	studenEl1@gmail.com	2026-05-22 08:35:23.733431
727	/schedule	8	studenEl1@gmail.com	2026-05-22 08:35:26.881398
728	/schedule/6	8	studenEl1@gmail.com	2026-05-22 08:35:40.643639
729	/schedule	8	studenEl1@gmail.com	2026-05-22 08:35:52.058692
730	/assignments/24	8	studenEl1@gmail.com	2026-05-22 08:36:50.386898
731	/schedule	8	studenEl1@gmail.com	2026-05-22 08:36:52.474085
732	/assignments/30	8	studenEl1@gmail.com	2026-05-22 08:39:27.076784
733	/peer-review	8	studenEl1@gmail.com	2026-05-22 08:40:45.303971
734	/dashboard	8	studenEl1@gmail.com	2026-05-22 08:40:50.849197
735	/schedule	8	studenEl1@gmail.com	2026-05-22 08:40:52.581618
736	/assignments/25	8	studenEl1@gmail.com	2026-05-22 08:40:54.715414
737	/circuit	8	studenEl1@gmail.com	2026-05-22 08:41:25.624748
738	/dashboard	8	studenEl1@gmail.com	2026-05-22 08:41:53.123416
739	/schedule	8	studenEl1@gmail.com	2026-05-22 08:41:54.288474
740	/assignments/25	8	studenEl1@gmail.com	2026-05-22 08:41:57.697306
741	/peer-review	8	studenEl1@gmail.com	2026-05-22 08:42:28.446347
742	/	13	studenEl2@gmail.com	2026-05-22 08:42:59.610973
743	/courses	13	studenEl2@gmail.com	2026-05-22 08:43:01.836343
744	/	14	studenEl3@gmail.com	2026-05-22 08:43:19.251652
745	/courses	14	studenEl3@gmail.com	2026-05-22 08:43:21.623467
746	/	15	studenEl4@gmail.com	2026-05-22 08:43:37.916954
747	/courses	15	studenEl4@gmail.com	2026-05-22 08:43:39.748407
748	/	16	studenEl5@gmail.com	2026-05-22 08:43:54.989469
749	/courses	16	studenEl5@gmail.com	2026-05-22 08:43:57.284833
750	/	17	studenEl6@gmail.com	2026-05-22 08:44:11.732611
751	/courses	17	studenEl6@gmail.com	2026-05-22 08:44:13.157016
752	/	18	studenEl7@gmail.com	2026-05-22 08:44:29.350533
753	/courses	18	studenEl7@gmail.com	2026-05-22 08:44:31.138022
754	/	19	studenEl8@gmail.com	2026-05-22 08:44:44.933106
755	/courses	19	studenEl8@gmail.com	2026-05-22 08:44:46.316771
756	/	20	studenEl9@gmail.com	2026-05-22 08:44:59.779772
757	/courses	20	studenEl9@gmail.com	2026-05-22 08:45:00.914697
758	/	21	studenEl10@gmail.com	2026-05-22 08:45:13.856527
759	/courses	21	studenEl10@gmail.com	2026-05-22 08:45:15.573095
760	/	22	studenEl11@gmail.com	2026-05-22 08:45:28.757333
761	/courses	22	studenEl11@gmail.com	2026-05-22 08:45:30.345463
762	/	8	studenEl1@gmail.com	2026-05-22 08:45:44.80061
763	/dashboard	8	studenEl1@gmail.com	2026-05-22 08:45:46.911178
764	/schedule	8	studenEl1@gmail.com	2026-05-22 08:45:48.65705
765	/assignments/25	8	studenEl1@gmail.com	2026-05-22 08:45:58.420156
766	/schedule	8	studenEl1@gmail.com	2026-05-22 08:46:00.376539
767	/assignments/25	8	studenEl1@gmail.com	2026-05-22 08:46:03.960056
768	/	13	studenEl2@gmail.com	2026-05-22 08:46:17.003171
769	/dashboard	13	studenEl2@gmail.com	2026-05-22 08:46:22.468788
770	/schedule	13	studenEl2@gmail.com	2026-05-22 08:46:23.87187
771	/assignments/25	13	studenEl2@gmail.com	2026-05-22 08:46:28.034303
772	/	14	studenEl3@gmail.com	2026-05-22 08:46:46.999759
773	/dashboard	14	studenEl3@gmail.com	2026-05-22 08:46:49.455914
774	/schedule	14	studenEl3@gmail.com	2026-05-22 08:46:51.758704
775	/assignments/25	14	studenEl3@gmail.com	2026-05-22 08:46:54.345873
776	/dashboard	14	studenEl3@gmail.com	2026-05-22 08:47:06.035958
777	/schedule	14	studenEl3@gmail.com	2026-05-22 08:47:08.160597
778	/	1	admin@gmail.com	2026-05-22 08:47:19.712078
779	/mentor	1	admin@gmail.com	2026-05-22 08:47:24.25217
780	/mentor/assignments	1	admin@gmail.com	2026-05-22 08:47:26.211885
781	/	8	studenEl1@gmail.com	2026-05-22 08:47:42.420728
782	/dashboard	8	studenEl1@gmail.com	2026-05-22 08:47:44.425218
783	/schedule	8	studenEl1@gmail.com	2026-05-22 08:47:46.200393
784	/	1	admin@gmail.com	2026-05-22 08:47:58.885339
785	/mentor	1	admin@gmail.com	2026-05-22 08:48:05.653688
786	/mentor/assignments	1	admin@gmail.com	2026-05-22 08:48:06.986789
787	/	8	studenEl1@gmail.com	2026-05-22 08:50:48.116941
788	/dashboard	8	studenEl1@gmail.com	2026-05-22 08:50:49.859699
789	/schedule	8	studenEl1@gmail.com	2026-05-22 08:50:51.38189
790	/peer-review	8	studenEl1@gmail.com	2026-05-22 08:50:57.556898
791	/schedule	8	studenEl1@gmail.com	2026-05-22 08:51:00.548166
792	/assignments/25	8	studenEl1@gmail.com	2026-05-22 08:51:02.446884
793	/schedule	8	studenEl1@gmail.com	2026-05-22 08:51:09.257238
796	/mentor/assignments	1	admin@gmail.com	2026-05-22 08:51:33.692825
797	/mentor/assignments	1	admin@gmail.com	2026-05-22 08:53:31.7314
798	/	8	studenEl1@gmail.com	2026-05-22 08:53:51.07248
799	/dashboard	8	studenEl1@gmail.com	2026-05-22 08:53:56.898362
800	/schedule	8	studenEl1@gmail.com	2026-05-22 08:53:58.768459
801	/assignments/155	8	studenEl1@gmail.com	2026-05-22 08:54:06.588907
802	/peer-review	8	studenEl1@gmail.com	2026-05-22 08:54:15.264663
803	/assignments/155	8	studenEl1@gmail.com	2026-05-22 08:54:19.103702
804	/schedule	8	studenEl1@gmail.com	2026-05-22 08:54:28.193356
805	/assignments/25	8	studenEl1@gmail.com	2026-05-22 08:54:38.502125
806	/schedule	8	studenEl1@gmail.com	2026-05-22 08:54:46.655551
807	/courses	8	studenEl1@gmail.com	2026-05-22 08:54:59.409098
808	/courses/english-vocab	8	studenEl1@gmail.com	2026-05-22 08:55:01.76109
809	/courses	8	studenEl1@gmail.com	2026-05-22 08:55:19.530136
810	/courses/english-vocab	8	studenEl1@gmail.com	2026-05-22 08:55:21.951202
811	/forum	8	studenEl1@gmail.com	2026-05-22 08:55:51.365422
812	/forum/1	8	studenEl1@gmail.com	2026-05-22 08:55:54.120667
813	/forum/topic/2	8	studenEl1@gmail.com	2026-05-22 08:58:35.215948
814	/	13	studenEl2@gmail.com	2026-05-22 08:58:52.352521
815	/forum	13	studenEl2@gmail.com	2026-05-22 08:58:55.098262
816	/forum/1	13	studenEl2@gmail.com	2026-05-22 08:58:57.701307
817	/forum/topic/2	13	studenEl2@gmail.com	2026-05-22 08:58:59.723149
818	/	1	admin@gmail.com	2026-05-22 08:59:21.964703
819	/	13	studenEl2@gmail.com	2026-05-22 09:00:06.265406
820	/forum	13	studenEl2@gmail.com	2026-05-22 09:01:24.30432
821	/forum/1	13	studenEl2@gmail.com	2026-05-22 09:01:26.4612
822	/forum/topic/2	13	studenEl2@gmail.com	2026-05-22 09:01:27.85901
823	/forum/topic/2	13	studenEl2@gmail.com	2026-05-22 09:01:59.326816
824	/	8	studenEl1@gmail.com	2026-05-22 09:02:14.838216
825	/forum	8	studenEl1@gmail.com	2026-05-22 09:02:19.949396
826	/forum/1	8	studenEl1@gmail.com	2026-05-22 09:02:21.36508
827	/forum/topic/2	8	studenEl1@gmail.com	2026-05-22 09:02:22.899523
828	/	14	studenEl3@gmail.com	2026-05-22 09:02:48.969198
829	/forum	14	studenEl3@gmail.com	2026-05-22 09:02:50.936141
830	/forum/1	14	studenEl3@gmail.com	2026-05-22 09:02:52.547169
831	/forum/topic/2	14	studenEl3@gmail.com	2026-05-22 09:02:54.028407
832	/forum/topic/2	8	studenEl1@gmail.com	2026-05-22 09:03:08.159134
833	/	8	studenEl1@gmail.com	2026-05-22 09:03:27.382041
834	/forum	8	studenEl1@gmail.com	2026-05-22 09:03:29.554798
835	/forum/1	8	studenEl1@gmail.com	2026-05-22 09:03:31.183121
836	/forum/topic/2	8	studenEl1@gmail.com	2026-05-22 09:03:33.028097
837	/forum/topic/2	8	studenEl1@gmail.com	2026-05-22 09:03:49.182119
838	/	13	studenEl2@gmail.com	2026-05-22 09:04:16.220677
839	/forum/topic/2	8	studenEl1@gmail.com	2026-05-22 09:04:31.383612
840	/forum	13	studenEl2@gmail.com	2026-05-22 09:04:46.389961
841	/forum/1	13	studenEl2@gmail.com	2026-05-22 09:04:48.018114
842	/forum/topic/2	13	studenEl2@gmail.com	2026-05-22 09:04:49.143245
843	/forum/topic/2	8	studenEl1@gmail.com	2026-05-22 09:05:08.751775
844	/forum/1	8	studenEl1@gmail.com	2026-05-22 09:05:31.859598
845	/forum/1	13	studenEl2@gmail.com	2026-05-22 09:05:41.221399
846	/forum/topic/3	13	studenEl2@gmail.com	2026-05-22 09:06:05.258861
847	/forum/1	13	studenEl2@gmail.com	2026-05-22 09:06:07.095403
848	/	14	studenEl3@gmail.com	2026-05-22 09:06:19.094438
849	/forum	14	studenEl3@gmail.com	2026-05-22 09:06:20.371918
850	/forum/1	14	studenEl3@gmail.com	2026-05-22 09:06:21.618719
851	/forum/topic/4	14	studenEl3@gmail.com	2026-05-22 09:06:36.680941
852	/forum/1	14	studenEl3@gmail.com	2026-05-22 09:06:38.529547
853	/	15	studenEl4@gmail.com	2026-05-22 09:06:49.0203
854	/forum	15	studenEl4@gmail.com	2026-05-22 09:06:50.268218
855	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:01.223462
856	/forum/topic/5	15	studenEl4@gmail.com	2026-05-22 09:07:08.97885
857	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:10.750353
858	/forum/topic/4	15	studenEl4@gmail.com	2026-05-22 09:07:11.882462
859	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:13.801459
860	/forum/topic/5	15	studenEl4@gmail.com	2026-05-22 09:07:14.786442
861	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:15.456896
862	/forum/topic/3	15	studenEl4@gmail.com	2026-05-22 09:07:16.785102
863	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:17.132375
864	/forum/topic/4	15	studenEl4@gmail.com	2026-05-22 09:07:18.061791
865	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:18.436624
866	/forum/topic/4	15	studenEl4@gmail.com	2026-05-22 09:07:19.188903
867	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:19.669328
868	/forum	15	studenEl4@gmail.com	2026-05-22 09:07:20.922752
869	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:22.308871
870	/forum/topic/4	15	studenEl4@gmail.com	2026-05-22 09:07:23.253204
871	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:24.782404
872	/forum/topic/4	15	studenEl4@gmail.com	2026-05-22 09:07:26.857713
873	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:27.623748
874	/forum/topic/2	15	studenEl4@gmail.com	2026-05-22 09:07:28.761081
875	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:29.216231
876	/forum/topic/3	15	studenEl4@gmail.com	2026-05-22 09:07:31.678826
877	/forum/1	15	studenEl4@gmail.com	2026-05-22 09:07:32.10889
878	/forum/topic/2	15	studenEl4@gmail.com	2026-05-22 09:07:56.213193
879	/hackathons	15	studenEl4@gmail.com	2026-05-22 09:09:21.110548
880	/hackathons/1	15	studenEl4@gmail.com	2026-05-22 09:09:22.368326
881	/profile	15	studenEl4@gmail.com	2026-05-22 09:09:49.869295
882	/dashboard	15	studenEl4@gmail.com	2026-05-22 09:10:21.225494
883	/	10	mentorElec@gmail.com	2026-05-22 09:23:42.35215
884	/mentor	10	mentorElec@gmail.com	2026-05-22 09:23:44.981779
885	/mentor/schedule	10	mentorElec@gmail.com	2026-05-22 09:23:47.526019
886	/mentor/assignments	10	mentorElec@gmail.com	2026-05-22 09:23:50.51148
887	/mentor/groups	10	mentorElec@gmail.com	2026-05-22 09:23:53.581349
888	/mentor/assignments	10	mentorElec@gmail.com	2026-05-22 09:23:57.119191
889	/mentor	10	mentorElec@gmail.com	2026-05-22 09:24:01.72206
890	/	1	admin@gmail.com	2026-05-22 09:24:32.505257
891	/	8	studenEl1@gmail.com	2026-05-22 11:26:07.366548
892	/dashboard	8	studenEl1@gmail.com	2026-05-22 11:26:09.627097
893	/schedule	8	studenEl1@gmail.com	2026-05-22 11:26:13.469997
894	/assignments/155	8	studenEl1@gmail.com	2026-05-22 11:26:18.725725
895	/peer-review	8	studenEl1@gmail.com	2026-05-22 11:26:45.426306
896	/dashboard	8	studenEl1@gmail.com	2026-05-22 11:26:49.06855
897	/schedule	8	studenEl1@gmail.com	2026-05-22 11:26:51.032267
898	/dashboard	8	studenEl1@gmail.com	2026-05-22 11:26:57.475686
899	/	1	admin@gmail.com	2026-05-22 11:27:13.120634
901	/mentor/schedule	1	admin@gmail.com	2026-05-22 11:27:21.348666
902	/mentor/assignments	1	admin@gmail.com	2026-05-22 11:27:25.102856
903	/mentor/assignments	1	admin@gmail.com	2026-05-22 11:27:59.450109
904	/	1	admin@gmail.com	2026-05-22 11:28:10.795702
905	/mentor	1	admin@gmail.com	2026-05-22 11:28:16.733401
906	/mentor/assignments	1	admin@gmail.com	2026-05-22 11:28:18.288503
907	/	8	studenEl1@gmail.com	2026-05-22 11:28:43.478072
908	/dashboard	8	studenEl1@gmail.com	2026-05-22 11:28:46.836097
909	/peer-review	8	studenEl1@gmail.com	2026-05-22 11:28:50.200003
910	/dashboard	8	studenEl1@gmail.com	2026-05-22 11:29:56.046554
911	/schedule	8	studenEl1@gmail.com	2026-05-22 11:30:15.911481
912	/profile	8	studenEl1@gmail.com	2026-05-22 11:38:42.137436
913	/profile	8	studenEl1@gmail.com	2026-05-22 11:38:43.595862
914	/forum	8	studenEl1@gmail.com	2026-05-22 11:39:01.471659
915	/rooms	8	studenEl1@gmail.com	2026-05-22 11:39:02.501571
916	/library	8	studenEl1@gmail.com	2026-05-22 11:39:03.419883
917	/dashboard	8	studenEl1@gmail.com	2026-05-22 11:39:07.405302
918	/	1	admin@gmail.com	2026-05-24 08:40:16.937948
919	/	1	admin@gmail.com	2026-05-24 10:11:02.107023
920	/	1	admin@gmail.com	2026-05-24 10:12:07.479127
921	/dashboard	1	admin@gmail.com	2026-05-24 10:12:17.677054
922	/electives	1	admin@gmail.com	2026-05-24 10:12:19.267343
923	/mentor	1	admin@gmail.com	2026-05-24 10:12:27.814982
924	/mentor/electives	1	admin@gmail.com	2026-05-24 10:12:30.459479
925	/dashboard	1	admin@gmail.com	2026-05-24 10:12:40.475333
926	/electives	1	admin@gmail.com	2026-05-24 10:12:42.110961
927	/courses	1	admin@gmail.com	2026-05-24 10:12:47.66391
928	/courses/7	1	admin@gmail.com	2026-05-24 10:13:00.228373
929	/	1	admin@gmail.com	2026-05-24 10:13:08.697174
930	/mentor	1	admin@gmail.com	2026-05-24 10:13:12.671123
931	/dashboard	1	admin@gmail.com	2026-05-24 10:13:13.973161
932	/electives	1	admin@gmail.com	2026-05-24 10:13:15.364721
933	/mentor	1	admin@gmail.com	2026-05-24 10:13:23.144793
934	/mentor/electives	1	admin@gmail.com	2026-05-24 10:13:24.715574
935	/library	1	admin@gmail.com	2026-05-24 10:13:28.471105
936	/courses	1	admin@gmail.com	2026-05-24 10:13:28.846227
937	/	1	admin@gmail.com	2026-05-24 10:13:40.382342
938	/dashboard	1	admin@gmail.com	2026-05-24 10:13:43.330147
939	/electives	1	admin@gmail.com	2026-05-24 10:13:44.817334
940	/	73	studenInf@gmail.com	2026-05-24 10:14:23.314786
941	/courses	73	studenInf@gmail.com	2026-05-24 10:14:24.324004
942	/	73	studenInf@gmail.com	2026-05-24 10:14:44.694475
943	/courses	73	studenInf@gmail.com	2026-05-24 10:14:45.363602
944	/	73	studenInf@gmail.com	2026-05-24 10:14:54.431124
945	/dashboard	73	studenInf@gmail.com	2026-05-24 10:14:56.947374
946	/electives	73	studenInf@gmail.com	2026-05-24 10:14:58.342593
947	/complilier	73	studenInf@gmail.com	2026-05-24 10:15:53.028284
948	/career	73	studenInf@gmail.com	2026-05-24 10:16:24.58482
949	/career/test/holland	73	studenInf@gmail.com	2026-05-24 10:16:38.552495
950	/career	73	studenInf@gmail.com	2026-05-24 10:16:42.993472
951	/career/test/holland	73	studenInf@gmail.com	2026-05-24 10:16:44.35006
952	/career	73	studenInf@gmail.com	2026-05-24 10:16:54.983641
953	/career/test/klimov	73	studenInf@gmail.com	2026-05-24 10:16:56.0769
954	/rooms	73	studenInf@gmail.com	2026-05-24 10:17:08.739728
955	/hackathons	73	studenInf@gmail.com	2026-05-24 10:17:09.428054
956	/career	73	studenInf@gmail.com	2026-05-24 10:17:10.167168
957	/prof-orientation	73	studenInf@gmail.com	2026-05-24 10:17:11.552823
958	/career	73	studenInf@gmail.com	2026-05-24 10:18:42.997279
959	/career/test/holland	73	studenInf@gmail.com	2026-05-24 10:18:45.095071
960	/profile	73	studenInf@gmail.com	2026-05-24 10:20:10.129765
961	/	12	mentorInf@gmail.com	2026-05-24 10:20:36.347674
962	/dashboard	12	mentorInf@gmail.com	2026-05-24 10:20:38.114345
963	/dashboard	12	mentorInf@gmail.com	2026-05-24 10:20:45.287144
964	/	12	mentorInf@gmail.com	2026-05-24 10:20:49.345881
965	/	12	mentorInf@gmail.com	2026-05-24 10:20:50.816989
966	/mentor	12	mentorInf@gmail.com	2026-05-24 10:20:52.620029
967	/mentor/electives	12	mentorInf@gmail.com	2026-05-24 10:20:55.773995
968	/mentor/olympiads	12	mentorInf@gmail.com	2026-05-24 10:21:06.878849
969	/	1	admin@gmail.com	2026-05-24 10:21:16.183867
970	/mentor	1	admin@gmail.com	2026-05-24 10:27:20.577485
971	/mentor/vocabulary	1	admin@gmail.com	2026-05-24 10:27:22.908301
972	/mentor/electives	1	admin@gmail.com	2026-05-24 10:27:23.44796
973	/mentor/forum	1	admin@gmail.com	2026-05-24 10:27:23.939949
974	/mentor/vocabulary	1	admin@gmail.com	2026-05-24 10:27:24.301238
975	/mentor/olympiads	1	admin@gmail.com	2026-05-24 10:27:25.040281
976	/olympiads/1	1	admin@gmail.com	2026-05-24 10:27:57.062238
977	/mentor/olympiads	1	admin@gmail.com	2026-05-24 14:07:22.885099
978	/dashboard	1	admin@gmail.com	2026-05-24 14:07:26.935763
979	/olympiads	1	admin@gmail.com	2026-05-24 14:07:30.678127
980	/mentor	1	admin@gmail.com	2026-05-24 14:07:36.916935
981	/mentor/olympiads	1	admin@gmail.com	2026-05-24 14:07:38.493803
982	/olympiads/2	1	admin@gmail.com	2026-05-24 14:07:53.200587
983	/mentor/assignments	1	admin@gmail.com	2026-05-24 14:08:02.747023
984	/mentor/olympiads	1	admin@gmail.com	2026-05-24 14:08:06.961231
985	/olympiads/2	1	admin@gmail.com	2026-05-24 14:08:28.820423
986	/dashboard	1	admin@gmail.com	2026-05-24 14:08:32.332441
987	/electives	1	admin@gmail.com	2026-05-24 14:08:33.961488
988	/prof-orientation	1	admin@gmail.com	2026-05-24 14:08:43.383553
989	/prof-orientation	1	admin@gmail.com	2026-05-24 14:28:15.349742
990	/	1	admin@gmail.com	2026-05-24 14:30:43.068576
991	/mentor	1	admin@gmail.com	2026-05-24 14:33:27.001588
992	/mentor/olympiads	1	admin@gmail.com	2026-05-24 14:33:27.805438
993	/olympiads/2	1	admin@gmail.com	2026-05-24 14:33:30.489201
994	/mentor/assignments	1	admin@gmail.com	2026-05-24 14:33:48.540893
995	/mentor/olympiads	1	admin@gmail.com	2026-05-24 14:33:54.944443
996	/mentor/olympiads	1	admin@gmail.com	2026-05-24 14:44:12.42282
997	/dashboard	1	admin@gmail.com	2026-05-24 14:49:29.43643
998	/olympiads	1	admin@gmail.com	2026-05-24 14:49:31.709965
999	/olympiads/3	1	admin@gmail.com	2026-05-24 14:49:33.442537
1000	/olympiads/3/problem/1	1	admin@gmail.com	2026-05-24 14:49:35.927784
1001	/olympiads/3	1	admin@gmail.com	2026-05-24 14:50:01.683443
1002	/	8	studenEl1@gmail.com	2026-05-24 14:50:29.671914
1003	/hackathons	8	studenEl1@gmail.com	2026-05-24 14:50:30.96134
1004	/prof-orientation	8	studenEl1@gmail.com	2026-05-24 14:50:35.65464
1005	/	1	admin@gmail.com	2026-05-24 14:51:12.065129
1006	/	1	admin@gmail.com	2026-05-24 17:47:09.14346
1007	/	1	admin@gmail.com	2026-05-31 16:14:41.207067
1008	/mqtt-expert	1	admin@gmail.com	2026-05-31 16:14:43.690794
1009	/complilier	1	admin@gmail.com	2026-05-31 16:18:45.68853
1010	/complilier	1	admin@gmail.com	2026-05-31 16:21:05.963454
1011	/complilier	1	admin@gmail.com	2026-05-31 16:24:10.664687
1012	/olympiads	1	admin@gmail.com	2026-05-31 16:24:19.160209
1013	/olympiads/3	1	admin@gmail.com	2026-05-31 16:24:20.441124
1014	/olympiads/3/problem/1	1	admin@gmail.com	2026-05-31 16:24:21.997123
1015	/	1	admin@gmail.com	2026-05-31 21:55:01.194271
1016	/rooms	1	admin@gmail.com	2026-05-31 21:55:07.218627
1017	/rooms/2/editor	1	admin@gmail.com	2026-05-31 21:55:42.360009
1018	/mqtt-expert	1	admin@gmail.com	2026-05-31 21:55:53.968572
1019	/hackathons	1	admin@gmail.com	2026-05-31 21:56:10.292577
1020	/career	1	admin@gmail.com	2026-05-31 21:56:12.720131
1021	/olympiads	1	admin@gmail.com	2026-05-31 21:56:15.267484
1022	/prof-orientation	1	admin@gmail.com	2026-05-31 21:56:15.775751
1023	/complilier	1	admin@gmail.com	2026-05-31 21:56:17.120714
1024	/circuit	1	admin@gmail.com	2026-05-31 21:56:18.00873
1025	/shematic	1	admin@gmail.com	2026-05-31 21:56:19.306024
1026	/career	1	admin@gmail.com	2026-05-31 21:56:21.498897
1027	/dashboard	1	admin@gmail.com	2026-05-31 21:56:24.302798
1028	/internships	1	admin@gmail.com	2026-05-31 21:56:25.721249
1029	/internships/37	1	admin@gmail.com	2026-05-31 21:56:33.309731
1030	/internships	1	admin@gmail.com	2026-05-31 21:56:43.934642
1031	/dashboard	1	admin@gmail.com	2026-05-31 21:56:44.378897
1032	/hackathons	1	admin@gmail.com	2026-05-31 21:56:47.069658
1033	/hackathons/1	1	admin@gmail.com	2026-05-31 21:56:50.18249
1034	/hackathons	1	admin@gmail.com	2026-05-31 21:57:05.65886
1035	/profile	1	admin@gmail.com	2026-05-31 21:57:15.628761
1036	/mentor	1	admin@gmail.com	2026-05-31 21:57:55.76932
1037	/mentor/schedule	1	admin@gmail.com	2026-05-31 21:57:57.711955
1038	/mentor/hackathons	1	admin@gmail.com	2026-05-31 21:58:07.676816
1039	/mentor	1	admin@gmail.com	2026-05-31 21:58:39.673719
1040	/mentor/hackathons	1	admin@gmail.com	2026-05-31 21:58:43.274069
1041	/	8	studenEl1@gmail.com	2026-06-04 22:19:26.957449
1042	/dashboard	8	studenEl1@gmail.com	2026-06-04 22:19:28.240584
1043	/schedule	8	studenEl1@gmail.com	2026-06-04 22:19:36.449481
1044	/	8	studenEl1@gmail.com	2026-06-04 22:19:40.342016
1045	/courses	8	studenEl1@gmail.com	2026-06-04 22:19:50.072048
1046	/courses/english-vocab	8	studenEl1@gmail.com	2026-06-04 22:20:09.110032
1047	/courses	8	studenEl1@gmail.com	2026-06-04 22:20:23.800156
1048	/	8	studenEl1@gmail.com	2026-06-04 22:20:25.406946
1049	/dashboard	8	studenEl1@gmail.com	2026-06-04 22:20:34.525181
1050	/schedule	8	studenEl1@gmail.com	2026-06-04 22:20:35.960254
1051	/peer-review	8	studenEl1@gmail.com	2026-06-04 22:20:38.773193
1052	/courses	8	studenEl1@gmail.com	2026-06-04 22:21:04.968408
1053	/library	8	studenEl1@gmail.com	2026-06-04 22:21:14.116264
1054	/courses	8	studenEl1@gmail.com	2026-06-04 22:21:49.827416
1055	/	8	studenEl1@gmail.com	2026-06-04 22:21:50.35096
1056	/forum	8	studenEl1@gmail.com	2026-06-04 22:21:51.176552
1057	/forum/1	8	studenEl1@gmail.com	2026-06-04 22:21:52.849245
1058	/forum/topic/6	8	studenEl1@gmail.com	2026-06-04 22:21:54.251817
1059	/	8	studenEl1@gmail.com	2026-06-04 22:22:01.878959
1060	/courses	8	studenEl1@gmail.com	2026-06-04 22:22:38.923879
1061	/library	8	studenEl1@gmail.com	2026-06-04 22:22:42.462703
1062	/forum	8	studenEl1@gmail.com	2026-06-04 22:22:50.698355
1063	/forum/1	8	studenEl1@gmail.com	2026-06-04 22:22:51.638437
1064	/forum/topic/6	8	studenEl1@gmail.com	2026-06-04 22:22:53.07854
1065	/	8	studenEl1@gmail.com	2026-06-04 22:23:01.14898
1066	/circuit	8	studenEl1@gmail.com	2026-06-04 22:23:05.067748
1067	/	8	studenEl1@gmail.com	2026-06-04 22:23:59.656738
1068	/courses	8	studenEl1@gmail.com	2026-06-04 22:24:17.363528
1069	/courses/english-vocab	8	studenEl1@gmail.com	2026-06-04 22:24:20.78743
1070	/library	8	studenEl1@gmail.com	2026-06-04 22:24:27.842301
1071	/forum	8	studenEl1@gmail.com	2026-06-04 22:24:37.43931
1072	/forum/1	8	studenEl1@gmail.com	2026-06-04 22:24:38.531962
1073	/forum/topic/5	8	studenEl1@gmail.com	2026-06-04 22:24:40.550053
1074	/prof-orientation	8	studenEl1@gmail.com	2026-06-04 22:24:48.585593
1075	/circuit	8	studenEl1@gmail.com	2026-06-04 22:24:49.329308
1076	/	8	studenEl1@gmail.com	2026-06-04 22:24:55.028813
1077	/courses	8	studenEl1@gmail.com	2026-06-04 22:25:23.916855
1078	/library	8	studenEl1@gmail.com	2026-06-04 22:25:25.523107
1079	/courses	8	studenEl1@gmail.com	2026-06-04 22:25:29.043751
1080	/courses/english-vocab	8	studenEl1@gmail.com	2026-06-04 22:25:29.582273
1081	/forum	8	studenEl1@gmail.com	2026-06-04 22:25:34.675314
1082	/forum/1	8	studenEl1@gmail.com	2026-06-04 22:25:35.351224
1083	/forum/topic/6	8	studenEl1@gmail.com	2026-06-04 22:25:36.541626
1084	/circuit	8	studenEl1@gmail.com	2026-06-04 22:25:41.267714
1085	/	8	studenEl1@gmail.com	2026-06-04 22:26:56.397495
1086	/	8	studenEl1@gmail.com	2026-06-04 22:26:58.87595
1087	/courses	8	studenEl1@gmail.com	2026-06-04 22:27:41.542186
1088	/courses/english-vocab	8	studenEl1@gmail.com	2026-06-04 22:27:43.472327
1089	/library	8	studenEl1@gmail.com	2026-06-04 22:27:48.0394
1090	/forum	8	studenEl1@gmail.com	2026-06-04 22:27:50.072426
1091	/forum/1	8	studenEl1@gmail.com	2026-06-04 22:27:51.151104
1092	/forum/topic/4	8	studenEl1@gmail.com	2026-06-04 22:27:52.140668
1093	/circuit	8	studenEl1@gmail.com	2026-06-04 22:27:58.312232
1094	/	8	studenEl1@gmail.com	2026-06-04 22:30:21.28369
1095	/circuit	8	studenEl1@gmail.com	2026-06-04 22:30:22.503524
1096	/	8	studenEl1@gmail.com	2026-06-04 22:30:23.60151
1097	/courses	8	studenEl1@gmail.com	2026-06-04 22:30:38.42117
1098	/courses/english-vocab	8	studenEl1@gmail.com	2026-06-04 22:30:40.025338
1099	/library	8	studenEl1@gmail.com	2026-06-04 22:30:45.100961
1100	/forum	8	studenEl1@gmail.com	2026-06-04 22:30:46.977607
1101	/forum/1	8	studenEl1@gmail.com	2026-06-04 22:30:47.656364
1102	/forum/topic/3	8	studenEl1@gmail.com	2026-06-04 22:30:48.542591
1103	/circuit	8	studenEl1@gmail.com	2026-06-04 22:30:52.967589
1104	/dashboard	8	studenEl1@gmail.com	2026-06-04 22:31:13.038868
1105	/	8	studenEl1@gmail.com	2026-06-04 22:31:37.846889
1106	/dashboard	8	studenEl1@gmail.com	2026-06-04 22:31:49.959743
1107	/schedule	8	studenEl1@gmail.com	2026-06-04 22:31:53.278137
1108	/assignments/26	8	studenEl1@gmail.com	2026-06-04 22:31:56.552564
1109	/schedule	8	studenEl1@gmail.com	2026-06-04 22:31:58.214663
1110	/assignments/27	8	studenEl1@gmail.com	2026-06-04 22:32:03.052436
1111	/schedule	8	studenEl1@gmail.com	2026-06-04 22:32:08.155998
1112	/hackathons/1	8	studenEl1@gmail.com	2026-06-04 22:32:17.211345
1113	/schedule	8	studenEl1@gmail.com	2026-06-04 22:32:18.333313
1114	/assignments/23	8	studenEl1@gmail.com	2026-06-04 22:32:22.472502
1116	/assignments/23	8	studenEl1@gmail.com	2026-06-04 22:32:31.561011
1118	/assignments/30	8	studenEl1@gmail.com	2026-06-04 22:32:34.745547
1119	/schedule	8	studenEl1@gmail.com	2026-06-04 22:32:36.516455
1115	/schedule	8	studenEl1@gmail.com	2026-06-04 22:32:24.451708
1117	/schedule	8	studenEl1@gmail.com	2026-06-04 22:32:32.721351
1120	/dashboard	8	studenEl1@gmail.com	2026-06-04 22:32:39.610199
1121	/schedule	8	studenEl1@gmail.com	2026-06-04 22:32:40.979551
1122	/schedule/6	8	studenEl1@gmail.com	2026-06-04 22:32:43.61661
1123	/	8	studenEl1@gmail.com	2026-06-04 22:32:58.090849
1124	/profile	8	studenEl1@gmail.com	2026-06-04 22:33:00.419923
1125	/	8	studenEl1@gmail.com	2026-06-04 22:33:05.248354
1126	/hackathons	8	studenEl1@gmail.com	2026-06-04 22:33:13.591251
1127	/hackathons/1	8	studenEl1@gmail.com	2026-06-04 22:33:15.823967
1128	/	8	studenEl1@gmail.com	2026-06-04 22:33:18.601747
1129	/courses	8	studenEl1@gmail.com	2026-06-04 22:34:42.156723
1130	/courses/english-vocab	8	studenEl1@gmail.com	2026-06-04 22:34:43.380751
1131	/forum	8	studenEl1@gmail.com	2026-06-04 22:34:46.465695
1132	/forum/1	8	studenEl1@gmail.com	2026-06-04 22:34:47.600969
1133	/forum/topic/3	8	studenEl1@gmail.com	2026-06-04 22:34:48.47551
1134	/library	8	studenEl1@gmail.com	2026-06-04 22:34:54.817209
1135	/circuit	8	studenEl1@gmail.com	2026-06-04 22:34:57.452945
1136	/dashboard	8	studenEl1@gmail.com	2026-06-04 22:35:18.926774
1137	/schedule	8	studenEl1@gmail.com	2026-06-04 22:35:19.833344
1138	/schedule/6	8	studenEl1@gmail.com	2026-06-04 22:35:20.739781
1139	/dashboard	8	studenEl1@gmail.com	2026-06-04 22:35:24.138424
1140	/schedule	8	studenEl1@gmail.com	2026-06-04 22:35:24.981991
1141	/peer-review	8	studenEl1@gmail.com	2026-06-04 22:35:27.965439
1142	/profile	8	studenEl1@gmail.com	2026-06-04 22:35:35.952945
1143	/	1	admin@gmail.com	2026-06-04 22:36:23.384599
1144	/dashboard	1	admin@gmail.com	2026-06-04 22:36:26.362781
1145	/mentor	1	admin@gmail.com	2026-06-04 22:36:33.650189
1146	/mentor/schedule	1	admin@gmail.com	2026-06-04 22:36:38.554649
1147	/mentor/hackathons	1	admin@gmail.com	2026-06-04 22:36:40.872415
1148	/hackathons	1	admin@gmail.com	2026-06-04 22:45:10.884227
1149	/hackathons/2	1	admin@gmail.com	2026-06-04 22:45:12.797732
1150	/hackathons/2	1	admin@gmail.com	2026-06-04 22:46:30.52308
1151	/	1	admin@gmail.com	2026-06-04 22:58:30.081237
1152	/complilier	1	admin@gmail.com	2026-06-04 22:59:10.1155
1153	/complilier	1	admin@gmail.com	2026-06-04 23:09:05.966027
1154	/complilier	1	admin@gmail.com	2026-06-04 23:14:48.776138
1155	/	1	admin@gmail.com	2026-06-04 23:20:03.156125
1156	/complilier	1	admin@gmail.com	2026-06-04 23:20:24.325324
1157	/prof-orientation	1	admin@gmail.com	2026-06-04 23:20:27.934444
1158	/hackathons	1	admin@gmail.com	2026-06-04 23:21:02.895897
1159	/olympiads	1	admin@gmail.com	2026-06-04 23:21:03.481489
1160	/olympiads/3	1	admin@gmail.com	2026-06-04 23:21:04.827028
1161	/olympiads/3/problem/1	1	admin@gmail.com	2026-06-04 23:21:08.232055
1162	/dashboard	1	admin@gmail.com	2026-06-04 23:21:32.646317
1163	/electives	1	admin@gmail.com	2026-06-04 23:21:34.264896
1164	/electives/6	1	admin@gmail.com	2026-06-04 23:21:41.037825
1165	/	1	admin@gmail.com	2026-06-04 23:21:45.131091
1166	/career	1	admin@gmail.com	2026-06-04 23:22:01.251547
1167	/	1	admin@gmail.com	2026-06-04 23:22:03.638767
1168	/career	1	admin@gmail.com	2026-06-04 23:22:05.057008
1169	/career/test/klimov	1	admin@gmail.com	2026-06-04 23:22:05.83015
1170	/	1	admin@gmail.com	2026-06-04 23:31:06.509059
1171	/rooms	1	admin@gmail.com	2026-06-04 23:31:48.58997
1172	/rooms/2	1	admin@gmail.com	2026-06-04 23:31:50.365032
1173	/rooms/2/editor	1	admin@gmail.com	2026-06-04 23:31:53.348301
1174	/	1	admin@gmail.com	2026-06-04 23:32:20.801966
1175	/shematic	1	admin@gmail.com	2026-06-04 23:32:25.147528
1176	/mqtt-expert	1	admin@gmail.com	2026-06-04 23:34:25.707176
1177	/mqtt-expert	1	admin@gmail.com	2026-06-04 23:34:47.478557
1178	/shematic	1	admin@gmail.com	2026-06-04 23:34:53.04424
1179	/mqtt-expert	1	admin@gmail.com	2026-06-04 23:34:54.676346
1180	/shematic	1	admin@gmail.com	2026-06-04 23:34:56.149742
1181	/shematic	1	admin@gmail.com	2026-06-04 23:36:43.948042
1182	/	1	admin@gmail.com	2026-06-04 23:36:45.735154
1183	/rooms	1	admin@gmail.com	2026-06-04 23:37:02.706921
1184	/rooms/4	1	admin@gmail.com	2026-06-04 23:37:09.947817
1185	/rooms/4/editor	1	admin@gmail.com	2026-06-04 23:37:11.180902
1186	/shematic	1	admin@gmail.com	2026-06-04 23:37:15.253573
1187	/mqtt-expert	1	admin@gmail.com	2026-06-04 23:37:36.634255
1188	/dashboard	1	admin@gmail.com	2026-06-04 23:37:53.017551
1189	/internships	1	admin@gmail.com	2026-06-04 23:37:54.370252
1190	/internships/37	1	admin@gmail.com	2026-06-04 23:37:56.035679
1191	/hackathons	1	admin@gmail.com	2026-06-04 23:38:44.992884
1192	/	1	admin@gmail.com	2026-06-04 23:38:52.330938
1193	/olympiads	1	admin@gmail.com	2026-06-04 23:38:53.522178
1194	/hackathons	1	admin@gmail.com	2026-06-04 23:38:54.39269
1195	/hackathons/1	1	admin@gmail.com	2026-06-04 23:38:55.416708
1196	/	1	admin@gmail.com	2026-06-04 23:38:58.437125
1197	/dashboard	1	admin@gmail.com	2026-06-04 23:39:07.584338
1198	/hackathons	1	admin@gmail.com	2026-06-04 23:39:10.853507
1199	/dashboard	1	admin@gmail.com	2026-06-04 23:39:11.941159
1200	/internships	1	admin@gmail.com	2026-06-04 23:39:12.714323
1201	/internships/37	1	admin@gmail.com	2026-06-04 23:39:13.934295
1202	/internships	1	admin@gmail.com	2026-06-04 23:39:17.139311
1203	/hackathons	1	admin@gmail.com	2026-06-04 23:39:19.749045
1204	/hackathons/2	1	admin@gmail.com	2026-06-04 23:39:21.164189
1205	/hackathons/2/team/1	1	admin@gmail.com	2026-06-04 23:39:30.844243
1206	/hackathons/2	1	admin@gmail.com	2026-06-04 23:39:41.202813
1207	/courses	1	admin@gmail.com	2026-06-05 06:43:38.968693
1208	/mqtt-expert	1	admin@gmail.com	2026-06-05 06:48:59.483716
1209	/circuit	1	admin@gmail.com	2026-06-05 06:49:00.460779
1210	/dashboard	1	admin@gmail.com	2026-06-05 06:51:16.658118
1211	/courses	1	admin@gmail.com	2026-06-05 06:51:25.421078
1212	/	8	studenEl1@gmail.com	2026-06-05 06:51:40.168681
1213	/dashboard	8	studenEl1@gmail.com	2026-06-05 06:51:41.585523
1214	/schedule	8	studenEl1@gmail.com	2026-06-05 06:53:06.794473
1215	/assignments/27	8	studenEl1@gmail.com	2026-06-05 06:53:46.595976
1216	/schedule	8	studenEl1@gmail.com	2026-06-05 06:53:54.666528
1217	/schedule/6	8	studenEl1@gmail.com	2026-06-05 06:53:56.637954
1218	/	1	admin@gmail.com	2026-06-05 06:55:36.699288
1219	/mentor	1	admin@gmail.com	2026-06-05 06:55:39.129262
1220	/mentor/assignments	1	admin@gmail.com	2026-06-05 06:55:41.53307
1221	/peer-review	1	admin@gmail.com	2026-06-05 06:56:38.313199
1222	/mentor/assignments	1	admin@gmail.com	2026-06-05 06:56:39.668401
1223	/forum	1	admin@gmail.com	2026-06-05 06:57:07.481611
1224	/forum/1	1	admin@gmail.com	2026-06-05 06:57:09.211264
1225	/forum/topic/2	1	admin@gmail.com	2026-06-05 06:57:11.430402
1226	/	8	studenEl1@gmail.com	2026-06-05 06:57:24.757628
1227	/forum	8	studenEl1@gmail.com	2026-06-05 06:57:25.64101
1228	/forum/1	8	studenEl1@gmail.com	2026-06-05 06:57:26.769138
1229	/forum/topic/2	8	studenEl1@gmail.com	2026-06-05 06:57:27.997646
1230	/profile	8	studenEl1@gmail.com	2026-06-05 06:58:02.376696
1231	/courses	8	studenEl1@gmail.com	2026-06-05 06:58:07.753615
1232	/courses/english-vocab	8	studenEl1@gmail.com	2026-06-05 06:58:08.767747
1233	/library	8	studenEl1@gmail.com	2026-06-05 06:58:21.645216
1234	/courses	8	studenEl1@gmail.com	2026-06-05 06:59:02.291508
1235	/courses/english-vocab	8	studenEl1@gmail.com	2026-06-05 06:59:03.177577
1236	/library	8	studenEl1@gmail.com	2026-06-05 06:59:29.398089
1237	/forum	8	studenEl1@gmail.com	2026-06-05 06:59:46.028192
1238	/forum/1	8	studenEl1@gmail.com	2026-06-05 06:59:47.045025
1239	/forum/topic/2	8	studenEl1@gmail.com	2026-06-05 06:59:49.176945
1240	/dashboard	8	studenEl1@gmail.com	2026-06-05 07:00:06.535836
1241	/profile	8	studenEl1@gmail.com	2026-06-05 07:00:08.461889
1242	/career	8	studenEl1@gmail.com	2026-06-05 07:33:50.607288
1243	/prof-orientation	8	studenEl1@gmail.com	2026-06-05 07:33:53.624191
1244	/hackathons	8	studenEl1@gmail.com	2026-06-05 07:33:57.831887
1245	/olympiads	8	studenEl1@gmail.com	2026-06-05 07:33:58.532372
1246	/career	8	studenEl1@gmail.com	2026-06-05 07:33:59.38999
1247	/career/test/klimov	8	studenEl1@gmail.com	2026-06-05 07:34:00.735458
1248	/career/test/klimov	8	studenEl1@gmail.com	2026-06-05 07:34:21.95303
1249	/career	8	studenEl1@gmail.com	2026-06-05 07:35:21.892372
1250	/career/test/holland	8	studenEl1@gmail.com	2026-06-05 07:35:35.544052
1251	/	8	studenEl1@gmail.com	2026-06-05 07:39:09.424339
1252	/	73	studenInf@gmail.com	2026-06-05 07:39:55.811336
1253	/dashboard	73	studenInf@gmail.com	2026-06-05 07:39:57.736549
1254	/electives	73	studenInf@gmail.com	2026-06-05 07:40:02.816408
1255	/electives/9	73	studenInf@gmail.com	2026-06-05 07:40:08.582354
1256	/electives	73	studenInf@gmail.com	2026-06-05 07:40:13.881671
1257	/complilier	73	studenInf@gmail.com	2026-06-05 07:40:18.336905
1258	/dashboard	73	studenInf@gmail.com	2026-06-05 07:40:31.089597
1259	/electives	73	studenInf@gmail.com	2026-06-05 07:40:33.718454
1260	/dashboard	73	studenInf@gmail.com	2026-06-05 07:42:42.208844
1261	/olympiads	73	studenInf@gmail.com	2026-06-05 07:42:45.494802
1262	/olympiads/3	73	studenInf@gmail.com	2026-06-05 07:42:47.496931
1263	/olympiads/3/problem/2	73	studenInf@gmail.com	2026-06-05 07:44:34.2279
1264	/olympiads/3/problem/2	73	studenInf@gmail.com	2026-06-05 07:45:39.362063
1265	/prof-orientation	73	studenInf@gmail.com	2026-06-05 07:47:26.324073
1266	/	73	studenInf@gmail.com	2026-06-05 07:47:33.688684
1267	/prof-orientation	73	studenInf@gmail.com	2026-06-05 07:48:18.138135
1268	/	1	admin@gmail.com	2026-06-05 07:53:11.217404
1269	/circuit	1	admin@gmail.com	2026-06-05 21:13:21.979427
1270	/	1	admin@gmail.com	2026-06-08 11:21:28.294221
1271	/rooms	1	admin@gmail.com	2026-06-08 11:21:32.532797
1272	/shematic	1	admin@gmail.com	2026-06-08 11:23:08.376974
1273	/mqtt-expert	1	admin@gmail.com	2026-06-08 11:24:21.168806
1274	/hackathons	1	admin@gmail.com	2026-06-08 11:25:51.947793
1275	/hackathons/1	1	admin@gmail.com	2026-06-08 11:26:08.384929
1276	/hackathons	1	admin@gmail.com	2026-06-08 11:28:46.622239
1277	/career	1	admin@gmail.com	2026-06-08 11:32:49.924037
1278	/hackathons	1	admin@gmail.com	2026-06-08 11:33:17.433453
1279	/career	1	admin@gmail.com	2026-06-08 11:33:19.862378
1280	/rooms	1	admin@gmail.com	2026-06-08 11:33:24.479085
1281	/forum	1	admin@gmail.com	2026-06-08 11:33:26.140432
1282	/library	1	admin@gmail.com	2026-06-08 11:33:27.487669
1283	/career	1	admin@gmail.com	2026-06-08 11:34:47.365786
1284	/dashboard	1	admin@gmail.com	2026-06-08 11:34:54.840954
1285	/internships	1	admin@gmail.com	2026-06-08 11:34:56.671134
1286	/internships/59	1	admin@gmail.com	2026-06-08 11:36:27.807478
1287	/internships	1	admin@gmail.com	2026-06-08 11:37:55.084034
1288	/internships/61	1	admin@gmail.com	2026-06-08 11:42:49.303819
1289	/internships	1	admin@gmail.com	2026-06-08 11:44:47.84137
1290	/circuit	1	admin@gmail.com	2026-06-08 11:45:08.585261
1291	/internships	1	admin@gmail.com	2026-06-08 11:45:11.696872
1292	/internships/61	1	admin@gmail.com	2026-06-08 11:45:16.152072
1293	/internships	1	admin@gmail.com	2026-06-08 11:45:19.938572
1294	/dashboard	1	admin@gmail.com	2026-06-08 11:45:35.241686
1295	/	1	admin@gmail.com	2026-06-08 11:51:43.800659
1296	/library	1	admin@gmail.com	2026-06-08 11:51:53.507589
1297	/courses	1	admin@gmail.com	2026-06-08 11:52:08.205982
1298	/dashboard	1	admin@gmail.com	2026-06-08 11:53:39.395729
1299	/mentor	1	admin@gmail.com	2026-06-08 11:53:50.349943
1300	/mentor/schedule	1	admin@gmail.com	2026-06-08 11:53:53.186662
1301	/mentor/hackathons	1	admin@gmail.com	2026-06-08 12:01:18.323436
1302	/shematic	1	admin@gmail.com	2026-06-08 17:55:58.102599
1303	/shematic	1	admin@gmail.com	2026-06-08 17:57:23.133238
1304	/	1	admin@gmail.com	2026-06-09 08:06:29.471361
1305	/courses	1	admin@gmail.com	2026-06-09 08:06:31.71468
1306	/courses	1	admin@gmail.com	2026-06-09 08:20:01.976937
1307	/library	1	admin@gmail.com	2026-06-09 08:20:55.944648
1308	/courses	1	admin@gmail.com	2026-06-09 08:25:41.743371
1309	/library	1	admin@gmail.com	2026-06-09 08:26:07.302836
1310	/forum	1	admin@gmail.com	2026-06-09 08:26:58.119731
1311	/forum/1	1	admin@gmail.com	2026-06-09 08:26:59.465786
1312	/rooms	1	admin@gmail.com	2026-06-09 08:27:03.780347
1313	/career	1	admin@gmail.com	2026-06-09 08:27:04.545834
1314	/hackathons	1	admin@gmail.com	2026-06-09 08:27:05.212299
1315	/career	1	admin@gmail.com	2026-06-09 08:27:06.032399
1316	/hackathons	1	admin@gmail.com	2026-06-09 08:27:06.918469
1317	/olympiads	1	admin@gmail.com	2026-06-09 08:27:14.97511
1318	/prof-orientation	1	admin@gmail.com	2026-06-09 08:27:16.511446
1319	/complilier	1	admin@gmail.com	2026-06-09 08:27:18.040336
1320	/circuit	1	admin@gmail.com	2026-06-09 08:27:18.567234
1321	/	1	admin@gmail.com	2026-06-09 08:27:57.776424
1322	/dashboard	1	admin@gmail.com	2026-06-09 08:28:00.621159
1323	/schedule	1	admin@gmail.com	2026-06-09 08:28:03.691685
1324	/hackathons/2	1	admin@gmail.com	2026-06-09 08:28:07.992077
1325	/schedule	1	admin@gmail.com	2026-06-09 08:28:09.361232
1326	/schedule/18	1	admin@gmail.com	2026-06-09 08:28:10.165929
1327	/schedule/18/submit	1	admin@gmail.com	2026-06-09 08:28:14.343031
1328	/schedule/18	1	admin@gmail.com	2026-06-09 08:28:18.213888
1329	/schedule	1	admin@gmail.com	2026-06-09 08:28:20.319222
1330	/assignments/89	1	admin@gmail.com	2026-06-09 08:28:21.627082
1331	/schedule	1	admin@gmail.com	2026-06-09 08:28:26.99983
1332	/schedule	1	admin@gmail.com	2026-06-09 08:47:25.279355
1333	/courses	1	admin@gmail.com	2026-06-09 08:47:26.169117
1334	/forum	1	admin@gmail.com	2026-06-09 08:47:30.406811
1335	/hackathons	1	admin@gmail.com	2026-06-09 08:47:32.800659
1336	/prof-orientation	1	admin@gmail.com	2026-06-09 08:47:33.443058
1337	/library	1	admin@gmail.com	2026-06-09 08:47:34.524623
1338	/	1	admin@gmail.com	2026-06-09 08:47:52.873995
1339	/courses	1	admin@gmail.com	2026-06-09 09:21:53.434435
1340	/	8	studenEl1@gmail.com	2026-06-09 09:22:52.456434
1341	/courses	8	studenEl1@gmail.com	2026-06-09 09:22:54.490545
1342	/	23	studenEl12@gmail.com	2026-06-09 09:23:50.163025
1343	/courses	23	studenEl12@gmail.com	2026-06-09 09:23:52.25848
1344	/	8	studenEl1@gmail.com	2026-06-09 09:27:35.520714
1345	/dashboard	8	studenEl1@gmail.com	2026-06-09 09:27:39.124614
1346	/	13	studenEl2@gmail.com	2026-06-09 09:27:53.971833
1347	/dashboard	13	studenEl2@gmail.com	2026-06-09 09:27:55.500354
1348	/schedule	13	studenEl2@gmail.com	2026-06-09 09:28:34.274186
1349	/dashboard	13	studenEl2@gmail.com	2026-06-09 09:28:48.533989
1350	/schedule	13	studenEl2@gmail.com	2026-06-09 09:29:10.481601
1351	/assignments/27	13	studenEl2@gmail.com	2026-06-09 09:32:23.275604
1352	/schedule	13	studenEl2@gmail.com	2026-06-09 09:32:26.319493
1353	/peer-review	13	studenEl2@gmail.com	2026-06-09 09:32:36.224291
1354	/schedule	13	studenEl2@gmail.com	2026-06-09 09:32:39.430163
1355	/assignments/28	13	studenEl2@gmail.com	2026-06-09 09:33:10.350788
1356	/schedule	13	studenEl2@gmail.com	2026-06-09 09:33:28.686106
1357	/circuit	13	studenEl2@gmail.com	2026-06-09 09:33:31.706821
1358	/dashboard	13	studenEl2@gmail.com	2026-06-09 09:33:40.133488
1359	/schedule	13	studenEl2@gmail.com	2026-06-09 09:33:43.161022
1360	/assignments/28	13	studenEl2@gmail.com	2026-06-09 09:33:46.119458
1361	/schedule	13	studenEl2@gmail.com	2026-06-09 09:34:06.661728
1362	/assignments/28	13	studenEl2@gmail.com	2026-06-09 09:34:31.305815
1363	/dashboard	13	studenEl2@gmail.com	2026-06-09 09:38:14.300043
1364	/schedule	13	studenEl2@gmail.com	2026-06-09 09:38:36.170854
1365	/assignments/27	13	studenEl2@gmail.com	2026-06-09 09:50:53.377875
1366	/schedule	13	studenEl2@gmail.com	2026-06-09 09:50:54.642209
1367	/schedule/6	13	studenEl2@gmail.com	2026-06-09 09:51:02.26138
1368	/schedule	13	studenEl2@gmail.com	2026-06-09 09:51:07.980882
1369	/schedule/6	13	studenEl2@gmail.com	2026-06-09 09:51:32.870459
1370	/dashboard	13	studenEl2@gmail.com	2026-06-09 09:53:19.853653
1371	/schedule	13	studenEl2@gmail.com	2026-06-09 09:55:11.302093
1372	/peer-review	13	studenEl2@gmail.com	2026-06-09 09:55:39.783355
1373	/courses	13	studenEl2@gmail.com	2026-06-09 09:57:33.870394
1374	/courses/english-vocab	13	studenEl2@gmail.com	2026-06-09 09:57:34.682354
1375	/library	13	studenEl2@gmail.com	2026-06-09 09:59:30.110243
1376	/forum	13	studenEl2@gmail.com	2026-06-09 10:01:36.074876
1377	/forum/1	13	studenEl2@gmail.com	2026-06-09 10:01:58.224654
1378	/forum/topic/6	13	studenEl2@gmail.com	2026-06-09 10:01:59.926943
1379	/forum/1	13	studenEl2@gmail.com	2026-06-09 10:02:02.513471
1380	/forum/topic/2	13	studenEl2@gmail.com	2026-06-09 10:02:03.462093
1381	/profile	13	studenEl2@gmail.com	2026-06-09 10:03:48.484122
1382	/circuit	13	studenEl2@gmail.com	2026-06-09 10:05:26.849957
1383	/circuit	13	studenEl2@gmail.com	2026-06-09 10:08:16.261091
1384	/	1	admin@gmail.com	2026-06-09 10:27:34.895261
1385	/mentor	1	admin@gmail.com	2026-06-09 10:27:38.904226
1386	/mentor/materials	1	admin@gmail.com	2026-06-09 10:27:52.305076
1387	/mentor/schedule	1	admin@gmail.com	2026-06-09 10:27:54.342152
1388	/mentor/assignments	1	admin@gmail.com	2026-06-09 10:27:56.862066
1389	/	10	mentorElec@gmail.com	2026-06-09 10:28:32.723238
1390	/mentor	10	mentorElec@gmail.com	2026-06-09 10:28:34.83526
1391	/mentor/assignments	10	mentorElec@gmail.com	2026-06-09 10:28:36.61659
1392	/	10	mentorElec@gmail.com	2026-06-09 10:35:38.082718
1393	/dashboard	10	mentorElec@gmail.com	2026-06-09 10:58:00.886926
1394	/	73	studenInf@gmail.com	2026-06-09 10:58:24.018692
1395	/dashboard	73	studenInf@gmail.com	2026-06-09 10:58:26.944057
1396	/electives	73	studenInf@gmail.com	2026-06-09 10:58:28.814736
1397	/dashboard	73	studenInf@gmail.com	2026-06-09 10:58:36.445241
1398	/electives	73	studenInf@gmail.com	2026-06-09 10:59:53.371807
1399	/electives/9	73	studenInf@gmail.com	2026-06-09 10:59:56.149744
1400	/electives	73	studenInf@gmail.com	2026-06-09 10:59:59.177869
1401	/olympiads	73	studenInf@gmail.com	2026-06-09 11:00:55.288748
1402	/olympiads/3	73	studenInf@gmail.com	2026-06-09 11:01:19.516996
1403	/olympiads/3/problem/1	73	studenInf@gmail.com	2026-06-09 11:01:25.7095
1404	/hackathons	73	studenInf@gmail.com	2026-06-09 11:05:45.975313
1405	/olympiads	73	studenInf@gmail.com	2026-06-09 11:05:46.768661
1406	/career	73	studenInf@gmail.com	2026-06-09 11:05:47.661376
1407	/career/test/holland	73	studenInf@gmail.com	2026-06-09 11:05:49.585585
1408	/career	73	studenInf@gmail.com	2026-06-09 11:08:47.990028
1409	/career/test/klimov	73	studenInf@gmail.com	2026-06-09 11:08:49.551725
1410	/hackathons	73	studenInf@gmail.com	2026-06-09 11:12:34.998566
1411	/prof-orientation	73	studenInf@gmail.com	2026-06-09 11:12:37.519117
1412	/	1	admin@gmail.com	2026-06-09 11:16:58.650833
1413	/	1	admin@gmail.com	2026-06-10 18:37:02.403357
1414	/circuit	1	admin@gmail.com	2026-06-10 18:37:39.861341
1415	/shematic	1	admin@gmail.com	2026-06-10 18:37:42.410889
1416	/	1	admin@gmail.com	2026-06-10 18:40:00.416614
1417	/rooms	1	admin@gmail.com	2026-06-10 18:40:42.991977
1418	/rooms/5/editor	1	admin@gmail.com	2026-06-10 18:40:55.459293
1419	/rooms	1	admin@gmail.com	2026-06-10 18:40:59.682065
1420	/rooms/2	1	admin@gmail.com	2026-06-10 18:41:01.721196
1421	/rooms/2/editor	1	admin@gmail.com	2026-06-10 18:41:06.827337
1422	/shematic	1	admin@gmail.com	2026-06-10 18:41:12.470604
1423	/mqtt-expert	1	admin@gmail.com	2026-06-10 18:44:21.927367
1424	/hackathons	1	admin@gmail.com	2026-06-10 18:44:52.918021
1425	/hackathons/2	1	admin@gmail.com	2026-06-10 18:44:56.706948
1426	/hackathons/2/team/1	1	admin@gmail.com	2026-06-10 18:45:17.222849
1427	/mentor	1	admin@gmail.com	2026-06-10 18:45:24.631856
1428	/mentor/hackathons	1	admin@gmail.com	2026-06-10 18:45:27.019683
1429	/dashboard	1	admin@gmail.com	2026-06-10 18:46:41.402678
1430	/internships	1	admin@gmail.com	2026-06-10 18:46:43.848461
1431	/internships/52	1	admin@gmail.com	2026-06-10 18:46:47.627153
1432	/internships	1	admin@gmail.com	2026-06-10 18:47:05.996559
1433	/internships/61	1	admin@gmail.com	2026-06-10 18:47:10.384848
1434	/internships	1	admin@gmail.com	2026-06-10 18:47:19.015046
1435	/internships/52	1	admin@gmail.com	2026-06-10 18:47:22.984943
1436	/internships/52	1	admin@gmail.com	2026-06-10 20:35:18.618094
1437	/internships/52	1	admin@gmail.com	2026-06-11 07:50:50.698301
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_achievements (id, "userId", "achievementId", "earnedAt", metadata) FROM stdin;
1	1	1	2026-05-09 16:25:17.115	\N
2	1	2	2026-05-09 17:18:38.529	\N
3	1	15	2026-05-09 17:18:38.547	\N
4	5	1	2026-05-13 06:43:29.898	\N
5	6	1	2026-05-13 07:09:04.407	\N
6	6	2	2026-05-13 07:09:22.081	\N
7	6	15	2026-05-13 07:09:22.1	\N
8	7	1	2026-05-13 09:46:16.316	\N
9	7	2	2026-05-13 09:46:33.348	\N
10	7	15	2026-05-13 09:46:33.369	\N
11	8	1	2026-05-13 09:48:23.848	\N
12	8	2	2026-05-13 09:48:36.047	\N
13	8	15	2026-05-13 09:48:36.056	\N
14	9	1	2026-05-13 11:58:26.973	\N
15	1	7	2026-05-18 09:13:30.408	\N
16	10	1	2026-05-21 08:35:46.841	\N
17	11	1	2026-05-21 08:36:23.209	\N
18	12	1	2026-05-21 08:37:00.456	\N
19	13	1	2026-05-21 09:49:00.015	\N
20	14	1	2026-05-21 09:49:20.351	\N
21	15	1	2026-05-21 09:49:36.334	\N
22	16	1	2026-05-21 09:49:57.473	\N
23	17	1	2026-05-21 09:50:17.252	\N
24	18	1	2026-05-21 09:50:34.281	\N
25	19	1	2026-05-21 09:50:51.818	\N
26	20	1	2026-05-21 09:51:12.045	\N
27	21	1	2026-05-21 09:51:31.449	\N
28	22	1	2026-05-21 09:51:48.757	\N
29	23	1	2026-05-21 09:52:04.185	\N
30	24	1	2026-05-21 09:52:19.993	\N
31	25	1	2026-05-21 09:52:36.89	\N
32	26	1	2026-05-21 09:52:53.402	\N
33	27	1	2026-05-21 09:53:09.849	\N
34	28	1	2026-05-21 09:53:28.682	\N
35	29	1	2026-05-21 09:53:44.567	\N
36	30	1	2026-05-21 09:54:02.592	\N
37	31	1	2026-05-21 09:54:21.78	\N
38	32	1	2026-05-21 09:54:47.816	\N
39	33	1	2026-05-21 09:55:07.419	\N
40	34	1	2026-05-21 09:55:26.343	\N
41	35	1	2026-05-21 09:55:52.567	\N
42	36	1	2026-05-21 09:56:14.466	\N
43	37	1	2026-05-21 09:56:31.746	\N
44	38	1	2026-05-21 09:56:48.536	\N
45	39	1	2026-05-21 09:57:06.327	\N
46	40	1	2026-05-21 09:57:25.271	\N
47	41	1	2026-05-21 09:57:44.832	\N
48	42	1	2026-05-21 09:58:02.542	\N
49	43	1	2026-05-21 09:58:18.77	\N
50	44	1	2026-05-21 09:58:37.569	\N
51	45	1	2026-05-21 09:58:58.711	\N
52	46	1	2026-05-21 09:59:16.818	\N
53	47	1	2026-05-21 09:59:42.647	\N
54	48	1	2026-05-21 10:00:01.854	\N
55	49	1	2026-05-21 10:00:19.27	\N
56	50	1	2026-05-21 10:00:38.342	\N
57	51	1	2026-05-21 10:00:54.064	\N
58	52	1	2026-05-21 10:01:31.616	\N
59	53	1	2026-05-21 10:01:50.582	\N
60	54	1	2026-05-21 10:02:07.529	\N
61	55	1	2026-05-21 10:02:26.617	\N
62	56	1	2026-05-21 10:02:45.829	\N
63	57	1	2026-05-21 10:03:04.866	\N
64	58	1	2026-05-21 10:03:23.033	\N
65	59	1	2026-05-21 10:03:42.648	\N
66	60	1	2026-05-21 10:06:32.03	\N
67	61	1	2026-05-21 10:06:48.636	\N
68	62	1	2026-05-21 10:07:05.844	\N
69	63	1	2026-05-21 10:07:24.497	\N
70	64	1	2026-05-21 10:07:43.279	\N
71	65	1	2026-05-21 10:08:02.24	\N
72	66	1	2026-05-21 10:08:21.63	\N
73	67	1	2026-05-21 10:08:40.393	\N
74	68	1	2026-05-21 10:08:59.82	\N
75	69	1	2026-05-21 10:09:23.597	\N
76	70	1	2026-05-21 10:09:43.421	\N
77	71	1	2026-05-21 10:10:02.93	\N
78	72	1	2026-05-21 10:10:21.013	\N
79	8	3	2026-05-22 08:42:19.071	\N
80	13	2	2026-05-22 08:43:07.075	\N
81	13	15	2026-05-22 08:43:07.076	\N
82	14	2	2026-05-22 08:43:25.571	\N
83	14	15	2026-05-22 08:43:25.58	\N
84	15	2	2026-05-22 08:43:43.42	\N
85	15	15	2026-05-22 08:43:43.426	\N
86	16	2	2026-05-22 08:44:02.101	\N
87	16	15	2026-05-22 08:44:02.105	\N
88	17	2	2026-05-22 08:44:17.903	\N
89	17	15	2026-05-22 08:44:17.913	\N
90	18	2	2026-05-22 08:44:34.781	\N
91	18	15	2026-05-22 08:44:34.788	\N
92	19	2	2026-05-22 08:44:49.55	\N
93	19	15	2026-05-22 08:44:49.555	\N
94	20	2	2026-05-22 08:45:04.297	\N
95	20	15	2026-05-22 08:45:04.303	\N
96	21	2	2026-05-22 08:45:19.076	\N
97	21	15	2026-05-22 08:45:19.087	\N
98	22	2	2026-05-22 08:45:34.941	\N
99	22	15	2026-05-22 08:45:34.946	\N
100	13	3	2026-05-22 08:46:35.967	\N
101	14	3	2026-05-22 08:47:01.92	\N
102	13	7	2026-05-22 08:59:09.678	\N
103	8	7	2026-05-22 09:02:25.234	\N
104	14	7	2026-05-22 09:02:57.327	\N
105	8	10	2026-05-22 12:02:23.787	\N
106	73	1	2026-05-24 10:14:19.404	\N
107	73	2	2026-05-24 10:14:28.875	\N
108	73	15	2026-05-24 10:14:28.882	\N
109	74	1	2026-05-24 17:32:20.858	\N
110	23	2	2026-06-09 09:24:17.822	\N
111	23	15	2026-06-09 09:24:17.894	\N
112	13	10	2026-06-09 09:34:47.124	\N
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (id, user_id, role) FROM stdin;
9	1	admin
10	6	registered_user
11	6	student_english
12	7	registered_user
13	7	student_electronics
14	8	registered_user
15	8	student_electronics
19	2	registered_user
20	9	registered_user
24	12	registered_user
25	12	mentor_computer_science
26	11	registered_user
27	11	mentor_iot
28	10	registered_user
29	10	mentor_electronics
34	5	registered_user
35	5	mentor_english
36	13	registered_user
37	14	registered_user
38	15	registered_user
39	16	registered_user
40	17	registered_user
41	18	registered_user
42	19	registered_user
43	20	registered_user
44	21	registered_user
45	22	registered_user
46	23	registered_user
47	24	registered_user
48	25	registered_user
49	26	registered_user
50	27	registered_user
51	28	registered_user
52	29	registered_user
53	30	registered_user
54	31	registered_user
55	32	registered_user
56	33	registered_user
57	34	registered_user
58	35	registered_user
59	36	registered_user
60	37	registered_user
61	38	registered_user
62	39	registered_user
63	40	registered_user
64	41	registered_user
65	42	registered_user
66	43	registered_user
67	44	registered_user
68	45	registered_user
69	46	registered_user
70	47	registered_user
71	48	registered_user
72	49	registered_user
73	50	registered_user
74	51	registered_user
75	52	registered_user
76	53	registered_user
77	54	registered_user
78	55	registered_user
79	56	registered_user
80	57	registered_user
81	58	registered_user
82	59	registered_user
83	60	registered_user
84	61	registered_user
85	62	registered_user
86	63	registered_user
87	64	registered_user
88	65	registered_user
89	66	registered_user
90	67	registered_user
91	68	registered_user
92	69	registered_user
93	70	registered_user
94	71	registered_user
95	72	registered_user
96	13	student_electronics
97	14	student_electronics
98	15	student_electronics
99	16	student_electronics
100	17	student_electronics
101	18	student_electronics
102	19	student_electronics
103	20	student_electronics
104	21	student_electronics
105	22	student_electronics
106	1	student_iot
107	73	registered_user
108	73	student_computer_science
109	74	registered_user
110	23	student_electronics
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt", avatar) FROM stdin;
1	admin@gmail.com	$2b$12$UBMo4d.tF.gA6PsDKzLtQeRIB6/XwczsPTQ7zBiEb1dYSr68TwqXi	Admin	Admin	t	2026-05-09 16:25:17.075983	2026-05-09 16:25:17.075983	\N
43	studenAngl12@gmail.com	$2b$12$UQTFzueZ7.YSj1ah/CDXGOnuwYG2uAmQKMPrM.R8dBapSECOEdic.	Student	Angl12	t	2026-05-21 09:58:18.757663	2026-05-21 09:58:18.757663	\N
5	menrotAngl@gmail.com	$2b$12$mSNQPMHLZFcDjlVL7nthDuguNxqraGn.irDmU9Fqm.wdIlfXbAW02	Ivan	Mentor	t	2026-05-13 06:43:29.871716	2026-05-13 06:43:29.871716	\N
6	studenAngl@gmail.com	$2b$12$6iALiYUjhbM.XptB/BrrW.LSeJ9fKPwCWpElccPguHW9z.WE3Rg9a	Angl	Student	t	2026-05-13 07:09:04.388725	2026-05-13 07:09:04.388725	\N
7	studenEl@gmail.com	$2b$12$XVafg2T7/VAfKafiQ3bBZOzwfQLIEhrw.RndVPXTf5cNkoNH8AnMe	Electric	Student	t	2026-05-13 09:46:16.299401	2026-05-13 09:46:16.299401	\N
9	nestudent@gmail.com	$2b$12$Xp81ayx8Q2gtGlbkgRZht.qLQaruPgULP5dfbaSJBNZLTl7Lju3.u	Ivan	Nestudent	t	2026-05-13 11:58:26.933195	2026-05-13 11:58:26.933195	\N
8	studenEl1@gmail.com	$2b$12$S1ZT6tKqvIJLk.deNhRKdO6g0g8msrc5zL1VCJh6LdFoDGfSlmKs2	Electric	Ivan	t	2026-05-13 09:48:23.83368	2026-05-13 17:05:03.584639	\N
3	mentor@asoi.edu	$2b$10$K8L1A5H5J5L5A5H5J5L5A.O5vA5H5J5L5A5H5J5L5A5H5J5L5A5H5J	????????	????????????	f	2026-05-09 16:33:40.840971	2026-05-19 09:16:01.942374	\N
4	student@asoi.edu	$2b$10$K8L1A5H5J5L5A5H5J5L5A.O5vA5H5J5L5A5H5J5L5A5H5J5L5A5H5J	??????????????	??????????????	f	2026-05-09 16:33:40.840971	2026-05-21 08:30:38.725007	\N
2	admin@asoi.edu	$2b$10$st5oH1yuNHLHP0AxlR.HveiqHXE.kQTq.tssfk85ktImo3w4zfB.K	??????????????????????????	??????????????	f	2026-05-09 16:33:40.840971	2026-05-21 08:30:53.657165	\N
10	mentorElec@gmail.com	$2b$12$ube8uyoq4oioOiHrvX72d.02FFXl0sKgcJBBgCElA.isO1ih12FHa	Mentor	Electronic	t	2026-05-21 08:35:46.818698	2026-05-21 08:35:46.818698	\N
11	mentorIot@gmail.com	$2b$12$zjFJ02CBXR400wiNW1wfBe.pdknOOWc76mPmVNATBmkGowl7Qechq	Mentor	IoT	t	2026-05-21 08:36:23.192559	2026-05-21 08:36:23.192559	\N
12	mentorInf@gmail.com	$2b$12$GMeySy6Hjxk5LY5m5L1s6uw1.OStAs5MLLlviRJzUyx4U2XDj2W8W	Mentor	Informatic	t	2026-05-21 08:37:00.434189	2026-05-21 08:37:00.434189	\N
13	studenEl2@gmail.com	$2b$12$eJGifarewim4H4NccCtR.OWQYJHSnOE5AQx3SBVHwxAW2L0eYAIB2	Student	El2	t	2026-05-21 09:48:59.992051	2026-05-21 09:48:59.992051	\N
14	studenEl3@gmail.com	$2b$12$Z4COXP8TeF/rXG75ZXCiuOPSzdWNMOSxBEBNI9yknwCtQzVAGQ3ce	Student	El3	t	2026-05-21 09:49:20.338267	2026-05-21 09:49:20.338267	\N
15	studenEl4@gmail.com	$2b$12$xceMfCSwNhEU/WMR.QEFqe5.n1Exi7DkQv4H9PSqtBv1rCG6yl442	Student	El4	t	2026-05-21 09:49:36.320102	2026-05-21 09:49:36.320102	\N
16	studenEl5@gmail.com	$2b$12$wS5lPB6UnyZeh5.xnuWkLuKmq3mEoSPF1yg7CKW0.0.xiHAo/whlu	Student	El5	t	2026-05-21 09:49:57.455841	2026-05-21 09:49:57.455841	\N
17	studenEl6@gmail.com	$2b$12$G3UOP2Q4C8ggTQz6s/hC9OvxD7utOF9/MSvGf3mwW.beybCUG8SCm	Student	El6	t	2026-05-21 09:50:17.235108	2026-05-21 09:50:17.235108	\N
18	studenEl7@gmail.com	$2b$12$XhoccDb5YkUU82g0YPd1uOCt9U12J/g2mtMsDdR4DmBraXDMV2Bdm	Student	El7	t	2026-05-21 09:50:34.263612	2026-05-21 09:50:34.263612	\N
19	studenEl8@gmail.com	$2b$12$LenE32mmm7zfzqv1qQthPOBeEGfk4FH2O46LSTABdaj8Qhqpx1Pdy	Student	El8	t	2026-05-21 09:50:51.80148	2026-05-21 09:50:51.80148	\N
20	studenEl9@gmail.com	$2b$12$pcKoPFFRu/7M90sEiOfbJOyWiqwQnMJbd1vyHZgYqAAZGRZy4DKou	Student	El9	t	2026-05-21 09:51:12.031605	2026-05-21 09:51:12.031605	\N
21	studenEl10@gmail.com	$2b$12$qJcFmgBCcxA2HCxK1ZbMee.7pQcRk1GMEAT9djLwOmjK8p2815JBG	Student	El10	t	2026-05-21 09:51:31.431857	2026-05-21 09:51:31.431857	\N
22	studenEl11@gmail.com	$2b$12$FtdLKT7W63qQBAP7.Hzb7.sFUbrSWYdgDFj6stY6Labz2shS.c/Ju	Student	El11	t	2026-05-21 09:51:48.735036	2026-05-21 09:51:48.735036	\N
23	studenEl12@gmail.com	$2b$12$BGUpISDKEI0MWGuqJgNcseqn9XFihCcRfKudHRUV.iwOUMXwUZlmi	Student	El12	t	2026-05-21 09:52:04.168509	2026-05-21 09:52:04.168509	\N
24	studenEl13@gmail.com	$2b$12$IOxgzW/.6NGqOlswJsoS5uLUDrbdDPsa3quuXuZ7eB/hOLhWFRcHa	Student	El13	t	2026-05-21 09:52:19.977319	2026-05-21 09:52:19.977319	\N
25	studenEl14@gmail.com	$2b$12$TUKzFQPP5djb7oCTCpH9SeOKLH7.9gF9ziWe0.JgbhIvhDIfT4hEW	Student	14	t	2026-05-21 09:52:36.877437	2026-05-21 09:52:36.877437	\N
26	studenEl15@gmail.com	$2b$12$9CjKhjdUxgDhFtMBuJRJxeon.yh/2KRp5vq0Am8t8JP5.ROg53EW6	Student	El15	t	2026-05-21 09:52:53.38773	2026-05-21 09:52:53.38773	\N
27	studenEl16@gmail.com	$2b$12$ajGhd4ce/eytG3EBnJGOw.RV8gpP8C/4fwKXClhZD/6DkFpgev13y	Student	El16	t	2026-05-21 09:53:09.834588	2026-05-21 09:53:09.834588	\N
28	studenEl17@gmail.com	$2b$12$2v9jEFX91u4Ln9PW54LPfOIdlxp8.FI0LlWLhuVT2cpyBV9e240ve	Student	El17	t	2026-05-21 09:53:28.666214	2026-05-21 09:53:28.666214	\N
29	studenEl18@gmail.com	$2b$12$.mm7HSwDtiDCgWs9/nJzwezLmpsnx7TPJjMPEX0EW9PSE1aCZvH9O	Student	18	t	2026-05-21 09:53:44.548697	2026-05-21 09:53:44.548697	\N
30	studenEl19@gmail.com	$2b$12$LYmcY5Vk2dES9kyZ2FFBmuotG12DxCGUKsHvJhKYHKrlNkLGtUjze	Student	El19	t	2026-05-21 09:54:02.57941	2026-05-21 09:54:02.57941	\N
31	studenEl20@gmail.com	$2b$12$EVdCuPYYIFy3q/crzuOcnOm7oGtEdXu/yObDW7fFd/O9Op8WE7CbW	Student	El20	t	2026-05-21 09:54:21.761852	2026-05-21 09:54:21.761852	\N
32	studenAngl1@gmail.com	$2b$12$SXc9C/lNERkPZniDHHSdROOjCuMKD1VyFIOQbjOppG87D60UIPG0C	Student	Angl1	t	2026-05-21 09:54:47.800125	2026-05-21 09:54:47.800125	\N
33	studenAngl2@gmail.com	$2b$12$I.nyke452GGGrFNCUaJoOuJ6qZFtzenjzep6.w6Sd/5PWwsP8XvQO	Student	Angl2	t	2026-05-21 09:55:07.404277	2026-05-21 09:55:07.404277	\N
34	studenAngl3@gmail.com	$2b$12$BJb6YJ8cJ5ZCWdHetoZDzO3UQuGBgDX8NoSgjwjnEI.dtEbsthvbK	Student	Angl3	t	2026-05-21 09:55:26.325744	2026-05-21 09:55:26.325744	\N
35	studenAngl4@gmail.com	$2b$12$fYb59Rpv5kWwXpZAGKSDqOL.D9NI11XwSrgMBpCfn8v4CUPQoZs2O	Student	Angl4	t	2026-05-21 09:55:52.554609	2026-05-21 09:55:52.554609	\N
36	studenAngl5@gmail.com	$2b$12$.NkxulkEQLaBG2yG.SBeHeE70Mnff6DiCW9lh4lmy8gSksDHcvb1q	Student	Angl5	t	2026-05-21 09:56:14.449296	2026-05-21 09:56:14.449296	\N
37	studenAngl6@gmail.com	$2b$12$ze8tHhz/upcRsSjyTGW1SOcz3bXvrl5RpR8rwL8mgQbuDcTsKo10e	Student	Angl6	t	2026-05-21 09:56:31.727786	2026-05-21 09:56:31.727786	\N
38	studenAngl7@gmail.com	$2b$12$pil9Slj18dy7Zx46ZJElL.ytGUt3LRcw6sOu7OKeeC2bktOLfs222	Student	Angl7	t	2026-05-21 09:56:48.519278	2026-05-21 09:56:48.519278	\N
39	studenAngl8@gmail.com	$2b$12$43iMUpeQmwp919iRB6hTceTijIp6N/X/5v37KL.INIDUZa/Sg4uAm	Student	Angl8	t	2026-05-21 09:57:06.308874	2026-05-21 09:57:06.308874	\N
40	studenAngl9@gmail.com	$2b$12$eGZXbIo/9FrNti7W9sS3eujO..qFd7gqxBBHuX8PWKedmJ0oQUlDW	Student	Angl9	t	2026-05-21 09:57:25.254464	2026-05-21 09:57:25.254464	\N
41	studenAngl10@gmail.com	$2b$12$aCr40A9M5tplrxbqB/N0fuUfZjmrwXlYVhJDyKdTPKlxH5QLmfmnG	Student	Angl10	t	2026-05-21 09:57:44.820268	2026-05-21 09:57:44.820268	\N
42	studenAngl11@gmail.com	$2b$12$zSNKIXn3LxzyYj01O592vuIdvtW599Qut02U0gsdRcemf0KnFRzPW	Student	Angl11	t	2026-05-21 09:58:02.528779	2026-05-21 09:58:02.528779	\N
44	studenAngl13@gmail.com	$2b$12$bmYcNNj28lJt5UxYIo2EkeHVNbDFfUEJuliAZqJd4eOPJrYXuazuO	Student	Angl13	t	2026-05-21 09:58:37.553604	2026-05-21 09:58:37.553604	\N
45	studenAngl14@gmail.com	$2b$12$XwNG3KzkGSaeoXr96vpjBe5cSK2URtUXiGQ9G1yU9ZJmol7zprttC	Student	Angl14	t	2026-05-21 09:58:58.694902	2026-05-21 09:58:58.694902	\N
46	studenAngl15@gmail.com	$2b$12$GBvkiUbGxjAGOjJWFchhYuuurrw3Sq3EeeU5wbnBa3zmAiv0kud7K	Student	Angl15	t	2026-05-21 09:59:16.801881	2026-05-21 09:59:16.801881	\N
47	studenAngl16@gmail.com	$2b$12$78ok2mjQDnxdoz9M7F4TGe/5xRx9CwjOAmbV6jPsIYyw.dedgx1be	Student	Angl16	t	2026-05-21 09:59:42.631382	2026-05-21 09:59:42.631382	\N
48	studenAngl17@gmail.com	$2b$12$aZ3jGgHYFEI1VLmQpkhFiuw6YdqfQCrKH/DIsAfpCth5TYAh1OgEa	Student	Angl17	t	2026-05-21 10:00:01.837903	2026-05-21 10:00:01.837903	\N
49	studenAngl18@gmail.com	$2b$12$UTlgeZZzDEx90S8oF1PQPeM6tmV.UCUm5Vd0rb/bxNXKnW3lZq.1u	Student	Angl18	t	2026-05-21 10:00:19.255905	2026-05-21 10:00:19.255905	\N
50	studenAngl19@gmail.com	$2b$12$z6zNhz2y1Rf/7hhE5UWDKe6QjNwU9ijK1GQmWa.QneXPRX4FPuGFC	Student	Angl19	t	2026-05-21 10:00:38.327447	2026-05-21 10:00:38.327447	\N
51	studenAngl20@gmail.com	$2b$12$hxG63sA1d.hLAeitv0q.TuY7l0kBH1SeydDOHe5YRrwtOZdR7xGfS	Student	Angl20	t	2026-05-21 10:00:54.049322	2026-05-21 10:00:54.049322	\N
52	studentIoT@gmail.com	$2b$12$pYOJnm5WQem2ABP688KyD.gKoPjDFMJI4rKU6D7KtpFkQDAU8.iLe	Student	IoT	t	2026-05-21 10:01:31.603017	2026-05-21 10:01:31.603017	\N
53	studentIoT1@gmail.com	$2b$12$YC0acPagO.0YoXXyZXxSQuQbi.Hws/aHhu78crhOliJLsoqnhMfpW	Student	IoT	t	2026-05-21 10:01:50.567182	2026-05-21 10:01:50.567182	\N
54	studentIoT2@gmail.com	$2b$12$C1SGot/kIxnU4jKKXV8BFuwkMhapWPPwrRQf7J4mKYPAaxYmS8bHm	Student	IoT	t	2026-05-21 10:02:07.512267	2026-05-21 10:02:07.512267	\N
55	studentIoT3@gmail.com	$2b$12$IsWelzY5DluRY.OwZh6m3ud4KcW9VvKfvIuG0bN090LoiagxJfMKy	Student	IoT3	t	2026-05-21 10:02:26.60151	2026-05-21 10:02:26.60151	\N
56	studentIoT4@gmail.com	$2b$12$Ca3OsmYiFEiJeqGuboXwXekKOp/rKO5uqRG3gg5DwNU1oXsJFUjNC	Student	IoT4	t	2026-05-21 10:02:45.813164	2026-05-21 10:02:45.813164	\N
57	studentIoT5@gmail.com	$2b$12$mnz1AW3z25T.9QX9JSTV3u2FofSJLOr.vvcR.KSZAcSpv0IWW8PiK	Student	IoT5	t	2026-05-21 10:03:04.848969	2026-05-21 10:03:04.848969	\N
58	studentIoT6@gmail.com	$2b$12$GbhOik.jNEUmCRS/Paag1OOetSMgOncNxndQQMSz4336R29kG.d26	Student	IoT6	t	2026-05-21 10:03:23.020425	2026-05-21 10:03:23.020425	\N
59	studentIoT7@gmail.com	$2b$12$aY4EbAq9hNQdFoWsl86zEedBzY.cUwoE90D6MPl5HoNza3MCHkrxC	Student	IoT7	t	2026-05-21 10:03:42.631996	2026-05-21 10:03:42.631996	\N
60	studentIoT8@gmail.com	$2b$12$KyQOmcJvvzZdwbuEjf4Fe.22eITKAVmTcC8QI8zlW8tf5WAGHwkZa	Student	IoT8	t	2026-05-21 10:06:32.012704	2026-05-21 10:06:32.012704	\N
61	studentIoT9@gmail.com	$2b$12$8lLfoZEB.hpPGMvD7xdDzOP3ZUL0dUZ2uRM9LEyKMjiZqkUCpQWPy	Student	IoT	t	2026-05-21 10:06:48.622027	2026-05-21 10:06:48.622027	\N
62	studentIoT10@gmail.com	$2b$12$M.x1Ktl8GsUULeW8xMXQ7.es0wWAP6UYf.ZnpnglH9Xz/PUeNmU1G	Student	IoT10	t	2026-05-21 10:07:05.829011	2026-05-21 10:07:05.829011	\N
63	studentIoT11@gmail.com	$2b$12$Dvac2pUxnrXwM4EqBLm6h.QOjJ8JVMBZ.9ZNJDGZaUKQhOLLUhy3u	Student	IoT11	t	2026-05-21 10:07:24.483653	2026-05-21 10:07:24.483653	\N
64	studentIoT12@gmail.com	$2b$12$7UCm5uJ8aG3yZ6s72vV1ie9KN86xhSiuY5NQOi.9tFoCAYdBCf2Ca	Student	El12	t	2026-05-21 10:07:43.263804	2026-05-21 10:07:43.263804	\N
65	studentIoT13@gmail.com	$2b$12$LfiGyXM9mKlQ5M3Tk7XI0e6KspccLqsvLWs0cecmsUqYCASihlM4G	Student	El13	t	2026-05-21 10:08:02.228707	2026-05-21 10:08:02.228707	\N
66	studentIoT14@gmail.com	$2b$12$oPKy8lNWCyEkQVhtErzjYO5qhEBtZwVGb7a9QDddJ4ePBsPK0VvLm	Student	IoT14	t	2026-05-21 10:08:21.613842	2026-05-21 10:08:21.613842	\N
67	studentIoT15@gmail.com	$2b$12$HTkgURLDlt6QZIrAFufWH.gR0bKrwxi8.WsfrSnSLBqQj95Ao3oo2	Student	IoT15	t	2026-05-21 10:08:40.380795	2026-05-21 10:08:40.380795	\N
68	studentIoT16@gmail.com	$2b$12$7NpXFn9zu.37Yv6FY3Sey.7NVDbFO5WGhHYCS.ETv6Mqs3g0h6/r2	Student	IoT16	t	2026-05-21 10:08:59.805029	2026-05-21 10:08:59.805029	\N
69	studentIoT17@gmail.com	$2b$12$alStSID1.V5Uq2GnoYAn6eYALhFG0ioLS/4wSJ5dFPe3aLBT1IVS2	Student	IoT17	t	2026-05-21 10:09:23.580505	2026-05-21 10:09:23.580505	\N
70	studentIoT18@gmail.com	$2b$12$Rhoj1.n8LlcPOH5M.xHt/e8hNRZEJavBYgpX9UWuGI8t5q8WSiGrm	Student	IoT18	t	2026-05-21 10:09:43.403652	2026-05-21 10:09:43.403652	\N
71	studentIoT19@gmail.com	$2b$12$0TrlrjelGzps5pi3TMAPWuEM1q9mvYHOu77TsulyKdAOoomALgiVW	Student	IoT19	t	2026-05-21 10:10:02.916585	2026-05-21 10:10:02.916585	\N
72	studentIoT20@gmail.com	$2b$12$9nytjubxXlI3/b/dKOEPEuX5w0STQszILf7XFr1avVVZa/HDyVbui	Student	IoT20	t	2026-05-21 10:10:20.997707	2026-05-21 10:10:20.997707	\N
73	studenInf@gmail.com	$2b$12$Byw9H/92VuFA6Yr35DYNJ.0KBkeOxHV6SZ0.13yy7UN4NjOEHLGy6	Student	Inf	t	2026-05-24 10:14:19.383858	2026-05-24 10:14:19.383858	\N
74	ivan.testov@example.com	$2b$12$eukpE47GtoVBvnGhKaYiauRaO4O106ECfgTMmy.IzvrbrCCMtqnti	Иван	Тестов	t	2026-05-24 17:32:20.832939	2026-05-24 17:32:20.832939	\N
\.


--
-- Data for Name: vocab_terms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vocab_terms (id, term, transcription, translation, category, definition, example, level, "isActive", "createdAt", "updatedAt") FROM stdin;
1	Algorithm	[ˈælɡərɪðəm]	Алгоритм	Программирование	A step-by-step procedure for solving a problem.	The sorting algorithm runs in O(n log n) time.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
2	Compiler	[kəmˈpaɪlər]	Компилятор	Программирование	A program that translates source code into machine code.	The compiler reported three syntax errors.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
3	Debugging	[diːˈbʌɡɪŋ]	Отладка	Программирование	The process of finding and fixing errors in software.	She spent hours debugging the authentication module.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
4	Refactoring	[riːˈfæktərɪŋ]	Рефакторинг	Программирование	Restructuring existing code without changing its behavior.	Refactoring improved code readability significantly.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
5	Recursion	[rɪˈkɜːʃən]	Рекурсия	Программирование	A function that calls itself to solve a smaller problem.	Factorial is a classic example of recursion.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
6	Abstraction	[æbˈstrækʃən]	Абстракция	Программирование	Hiding complexity by exposing only essential features.	The API provides abstraction over the database layer.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
7	Polymorphism	[ˌpɒlɪˈmɔːfɪzəm]	Полиморфизм	Программирование	Different objects responding to the same interface differently.	Polymorphism allows draw() to render different shapes.	advanced	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
8	Encapsulation	[ɪnˌkæpsʊˈleɪʃən]	Инкапсуляция	Программирование	Bundling data and methods within a single unit.	Encapsulation protects internal state from external modification.	advanced	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
9	Dependency	[dɪˈpendənsi]	Зависимость	Программирование	A module that another module relies on.	Install all dependencies by running npm install.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
10	Middleware	[ˈmɪdəlweər]	Промежуточное ПО	Программирование	Software that handles requests before they reach the main handler.	The auth middleware checks tokens on every request.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
11	Interface	[ˈɪntəfeɪs]	Интерфейс	Программирование	A contract that defines what methods a class must implement.	The Serializable interface requires a serialize() method.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
12	Inheritance	[ɪnˈherɪtəns]	Наследование	Программирование	A mechanism where a class acquires properties from another class.	Dog inherits from Animal and overrides the speak() method.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
13	Runtime	[ˈrʌntaɪm]	Время выполнения	Программирование	The period when a program is executing.	A runtime error occurred when dividing by zero.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
14	Thread	[θred]	Поток	Программирование	The smallest unit of execution that can run concurrently.	Use worker threads to avoid blocking the main thread.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
15	Callback	[ˈkɔːlbæk]	Колбэк / Обратный вызов	Программирование	A function passed as argument to be called later.	Pass a callback to handle the async response.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
16	Promise	[ˈprɒmɪs]	Промис	Программирование	An object representing a future asynchronous result.	The fetch() function returns a Promise.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
17	Bandwidth	[ˈbændwɪdθ]	Пропускная способность	Сети	The maximum rate of data transfer across a network.	The server upgrade doubled our available bandwidth.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
18	Latency	[ˈleɪtənsi]	Задержка	Сети	The time delay between sending and receiving data.	High latency causes lag in real-time applications.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
19	Protocol	[ˈprəʊtəkɒl]	Протокол	Сети	A set of rules governing communication between devices.	HTTP is the protocol used for web communication.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
20	Packet	[ˈpækɪt]	Пакет	Сети	A unit of data transmitted over a network.	Each packet contains a header with routing information.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
21	Handshake	[ˈhændʃeɪk]	Квитирование	Сети	A process where two systems establish connection parameters.	TLS uses a three-way handshake for a secure session.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
22	Gateway	[ˈɡeɪtweɪ]	Шлюз	Сети	A network node that connects two different networks.	The default gateway routes traffic to the internet.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
23	Subnet	[ˈsʌbnet]	Подсеть	Сети	A logical subdivision of an IP network.	Devices on the same subnet communicate directly.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
24	DNS	[ˌdiːenˈes]	Система доменных имён	Сети	Domain Name System — translates domain names to IP addresses.	DNS resolves example.com to 93.184.216.34.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
25	Load balancer	[ləʊd ˈbælənsər]	Балансировщик нагрузки	Сети	Distributes incoming traffic across multiple servers.	The load balancer prevents any single server from overloading.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
26	Firmware	[ˈfɜːmweər]	Прошивка	IoT / Железо	Low-level software permanently programmed into hardware.	Update the firmware to fix the connectivity bug.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
27	Microcontroller	[ˌmaɪkrəʊkənˈtrəʊlər]	Микроконтроллер	IoT / Железо	A compact IC with a processor, memory, and I/O peripherals.	The ESP32 microcontroller includes built-in Wi-Fi.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
28	GPIO	[ˌdʒiːpiːaɪˈəʊ]	Цифровой порт ввода/вывода	IoT / Железо	General Purpose Input/Output pins on a microcontroller.	Set GPIO pin 2 as output to control the LED.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
29	Interrupt	[ˈɪntərʌpt]	Прерывание	IoT / Железо	A signal that pauses program execution to handle an event.	Configure an interrupt to trigger when button is pressed.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
30	PWM	[ˌpiːdʌbljuːˈem]	Широтно-импульсная модуляция	IoT / Железо	Controlling power by varying the duty cycle of a signal.	Use PWM to control motor speed.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
31	I2C	[ˌaɪ tuː ˈsiː]	Протокол I2C	IoT / Железо	Inter-Integrated Circuit — a two-wire serial communication protocol.	Connect the OLED display using I2C on SDA and SCL.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
32	SPI	[ˌespiːˈaɪ]	Протокол SPI	IoT / Железо	Serial Peripheral Interface — a four-wire synchronous bus.	The SD card module communicates via SPI.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
33	ADC	[ˌeɪdiːˈsiː]	АЦП	IoT / Железо	Analog-to-Digital Converter — converts analog signals to digital.	The ADC reads sensor voltage as a 12-bit integer.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
34	Polling	[ˈpəʊlɪŋ]	Опрос	IoT / Железо	Repeatedly checking the status of a device.	Polling the sensor every 100 ms consumes unnecessary power.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
35	Authentication	[ɔːˌθentɪˈkeɪʃən]	Аутентификация	Безопасность	Verifying the identity of a user or system.	Two-factor authentication adds an extra security layer.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
36	Encryption	[ɪnˈkrɪpʃən]	Шифрование	Безопасность	Encoding data so only authorized parties can read it.	All passwords must be stored with encryption.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
37	Vulnerability	[ˌvʌlnərəˈbɪlɪti]	Уязвимость	Безопасность	A weakness in a system that can be exploited by attackers.	The audit discovered a SQL injection vulnerability.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
38	Token	[ˈtəʊkən]	Токен	Безопасность	A digital key used to verify identity or authorize access.	The JWT token expires after one hour.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
39	Payload	[ˈpeɪləʊd]	Полезная нагрузка	Безопасность	The actual message content, or malicious code in attacks.	The malware payload activates 24 hours after infection.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
40	Firewall	[ˈfaɪəwɔːl]	Брандмауэр	Безопасность	A system that monitors and controls network traffic.	The firewall blocked suspicious incoming connections.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
41	Query	[ˈkwɪəri]	Запрос	Базы данных	A request for data from a database.	The SQL query returned 500 records in under a second.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
42	Index	[ˈɪndeks]	Индекс	Базы данных	A data structure that improves the speed of data retrieval.	Adding an index on email sped up login queries.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
43	Transaction	[trænˈzækʃən]	Транзакция	Базы данных	A sequence of operations that must fully succeed or fail.	The payment transaction rolled back due to insufficient funds.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
44	Migration	[maɪˈɡreɪʃən]	Миграция	Базы данных	The process of moving or transforming database schema or data.	The migration added three new columns to the users table.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
45	Schema	[ˈskiːmə]	Схема	Базы данных	The structure that defines the organization of data.	The schema was redesigned to support multi-tenancy.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
46	Training	[ˈtreɪnɪŋ]	Обучение (модели)	ИИ / ML	Feeding data to a model so it can learn patterns.	Training on larger datasets improved accuracy.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
47	Inference	[ˈɪnfərəns]	Вывод (предсказание)	ИИ / ML	Using a trained model to make predictions on new data.	Inference on edge devices requires optimized models.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
48	Overfitting	[ˌəʊvəˈfɪtɪŋ]	Переобучение	ИИ / ML	When a model learns training data too well and cannot generalize.	Dropout layers help prevent overfitting.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
49	Epoch	[ˈiːpɒk]	Эпоха	ИИ / ML	One complete pass through the entire training dataset.	After 50 epochs, the loss converged to 0.02.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
50	Feature	[ˈfiːtʃər]	Признак	ИИ / ML	An individual measurable property used as input to a model.	Temperature and humidity are features for weather prediction.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
51	Deploy	[dɪˈplɔɪ]	Развёртывать	Общее	To release software to a production environment.	We deploy to production every Friday afternoon.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
52	Scalability	[ˌskeɪləˈbɪlɪti]	Масштабируемость	Общее	The ability of a system to handle increased load.	Microservices improve the scalability of large applications.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
53	Bottleneck	[ˈbɒtəlnek]	Узкое место	Общее	A point in a system that limits overall performance.	The database was identified as the main bottleneck.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
54	Legacy	[ˈleɡəsi]	Устаревший код	Общее	Outdated software or systems that are still in use.	The legacy codebase made adding new features difficult.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
55	Deprecate	[ˈdeprɪkeɪt]	Объявлять устаревшим	Общее	To mark a feature as outdated and discourage its use.	This API endpoint will be deprecated in version 3.0.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
56	Boilerplate	[ˈbɔɪlərpleɪt]	Шаблонный код	Общее	Repetitive code that appears in many places with little change.	The framework reduces boilerplate in API controllers.	intermediate	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
57	Benchmark	[ˈbentʃmɑːk]	Тест производительности	Общее	A test used to measure the performance of a system.	Run the benchmark before and after the optimization.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
58	Cache	[kæʃ]	Кэш	Общее	Temporary storage for frequently accessed data to speed up access.	Clear the browser cache to see the latest changes.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
59	Repository	[rɪˈpɒzɪtəri]	Репозиторий	Общее	A storage location for code, managed by version control.	Clone the repository to get a local copy of the project.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
60	API	[ˌeɪpiːˈaɪ]	Программный интерфейс	Общее	Application Programming Interface — a way for programs to communicate.	The mobile app calls the REST API to fetch data.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
61	Endpoint	[ˈendpɔɪnt]	Конечная точка	Общее	A specific URL where an API can be accessed.	POST /users is the endpoint for creating a new user.	basic	t	2026-05-13 07:21:46.531476	2026-05-13 07:21:46.531476
\.


--
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.achievements_id_seq', 26, true);


--
-- Name: assignment_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assignment_submissions_id_seq', 5, true);


--
-- Name: assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assignments_id_seq', 159, true);


--
-- Name: career_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.career_tests_id_seq', 2, true);


--
-- Name: circuit_solutions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.circuit_solutions_id_seq', 1, false);


--
-- Name: circuit_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.circuit_submissions_id_seq', 1, false);


--
-- Name: course_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.course_groups_id_seq', 19, true);


--
-- Name: course_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.course_materials_id_seq', 24, true);


--
-- Name: course_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.course_registrations_id_seq', 56, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.courses_id_seq', 7, true);


--
-- Name: elective_enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.elective_enrollments_id_seq', 2, true);


--
-- Name: electives_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.electives_id_seq', 11, true);


--
-- Name: forum_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.forum_posts_id_seq', 18, true);


--
-- Name: forum_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.forum_sections_id_seq', 4, true);


--
-- Name: forum_topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.forum_topics_id_seq', 6, true);


--
-- Name: hackathon_grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hackathon_grades_id_seq', 1, false);


--
-- Name: hackathon_stage_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hackathon_stage_submissions_id_seq', 2, true);


--
-- Name: hackathon_stages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hackathon_stages_id_seq', 5, true);


--
-- Name: hackathon_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hackathon_submissions_id_seq', 1, false);


--
-- Name: hackathon_task_grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hackathon_task_grades_id_seq', 1, false);


--
-- Name: hackathon_task_reviewers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hackathon_task_reviewers_id_seq', 1, false);


--
-- Name: hackathon_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hackathon_tasks_id_seq', 10, true);


--
-- Name: hackathon_team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hackathon_team_members_id_seq', 1, true);


--
-- Name: hackathon_teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hackathon_teams_id_seq', 1, true);


--
-- Name: hackathons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hackathons_id_seq', 2, true);


--
-- Name: internship_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.internship_applications_id_seq', 37, true);


--
-- Name: internship_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.internship_views_id_seq', 4, true);


--
-- Name: internships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.internships_id_seq', 61, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 126, true);


--
-- Name: olympiad_problems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.olympiad_problems_id_seq', 3, true);


--
-- Name: olympiad_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.olympiad_submissions_id_seq', 2, true);


--
-- Name: olympiads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.olympiads_id_seq', 3, true);


--
-- Name: peer_review_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.peer_review_sessions_id_seq', 2, true);


--
-- Name: peer_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.peer_reviews_id_seq', 6, true);


--
-- Name: professional_orientations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.professional_orientations_id_seq', 4, true);


--
-- Name: room_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.room_members_id_seq', 6, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rooms_id_seq', 5, true);


--
-- Name: schedule_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schedule_items_id_seq', 62, true);


--
-- Name: site_visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_visits_id_seq', 1437, true);


--
-- Name: user_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_achievements_id_seq', 112, true);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 110, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 74, true);


--
-- Name: vocab_terms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vocab_terms_id_seq', 61, true);


--
-- Name: schedule_items PK_035b2d214f67bd7ef775cb44ab1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_items
    ADD CONSTRAINT "PK_035b2d214f67bd7ef775cb44ab1" PRIMARY KEY (id);


--
-- Name: rooms PK_0368a2d7c215f2d0458a54933f2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY (id);


--
-- Name: internships PK_0a44e3c9dde1f2b92a4eb3c529f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT "PK_0a44e3c9dde1f2b92a4eb3c529f" PRIMARY KEY (id);


--
-- Name: assignment_submissions PK_0caedc49d0357bedac05ca5a806; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT "PK_0caedc49d0357bedac05ca5a806" PRIMARY KEY (id);


--
-- Name: hackathon_grades PK_13ec9a862dcac5cba9f27c1d643; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_grades
    ADD CONSTRAINT "PK_13ec9a862dcac5cba9f27c1d643" PRIMARY KEY (id);


--
-- Name: achievements PK_1bc19c37c6249f70186f318d71d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY (id);


--
-- Name: peer_reviews PK_2532078fca474d3c97e56a5bd19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT "PK_2532078fca474d3c97e56a5bd19" PRIMARY KEY (id);


--
-- Name: olympiad_submissions PK_2adbedb5b703fbe3ca79169e969; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiad_submissions
    ADD CONSTRAINT "PK_2adbedb5b703fbe3ca79169e969" PRIMARY KEY (id);


--
-- Name: peer_review_sessions PK_322bba6d1127eb59342e2362c5d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peer_review_sessions
    ADD CONSTRAINT "PK_322bba6d1127eb59342e2362c5d" PRIMARY KEY (id);


--
-- Name: site_visits PK_33b7e3823d02ff3218134f0a277; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_visits
    ADD CONSTRAINT "PK_33b7e3823d02ff3218134f0a277" PRIMARY KEY (id);


--
-- Name: circuit_solutions PK_34a0f404b9818a8a9401889cd04; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.circuit_solutions
    ADD CONSTRAINT "PK_34a0f404b9818a8a9401889cd04" PRIMARY KEY (id);


--
-- Name: circuit_element_types PK_3cdb855fa9e777fbbafeb0dc02a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.circuit_element_types
    ADD CONSTRAINT "PK_3cdb855fa9e777fbbafeb0dc02a" PRIMARY KEY (type);


--
-- Name: user_achievements PK_3d94aba7e9ed55365f68b5e77fa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "PK_3d94aba7e9ed55365f68b5e77fa" PRIMARY KEY (id);


--
-- Name: forum_posts PK_3e9c301114a0fd42c998681b04e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT "PK_3e9c301114a0fd42c998681b04e" PRIMARY KEY (id);


--
-- Name: courses PK_3f70a487cc718ad8eda4e6d58c9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY (id);


--
-- Name: room_members PK_4493fab0433f741b7cf842e6038; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_members
    ADD CONSTRAINT "PK_4493fab0433f741b7cf842e6038" PRIMARY KEY (id);


--
-- Name: internship_applications PK_44ff34aef5f553a222a2cb770fe; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship_applications
    ADD CONSTRAINT "PK_44ff34aef5f553a222a2cb770fe" PRIMARY KEY (id);


--
-- Name: elective_enrollments PK_599866b9a790885cc4d291b432d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elective_enrollments
    ADD CONSTRAINT "PK_599866b9a790885cc4d291b432d" PRIMARY KEY (id);


--
-- Name: olympiad_problems PK_5c839de074c011dc17632a6abed; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiad_problems
    ADD CONSTRAINT "PK_5c839de074c011dc17632a6abed" PRIMARY KEY (id);


--
-- Name: internship_views PK_5fdf3ffa9e879dfd04b67081bd7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship_views
    ADD CONSTRAINT "PK_5fdf3ffa9e879dfd04b67081bd7" PRIMARY KEY (id);


--
-- Name: hackathon_teams PK_698e891160d654b5763ff88c3a4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_teams
    ADD CONSTRAINT "PK_698e891160d654b5763ff88c3a4" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: hackathon_stages PK_6d07f0c7af00e448870328249ef; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_stages
    ADD CONSTRAINT "PK_6d07f0c7af00e448870328249ef" PRIMARY KEY (id);


--
-- Name: professional_orientations PK_73ffc94fb2ebecece2ba8492b67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professional_orientations
    ADD CONSTRAINT "PK_73ffc94fb2ebecece2ba8492b67" PRIMARY KEY (id);


--
-- Name: circuit_submissions PK_7861c16bb55e590107e2ea87979; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.circuit_submissions
    ADD CONSTRAINT "PK_7861c16bb55e590107e2ea87979" PRIMARY KEY (id);


--
-- Name: hackathon_task_reviewers PK_7d6a19548d2336cdd9e3f249155; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_reviewers
    ADD CONSTRAINT "PK_7d6a19548d2336cdd9e3f249155" PRIMARY KEY (id);


--
-- Name: hackathon_submissions PK_84e5597b2922c2d332b18dd61c3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_submissions
    ADD CONSTRAINT "PK_84e5597b2922c2d332b18dd61c3" PRIMARY KEY (id);


--
-- Name: user_roles PK_8acd5cf26ebd158416f477de799; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY (id);


--
-- Name: hackathon_task_grades PK_92939f3a94f238928c2253e8025; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_grades
    ADD CONSTRAINT "PK_92939f3a94f238928c2253e8025" PRIMARY KEY (id);


--
-- Name: hackathon_stage_submissions PK_9632fa63b130535d9d95be6bb01; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_stage_submissions
    ADD CONSTRAINT "PK_9632fa63b130535d9d95be6bb01" PRIMARY KEY (id);


--
-- Name: course_groups PK_9722c03add9ea0dca5c69447398; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_groups
    ADD CONSTRAINT "PK_9722c03add9ea0dca5c69447398" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: course_registrations PK_a8726b4f90ee73642e768e21ef0; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_registrations
    ADD CONSTRAINT "PK_a8726b4f90ee73642e768e21ef0" PRIMARY KEY (id);


--
-- Name: hackathons PK_b290177bd925b16bf35bf59961b; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathons
    ADD CONSTRAINT "PK_b290177bd925b16bf35bf59961b" PRIMARY KEY (id);


--
-- Name: hackathon_tasks PK_b6a226216c40d0def9c5ed4e835; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_tasks
    ADD CONSTRAINT "PK_b6a226216c40d0def9c5ed4e835" PRIMARY KEY (id);


--
-- Name: course_materials PK_b8d788301b7ea04c1cefc4bd2ca; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_materials
    ADD CONSTRAINT "PK_b8d788301b7ea04c1cefc4bd2ca" PRIMARY KEY (id);


--
-- Name: hackathon_team_members PK_bd4a1ee6e3aa5a16059ee0c327a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_team_members
    ADD CONSTRAINT "PK_bd4a1ee6e3aa5a16059ee0c327a" PRIMARY KEY (id);


--
-- Name: forum_topics PK_c3cfc62a16863804757504742b4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_topics
    ADD CONSTRAINT "PK_c3cfc62a16863804757504742b4" PRIMARY KEY (id);


--
-- Name: assignments PK_c54ca359535e0012b04dcbd80ee; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "PK_c54ca359535e0012b04dcbd80ee" PRIMARY KEY (id);


--
-- Name: forum_sections PK_c9325bcd3ec6be258eed84ca839; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_sections
    ADD CONSTRAINT "PK_c9325bcd3ec6be258eed84ca839" PRIMARY KEY (id);


--
-- Name: vocab_terms PK_df4df3fe57eab695b92b7568242; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vocab_terms
    ADD CONSTRAINT "PK_df4df3fe57eab695b92b7568242" PRIMARY KEY (id);


--
-- Name: olympiads PK_e769cf321c3bb81860f8db30c9d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiads
    ADD CONSTRAINT "PK_e769cf321c3bb81860f8db30c9d" PRIMARY KEY (id);


--
-- Name: career_tests PK_f4a7176713122ec8bf5074fdd01; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_tests
    ADD CONSTRAINT "PK_f4a7176713122ec8bf5074fdd01" PRIMARY KEY (id);


--
-- Name: electives PK_fdbd070acb971f9cad861aa293a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.electives
    ADD CONSTRAINT "PK_fdbd070acb971f9cad861aa293a" PRIMARY KEY (id);


--
-- Name: hackathon_stage_submissions UQ_311ae8e632d71696cc2fe2318d6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_stage_submissions
    ADD CONSTRAINT "UQ_311ae8e632d71696cc2fe2318d6" UNIQUE (stage_id, team_id);


--
-- Name: hackathon_task_reviewers UQ_4f3c0e3efab12b0cade4c09f04a; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_reviewers
    ADD CONSTRAINT "UQ_4f3c0e3efab12b0cade4c09f04a" UNIQUE (task_id, user_id);


--
-- Name: career_tests UQ_5d116d1dc8709e8ad75cebc4173; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_tests
    ADD CONSTRAINT "UQ_5d116d1dc8709e8ad75cebc4173" UNIQUE (type);


--
-- Name: hackathon_team_members UQ_79dc6cc4aa620b3ea7123a83c8c; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_team_members
    ADD CONSTRAINT "UQ_79dc6cc4aa620b3ea7123a83c8c" UNIQUE ("teamId", "userId");


--
-- Name: internship_applications UQ_7b35c07ab6ca856486d3a374f94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship_applications
    ADD CONSTRAINT "UQ_7b35c07ab6ca856486d3a374f94" UNIQUE ("userId", "internshipId");


--
-- Name: rooms UQ_8f569e8b851d66275352ede4bf2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT "UQ_8f569e8b851d66275352ede4bf2" UNIQUE ("inviteCode");


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: internship_views UQ_b780b880920f92160429377c1f2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship_views
    ADD CONSTRAINT "UQ_b780b880920f92160429377c1f2" UNIQUE ("userId", "internshipId");


--
-- Name: elective_enrollments UQ_ca6c53049643183a882a1e7daea; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elective_enrollments
    ADD CONSTRAINT "UQ_ca6c53049643183a882a1e7daea" UNIQUE ("electiveId", "userId");


--
-- Name: room_members UQ_d4ea360161fd5ff21a94ae9d8a6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_members
    ADD CONSTRAINT "UQ_d4ea360161fd5ff21a94ae9d8a6" UNIQUE (room_id, user_id);


--
-- Name: hackathon_task_grades UQ_e33f73347a0b5d78b9134c0b39f; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_grades
    ADD CONSTRAINT "UQ_e33f73347a0b5d78b9134c0b39f" UNIQUE (task_id, team_id, reviewer_id);


--
-- Name: peer_reviews UQ_ea76c408d8de293962bb935575e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT "UQ_ea76c408d8de293962bb935575e" UNIQUE ("reviewerId", "submissionId");


--
-- Name: course_registrations UQ_f5159b7f0fa5473ef6b91597263; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_registrations
    ADD CONSTRAINT "UQ_f5159b7f0fa5473ef6b91597263" UNIQUE ("userId", "courseGroupId");


--
-- Name: IDX_2bfbe5441b458f6bf2e7eabf65; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_2bfbe5441b458f6bf2e7eabf65" ON public.site_visits USING btree ("userId");


--
-- Name: IDX_692a909ee0fa9383e7859f9b40; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_692a909ee0fa9383e7859f9b40" ON public.notifications USING btree ("userId");


--
-- Name: IDX_8204e73c6913d43e85434d1252; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_8204e73c6913d43e85434d1252" ON public.site_visits USING btree ("visitedAt");


--
-- Name: IDX_ed528548f4d36f81efbaaacff8; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_ed528548f4d36f81efbaaacff8" ON public.site_visits USING btree (path);


--
-- Name: forum_topics FK_006898061c2e0db9181ff28edc3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_topics
    ADD CONSTRAINT "FK_006898061c2e0db9181ff28edc3" FOREIGN KEY ("sectionId") REFERENCES public.forum_sections(id) ON DELETE CASCADE;


--
-- Name: peer_reviews FK_05fe25ed8b62ec86b08b2aad491; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT "FK_05fe25ed8b62ec86b08b2aad491" FOREIGN KEY ("submissionId") REFERENCES public.assignment_submissions(id);


--
-- Name: circuit_solutions FK_0743c23c16f3a993f6fc277b20a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.circuit_solutions
    ADD CONSTRAINT "FK_0743c23c16f3a993f6fc277b20a" FOREIGN KEY ("assignmentId") REFERENCES public.assignments(id);


--
-- Name: peer_reviews FK_07c9f6b29a8b8db324223eb558f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT "FK_07c9f6b29a8b8db324223eb558f" FOREIGN KEY ("reviewerId") REFERENCES public.users(id);


--
-- Name: forum_sections FK_0c4e9cbc4e10fce00550edd6800; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_sections
    ADD CONSTRAINT "FK_0c4e9cbc4e10fce00550edd6800" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: olympiads FK_112260651a59744778cfc676269; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiads
    ADD CONSTRAINT "FK_112260651a59744778cfc676269" FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL;


--
-- Name: hackathons FK_115d426b9f65d2134bbaee6e6cd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathons
    ADD CONSTRAINT "FK_115d426b9f65d2134bbaee6e6cd" FOREIGN KEY ("courseId") REFERENCES public.courses(id);


--
-- Name: forum_posts FK_151dff45f01c0c195022e7db127; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT "FK_151dff45f01c0c195022e7db127" FOREIGN KEY ("authorId") REFERENCES public.users(id);


--
-- Name: assignment_submissions FK_16c8e730e6a93035772cf97ed25; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT "FK_16c8e730e6a93035772cf97ed25" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: internship_applications FK_29ee4775294094c41f9cb0c51df; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship_applications
    ADD CONSTRAINT "FK_29ee4775294094c41f9cb0c51df" FOREIGN KEY ("internshipId") REFERENCES public.internships(id) ON DELETE CASCADE;


--
-- Name: user_achievements FK_3ac6bc9da3e8a56f3f7082012dd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "FK_3ac6bc9da3e8a56f3f7082012dd" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: olympiad_submissions FK_3d27aa4c2d27ca1ebc294f34f6f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiad_submissions
    ADD CONSTRAINT "FK_3d27aa4c2d27ca1ebc294f34f6f" FOREIGN KEY (problem_id) REFERENCES public.olympiad_problems(id) ON DELETE CASCADE;


--
-- Name: hackathon_teams FK_3d34425206302ad8c68e5df9d29; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_teams
    ADD CONSTRAINT "FK_3d34425206302ad8c68e5df9d29" FOREIGN KEY ("hackathonId") REFERENCES public.hackathons(id);


--
-- Name: hackathon_grades FK_3f9f0337ea289cd5f890a861851; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_grades
    ADD CONSTRAINT "FK_3f9f0337ea289cd5f890a861851" FOREIGN KEY ("judgeId") REFERENCES public.users(id);


--
-- Name: hackathon_task_grades FK_42ed05a46cb9d0b6e9bc462f4ee; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_grades
    ADD CONSTRAINT "FK_42ed05a46cb9d0b6e9bc462f4ee" FOREIGN KEY (team_id) REFERENCES public.hackathon_teams(id) ON DELETE CASCADE;


--
-- Name: electives FK_46b963ed3907db0bc60da37dff5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.electives
    ADD CONSTRAINT "FK_46b963ed3907db0bc60da37dff5" FOREIGN KEY ("instructorId") REFERENCES public.users(id);


--
-- Name: peer_review_sessions FK_47f7788fd8eb676f2b56a3d200a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peer_review_sessions
    ADD CONSTRAINT "FK_47f7788fd8eb676f2b56a3d200a" FOREIGN KEY ("assignmentId") REFERENCES public.assignments(id);


--
-- Name: circuit_submissions FK_4804f5d41db7f3ca62293024d08; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.circuit_submissions
    ADD CONSTRAINT "FK_4804f5d41db7f3ca62293024d08" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: circuit_submissions FK_4d9b81de61eb5807fdf3fd80e20; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.circuit_submissions
    ADD CONSTRAINT "FK_4d9b81de61eb5807fdf3fd80e20" FOREIGN KEY ("assignmentId") REFERENCES public.assignments(id) ON DELETE CASCADE;


--
-- Name: hackathon_grades FK_4e37a131f36738cb52b4f49dcd9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_grades
    ADD CONSTRAINT "FK_4e37a131f36738cb52b4f49dcd9" FOREIGN KEY ("submissionId") REFERENCES public.hackathon_submissions(id);


--
-- Name: hackathon_stage_submissions FK_53a7cde3f3ecc50ac9f5e7758f8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_stage_submissions
    ADD CONSTRAINT "FK_53a7cde3f3ecc50ac9f5e7758f8" FOREIGN KEY (team_id) REFERENCES public.hackathon_teams(id) ON DELETE CASCADE;


--
-- Name: hackathon_task_grades FK_548ff8abfe477f463e93f80d9ae; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_grades
    ADD CONSTRAINT "FK_548ff8abfe477f463e93f80d9ae" FOREIGN KEY (task_id) REFERENCES public.hackathon_tasks(id) ON DELETE CASCADE;


--
-- Name: hackathon_task_grades FK_570a614361497922cbe3049df93; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_grades
    ADD CONSTRAINT "FK_570a614361497922cbe3049df93" FOREIGN KEY (reviewer_id) REFERENCES public.users(id);


--
-- Name: hackathon_teams FK_58201dc448757f1b9a19ae9fdeb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_teams
    ADD CONSTRAINT "FK_58201dc448757f1b9a19ae9fdeb" FOREIGN KEY ("leaderId") REFERENCES public.users(id);


--
-- Name: olympiad_problems FK_5a59b3933d0a6a8c4987c0a8ca6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiad_problems
    ADD CONSTRAINT "FK_5a59b3933d0a6a8c4987c0a8ca6" FOREIGN KEY (olympiad_id) REFERENCES public.olympiads(id) ON DELETE CASCADE;


--
-- Name: electives FK_5fae0b7207643a536e80450feeb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.electives
    ADD CONSTRAINT "FK_5fae0b7207643a536e80450feeb" FOREIGN KEY ("courseGroupId") REFERENCES public.course_groups(id);


--
-- Name: course_registrations FK_66c60a13fcc02be5951f1d97659; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_registrations
    ADD CONSTRAINT "FK_66c60a13fcc02be5951f1d97659" FOREIGN KEY ("courseGroupId") REFERENCES public.course_groups(id);


--
-- Name: user_achievements FK_6a5a5816f54d0044ba5f3dc2b74; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "FK_6a5a5816f54d0044ba5f3dc2b74" FOREIGN KEY ("achievementId") REFERENCES public.achievements(id);


--
-- Name: assignment_submissions FK_6e8a68594fde52f61876a40489c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT "FK_6e8a68594fde52f61876a40489c" FOREIGN KEY ("assignmentId") REFERENCES public.assignments(id);


--
-- Name: olympiad_submissions FK_73fe6c1b19117880b1e422205d9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiad_submissions
    ADD CONSTRAINT "FK_73fe6c1b19117880b1e422205d9" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: olympiad_submissions FK_7fa1e70b26f7d5767cfdd561b42; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.olympiad_submissions
    ADD CONSTRAINT "FK_7fa1e70b26f7d5767cfdd561b42" FOREIGN KEY (olympiad_id) REFERENCES public.olympiads(id) ON DELETE CASCADE;


--
-- Name: hackathon_submissions FK_84c04b0ced793ee64e02d3fb753; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_submissions
    ADD CONSTRAINT "FK_84c04b0ced793ee64e02d3fb753" FOREIGN KEY ("teamId") REFERENCES public.hackathon_teams(id);


--
-- Name: user_roles FK_87b8888186ca9769c960e926870; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: assignments FK_8e5a2e9380222968b7b88a2751c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "FK_8e5a2e9380222968b7b88a2751c" FOREIGN KEY ("courseGroupId") REFERENCES public.course_groups(id);


--
-- Name: hackathon_task_reviewers FK_8e8f1b6396d99ed8c6652c8bcc6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_reviewers
    ADD CONSTRAINT "FK_8e8f1b6396d99ed8c6652c8bcc6" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: professional_orientations FK_96cc8da75732c415bcfc07299da; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professional_orientations
    ADD CONSTRAINT "FK_96cc8da75732c415bcfc07299da" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: rooms FK_9f38c339cb7a6e33b02f9d2c743; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT "FK_9f38c339cb7a6e33b02f9d2c743" FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: hackathon_team_members FK_9f3e1e47610486f6ea3e488ef44; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_team_members
    ADD CONSTRAINT "FK_9f3e1e47610486f6ea3e488ef44" FOREIGN KEY ("teamId") REFERENCES public.hackathon_teams(id);


--
-- Name: peer_review_sessions FK_a3bd4e9c1bca59d362b8fce43c9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peer_review_sessions
    ADD CONSTRAINT "FK_a3bd4e9c1bca59d362b8fce43c9" FOREIGN KEY ("courseGroupId") REFERENCES public.course_groups(id);


--
-- Name: schedule_items FK_a58fa25de0601dc5b5471f1e8ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_items
    ADD CONSTRAINT "FK_a58fa25de0601dc5b5471f1e8ce" FOREIGN KEY ("instructorId") REFERENCES public.users(id);


--
-- Name: internship_views FK_a80149e7da5ad21a1f3398518ff; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship_views
    ADD CONSTRAINT "FK_a80149e7da5ad21a1f3398518ff" FOREIGN KEY ("internshipId") REFERENCES public.internships(id) ON DELETE CASCADE;


--
-- Name: course_materials FK_ace3ef4157ae10a215848945a36; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_materials
    ADD CONSTRAINT "FK_ace3ef4157ae10a215848945a36" FOREIGN KEY ("courseId") REFERENCES public.courses(id);


--
-- Name: schedule_items FK_acee6be562046e2928aec54247d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_items
    ADD CONSTRAINT "FK_acee6be562046e2928aec54247d" FOREIGN KEY ("courseGroupId") REFERENCES public.course_groups(id);


--
-- Name: room_members FK_b2d15baf5b46ed9659bd71fbb43; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_members
    ADD CONSTRAINT "FK_b2d15baf5b46ed9659bd71fbb43" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: course_groups FK_b6ec3d0cce75665e56432841b22; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_groups
    ADD CONSTRAINT "FK_b6ec3d0cce75665e56432841b22" FOREIGN KEY ("courseId") REFERENCES public.courses(id);


--
-- Name: internship_applications FK_b80d0deb281c61086e387b2816f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship_applications
    ADD CONSTRAINT "FK_b80d0deb281c61086e387b2816f" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: internship_views FK_b924ce8e3b048a5694d9e21e48e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship_views
    ADD CONSTRAINT "FK_b924ce8e3b048a5694d9e21e48e" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: course_registrations FK_bf1afb5a5857b9810ad3ea71c84; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_registrations
    ADD CONSTRAINT "FK_bf1afb5a5857b9810ad3ea71c84" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: hackathon_stage_submissions FK_c15ab2aabe60e83d66cb1463f1e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_stage_submissions
    ADD CONSTRAINT "FK_c15ab2aabe60e83d66cb1463f1e" FOREIGN KEY (stage_id) REFERENCES public.hackathon_stages(id) ON DELETE CASCADE;


--
-- Name: forum_topics FK_c228733246cf2aee0240663b354; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_topics
    ADD CONSTRAINT "FK_c228733246cf2aee0240663b354" FOREIGN KEY ("authorId") REFERENCES public.users(id);


--
-- Name: course_materials FK_c72fda5c18f31710e7decde8bc3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_materials
    ADD CONSTRAINT "FK_c72fda5c18f31710e7decde8bc3" FOREIGN KEY ("uploadedById") REFERENCES public.users(id);


--
-- Name: hackathon_stages FK_c89a65634b562b01aef96500655; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_stages
    ADD CONSTRAINT "FK_c89a65634b562b01aef96500655" FOREIGN KEY ("hackathonId") REFERENCES public.hackathons(id) ON DELETE CASCADE;


--
-- Name: elective_enrollments FK_d9a49b68b8efd665c684aca4502; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elective_enrollments
    ADD CONSTRAINT "FK_d9a49b68b8efd665c684aca4502" FOREIGN KEY ("electiveId") REFERENCES public.electives(id);


--
-- Name: hackathon_team_members FK_e45fdd0fbab67920df74ced447b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_team_members
    ADD CONSTRAINT "FK_e45fdd0fbab67920df74ced447b" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: room_members FK_e6cf45f179a524427ddf8bacd8e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room_members
    ADD CONSTRAINT "FK_e6cf45f179a524427ddf8bacd8e" FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: hackathon_tasks FK_e919a3ff3c25dbcf11cfe296409; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_tasks
    ADD CONSTRAINT "FK_e919a3ff3c25dbcf11cfe296409" FOREIGN KEY ("stageId") REFERENCES public.hackathon_stages(id) ON DELETE CASCADE;


--
-- Name: elective_enrollments FK_ec656ea5c5aac6f3bfd8906774f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elective_enrollments
    ADD CONSTRAINT "FK_ec656ea5c5aac6f3bfd8906774f" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: forum_posts FK_ee11320a399813b9ee190a6b135; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT "FK_ee11320a399813b9ee190a6b135" FOREIGN KEY ("topicId") REFERENCES public.forum_topics(id) ON DELETE CASCADE;


--
-- Name: hackathon_task_reviewers FK_faba44ce3222be5ec9a4fa7ad40; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hackathon_task_reviewers
    ADD CONSTRAINT "FK_faba44ce3222be5ec9a4fa7ad40" FOREIGN KEY (task_id) REFERENCES public.hackathon_tasks(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict odKV5GH2jb9zNFxgS55qLitvoVQN1X9irdVmLFCdLVHTSzEua8v2N2yQxq03V0x


--
-- Тестовая учётная запись администратора для проверки развёртывания
-- email: test_admin@asoi.edu / пароль: Demo1234!
--

INSERT INTO public.users (email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
VALUES ('test_admin@asoi.edu', '$2b$12$Ev/MaV9QgoXsskgeiIsUz.X1vxGOUfbihdGTppzXukRiZGmeiwE5m', 'Тест', 'Админ', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM public.users WHERE email = 'test_admin@asoi.edu';
