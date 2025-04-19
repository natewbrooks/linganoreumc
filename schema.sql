CREATE DATABASE IF NOT EXISTS Linganore;
USE Linganore;
SET time_zone = 'America/New_York';

-- -----------------------------
-- EVENTS
-- -----------------------------

CREATE TABLE IF NOT EXISTS Events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    isDraft BOOLEAN DEFAULT FALSE,
    isFeatured BOOLEAN DEFAULT FALSE,
    isRecurring BOOLEAN DEFAULT FALSE,
    isArchived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS EventDates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventID INT NOT NULL,
    date DATE NOT NULL,
    isCancelled BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (eventID) REFERENCES Events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS EventTimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventDateID INT NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NULL,
    FOREIGN KEY (eventDateID) REFERENCES EventDates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS EventPhotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventID INT NOT NULL,
    photoURL VARCHAR(2083) NOT NULL,
    isThumbnail BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (eventID) REFERENCES Events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS EventVideos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventID INT NOT NULL,
    videoURL VARCHAR(2083) NOT NULL,
    FOREIGN KEY (eventID) REFERENCES Events(id) ON DELETE CASCADE
);


-- -----------------------------
-- SERMONS
-- -----------------------------

CREATE TABLE IF NOT EXISTS Sermons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    body LONGTEXT,
    videoURL VARCHAR(2083),
    publishDate DATE,
    lastEditDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isArchived BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS SermonVerses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sermonID INT NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (sermonID) REFERENCES Sermons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SermonPhotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sermonID INT NOT NULL,
    photoURL VARCHAR(2083) NOT NULL,
    FOREIGN KEY (sermonID) REFERENCES Sermons(id) ON DELETE CASCADE
);


-- -----------------------------
-- USERS
-- -----------------------------

CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
