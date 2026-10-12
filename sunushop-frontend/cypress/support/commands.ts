// ***********************************************
// Commandes personnalisees Cypress
// Login via API + injection localStorage (bonnes cles)
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      loginViaApi(username: string, password: string): Chainable<void>;
      loginWithUi(username: string, password: string): Chainable<void>;
    }
  }
}

// Login via API + injection dans localStorage avec les BONNES cles
Cypress.Commands.add('loginViaApi', (username: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8081/api/v2/auth/login',
    body: { username, password }
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');

    const token = response.body.token;
    const user = {
      username: response.body.username,
      role: response.body.role
    };

    // Injecter dans localStorage AVANT le chargement de la page
    cy.visit('/articles', {
      onBeforeLoad(win) {
        win.localStorage.setItem('sunushop_token', token);
        win.localStorage.setItem('sunushop_user', JSON.stringify(user));
      }
    });
  });
});

// Login via UI (pour tester le formulaire)
Cypress.Commands.add('loginWithUi', (username: string, password: string) => {
  cy.visit('/login');
  cy.get('input', { timeout: 10000 }).should('have.length.at.least', 2);
  cy.get('input').eq(0).clear().type(username);
  cy.get('input[type="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
});

export {};