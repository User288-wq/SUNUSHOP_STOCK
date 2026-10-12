describe('Reservations E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.loginViaApi('testadmin', 'test1234');
  });

  it('devrait afficher la liste des reservations', () => {
    cy.visit('/reservations');
    cy.contains(/reservation/i, { timeout: 10000 }).should('be.visible');
  });

  it('devrait naviguer vers le formulaire de mouvement', () => {
    cy.visit('/articles');
    cy.contains(/mouvement/i, { timeout: 5000 })
      .first()
      .click();
    cy.url({ timeout: 5000 }).should('include', '/stocks/movement');
  });
});