CREATE DATABASE fitness_collab_db;

CREATE TYPE week_day AS ENUM ( 
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    surname VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    nickname VARCHAR(30) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    refresh_token_hash VARCHAR(350)
);

CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(), 
    description VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
 
CREATE TABLE trainees (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(), 
    description VARCHAR(255),
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

CREATE TABLE modes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE user_modes (
    user_id INT NOT NULL,
    mode_id INT NOT NULL,
    PRIMARY KEY (user_id, mode_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (mode_id) REFERENCES modes (id) ON DELETE CASCADE
);

CREATE TABLE workout_plan (
    name VARCHAR(30) NOT NULL,
    id SERIAL PRIMARY KEY,
    trainer_id INT NOT NULL,
    trainee_id INT NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainers (id) ON DELETE CASCADE,
    FOREIGN KEY (trainee_id) REFERENCES trainees (id) ON DELETE CASCADE
);

CREATE TABLE workout_plan_day (
    name VARCHAR(30) NOT NULL,
    week_day week_day NOT NULL,
    total_excersise INT NOT NULL,
    id SERIAL PRIMARY KEY,
    workout_plan_Id  INT NOT NULL,
    FOREIGN KEY (workout_plan_Id) REFERENCES workout_plan (id) ON DELETE CASCADE
);