--
-- PostgreSQL database dump
--

\restrict j3VTXTWPvZHL8K7KvmlMiAjrtL0FUjuBl4gSnyRwAKDAxPVcQzze9VlsJwnFfg8

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

-- Started on 2026-06-25 22:47:06

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
-- TOC entry 5 (class 2615 OID 16605)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 16681)
-- Name: action_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.action_log (
    id_action integer NOT NULL,
    id_user integer NOT NULL,
    action character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.action_log OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16680)
-- Name: action_log_id_action_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.action_log_id_action_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.action_log_id_action_seq OWNER TO postgres;

--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 233
-- Name: action_log_id_action_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.action_log_id_action_seq OWNED BY public.action_log.id_action;


--
-- TOC entry 220 (class 1259 OID 16625)
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id_client integer NOT NULL,
    full_name character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(100) NOT NULL,
    login character varying(50) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16624)
-- Name: clients_id_client_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_client_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_client_seq OWNER TO postgres;

--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 219
-- Name: clients_id_client_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_client_seq OWNED BY public.clients.id_client;


--
-- TOC entry 228 (class 1259 OID 16655)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id_comment integer NOT NULL,
    id_request integer NOT NULL,
    text text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16654)
-- Name: comments_id_comment_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_comment_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_comment_seq OWNER TO postgres;

--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 227
-- Name: comments_id_comment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_comment_seq OWNED BY public.comments.id_comment;


--
-- TOC entry 224 (class 1259 OID 16641)
-- Name: engineers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.engineers (
    id_engineer integer NOT NULL,
    full_name character varying(100) NOT NULL,
    specialization character varying(100) NOT NULL,
    id_user integer
);


ALTER TABLE public.engineers OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16640)
-- Name: engineers_id_engineer_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.engineers_id_engineer_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.engineers_id_engineer_seq OWNER TO postgres;

--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 223
-- Name: engineers_id_engineer_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.engineers_id_engineer_seq OWNED BY public.engineers.id_engineer;


--
-- TOC entry 222 (class 1259 OID 16632)
-- Name: equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment (
    id_equipment integer NOT NULL,
    name character varying NOT NULL,
    model character varying NOT NULL,
    serial_number character varying NOT NULL
);


ALTER TABLE public.equipment OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16631)
-- Name: equipment_id_equipment_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipment_id_equipment_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipment_id_equipment_seq OWNER TO postgres;

--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 221
-- Name: equipment_id_equipment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipment_id_equipment_seq OWNED BY public.equipment.id_equipment;


--
-- TOC entry 216 (class 1259 OID 16607)
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    id_request integer NOT NULL,
    id_client integer NOT NULL,
    id_engineer integer,
    id_equipment integer NOT NULL,
    id_category integer NOT NULL,
    id_status integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    title character varying(255),
    description text
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16606)
-- Name: requests_id_request_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_id_request_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requests_id_request_seq OWNER TO postgres;

--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 215
-- Name: requests_id_request_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_id_request_seq OWNED BY public.requests.id_request;


--
-- TOC entry 226 (class 1259 OID 16648)
-- Name: service_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_categories (
    id_category integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(255) NOT NULL
);


ALTER TABLE public.service_categories OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16647)
-- Name: service_categories_id_category_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_categories_id_category_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_categories_id_category_seq OWNER TO postgres;

--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 225
-- Name: service_categories_id_category_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_categories_id_category_seq OWNED BY public.service_categories.id_category;


--
-- TOC entry 230 (class 1259 OID 16665)
-- Name: spare_parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.spare_parts (
    id_part integer NOT NULL,
    name character varying NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL
);


ALTER TABLE public.spare_parts OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16664)
-- Name: spare_parts_id_part_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.spare_parts_id_part_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.spare_parts_id_part_seq OWNER TO postgres;

--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 229
-- Name: spare_parts_id_part_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.spare_parts_id_part_seq OWNED BY public.spare_parts.id_part;


--
-- TOC entry 236 (class 1259 OID 16692)
-- Name: statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statuses (
    id_status integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.statuses OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16691)
-- Name: statuses_id_status_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statuses_id_status_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.statuses_id_status_seq OWNER TO postgres;

