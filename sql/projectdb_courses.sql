-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: projectdb
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `courseId` int(11) NOT NULL AUTO_INCREMENT,
  `courseName` varchar(255) DEFAULT NULL,
  `courseStatus` varchar(45) DEFAULT NULL,
  `courseContent` longtext DEFAULT NULL,
  `authorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`courseId`),
  KEY `fk_course_author` (`authorId`),
  CONSTRAINT `fk_course_author` FOREIGN KEY (`authorId`) REFERENCES `users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Information Technology','Open','Information technology (IT) is the use of computers to create, process, store, retrieve, and exchange all kinds of data and information. IT is typically used within the context of business operations as opposed to personal or entertainment technologies.',NULL),(3,'test','open','⁠Cloudflare is a global cloud platform that enhances the security, performance, and reliability of internet properties. Acting as a massive reverse proxy, it routes web traffic through its expansive edge network to block cyber threats (like DDoS attacks) while speeding up load times via content cach',5),(4,'Data Structure','open','A data structure is a specialized format for organizing, storing, and managing data in a computer\'s memory. By arranging information logically, it allows programmers and algorithms to access, modify, and process data with maximum efficiency. \nData structures can be divided into two primary categories:Linear: Elements are arranged sequentially (e.g., Arrays, Stacks, and Queues). They are ideal for processing data in a specific, orderly flow.Non-linear: Elements are organized in a hierarchical or interconnected manner (e.g., Trees and Graphs). They excel at representing complex, multi-layered relationships. \n\nChoosing the right structure directly impacts a program\'s performance, determining how fast data can be searched, sorted, or retrieved. For a comprehensive overview of how these concepts form the foundation of software development, you can explore the IBM Data Structure Guide or browse through the TechTarget Data Structure Definition.',5);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-05 15:45:18
