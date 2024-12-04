import { faker } from '@faker-js/faker';

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should successfully login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('admin@ecole-moliere.com');
    cy.get('[data-testid="password-input"]').type('admin123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-profile"]').should('exist');
  });

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@email.com');
    cy.get('[data-testid="password-input"]').type('wrongpass');
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('should successfully register a new user', () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    
    cy.get('[data-testid="register-link"]').click();
    cy.get('[data-testid="name-input"]').type(faker.person.fullName());
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="confirm-password-input"]').type(password);
    cy.get('[data-testid="register-button"]').click();
    
    cy.url().should('include', '/dashboard');
  });

  it('should reset password successfully', () => {
    cy.get('[data-testid="forgot-password-link"]').click();
    cy.get('[data-testid="email-input"]').type('admin@ecole-moliere.com');
    cy.get('[data-testid="reset-button"]').click();
    
    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Reset instructions sent');
  });

  it('should logout successfully', () => {
    cy.login('admin@ecole-moliere.com', 'admin123');
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();
    
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-testid="login-button"]').should('exist');
  });
});
