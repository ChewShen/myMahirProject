CREATE DATABASE IF NOT EXISTS `elearning-db`;
USE `elearning-db`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- ------------------------------------------------------
-- Table structure for table `users`
-- ------------------------------------------------------

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userEmail` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userPassword` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userStatus` varchar(45) COLLATE utf8mb4_general_ci DEFAULT 'active',
  `quizCompleted` int DEFAULT NULL,
  `userRole` varchar(45) COLLATE utf8mb4_general_ci DEFAULT 'student',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userEmail_UNIQUE` (`userEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=7778 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES 
(4,'user','user@gmail.com','$2b$10$8YgMr2DNVzxhuCGF.ZAvh.OfSIbpysctvwL8pF2BUNhwngrEnF/S6','active',0,'student'),
(5,'admin','admin@gmail.com','$2b$10$TlqXE.D17iNw77gGtykeouY1r.nWsEcW/V4ivUx/kvRg/ashtwqaW','active',0,'admin'),
(6,'ali','ali@gmail.com','$2b$10$vnz0VSjcIlT7MMbG76H6LOTrjLKIR9T49atNx5CIKUwul253/bVam','active',0,'student'),
(9,'local','local@gmail.com','$2b$10$eRUB2V7hSqs4eiZJxbXrhepnKbM1l05aqYrh4/jga6oqvB7IMwed2','active',0,'student');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

-- ------------------------------------------------------
-- Table structure for table `courses`
-- ------------------------------------------------------

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `courseId` int NOT NULL AUTO_INCREMENT,
  `courseName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `courseStatus` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `courseContent` longtext COLLATE utf8mb4_general_ci,
  `authorId` int DEFAULT NULL,
  PRIMARY KEY (`courseId`),
  KEY `fk_course_author` (`authorId`),
  CONSTRAINT `fk_course_author` FOREIGN KEY (`authorId`) REFERENCES `users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- ------------------------------------------------------
-- Table structure for table `quiz`
-- ------------------------------------------------------

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `quizId` int NOT NULL AUTO_INCREMENT,
  `courseId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `score` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `totalQuestions` int DEFAULT '0',
  PRIMARY KEY (`quizId`),
  KEY `courseId_idx` (`courseId`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `fk_quiz_course` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`),
  CONSTRAINT `fk_quiz_user` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;