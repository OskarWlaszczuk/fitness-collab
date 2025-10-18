CREATE DATABASE fitness_collab_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(30) NOT NULL,
    surname VARCHAR(30) NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    refresh_token_hash TEXT
);

CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(), 
    description VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
 
CREATE TABLE specializations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE trainer_specializations (
    trainer_id INT NOT NULL,
    specialization_id INT NOT NULL,
    PRIMARY KEY (trainer_id, specialization_id),
    FOREIGN KEY (trainer_id) REFERENCES trainers (id) ON DELETE CASCADE,
    FOREIGN KEY (specialization_id) REFERENCES specializations (id) ON DELETE CASCADE
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);