--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 235
-- Name: statuses_id_status_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statuses_id_status_seq OWNED BY public.statuses.id_status;


--
-- TOC entry 218 (class 1259 OID 16616)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id_user integer NOT NULL,
    login character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(30) NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16615)
-- Name: users_id_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_user_seq OWNER TO postgres;

--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;


--
-- TOC entry 232 (class 1259 OID 16674)
-- Name: write_offs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.write_offs (
    id_writeoff integer NOT NULL,
    id_request integer NOT NULL,
    id_part integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.write_offs OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16673)
-- Name: write_offs_id_writeoff_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.write_offs_id_writeoff_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.write_offs_id_writeoff_seq OWNER TO postgres;

--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 231
-- Name: write_offs_id_writeoff_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.write_offs_id_writeoff_seq OWNED BY public.write_offs.id_writeoff;


--
-- TOC entry 4796 (class 2604 OID 16684)
-- Name: action_log id_action; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_log ALTER COLUMN id_action SET DEFAULT nextval('public.action_log_id_action_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 16628)
-- Name: clients id_client; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id_client SET DEFAULT nextval('public.clients_id_client_seq'::regclass);


--
-- TOC entry 4792 (class 2604 OID 16658)
-- Name: comments id_comment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id_comment SET DEFAULT nextval('public.comments_id_comment_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 16644)
-- Name: engineers id_engineer; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineers ALTER COLUMN id_engineer SET DEFAULT nextval('public.engineers_id_engineer_seq'::regclass);


--
-- TOC entry 4789 (class 2604 OID 16635)
-- Name: equipment id_equipment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment ALTER COLUMN id_equipment SET DEFAULT nextval('public.equipment_id_equipment_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 16610)
-- Name: requests id_request; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN id_request SET DEFAULT nextval('public.requests_id_request_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 16651)
-- Name: service_categories id_category; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_categories ALTER COLUMN id_category SET DEFAULT nextval('public.service_categories_id_category_seq'::regclass);


--
-- TOC entry 4794 (class 2604 OID 16668)
-- Name: spare_parts id_part; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spare_parts ALTER COLUMN id_part SET DEFAULT nextval('public.spare_parts_id_part_seq'::regclass);


--
-- TOC entry 4798 (class 2604 OID 16695)
-- Name: statuses id_status; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses ALTER COLUMN id_status SET DEFAULT nextval('public.statuses_id_status_seq'::regclass);


--
-- TOC entry 4787 (class 2604 OID 16619)
-- Name: users id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 16677)
-- Name: write_offs id_writeoff; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.write_offs ALTER COLUMN id_writeoff SET DEFAULT nextval('public.write_offs_id_writeoff_seq'::regclass);


--
-- TOC entry 4987 (class 0 OID 16681)
-- Dependencies: 234
-- Data for Name: action_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.action_log (id_action, id_user, action, created_at) FROM stdin;
1	1	Создание заявки	2026-06-15 15:17:35.568173
2	2	Назначение инженера	2026-06-15 15:17:35.568173
3	3	Изменение статуса заявки	2026-06-15 15:17:35.568173
\.


--
-- TOC entry 4973 (class 0 OID 16625)
-- Dependencies: 220
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id_client, full_name, phone, email, login, password) FROM stdin;
2	Петров Петр Петрович	+79997654321	petrov@mail.ru	petrov	qwerty
1	Иванов Иван Иванович	+79991234567	ivanov@mail.ru	ivanov	123456
4	Тестов Тест Тестович	+79990000000	test@mail.ru	testuser	test123
\.


--
-- TOC entry 4981 (class 0 OID 16655)
-- Dependencies: 228
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id_comment, id_request, text, created_at) FROM stdin;
1	1	Заявка зарегистрирована	2026-06-15 15:17:35.568173
2	1	Передана инженеру	2026-06-15 15:17:35.568173
3	2	Проводится диагностика	2026-06-15 15:17:35.568173
5	1	Всё круто и классно!	2026-06-25 01:48:12.87
6	2	бебе	2026-06-25 16:12:15.543
7	3	БЕБЕ	2026-06-25 18:54:26.07
\.


--
-- TOC entry 4977 (class 0 OID 16641)
-- Dependencies: 224
-- Data for Name: engineers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.engineers (id_engineer, full_name, specialization, id_user) FROM stdin;
1	Сидоров Сергей	Ноутбуки	3
2	Алексеев Алексей	Компьютеры	6
3	Кузнецов Андрей	Сетевое оборудование	7
\.


--
-- TOC entry 4975 (class 0 OID 16632)
-- Dependencies: 222
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipment (id_equipment, name, model, serial_number) FROM stdin;
1	Ноутбук	Lenovo IdeaPad	LN001
2	Компьютер	HP ProDesk	HP002
3	Принтер	Canon LBP2900	CN003
\.


--
-- TOC entry 4969 (class 0 OID 16607)
-- Dependencies: 216
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id_request, id_client, id_engineer, id_equipment, id_category, id_status, created_at, title, description) FROM stdin;
1	1	2	1	2	4	2026-06-15 15:17:35.568173	Не включается ноутбук	Ноутбук перестал включаться после того, как я подключил его к зарядному устройству. Индикатор питания горит, но экран остаётся чёрным. При нажатии кнопки включения слышен звук кулера, но загрузка не происходит. Пробовал отключать батарею и подключать напрямую к сети — не помогло.
3	1	\N	3	3	1	2026-06-24 20:42:28.777	Принтер не печатает и выдает ошибку "Бумага отсутствует"	Принтер перестал печатать. На экране отображается ошибка "Бумага отсутствует", хотя бумага в лотке есть. Перезагрузка принтера и компьютера не помогла. Бумага не замята. Принтер используется ежедневно, проблема возникла сегодня утром после заправки картриджа.
2	2	2	2	1	2	2026-06-15 15:17:35.568173	Компьютер сильно греется и выключается	Компьютер начал сильно греться и самопроизвольно выключаться под нагрузкой. Кулер процессора работает, но на максимальных оборотах. Температура CPU достигает 95°C за 10 минут работы в игре. Термопасту не менял с момента сборки (2 года). Корпус закрытый, пылевой фильтр забит пылью.
\.


