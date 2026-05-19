--
-- PostgreSQL database dump
--

\restrict ZXAWGJmQQNIpOlf8A54g0H5Q2HejxL0liwmFggVYldl6EVemvu0OeGOZjHenMFy

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.14 (Debian 15.14-1.pgdg13+1)

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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: achievements_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.achievements_type_enum AS ENUM (
    'course_completion',
    'assignment_excellence',
    'peer_reviewer',
    'forum_contributor',
    'early_bird',
    'perfect_score',
    'hackathon_winner',
    'olympiad_winner'
);


ALTER TYPE public.achievements_type_enum OWNER TO postgres;

--
-- Name: assignment_submissions_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assignment_submissions_status_enum AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'reviewed',
    'graded'
);


ALTER TYPE public.assignment_submissions_status_enum OWNER TO postgres;

--
-- Name: assignments_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assignments_type_enum AS ENUM (
    'lecture',
    'practice',
    'test',
    'hackathon',
    'olympiad',
    'facultative'
);


ALTER TYPE public.assignments_type_enum OWNER TO postgres;

--
-- Name: course_materials_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.course_materials_type_enum AS ENUM (
    'lecture_slides',
    'video',
    'document',
    'code_example',
    'project_template',
    'reference'
);


ALTER TYPE public.course_materials_type_enum OWNER TO postgres;

--
-- Name: course_registrations_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.course_registrations_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.course_registrations_status_enum OWNER TO postgres;

--
-- Name: courses_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.courses_type_enum AS ENUM (
    'english',
    'electronics',
    'computer_science',
    'iot'
);


ALTER TYPE public.courses_type_enum OWNER TO postgres;

--
-- Name: schedule_items_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.schedule_items_type_enum AS ENUM (
    'lecture',
    'practice',
    'test',
    'hackathon',
    'olympiad',
    'facultative',
    'internship'
);


ALTER TYPE public.schedule_items_type_enum OWNER TO postgres;

--
-- Name: user_roles_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_roles_role_enum AS ENUM (
    'registered_user',
    'student',
    'mentor',
    'admin'
);


ALTER TYPE public.user_roles_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.achievements OWNER TO postgres;

--
-- Name: achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.achievements_id_seq OWNER TO postgres;

--
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- Name: assignment_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignment_submissions (
    id integer NOT NULL,
    content text NOT NULL,
    attachments json,
    status public.assignment_submissions_status_enum DEFAULT 'draft'::public.assignment_submissions_status_enum NOT NULL,
    "submittedAt" timestamp without time zone,
    "finalScore" integer,
    "mentorFeedback" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer NOT NULL,
    "assignmentId" integer NOT NULL
);


ALTER TABLE public.assignment_submissions OWNER TO postgres;

--
-- Name: assignment_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignment_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assignment_submissions_id_seq OWNER TO postgres;

--
-- Name: assignment_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignment_submissions_id_seq OWNED BY public.assignment_submissions.id;


--
-- Name: assignments; Type: TABLE; Schema: public; Owner: postgres
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
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "courseGroupId" integer NOT NULL,
    "testCases" json
);


ALTER TABLE public.assignments OWNER TO postgres;

--
-- Name: assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assignments_id_seq OWNER TO postgres;

--
-- Name: assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;


--
-- Name: circuit_element_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.circuit_element_types (
    type character varying NOT NULL,
    metadata json NOT NULL
);


ALTER TABLE public.circuit_element_types OWNER TO postgres;

--
-- Name: circuit_solutions; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.circuit_solutions OWNER TO postgres;

--
-- Name: circuit_solutions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.circuit_solutions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.circuit_solutions_id_seq OWNER TO postgres;

--
-- Name: circuit_solutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.circuit_solutions_id_seq OWNED BY public.circuit_solutions.id;


--
-- Name: circuit_submissions; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.circuit_submissions OWNER TO postgres;

--
-- Name: circuit_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.circuit_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.circuit_submissions_id_seq OWNER TO postgres;

--
-- Name: circuit_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.circuit_submissions_id_seq OWNED BY public.circuit_submissions.id;


--
-- Name: course_groups; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.course_groups OWNER TO postgres;

--
-- Name: course_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.course_groups_id_seq OWNER TO postgres;

