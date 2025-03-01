

DROP TABLE IF EXISTS `churches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `churches` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `domain_name` varchar(255) NOT NULL,
  `registration_number` varchar(255) NOT NULL,
  `contact_phone` varchar(255) NOT NULL,
  `contact_email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `churches_domain_name_unique` (`domain_name`),
  UNIQUE KEY `churches_registration_number_unique` (`registration_number`),
  KEY `churches_domain_name_index` (`domain_name`),
  KEY `churches_registration_number_index` (`registration_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `churches`
--

LOCK TABLES `churches` WRITE;
/*!40000 ALTER TABLE `churches` DISABLE KEYS */;
/*!40000 ALTER TABLE `churches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `envelope_assignments`
--

DROP TABLE IF EXISTS `envelope_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `envelope_assignments` (
  `id` char(36) NOT NULL,
  `envelope_id` char(36) NOT NULL,
  `church_id` char(36) NOT NULL,
  `member_id` char(36) DEFAULT NULL,
  `activity_type` enum('ASSIGNMENT','RELEASE') NOT NULL,
  `activity_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `envelope_assignments_church_id_foreign` (`church_id`),
  KEY `envelope_assignments_member_id_foreign` (`member_id`),
  KEY `envelope_assignments_envelope_id_church_id_index` (`envelope_id`,`church_id`),
  CONSTRAINT `envelope_assignments_church_id_foreign` FOREIGN KEY (`church_id`) REFERENCES `churches` (`id`),
  CONSTRAINT `envelope_assignments_envelope_id_foreign` FOREIGN KEY (`envelope_id`) REFERENCES `envelopes` (`id`),
  CONSTRAINT `envelope_assignments_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `envelope_assignments`
--

LOCK TABLES `envelope_assignments` WRITE;
/*!40000 ALTER TABLE `envelope_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `envelope_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `envelopes`
--

DROP TABLE IF EXISTS `envelopes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `envelopes` (
  `id` char(36) NOT NULL,
  `envelope_number` int NOT NULL,
  `church_id` char(36) NOT NULL,
  `member_id` char(36) DEFAULT NULL,
  `assigned_at` datetime DEFAULT NULL,
  `released_at` datetime DEFAULT NULL,
  `is_assigned` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `envelopes_envelope_number_unique` (`envelope_number`),
  KEY `envelopes_church_id_foreign` (`church_id`),
  KEY `envelopes_member_id_foreign` (`member_id`),
  CONSTRAINT `envelopes_church_id_foreign` FOREIGN KEY (`church_id`) REFERENCES `churches` (`id`),
  CONSTRAINT `envelopes_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `envelopes`
--

LOCK TABLES `envelopes` WRITE;
/*!40000 ALTER TABLE `envelopes` DISABLE KEYS */;
/*!40000 ALTER TABLE `envelopes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fellowship_elders`
--

DROP TABLE IF EXISTS `fellowship_elders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fellowship_elders` (
  `fellowship_id` char(36) NOT NULL,
  `member_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fellowship_id`,`member_id`),
  KEY `fellowship_elders_member_id_foreign` (`member_id`),
  CONSTRAINT `fellowship_elders_fellowship_id_foreign` FOREIGN KEY (`fellowship_id`) REFERENCES `fellowships` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fellowship_elders_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fellowship_elders`
--

LOCK TABLES `fellowship_elders` WRITE;
/*!40000 ALTER TABLE `fellowship_elders` DISABLE KEYS */;
/*!40000 ALTER TABLE `fellowship_elders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fellowships`
--

DROP TABLE IF EXISTS `fellowships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fellowships` (
  `id` char(36) NOT NULL,
  `church_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `chairman_id` char(36) DEFAULT NULL,
  `deputy_chairman_id` char(36) DEFAULT NULL,
  `secretary_id` char(36) DEFAULT NULL,
  `treasurer_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fellowships_name_unique` (`name`),
  KEY `fellowships_church_id_foreign` (`church_id`),
  KEY `fellowships_chairman_id_foreign` (`chairman_id`),
  KEY `fellowships_deputy_chairman_id_foreign` (`deputy_chairman_id`),
  KEY `fellowships_secretary_id_foreign` (`secretary_id`),
  KEY `fellowships_treasurer_id_foreign` (`treasurer_id`),
  CONSTRAINT `fellowships_chairman_id_foreign` FOREIGN KEY (`chairman_id`) REFERENCES `members` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fellowships_church_id_foreign` FOREIGN KEY (`church_id`) REFERENCES `churches` (`id`),
  CONSTRAINT `fellowships_deputy_chairman_id_foreign` FOREIGN KEY (`deputy_chairman_id`) REFERENCES `members` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fellowships_secretary_id_foreign` FOREIGN KEY (`secretary_id`) REFERENCES `members` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fellowships_treasurer_id_foreign` FOREIGN KEY (`treasurer_id`) REFERENCES `members` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fellowships`
--

LOCK TABLES `fellowships` WRITE;
/*!40000 ALTER TABLE `fellowships` DISABLE KEYS */;
/*!40000 ALTER TABLE `fellowships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations`
--

LOCK TABLES `knex_migrations` WRITE;
/*!40000 ALTER TABLE `knex_migrations` DISABLE KEYS */;
INSERT INTO `knex_migrations` VALUES (1,'20250202134923_create_table_churches.js',1,'2025-02-22 17:15:29'),(2,'20250202135155_create_table_volunter_opportunities.js',2,'2025-02-22 17:15:32'),(4,'20250202135402_create_table_fellowships.js',3,'2025-02-22 17:16:22'),(5,'20250202135414_create_members_table.js',4,'2025-02-22 17:16:27'),(7,'20250202135547_create_table_member_volunteer_interests.js',5,'2025-02-22 17:17:50'),(9,'20250202145013_create_table_fellowship_elders.js',6,'2025-02-22 17:18:41'),(10,'20250222122631_add_fellowship_leadership_roles.js',7,'2025-02-22 17:18:44'),(11,'20250222124207_create_table_roles.js',8,'2025-02-22 17:19:19'),(12,'20250222124339_create_table_users.js',9,'2025-02-22 17:19:26'),(14,'20250222124439_create_table_user_credentals.js',10,'2025-02-22 17:21:09'),(15,'20250222135423_create_table_envelopes.js',11,'2025-02-22 17:21:12'),(16,'20250222140447_create_table_envelopes_assignments.js',12,'2025-02-22 17:21:15');
/*!40000 ALTER TABLE `knex_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations_lock` (
  `index` int unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations_lock`
--

LOCK TABLES `knex_migrations_lock` WRITE;
/*!40000 ALTER TABLE `knex_migrations_lock` DISABLE KEYS */;
INSERT INTO `knex_migrations_lock` VALUES (1,0);
/*!40000 ALTER TABLE `knex_migrations_lock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_volunteer_interests`
--

DROP TABLE IF EXISTS `member_volunteer_interests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_volunteer_interests` (
  `member_id` char(36) NOT NULL,
  `volunteer_opportunity_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`member_id`,`volunteer_opportunity_id`),
  KEY `member_volunteer_interests_volunteer_opportunity_id_foreign` (`volunteer_opportunity_id`),
  CONSTRAINT `member_volunteer_interests_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  CONSTRAINT `member_volunteer_interests_volunteer_opportunity_id_foreign` FOREIGN KEY (`volunteer_opportunity_id`) REFERENCES `volunteer_opportunities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_volunteer_interests`
--

LOCK TABLES `member_volunteer_interests` WRITE;
/*!40000 ALTER TABLE `member_volunteer_interests` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_volunteer_interests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` char(36) NOT NULL,
  `church_id` char(36) NOT NULL,
  `envelope_number` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `place_of_birth` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `marital_status` varchar(255) NOT NULL,
  `marriage_type` varchar(255) NOT NULL,
  `date_of_marriage` date DEFAULT NULL,
  `spouse_name` varchar(255) DEFAULT NULL,
  `place_of_marriage` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `spouse_phone_number` varchar(255) DEFAULT NULL,
  `residence_number` varchar(255) DEFAULT NULL,
  `residence_block` varchar(255) DEFAULT NULL,
  `postal_box` varchar(255) DEFAULT NULL,
  `residence_area` varchar(255) DEFAULT NULL,
  `former_church` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `place_of_work` varchar(255) DEFAULT NULL,
  `education_level` varchar(255) DEFAULT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `member_role` varchar(255) NOT NULL DEFAULT 'Regular',
  `is_baptized` tinyint(1) NOT NULL DEFAULT '0',
  `is_confirmed` tinyint(1) NOT NULL DEFAULT '0',
  `partakes_lord_supper` tinyint(1) NOT NULL DEFAULT '0',
  `fellowship_id` char(36) NOT NULL,
  `nearest_member_name` varchar(255) DEFAULT NULL,
  `nearest_member_phone` varchar(255) DEFAULT NULL,
  `attends_fellowship` tinyint(1) NOT NULL DEFAULT '0',
  `fellowship_absence_reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `members_envelope_number_unique` (`envelope_number`),
  KEY `members_church_id_foreign` (`church_id`),
  KEY `members_fellowship_id_foreign` (`fellowship_id`),
  CONSTRAINT `members_church_id_foreign` FOREIGN KEY (`church_id`) REFERENCES `churches` (`id`),
  CONSTRAINT `members_fellowship_id_foreign` FOREIGN KEY (`fellowship_id`) REFERENCES `fellowships` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_credentials`
--

DROP TABLE IF EXISTS `user_credentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_credentials` (
  `user_id` char(36) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_salt` varchar(255) DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_credentials_username_unique` (`username`),
  CONSTRAINT `user_credentials_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_credentials`
--

LOCK TABLES `user_credentials` WRITE;
/*!40000 ALTER TABLE `user_credentials` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_credentials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `church_id` char(36) NOT NULL,
  `role_id` char(36) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_church_id_foreign` (`church_id`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_church_id_foreign` FOREIGN KEY (`church_id`) REFERENCES `churches` (`id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volunteer_opportunities`
--

DROP TABLE IF EXISTS `volunteer_opportunities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `volunteer_opportunities` (
  `id` char(36) NOT NULL,
  `church_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `volunteer_opportunities_church_id_foreign` (`church_id`),
  CONSTRAINT `volunteer_opportunities_church_id_foreign` FOREIGN KEY (`church_id`) REFERENCES `churches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