--
-- TOC entry 4979 (class 0 OID 16648)
-- Dependencies: 226
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_categories (id_category, name, description) FROM stdin;
2	Ремонт ноутбуков	Обслуживание ноутбуков
3	Настройка ПО	Установка программного обеспечения
4	Сетевые работы	Настройка сетевого оборудования
1	Ремонт ПК	Диагностика и ремонт персональных компьютеров
\.


--
-- TOC entry 4983 (class 0 OID 16665)
-- Dependencies: 230
-- Data for Name: spare_parts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spare_parts (id_part, name, quantity, price) FROM stdin;
3	Материнская плата	4	8500.00
1	SSD 512GB	8	4500.00
2	Оперативная память 16GB	13	3500.00
\.


--
-- TOC entry 4989 (class 0 OID 16692)
-- Dependencies: 236
-- Data for Name: statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statuses (id_status, name) FROM stdin;
1	Новая
2	В работе
3	Ожидание
4	Выполнена
5	Закрыта
\.


--
-- TOC entry 4971 (class 0 OID 16616)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id_user, login, password, role, created_at) FROM stdin;
1	admin	12345	ADMIN	2026-06-15 15:17:35.568173
2	dispatcher	12345	DISPATCHER	2026-06-15 15:17:35.568173
3	engineer	12345	ENGINEER	2026-06-15 15:17:35.568173
6	engineer1	123456	ENGINEER	2026-06-25 00:53:53.854989
7	engineer2	1234567	ENGINEER	2026-06-25 00:53:53.854989
\.


--
-- TOC entry 4985 (class 0 OID 16674)
-- Dependencies: 232
-- Data for Name: write_offs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.write_offs (id_writeoff, id_request, id_part, quantity) FROM stdin;
1	1	1	1
2	2	2	2
3	2	2	1
\.


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 233
-- Name: action_log_id_action_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.action_log_id_action_seq', 3, true);


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 219
-- Name: clients_id_client_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_client_seq', 4, true);


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 227
-- Name: comments_id_comment_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_comment_seq', 7, true);


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 223
-- Name: engineers_id_engineer_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.engineers_id_engineer_seq', 7, true);


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 221
-- Name: equipment_id_equipment_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipment_id_equipment_seq', 3, true);


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 215
-- Name: requests_id_request_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_id_request_seq', 3, true);


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 225
-- Name: service_categories_id_category_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_categories_id_category_seq', 5, true);


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 229
-- Name: spare_parts_id_part_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.spare_parts_id_part_seq', 3, true);


