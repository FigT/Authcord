-- CreateTable
CREATE TABLE `accounts` (
    `name` VARCHAR(191) NOT NULL,
    `secret` VARCHAR(191) NOT NULL,
    `type` ENUM('TOTP', 'HOTP') NOT NULL,
    `digits` INTEGER NOT NULL,

    UNIQUE INDEX `accounts_name_key`(`name`),
    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
