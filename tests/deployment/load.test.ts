import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Montée progressive à 100 utilisateurs
    { duration: '5m', target: 100 }, // Maintien de la charge
    { duration: '2m', target: 200 }, // Montée à 200 utilisateurs
    { duration: '5m', target: 200 }, // Test de charge
    { duration: '2m', target: 0 },   // Retour au calme
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% des requêtes sous 500ms
    'http_req_failed': ['rate<0.01'],   // Moins de 1% d'erreurs
  },
};

const BASE_URL = __ENV.API_URL || 'https://api.ecole-moliere.com';
const TOKEN = __ENV.AUTH_TOKEN;

export function setup() {
  // Login pour obtenir un token
  const loginRes = http.post(`${BASE_URL}/auth/login`, {
    email: 'test@ecole-moliere.com',
    password: 'test123',
  });
  
  return {
    token: loginRes.json('token'),
  };
}

export default function(data) {
  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  // Test des endpoints critiques
  group('Critical Endpoints', () => {
    // Dashboard
    const dashboardRes = http.get(`${BASE_URL}/api/dashboard`, { headers });
    check(dashboardRes, {
      'dashboard status 200': (r) => r.status === 200,
      'dashboard load time OK': (r) => r.timings.duration < 1000,
    });
    
    // Liste des étudiants
    const studentsRes = http.get(`${BASE_URL}/api/students?page=1&size=10`, { headers });
    check(studentsRes, {
      'students status 200': (r) => r.status === 200,
      'students load time OK': (r) => r.timings.duration < 1000,
    });
    
    // Liste des classes
    const classesRes = http.get(`${BASE_URL}/api/classes`, { headers });
    check(classesRes, {
      'classes status 200': (r) => r.status === 200,
      'classes load time OK': (r) => r.timings.duration < 800,
    });
  });

  // Test des opérations d'écriture
  group('Write Operations', () => {
    // Création d'un étudiant
    const studentData = {
      firstName: 'Test',
      lastName: 'Student',
      email: `test.student.${Date.now()}@ecole-moliere.com`,
      classId: 1,
    };
    
    const createStudentRes = http.post(
      `${BASE_URL}/api/students`,
      JSON.stringify(studentData),
      { headers }
    );
    
    check(createStudentRes, {
      'create student status 201': (r) => r.status === 201,
      'create student time OK': (r) => r.timings.duration < 1200,
    });
    
    // Mise à jour d'une note
    const gradeData = {
      studentId: 1,
      subjectId: 1,
      value: 15,
      date: new Date().toISOString(),
    };
    
    const createGradeRes = http.post(
      `${BASE_URL}/api/grades`,
      JSON.stringify(gradeData),
      { headers }
    );
    
    check(createGradeRes, {
      'create grade status 201': (r) => r.status === 201,
      'create grade time OK': (r) => r.timings.duration < 1000,
    });
  });

  // Test des recherches
  group('Search Operations', () => {
    const searchRes = http.get(
      `${BASE_URL}/api/students/search?query=Martin`,
      { headers }
    );
    
    check(searchRes, {
      'search status 200': (r) => r.status === 200,
      'search time OK': (r) => r.timings.duration < 1500,
      'search results OK': (r) => r.json('total') >= 0,
    });
  });

  // Test du cache
  group('Cache Efficiency', () => {
    // Premier appel
    const firstCall = http.get(`${BASE_URL}/api/classes/1`, { headers });
    
    // Deuxième appel (devrait être plus rapide)
    const secondCall = http.get(`${BASE_URL}/api/classes/1`, { headers });
    
    check(secondCall, {
      'cached response faster': (r) => r.timings.duration < firstCall.timings.duration,
      'cache headers present': (r) => r.headers['cache-control'] !== undefined,
    });
  });

  sleep(1);
}

export function teardown(data) {
  // Nettoyage des données de test si nécessaire
  http.del(`${BASE_URL}/api/test/cleanup`, {
    headers: {
      'Authorization': `Bearer ${data.token}`,
    },
  });
}
