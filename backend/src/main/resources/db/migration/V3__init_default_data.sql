-- Default Roles
INSERT INTO roles (name, description, is_active, created_at) VALUES
('ROLE_ADMIN', 'Administrateur système', true, NOW()),
('ROLE_DIRECTOR', 'Directeur d''école', true, NOW()),
('ROLE_TEACHER', 'Enseignant', true, NOW()),
('ROLE_STUDENT', 'Étudiant', true, NOW()),
('ROLE_PARENT', 'Parent d''élève', true, NOW()),
('ROLE_STAFF', 'Personnel administratif', true, NOW());

-- Default Permissions
INSERT INTO permissions (name, description, resource_name, type, is_active, created_at) VALUES
-- User Management
('USER_CREATE', 'Créer un utilisateur', 'USER', 'CREATE', true, NOW()),
('USER_READ', 'Voir les utilisateurs', 'USER', 'READ', true, NOW()),
('USER_UPDATE', 'Modifier un utilisateur', 'USER', 'UPDATE', true, NOW()),
('USER_DELETE', 'Supprimer un utilisateur', 'USER', 'DELETE', true, NOW()),

-- Student Management
('STUDENT_CREATE', 'Inscrire un étudiant', 'STUDENT', 'CREATE', true, NOW()),
('STUDENT_READ', 'Voir les étudiants', 'STUDENT', 'READ', true, NOW()),
('STUDENT_UPDATE', 'Modifier un étudiant', 'STUDENT', 'UPDATE', true, NOW()),
('STUDENT_DELETE', 'Supprimer un étudiant', 'STUDENT', 'DELETE', true, NOW()),

-- Teacher Management
('TEACHER_CREATE', 'Ajouter un enseignant', 'TEACHER', 'CREATE', true, NOW()),
('TEACHER_READ', 'Voir les enseignants', 'TEACHER', 'READ', true, NOW()),
('TEACHER_UPDATE', 'Modifier un enseignant', 'TEACHER', 'UPDATE', true, NOW()),
('TEACHER_DELETE', 'Supprimer un enseignant', 'TEACHER', 'DELETE', true, NOW()),

-- Class Management
('CLASS_CREATE', 'Créer une classe', 'CLASS', 'CREATE', true, NOW()),
('CLASS_READ', 'Voir les classes', 'CLASS', 'READ', true, NOW()),
('CLASS_UPDATE', 'Modifier une classe', 'CLASS', 'UPDATE', true, NOW()),
('CLASS_DELETE', 'Supprimer une classe', 'CLASS', 'DELETE', true, NOW()),

-- Subject Management
('SUBJECT_CREATE', 'Créer une matière', 'SUBJECT', 'CREATE', true, NOW()),
('SUBJECT_READ', 'Voir les matières', 'SUBJECT', 'READ', true, NOW()),
('SUBJECT_UPDATE', 'Modifier une matière', 'SUBJECT', 'UPDATE', true, NOW()),
('SUBJECT_DELETE', 'Supprimer une matière', 'SUBJECT', 'DELETE', true, NOW());

-- Assign Permissions to Admin Role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ROLE_ADMIN';

-- Create default admin user (password: admin123)
INSERT INTO users (
    first_name,
    last_name,
    email,
    password,
    must_change_password,
    is_active,
    created_at
) VALUES (
    'Admin',
    'System',
    'admin@ecolemoliere.ma',
    '$2a$10$ZuGgeoawgOg.6AM3QEGZ3O4QlBSWyRx3A70oIP9ordWjm/pxNz6ji',
    true,
    true,
    NOW()
);

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@ecolemoliere.ma'
AND r.name = 'ROLE_ADMIN';
