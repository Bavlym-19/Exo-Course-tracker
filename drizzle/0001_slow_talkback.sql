CREATE TABLE `progressLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`sectionReached` text,
	`percentageComplete` float NOT NULL,
	`percentageRemaining` float NOT NULL,
	`screenshotId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `progressLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`progressLogId` int,
	`questions` json,
	`answers` json,
	`score` float NOT NULL,
	`passed` int NOT NULL,
	`cumulativeUnderstanding` float NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `screenshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`analyzedPercentage` float,
	`lastSection` text,
	`remainingPercentage` float,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `screenshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int NOT NULL,
	`name` text NOT NULL,
	`courseLink` text,
	`role` enum('student','admin') NOT NULL DEFAULT 'student',
	`jobTitle` text,
	`level` varchar(50) DEFAULT 'Junior',
	`deferredExamsCount` int DEFAULT 0 NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`)
);
