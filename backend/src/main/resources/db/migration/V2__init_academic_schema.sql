-- School Classes table
CREATE TABLE school_classes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    grade_level INT NOT NULL,
    section VARCHAR(100),
    max_students INT,
    class_teacher_id BIGINT,
    room VARCHAR(200),
    description VARCHAR(500),
    academic_year VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    created_by VARCHAR(100),
    updated_at DATETIME,
    updated_by VARCHAR(100),
    version INT DEFAULT 0,
    FOREIGN KEY (class_teacher_id) REFERENCES teachers(id)
);

-- Students table
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(100),
    gender VARCHAR(10) NOT NULL,
    nationality VARCHAR(100),
    address VARCHAR(200),
    class_id BIGINT,
    enrollment_date DATE,
    medical_info VARCHAR(500),
    notes VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    created_by VARCHAR(100),
    updated_at DATETIME,
    updated_by VARCHAR(100),
    version INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES school_classes(id)
);

-- Teachers table
CREATE TABLE teachers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    hire_date DATE NOT NULL,
    specialization VARCHAR(200),
    qualifications VARCHAR(500),
    notes VARCHAR(500),
    is_class_teacher BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    created_by VARCHAR(100),
    updated_at DATETIME,
    updated_by VARCHAR(100),
    version INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Subjects table
CREATE TABLE subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    description VARCHAR(500),
    credit_hours INT,
    department VARCHAR(100),
    is_mandatory BOOLEAN DEFAULT TRUE,
    passing_grade INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    created_by VARCHAR(100),
    updated_at DATETIME,
    updated_by VARCHAR(100),
    version INT DEFAULT 0
);

-- Teacher Subjects junction table
CREATE TABLE teacher_subjects (
    teacher_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    PRIMARY KEY (teacher_id, subject_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- Teacher Classes junction table
CREATE TABLE teacher_classes (
    teacher_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    PRIMARY KEY (teacher_id, class_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (class_id) REFERENCES school_classes(id)
);

-- Class Subjects junction table
CREATE TABLE class_subjects (
    class_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    PRIMARY KEY (class_id, subject_id),
    FOREIGN KEY (class_id) REFERENCES school_classes(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
