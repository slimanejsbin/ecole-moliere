import { faker } from '@faker-js/faker';

describe('Student Management', () => {
  beforeEach(() => {
    cy.login('admin@ecole-moliere.com', 'admin123');
    cy.visit('/students');
  });

  it('should list students with pagination', () => {
    cy.get('[data-testid="student-list"]').should('exist');
    cy.get('[data-testid="student-card"]').should('have.length.at.least', 1);
    cy.get('[data-testid="pagination"]').should('exist');
  });

  it('should add a new student successfully', () => {
    const studentData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      birthDate: '2010-01-01',
      class: '6ème A'
    };

    cy.get('[data-testid="add-student-button"]').click();
    cy.get('[data-testid="first-name-input"]').type(studentData.firstName);
    cy.get('[data-testid="last-name-input"]').type(studentData.lastName);
    cy.get('[data-testid="email-input"]').type(studentData.email);
    cy.get('[data-testid="birth-date-input"]').type(studentData.birthDate);
    cy.get('[data-testid="class-select"]').click().type(studentData.class + '{enter}');
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Student added successfully');
    
    cy.get('[data-testid="student-list"]')
      .should('contain', studentData.firstName)
      .and('contain', studentData.lastName);
  });

  it('should edit student information', () => {
    const newName = faker.person.firstName();
    
    cy.get('[data-testid="student-card"]').first().click();
    cy.get('[data-testid="edit-button"]').click();
    cy.get('[data-testid="first-name-input"]')
      .clear()
      .type(newName);
    cy.get('[data-testid="submit-button"]').click();

    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Student updated successfully');
    
    cy.get('[data-testid="student-card"]')
      .first()
      .should('contain', newName);
  });

  it('should delete a student', () => {
    cy.get('[data-testid="student-card"]').first().as('firstStudent');
    cy.get('@firstStudent').find('[data-testid="student-name"]').invoke('text').as('studentName');
    
    cy.get('@firstStudent').find('[data-testid="delete-button"]').click();
    cy.get('[data-testid="confirm-delete"]').click();

    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Student deleted successfully');
    
    cy.get('@studentName').then((name) => {
      cy.get('[data-testid="student-list"]').should('not.contain', name);
    });
  });

  it('should filter students by class', () => {
    cy.get('[data-testid="class-filter"]').click().type('6ème A{enter}');
    
    cy.get('[data-testid="student-card"]').each(($card) => {
      cy.wrap($card).should('contain', '6ème A');
    });
  });

  it('should search students by name', () => {
    const searchTerm = 'Mar';
    cy.get('[data-testid="search-input"]').type(searchTerm);
    
    cy.get('[data-testid="student-card"]').each(($card) => {
      cy.wrap($card).invoke('text').should('match', new RegExp(searchTerm, 'i'));
    });
  });
});
