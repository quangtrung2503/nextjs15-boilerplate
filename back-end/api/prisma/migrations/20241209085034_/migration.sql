-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(191) NULL,
    `phone` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `lastAccessToken` TEXT NULL,
    `fcmToken` TEXT NULL,
    `nickName` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,
    `role` ENUM('MEMBER') NOT NULL DEFAULT 'MEMBER',
    `sex` VARCHAR(255) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `address` VARCHAR(255) NULL,
    `status` ENUM('ACTIVE', 'DELETED', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_phone_key`(`phone`),
    UNIQUE INDEX `user_email_key`(`email`),
    FULLTEXT INDEX `user_username_email_phone_name_nickName_idx`(`username`, `email`, `phone`, `name`, `nickName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