--
-- Name: course_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_groups_id_seq OWNED BY public.course_groups.id;


--
-- Name: course_materials; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.course_materials OWNER TO postgres;

--
-- Name: course_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.course_materials_id_seq OWNER TO postgres;

--
-- Name: course_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_materials_id_seq OWNED BY public.course_materials.id;


--
-- Name: course_registrations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.course_registrations OWNER TO postgres;

--
-- Name: course_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.course_registrations_id_seq OWNER TO postgres;

--
-- Name: course_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_registrations_id_seq OWNED BY public.course_registrations.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.courses_id_seq OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: forum_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_posts (
    id integer NOT NULL,
    content text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "topicId" integer NOT NULL,
    "authorId" integer NOT NULL,
    "parentPostId" integer
);


ALTER TABLE public.forum_posts OWNER TO postgres;

--
-- Name: forum_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forum_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forum_posts_id_seq OWNER TO postgres;

--
-- Name: forum_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forum_posts_id_seq OWNED BY public.forum_posts.id;


--
-- Name: forum_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_sections (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "topicCount" integer DEFAULT 0 NOT NULL,
    "postCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "courseId" integer NOT NULL
);


ALTER TABLE public.forum_sections OWNER TO postgres;

--
-- Name: forum_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forum_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forum_sections_id_seq OWNER TO postgres;

--
-- Name: forum_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forum_sections_id_seq OWNED BY public.forum_sections.id;


--
-- Name: forum_topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_topics (
    id integer NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL,
    "isLocked" boolean DEFAULT false NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "postCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "sectionId" integer NOT NULL,
    "authorId" integer NOT NULL,
    "lastPostAt" timestamp without time zone,
    "lastPostById" integer
);


ALTER TABLE public.forum_topics OWNER TO postgres;

--
-- Name: forum_topics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forum_topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forum_topics_id_seq OWNER TO postgres;

--
-- Name: forum_topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forum_topics_id_seq OWNED BY public.forum_topics.id;


