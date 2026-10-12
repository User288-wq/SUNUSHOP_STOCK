describe('Articles E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.loginViaApi('testadmin', 'test1234');
  });

  it('devrait afficher la liste des articles', () => {
    cy.visit('/articles');
    cy.contains(/liste des articles/i, { timeout: 10000 }).should('be.visible');
  });

  it('devrait naviguer vers le dashboard', () => {
    cy.visit('/dashboard');
    cy.contains(/tableau de bord|dashboard/i, { timeout: 10000 }).should('be.visible');
  });
});