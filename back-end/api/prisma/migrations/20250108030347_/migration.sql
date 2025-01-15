-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(255) NULL,
    `name` VARCHAR(255) NOT NULL,
    `lastAccessToken` TEXT NULL,
    `fcmToken` TEXT NULL,
    `nickName` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,
    `role` ENUM('ADMIN', 'STAFF', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    `sex` VARCHAR(255) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `address` VARCHAR(255) NULL,
    `status` ENUM('ACTIVE', 'DELETED', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_phone_key`(`phone`),
    FULLTEXT INDEX `user_email_phone_name_nickName_idx`(`email`, `phone`, `name`, `nickName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `thumbnail` VARCHAR(255) NOT NULL,
    `video` VARCHAR(255) NOT NULL,
    `isDisplay` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `slug` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `city_name_key`(`name`),
    UNIQUE INDEX `city_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(255) NULL,
    `color` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city_tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cityId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `city_tag_cityId_tagId_key`(`cityId`, `tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `theme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `isDisplay` BOOLEAN NOT NULL DEFAULT true,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `slug` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `theme_name_key`(`name`),
    UNIQUE INDEX `theme_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `destination` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `isFeature` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `slug` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `destination_name_key`(`name`),
    UNIQUE INDEX `destination_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tour` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `price` DOUBLE NOT NULL,
    `transport` VARCHAR(255) NOT NULL,
    `package` VARCHAR(255) NOT NULL,
    `numberOfHours` INTEGER NOT NULL,
    `numberOfPeople` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `description` TEXT NOT NULL,
    `activity` TEXT NOT NULL,
    `included` TEXT NOT NULL,
    `notIncluded` TEXT NOT NULL,
    `safety` TEXT NOT NULL,
    `language` TEXT NOT NULL,
    `guideMeetingAddress` TEXT NOT NULL,
    `cityId` INTEGER NOT NULL,
    `themeId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tour_slug_key`(`slug`),
    FULLTEXT INDEX `tour_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tour_destination` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tourId` INTEGER NOT NULL,
    `destinationId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tour_destination_tourId_destinationId_key`(`tourId`, `destinationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tour_image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tourId` INTEGER NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tourId` INTEGER NOT NULL,
    `ratingGuide` INTEGER NOT NULL,
    `ratingTransportation` INTEGER NOT NULL,
    `ratingValueOfMoney` INTEGER NOT NULL,
    `ratingSafety` INTEGER NOT NULL,
    `rating` DOUBLE NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `review_userId_tourId_key`(`userId`, `tourId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userCreatedId` INTEGER NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `slug` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `post_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tourId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `wishlist_userId_tourId_key`(`userId`, `tourId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingCode` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL,
    `tourId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `numberOfAdults` INTEGER NOT NULL,
    `numberOfChildren` INTEGER NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `paymentMethod` VARCHAR(255) NOT NULL,
    `note` TEXT NULL,
    `updatedBy` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `booking_bookingCode_key`(`bookingCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `paymentCode` VARCHAR(255) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `bankCode` VARCHAR(50) NULL,
    `bankTranNo` VARCHAR(255) NULL,
    `cardType` VARCHAR(20) NULL,
    `orderInfo` VARCHAR(255) NULL,
    `expireDate` DATETIME(3) NOT NULL,
    `payDate` DATETIME(3) NULL,
    `responseCode` VARCHAR(10) NULL,
    `transactionNo` VARCHAR(50) NULL,
    `transactionStatus` VARCHAR(20) NOT NULL,
    `txnRef` VARCHAR(255) NOT NULL,
    `secureHash` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `payment_paymentCode_key`(`paymentCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request_refund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `imageQRCode` VARCHAR(255) NOT NULL,
    `accountHolderName` VARCHAR(255) NOT NULL,
    `accountNumber` VARCHAR(255) NOT NULL,
    `bankName` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(255) NULL,

    UNIQUE INDEX `request_refund_bookingId_userId_key`(`bookingId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `city_tag` ADD CONSTRAINT `city_tag_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `city`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `city_tag` ADD CONSTRAINT `city_tag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour` ADD CONSTRAINT `tour_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour` ADD CONSTRAINT `tour_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `theme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour_destination` ADD CONSTRAINT `tour_destination_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour_destination` ADD CONSTRAINT `tour_destination_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `destination`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour_image` ADD CONSTRAINT `tour_image_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_userCreatedId_fkey` FOREIGN KEY (`userCreatedId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tour`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tour`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_refund` ADD CONSTRAINT `request_refund_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_refund` ADD CONSTRAINT `request_refund_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