--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 235
-- Name: statuses_id_status_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.statuses_id_status_seq', 5, true);


--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_user_seq', 7, true);


--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 231
-- Name: write_offs_id_writeoff_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.write_offs_id_writeoff_seq', 3, true);


--
-- TOC entry 4812 (class 2606 OID 16646)
-- Name: engineers PK_343e78f524c7e8ddf6ee82df54b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engineers
    ADD CONSTRAINT "PK_343e78f524c7e8ddf6ee82df54b" PRIMARY KEY (id_engineer);


--
-- TOC entry 4824 (class 2606 OID 16699)
-- Name: statuses PK_41260694f05374bd7d529d595bd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT "PK_41260694f05374bd7d529d595bd" PRIMARY KEY (id_status);


--
-- TOC entry 4816 (class 2606 OID 16663)
-- Name: comments PK_45dff610322fe0f7ac394a1370b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "PK_45dff610322fe0f7ac394a1370b" PRIMARY KEY (id_comment);


--
-- TOC entry 4820 (class 2606 OID 16679)
-- Name: write_offs PK_58172ae671fdb23e6c0707ddaf0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.write_offs
    ADD CONSTRAINT "PK_58172ae671fdb23e6c0707ddaf0" PRIMARY KEY (id_writeoff);


--
-- TOC entry 4806 (class 2606 OID 16630)
-- Name: clients PK_59bc814de9b1855a712531853aa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT "PK_59bc814de9b1855a712531853aa" PRIMARY KEY (id_client);


--
-- TOC entry 4818 (class 2606 OID 16672)
-- Name: spare_parts PK_5ca5ed125de99f1411aa43d7bad; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.spare_parts
    ADD CONSTRAINT "PK_5ca5ed125de99f1411aa43d7bad" PRIMARY KEY (id_part);


--
-- TOC entry 4800 (class 2606 OID 16614)
-- Name: requests PK_7156ff6b08f1dd0be0f43590f4e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT "PK_7156ff6b08f1dd0be0f43590f4e" PRIMARY KEY (id_request);


--
-- TOC entry 4814 (class 2606 OID 16653)
-- Name: service_categories PK_beb9f5acfcdab44ef20f3fbe143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT "PK_beb9f5acfcdab44ef20f3fbe143" PRIMARY KEY (id_category);


--
-- TOC entry 4810 (class 2606 OID 16639)
-- Name: equipment PK_c6bce8adb8562a2a571d7d04de9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT "PK_c6bce8adb8562a2a571d7d04de9" PRIMARY KEY (id_equipment);


--
-- TOC entry 4822 (class 2606 OID 16689)
-- Name: action_log PK_e67cdcadf9f9d2ffa72cec952e4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_log
    ADD CONSTRAINT "PK_e67cdcadf9f9d2ffa72cec952e4" PRIMARY KEY (id_action);


--
-- TOC entry 4802 (class 2606 OID 16621)
-- Name: users PK_fbb07fa6fbd1d74bee9782fb945; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_fbb07fa6fbd1d74bee9782fb945" PRIMARY KEY (id_user);


--
-- TOC entry 4804 (class 2606 OID 16623)
-- Name: users UQ_2d443082eccd5198f95f2a36e2c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE (login);


--
-- TOC entry 4808 (class 2606 OID 16703)
-- Name: clients UQ_a9170621bce4bd86ca626befa94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT "UQ_a9170621bce4bd86ca626befa94" UNIQUE (login);


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-06-25 22:47:06

--
-- PostgreSQL database dump complete
--

\unrestrict j3VTXTWPvZHL8K7KvmlMiAjrtL0FUjuBl4gSnyRwAKDAxPVcQzze9VlsJwnFfg8