--
-- Name: hackathon_grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hackathon_grades (
    id integer NOT NULL,
    "projectId" integer NOT NULL,
    "juryId" integer NOT NULL,
    "innovationScore" numeric(5,2) NOT NULL,
    "technicalScore" numeric(5,2) NOT NULL,
    "presentationScore" numeric(5,2) NOT NULL,
    "usabilityScore" numeric(5,2) NOT NULL,
    comment text,
    "gradedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hackathon_grades OWNER TO postgres;

--
-- Name: hackathon_grades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hackathon_grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hackathon_grades_id_seq OWNER TO postgres;

--
-- Name: hackathon_grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hackathon_grades_id_seq OWNED BY public.hackathon_grades.id;


--
-- Name: hackathon_jury; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hackathon_jury (
    id integer NOT NULL,
    "hackathonId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public.hackathon_jury OWNER TO postgres;

--
-- Name: hackathon_jury_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hackathon_jury_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hackathon_jury_id_seq OWNER TO postgres;

--
-- Name: hackathon_jury_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hackathon_jury_id_seq OWNED BY public.hackathon_jury.id;


--
-- Name: hackathon_projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hackathon_projects (
    id integer NOT NULL,
    "teamId" integer NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    "repositoryUrl" character varying,
    "presentationUrl" character varying,
    "demoUrl" character varying,
    "isSubmitted" boolean DEFAULT false NOT NULL,
    "submittedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hackathon_projects OWNER TO postgres;

--
-- Name: hackathon_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hackathon_projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hackathon_projects_id_seq OWNER TO postgres;

--
-- Name: hackathon_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hackathon_projects_id_seq OWNED BY public.hackathon_projects.id;


--
-- Name: hackathon_team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hackathon_team_members (
    id integer NOT NULL,
    "teamId" integer NOT NULL,
    "userId" integer NOT NULL,
    role character varying DEFAULT 'member'::character varying NOT NULL,
    "joinedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hackathon_team_members OWNER TO postgres;

--
-- Name: hackathon_team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hackathon_team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hackathon_team_members_id_seq OWNER TO postgres;

--
-- Name: hackathon_team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hackathon_team_members_id_seq OWNED BY public.hackathon_team_members.id;


--
-- Name: hackathon_teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hackathon_teams (
    id integer NOT NULL,
    name character varying NOT NULL,
    "joinCode" character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    "rejectionReason" text,
    "hackathonId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hackathon_teams OWNER TO postgres;

--
-- Name: hackathon_teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hackathon_teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hackathon_teams_id_seq OWNER TO postgres;

--
-- Name: hackathon_teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hackathon_teams_id_seq OWNED BY public.hackathon_teams.id;


--
-- Name: hackathons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hackathons (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    rules text,
    "maxTeamSize" integer DEFAULT 5 NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hackathons OWNER TO postgres;

--
-- Name: hackathons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hackathons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hackathons_id_seq OWNER TO postgres;

--
-- Name: hackathons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hackathons_id_seq OWNED BY public.hackathons.id;


--
-- Name: peer_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.peer_reviews (
    id integer NOT NULL,
    score integer NOT NULL,
    feedback text NOT NULL,
    "isMentorReview" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "submissionId" integer NOT NULL,
    "reviewerId" integer NOT NULL
);


ALTER TABLE public.peer_reviews OWNER TO postgres;

--
-- Name: peer_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.peer_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.peer_reviews_id_seq OWNER TO postgres;

--
-- Name: peer_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.peer_reviews_id_seq OWNED BY public.peer_reviews.id;


--
-- Name: professional_orientations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professional_orientations (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "testResult" json DEFAULT '{}'::json NOT NULL,
    "recommendedProfession" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.professional_orientations OWNER TO postgres;

--
-- Name: professional_orientations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.professional_orientations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.professional_orientations_id_seq OWNER TO postgres;

--
-- Name: professional_orientations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professional_orientations_id_seq OWNED BY public.professional_orientations.id;


--
-- Name: schedule_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule_items (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    type public.schedule_items_type_enum NOT NULL,
    "startTime" timestamp without time zone NOT NULL,
    "endTime" timestamp without time zone NOT NULL,
    location character varying DEFAULT 'online'::character varying NOT NULL,
    "meetingUrl" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "courseGroupId" integer NOT NULL,
    "instructorId" integer
);


ALTER TABLE public.schedule_items OWNER TO postgres;

--
-- Name: schedule_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.schedule_items_id_seq OWNER TO postgres;

--
-- Name: schedule_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_items_id_seq OWNED BY public.schedule_items.id;


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_achievements (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "achievementId" integer NOT NULL,
    "earnedAt" timestamp without time zone DEFAULT now() NOT NULL,
    metadata json
);


ALTER TABLE public.user_achievements OWNER TO postgres;

--
-- Name: user_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_achievements_id_seq OWNER TO postgres;

--
-- Name: user_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_achievements_id_seq OWNED BY public.user_achievements.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    role public.user_roles_role_enum DEFAULT 'registered_user'::public.user_roles_role_enum NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_roles_id_seq OWNER TO postgres;

--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    avatar character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- Name: assignment_submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions ALTER COLUMN id SET DEFAULT nextval('public.assignment_submissions_id_seq'::regclass);


--
-- Name: assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);


--
-- Name: circuit_solutions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.circuit_solutions ALTER COLUMN id SET DEFAULT nextval('public.circuit_solutions_id_seq'::regclass);


--
-- Name: circuit_submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.circuit_submissions ALTER COLUMN id SET DEFAULT nextval('public.circuit_submissions_id_seq'::regclass);


--
-- Name: course_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_groups ALTER COLUMN id SET DEFAULT nextval('public.course_groups_id_seq'::regclass);


--
-- Name: course_materials id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_materials ALTER COLUMN id SET DEFAULT nextval('public.course_materials_id_seq'::regclass);


--
-- Name: course_registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_registrations ALTER COLUMN id SET DEFAULT nextval('public.course_registrations_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: forum_posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_posts ALTER COLUMN id SET DEFAULT nextval('public.forum_posts_id_seq'::regclass);


--
-- Name: forum_sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_sections ALTER COLUMN id SET DEFAULT nextval('public.forum_sections_id_seq'::regclass);


--
-- Name: forum_topics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_topics ALTER COLUMN id SET DEFAULT nextval('public.forum_topics_id_seq'::regclass);


--
-- Name: hackathon_grades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_grades ALTER COLUMN id SET DEFAULT nextval('public.hackathon_grades_id_seq'::regclass);


--
-- Name: hackathon_jury id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_jury ALTER COLUMN id SET DEFAULT nextval('public.hackathon_jury_id_seq'::regclass);


--
-- Name: hackathon_projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_projects ALTER COLUMN id SET DEFAULT nextval('public.hackathon_projects_id_seq'::regclass);


--
-- Name: hackathon_team_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_team_members ALTER COLUMN id SET DEFAULT nextval('public.hackathon_team_members_id_seq'::regclass);


--
-- Name: hackathon_teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_teams ALTER COLUMN id SET DEFAULT nextval('public.hackathon_teams_id_seq'::regclass);


--
-- Name: hackathons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathons ALTER COLUMN id SET DEFAULT nextval('public.hackathons_id_seq'::regclass);


--
-- Name: peer_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peer_reviews ALTER COLUMN id SET DEFAULT nextval('public.peer_reviews_id_seq'::regclass);


--
-- Name: professional_orientations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_orientations ALTER COLUMN id SET DEFAULT nextval('public.professional_orientations_id_seq'::regclass);


--
-- Name: schedule_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_items ALTER COLUMN id SET DEFAULT nextval('public.schedule_items_id_seq'::regclass);


--
-- Name: user_achievements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements ALTER COLUMN id SET DEFAULT nextval('public.user_achievements_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.achievements (id, name, description, type, icon, points, conditions, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: assignment_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignment_submissions (id, content, attachments, status, "submittedAt", "finalScore", "mentorFeedback", "createdAt", "userId", "assignmentId") FROM stdin;
\.


--
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignments (id, title, description, type, requirements, "maxScore", deadline, "isActive", "createdAt", "updatedAt", "courseGroupId", "testCases") FROM stdin;
\.


--
-- Data for Name: circuit_element_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.circuit_element_types (type, metadata) FROM stdin;
\.


--
-- Data for Name: circuit_solutions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.circuit_solutions (id, "circuitData", "simulationResults", score, "maxScore", feedback, "submittedAt", "assignmentId") FROM stdin;
\.


--
-- Data for Name: circuit_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.circuit_submissions (id, "circuitData", score, "maxScore", feedback, "isPassed", submitted_at, "assignmentId", "userId") FROM stdin;
\.


--
-- Data for Name: course_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_groups (id, name, year, semester, "maxStudents", "isActive", "startDate", "endDate", "createdAt", "updatedAt", "courseId") FROM stdin;
\.


--
-- Data for Name: course_materials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_materials (id, title, description, type, "fileUrl", "thumbnailUrl", "isPublic", "createdAt", "updatedAt", "courseId", "uploadedById") FROM stdin;
\.


--
-- Data for Name: course_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_registrations (id, "userId", "courseGroupId", status, "registeredAt", "approvedAt", "approvedBy") FROM stdin;
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, name, type, description, duration, "isActive", "imageUrl", "createdAt", "updatedAt") FROM stdin;
1	Основы электроники	electronics	Изучение базовых принципов электроники и схемотехники	36	t	https://avatars.mds.yandex.net/i?id=f545a94d2033dd4cf5fc097f83db55c4e3ede798-4360605-images-thumbs&n=13	2025-11-21 18:18:42.709123	2025-11-21 18:18:42.709123
2	Программирование на Python	computer_science	Основы программирования на языке Python	48	t	https://avatars.mds.yandex.net/i?id=996901c0d05afc1ac67a5cdfc9c3556f789cc47d-5425024-images-thumbs&n=13	2025-11-21 18:19:28.140585	2025-11-21 18:19:28.140585
3	Английский для IT	english	Технический английский для IT-специалистов	24	t	https://avatars.mds.yandex.net/i?id=45e80cbeb1509b53dd7ac68dd7b39b0cae625438-5234000-images-thumbs&n=13	2025-11-21 18:20:16.248977	2025-11-21 18:20:16.248977
\.


--
-- Data for Name: forum_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forum_posts (id, content, "isActive", "createdAt", "updatedAt", "topicId", "authorId", "parentPostId") FROM stdin;
\.


--
-- Data for Name: forum_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forum_sections (id, name, description, "isActive", "topicCount", "postCount", "createdAt", "updatedAt", "courseId") FROM stdin;
\.


--
-- Data for Name: forum_topics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forum_topics (id, title, content, "isActive", "isPinned", "isLocked", "viewCount", "postCount", "createdAt", "updatedAt", "sectionId", "authorId", "lastPostAt", "lastPostById") FROM stdin;
\.


--
-- Data for Name: hackathon_grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hackathon_grades (id, "projectId", "juryId", "innovationScore", "technicalScore", "presentationScore", "usabilityScore", comment, "gradedAt") FROM stdin;
\.


--
-- Data for Name: hackathon_jury; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hackathon_jury (id, "hackathonId", "userId") FROM stdin;
\.


--
-- Data for Name: hackathon_projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hackathon_projects (id, "teamId", name, description, "repositoryUrl", "presentationUrl", "demoUrl", "isSubmitted", "submittedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: hackathon_team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hackathon_team_members (id, "teamId", "userId", role, "joinedAt") FROM stdin;
\.


--
-- Data for Name: hackathon_teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hackathon_teams (id, name, "joinCode", status, "rejectionReason", "hackathonId", "createdAt") FROM stdin;
\.


--
-- Data for Name: hackathons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hackathons (id, name, description, "startDate", "endDate", rules, "maxTeamSize", "isPublic", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: peer_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.peer_reviews (id, score, feedback, "isMentorReview", "createdAt", "submissionId", "reviewerId") FROM stdin;
\.


--
-- Data for Name: professional_orientations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professional_orientations (id, "userId", "testResult", "recommendedProfession", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: schedule_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_items (id, title, description, type, "startTime", "endTime", location, "meetingUrl", "createdAt", "updatedAt", "courseGroupId", "instructorId") FROM stdin;
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_achievements (id, "userId", "achievementId", "earnedAt", metadata) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, user_id, role) FROM stdin;
1	1	registered_user
2	1	admin
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, "firstName", "lastName", avatar, "isActive", "createdAt", "updatedAt") FROM stdin;
1	admin@gmail.com	$2b$12$1xdFDPT/f0RyFCHIHk.GJelzup1PdvN8pmYcqMccuIMCmQIAB2LE2	admin	admin	\N	t	2025-11-21 18:16:26.092842	2025-11-21 18:16:26.092842
\.


--
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.achievements_id_seq', 1, false);


--
-- Name: assignment_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignment_submissions_id_seq', 1, false);


--
-- Name: assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignments_id_seq', 1, false);


--
-- Name: circuit_solutions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.circuit_solutions_id_seq', 1, false);


--
-- Name: circuit_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.circuit_submissions_id_seq', 1, false);


--
-- Name: course_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_groups_id_seq', 1, false);


--
-- Name: course_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_materials_id_seq', 1, false);


--
-- Name: course_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.course_registrations_id_seq', 1, false);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 3, true);


--
-- Name: forum_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.forum_posts_id_seq', 1, false);


--
-- Name: forum_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.forum_sections_id_seq', 1, false);


--
-- Name: forum_topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.forum_topics_id_seq', 1, false);


--
-- Name: hackathon_grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hackathon_grades_id_seq', 1, false);


--
-- Name: hackathon_jury_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hackathon_jury_id_seq', 1, false);


--
-- Name: hackathon_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hackathon_projects_id_seq', 1, false);


--
-- Name: hackathon_team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hackathon_team_members_id_seq', 1, false);


--
-- Name: hackathon_teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hackathon_teams_id_seq', 1, false);


--
-- Name: hackathons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hackathons_id_seq', 1, false);


--
-- Name: peer_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.peer_reviews_id_seq', 1, false);


--
-- Name: professional_orientations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.professional_orientations_id_seq', 1, false);


--
-- Name: schedule_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_items_id_seq', 1, false);


--
-- Name: user_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_achievements_id_seq', 1, false);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: schedule_items PK_035b2d214f67bd7ef775cb44ab1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_items
    ADD CONSTRAINT "PK_035b2d214f67bd7ef775cb44ab1" PRIMARY KEY (id);


--
-- Name: assignment_submissions PK_0caedc49d0357bedac05ca5a806; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT "PK_0caedc49d0357bedac05ca5a806" PRIMARY KEY (id);


--
-- Name: hackathon_grades PK_13ec9a862dcac5cba9f27c1d643; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_grades
    ADD CONSTRAINT "PK_13ec9a862dcac5cba9f27c1d643" PRIMARY KEY (id);


--
-- Name: achievements PK_1bc19c37c6249f70186f318d71d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY (id);


--
-- Name: peer_reviews PK_2532078fca474d3c97e56a5bd19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT "PK_2532078fca474d3c97e56a5bd19" PRIMARY KEY (id);


--
-- Name: circuit_solutions PK_34a0f404b9818a8a9401889cd04; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.circuit_solutions
    ADD CONSTRAINT "PK_34a0f404b9818a8a9401889cd04" PRIMARY KEY (id);


--
-- Name: circuit_element_types PK_3cdb855fa9e777fbbafeb0dc02a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.circuit_element_types
    ADD CONSTRAINT "PK_3cdb855fa9e777fbbafeb0dc02a" PRIMARY KEY (type);


--
-- Name: user_achievements PK_3d94aba7e9ed55365f68b5e77fa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "PK_3d94aba7e9ed55365f68b5e77fa" PRIMARY KEY (id);


--
-- Name: forum_posts PK_3e9c301114a0fd42c998681b04e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT "PK_3e9c301114a0fd42c998681b04e" PRIMARY KEY (id);


--
-- Name: courses PK_3f70a487cc718ad8eda4e6d58c9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY (id);


--
-- Name: hackathon_teams PK_698e891160d654b5763ff88c3a4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_teams
    ADD CONSTRAINT "PK_698e891160d654b5763ff88c3a4" PRIMARY KEY (id);


--
-- Name: professional_orientations PK_73ffc94fb2ebecece2ba8492b67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_orientations
    ADD CONSTRAINT "PK_73ffc94fb2ebecece2ba8492b67" PRIMARY KEY (id);


--
-- Name: circuit_submissions PK_7861c16bb55e590107e2ea87979; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.circuit_submissions
    ADD CONSTRAINT "PK_7861c16bb55e590107e2ea87979" PRIMARY KEY (id);


--
-- Name: user_roles PK_8acd5cf26ebd158416f477de799; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY (id);


--
-- Name: course_groups PK_9722c03add9ea0dca5c69447398; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_groups
    ADD CONSTRAINT "PK_9722c03add9ea0dca5c69447398" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: course_registrations PK_a8726b4f90ee73642e768e21ef0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_registrations
    ADD CONSTRAINT "PK_a8726b4f90ee73642e768e21ef0" PRIMARY KEY (id);


--
-- Name: hackathon_projects PK_b0effcd7a439f45c08b617fd7be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_projects
    ADD CONSTRAINT "PK_b0effcd7a439f45c08b617fd7be" PRIMARY KEY (id);


--
-- Name: hackathons PK_b290177bd925b16bf35bf59961b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathons
    ADD CONSTRAINT "PK_b290177bd925b16bf35bf59961b" PRIMARY KEY (id);


--
-- Name: course_materials PK_b8d788301b7ea04c1cefc4bd2ca; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_materials
    ADD CONSTRAINT "PK_b8d788301b7ea04c1cefc4bd2ca" PRIMARY KEY (id);


--
-- Name: hackathon_team_members PK_bd4a1ee6e3aa5a16059ee0c327a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_team_members
    ADD CONSTRAINT "PK_bd4a1ee6e3aa5a16059ee0c327a" PRIMARY KEY (id);


--
-- Name: forum_topics PK_c3cfc62a16863804757504742b4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_topics
    ADD CONSTRAINT "PK_c3cfc62a16863804757504742b4" PRIMARY KEY (id);


--
-- Name: assignments PK_c54ca359535e0012b04dcbd80ee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "PK_c54ca359535e0012b04dcbd80ee" PRIMARY KEY (id);


--
-- Name: forum_sections PK_c9325bcd3ec6be258eed84ca839; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_sections
    ADD CONSTRAINT "PK_c9325bcd3ec6be258eed84ca839" PRIMARY KEY (id);


--
-- Name: hackathon_jury PK_f70ef31f0912718fe8f8a004dfb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_jury
    ADD CONSTRAINT "PK_f70ef31f0912718fe8f8a004dfb" PRIMARY KEY (id);


--
-- Name: hackathon_projects REL_84290e93b0fa3a802b69ad2af3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_projects
    ADD CONSTRAINT "REL_84290e93b0fa3a802b69ad2af3" UNIQUE ("teamId");


--
-- Name: hackathon_teams UQ_6196b2ae9c761670521af46f6df; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_teams
    ADD CONSTRAINT "UQ_6196b2ae9c761670521af46f6df" UNIQUE ("joinCode");


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: course_registrations UQ_f5159b7f0fa5473ef6b91597263; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_registrations
    ADD CONSTRAINT "UQ_f5159b7f0fa5473ef6b91597263" UNIQUE ("userId", "courseGroupId");


--
-- Name: forum_topics FK_006898061c2e0db9181ff28edc3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_topics
    ADD CONSTRAINT "FK_006898061c2e0db9181ff28edc3" FOREIGN KEY ("sectionId") REFERENCES public.forum_sections(id);


--
-- Name: peer_reviews FK_05fe25ed8b62ec86b08b2aad491; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT "FK_05fe25ed8b62ec86b08b2aad491" FOREIGN KEY ("submissionId") REFERENCES public.assignment_submissions(id);


--
-- Name: circuit_solutions FK_0743c23c16f3a993f6fc277b20a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.circuit_solutions
    ADD CONSTRAINT "FK_0743c23c16f3a993f6fc277b20a" FOREIGN KEY ("assignmentId") REFERENCES public.assignments(id);


--
-- Name: peer_reviews FK_07c9f6b29a8b8db324223eb558f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peer_reviews
    ADD CONSTRAINT "FK_07c9f6b29a8b8db324223eb558f" FOREIGN KEY ("reviewerId") REFERENCES public.users(id);


--
-- Name: forum_sections FK_0c4e9cbc4e10fce00550edd6800; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_sections
    ADD CONSTRAINT "FK_0c4e9cbc4e10fce00550edd6800" FOREIGN KEY ("courseId") REFERENCES public.courses(id);


--
-- Name: forum_posts FK_151dff45f01c0c195022e7db127; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT "FK_151dff45f01c0c195022e7db127" FOREIGN KEY ("authorId") REFERENCES public.users(id);


--
-- Name: assignment_submissions FK_16c8e730e6a93035772cf97ed25; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT "FK_16c8e730e6a93035772cf97ed25" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: user_achievements FK_3ac6bc9da3e8a56f3f7082012dd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "FK_3ac6bc9da3e8a56f3f7082012dd" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: hackathon_teams FK_3d34425206302ad8c68e5df9d29; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_teams
    ADD CONSTRAINT "FK_3d34425206302ad8c68e5df9d29" FOREIGN KEY ("hackathonId") REFERENCES public.hackathons(id);


--
-- Name: circuit_submissions FK_4804f5d41db7f3ca62293024d08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.circuit_submissions
    ADD CONSTRAINT "FK_4804f5d41db7f3ca62293024d08" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: circuit_submissions FK_4d9b81de61eb5807fdf3fd80e20; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.circuit_submissions
    ADD CONSTRAINT "FK_4d9b81de61eb5807fdf3fd80e20" FOREIGN KEY ("assignmentId") REFERENCES public.assignments(id) ON DELETE CASCADE;


--
-- Name: hackathon_grades FK_54abf063c23f24fee14551539f2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_grades
    ADD CONSTRAINT "FK_54abf063c23f24fee14551539f2" FOREIGN KEY ("projectId") REFERENCES public.hackathon_projects(id);


--
-- Name: course_registrations FK_66c60a13fcc02be5951f1d97659; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_registrations
    ADD CONSTRAINT "FK_66c60a13fcc02be5951f1d97659" FOREIGN KEY ("courseGroupId") REFERENCES public.course_groups(id);


--
-- Name: user_achievements FK_6a5a5816f54d0044ba5f3dc2b74; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "FK_6a5a5816f54d0044ba5f3dc2b74" FOREIGN KEY ("achievementId") REFERENCES public.achievements(id);


--
-- Name: assignment_submissions FK_6e8a68594fde52f61876a40489c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignment_submissions
    ADD CONSTRAINT "FK_6e8a68594fde52f61876a40489c" FOREIGN KEY ("assignmentId") REFERENCES public.assignments(id);


--
-- Name: hackathon_grades FK_79f847e07aabfd3ed7e7fe13b7b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_grades
    ADD CONSTRAINT "FK_79f847e07aabfd3ed7e7fe13b7b" FOREIGN KEY ("juryId") REFERENCES public.users(id);


--
-- Name: hackathon_projects FK_84290e93b0fa3a802b69ad2af33; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_projects
    ADD CONSTRAINT "FK_84290e93b0fa3a802b69ad2af33" FOREIGN KEY ("teamId") REFERENCES public.hackathon_teams(id);


--
-- Name: user_roles FK_87b8888186ca9769c960e926870; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: assignments FK_8e5a2e9380222968b7b88a2751c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT "FK_8e5a2e9380222968b7b88a2751c" FOREIGN KEY ("courseGroupId") REFERENCES public.course_groups(id);


--
-- Name: professional_orientations FK_96cc8da75732c415bcfc07299da; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_orientations
    ADD CONSTRAINT "FK_96cc8da75732c415bcfc07299da" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: hackathon_jury FK_9e02cef462349da496e5ac4bca5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_jury
    ADD CONSTRAINT "FK_9e02cef462349da496e5ac4bca5" FOREIGN KEY ("hackathonId") REFERENCES public.hackathons(id);


--
-- Name: hackathon_team_members FK_9f3e1e47610486f6ea3e488ef44; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_team_members
    ADD CONSTRAINT "FK_9f3e1e47610486f6ea3e488ef44" FOREIGN KEY ("teamId") REFERENCES public.hackathon_teams(id);


--
-- Name: schedule_items FK_a58fa25de0601dc5b5471f1e8ce; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_items
    ADD CONSTRAINT "FK_a58fa25de0601dc5b5471f1e8ce" FOREIGN KEY ("instructorId") REFERENCES public.users(id);


--
-- Name: course_materials FK_ace3ef4157ae10a215848945a36; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_materials
    ADD CONSTRAINT "FK_ace3ef4157ae10a215848945a36" FOREIGN KEY ("courseId") REFERENCES public.courses(id);


--
-- Name: schedule_items FK_acee6be562046e2928aec54247d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_items
    ADD CONSTRAINT "FK_acee6be562046e2928aec54247d" FOREIGN KEY ("courseGroupId") REFERENCES public.course_groups(id);


--
-- Name: course_groups FK_b6ec3d0cce75665e56432841b22; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_groups
    ADD CONSTRAINT "FK_b6ec3d0cce75665e56432841b22" FOREIGN KEY ("courseId") REFERENCES public.courses(id);


--
-- Name: course_registrations FK_bf1afb5a5857b9810ad3ea71c84; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_registrations
    ADD CONSTRAINT "FK_bf1afb5a5857b9810ad3ea71c84" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: forum_topics FK_c228733246cf2aee0240663b354; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_topics
    ADD CONSTRAINT "FK_c228733246cf2aee0240663b354" FOREIGN KEY ("authorId") REFERENCES public.users(id);


--
-- Name: course_materials FK_c72fda5c18f31710e7decde8bc3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_materials
    ADD CONSTRAINT "FK_c72fda5c18f31710e7decde8bc3" FOREIGN KEY ("uploadedById") REFERENCES public.users(id);


--
-- Name: hackathon_jury FK_e07d937127c547be56f525ead44; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_jury
    ADD CONSTRAINT "FK_e07d937127c547be56f525ead44" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: hackathon_team_members FK_e45fdd0fbab67920df74ced447b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hackathon_team_members
    ADD CONSTRAINT "FK_e45fdd0fbab67920df74ced447b" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: forum_posts FK_ee11320a399813b9ee190a6b135; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_posts
    ADD CONSTRAINT "FK_ee11320a399813b9ee190a6b135" FOREIGN KEY ("topicId") REFERENCES public.forum_topics(id);


--
-- PostgreSQL database dump complete
--

\unrestrict ZXAWGJmQQNIpOlf8A54g0H5Q2HejxL0liwmFggVYldl6EVemvu0OeGOZjHenMFy

