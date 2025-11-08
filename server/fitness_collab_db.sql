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

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);
-- uprościć nazwę
CREATE TABLE workout_plan (
    name VARCHAR(30) NOT NULL,
    id SERIAL PRIMARY KEY,
    trainer_id INT NOT NULL,
    trainee_id INT NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainers (id) ON DELETE CASCADE,
    FOREIGN KEY (trainee_id) REFERENCES trainees (id) ON DELETE CASCADE
);
-- uprościć nazwę
CREATE TABLE workout_plan_day (
    name VARCHAR(30) NOT NULL,
    week_day week_day NOT NULL,
    total_excersise INT NOT NULL,
    id SERIAL PRIMARY KEY,
    workout_plan_Id  INT NOT NULL,
    FOREIGN KEY (workout_plan_Id) REFERENCES workout_plan (id) ON DELETE CASCADE
);

CREATE TABLE muscle_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE muscle_subgroups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    muscle_group_id  INT NOT NULL,
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups (id) ON DELETE CASCADE
);

CREATE TABLE excersises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE excersise_trainee_notes (
    id SERIAL PRIMARY KEY,
    excersise_id INT NOT NULL,
    trainee_id INT NOT NULL,
    order_number INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    FOREIGN KEY (excersise_id) REFERENCES excersises (id) ON DELETE CASCADE
    FOREIGN KEY (trainee_id) REFERENCES trainees (id) ON DELETE CASCADE
);

CREATE TABLE instruction_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE excersise_instruction (
    id SERIAL PRIMARY KEY,
    order_number INT NOT NULL,
    excersise_id INT NOT NULL,
    instruction_category_id  INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    FOREIGN KEY (instruction_category_id) REFERENCES instruction_categories (id) ON DELETE CASCADE,
    FOREIGN KEY (excersise_id) REFERENCES excersises (id) ON DELETE CASCADE
);

CREATE TABLE excersise_muscle_subgroups (
    excersise_id INT NOT NULL,
    muscle_group_id  INT NOT NULL,
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups (id) ON DELETE CASCADE,
    FOREIGN KEY (excersise_id) REFERENCES excersises (id) ON DELETE CASCADE
);

CREATE TABLE workout_excersises (
    id SERIAL PRIMARY KEY,
    order_number INT NOT NULL,
    excersise_id INT NOT NULL,
    workout_plan_day_id INT NOT NULL,
    sets_number INT NOT NULL,
    break_min_sec INT NOT NULL,
    break_max_sec INT,
    reps_min INT,
    reps_max INT,
    eccentric INT,
    concentric INT,
    eccentricPause INT,
    concentricPause INT,
    FOREIGN KEY (workout_plan_day_id) REFERENCES workout_plan_day (id) ON DELETE CASCADE,
    FOREIGN KEY (excersise_id) REFERENCES excersises (id) ON DELETE CASCADE
);

CREATE TABLE workout_excersise_trainer_comments (
    id SERIAL PRIMARY KEY,
    workout_excersise_id INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    order_number INT NOT NULL,
    FOREIGN KEY (workout_excersise_id) REFERENCES workout_excersises (id) ON DELETE CASCADE
);

CREATE TABLE trainer_excersise_feedbacks (
    id SERIAL PRIMARY KEY,
    trainer_id INT NOT NULL,
    trainee_id INT NOT NULL,
    excersise_id INT NOT NULL,
    description VARCHAR(250) NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES trainers (id) ON DELETE CASCADE,
    FOREIGN KEY (trainee_id) REFERENCES trainees (id) ON DELETE CASCADE,
    FOREIGN KEY (excersise_id) REFERENCES excersises (id) ON DELETE CASCADE,
);

CREATE TABLE trainee_log_excersises (
    id SERIAL PRIMARY KEY,
    trainee_id INT NOT NULL,
    excersise_id INT NOT NULL,
    FOREIGN KEY (trainee_id) REFERENCES trainees (id) ON DELETE CASCADE,
    FOREIGN KEY (excersise_id) REFERENCES excersises (id) ON DELETE CASCADE,
);

CREATE TABLE trainee_log_excersise_entries (
    id SERIAL PRIMARY KEY,
    trainee_log_excersise_id INT NOT NULL,
    workout_plan_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (trainee_log_excersise_id) REFERENCES trainee_log_excersises (id) ON DELETE CASCADE,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans (id) ON DELETE CASCADE,
);

CREATE TABLE trainee_log_excersise_entry_sets (
    id SERIAL PRIMARY KEY,
    trainee_log_excersise_entry_id INT NOT NULL,
    sets_number INT NOT NULL,
    break_range_min_seconds INT NOT NULL,
    break_range_max_seconds INT,
    reps_range_min INT,
    reps_range_max INT,
    eccentric_length_seconds INT,
    concentric_length_seconds INT,
    eccentric_pause_length_seconds INT,
    concentric_pasue_length_seconds INT,
    FOREIGN KEY (trainee_log_excersise_entry_id) REFERENCES trainee_log_excersise_entries (id) ON DELETE CASCADE
);