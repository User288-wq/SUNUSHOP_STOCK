describe('Authentication E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('devrait afficher la page de connexion', () => {
    cy.visit('/login');
    cy.contains(/connexion/i, { timeout: 10000 }).should('be.visible');
    cy.get('input').should('have.length.at.least', 2);
    cy.get('button[type="submit"]').should('exist');
  });

  it('devrait avoir un formulaire fonctionnel (remplissage)', () => {
    cy.visit('/login');
    cy.get('input').eq(0).clear().type('testadmin');
    cy.get('input[type="password"]').clear().type('test1234');
    cy.get('input').eq(0).should('have.value', 'testadmin');
    cy.get('input[type="password"]').should('have.value', 'test1234');
  });

  it('devrait se connecter via API et acceder aux articles', () => {
    cy.loginViaApi('testadmin', 'test1234');
    cy.contains(/liste des articles/i, { timeout: 10000 }).should('be.visible');
  });
});