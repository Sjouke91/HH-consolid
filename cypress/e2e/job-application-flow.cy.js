context('Job application flow', function () {
  beforeEach(function () {
    const customer = 'DirectImpact';
    cy.fixture('customerFormArray.json').then((arr) => {
      this.customerObject = arr.find((el) => el.customer === customer);
    });
    cy.log(`Visiting http://localhost:8080`);
    cy.visit('/');
    // cy.setCookie('cookieAccepted', 'necessary,statistics,marketing');
    // cy.get('.c-cookiewall__button-wrapper').first().click();
  });

  it('1. CHECK IF PAGE BODY EXISTS', () => {
    cy.get('#page-body').should('have.length', 1);
  });

  it('2. CHECK IF IT HAS A TITLE TAG', () => {
    cy.get('head title').should('have.length', 1);
  });

  it('3. CHECK IF canonical/alternate/x-default IS SET UP', () => {
    cy.get('head link[rel="canonical"]')
      .should('have.length', 1)
      .and('have.attr', 'href')
      .and('not.be.empty');

    cy.get('head link[rel="alternate"]')
      .should('have.length', 1)
      .and('have.attr', 'href')
      .and('not.be.empty');

    cy.get('head link[rel="x-default"]')
      .should('have.length', 1)
      .and('have.attr', 'href')
      .and('not.be.empty');
  });

  it('4. CHECK IF LISTER HAS JOBS', () => {
    cy.log(
      `Visiting http://localhost:8080/${this.ctx.customerObject.jobListerUrl}`,
    );
    cy.visit(this.ctx.customerObject.jobListerUrl);

    cy.get('.c-job-lister-block__outer-wrapper').should('be.visible');
    cy.get('.c-job-lister-block__vacancy-container > a')
      .its('length') // calls 'length' property returning that value
      .should('be.gt', 5);
  });

  it(
    '5. CHECK IF APPLICATION SUCCESS MESSAGE SHOWS',
    { scrollBehavior: 'center' },
    () => {
      cy.log(
        `Visiting http://localhost:8080/${this.ctx.customerObject.jobListerUrl}`,
      );
      cy.visit(this.ctx.customerObject.jobListerUrl);

      cy.get('.c-vacancy-list-item__vacancy-card').first().click();
      cy.location('pathname').should('include', '/job/');

      cy.get('.c-sticky-header__outer-wrapper').should('be.visible');
      cy.get('.c-sticky-header__application-button').first().click();
      cy.location('pathname').should('include', '/application');

      //fill in form
      this.ctx.customerObject.formFields.forEach((el) => {
        if (el.type === 'text')
          return cy.get(el.id).should('be.visible').type(el.testInput);
        if (el.type === 'file')
          return cy.get(el.id).should('be.visible').selectFile(el.testInput);
        if (el.type === 'checkbox') return cy.get(el.id).should('be.visible');
      });

      if (this.ctx.customerObject.checkBoxes)
        return cy.get('[type="checkbox"]').check({ force: true });

      //intercept post request
      cy.intercept(
        { method: 'POST', url: '/api/post-application-form' },
        {
          statusCode: 200,
          body: {
            message: 'cypress test success',
            status: 'success',
            data: { atsId: 'test', insertedId: 'test' },
          },
        },
      ).as('postApplication');

      cy.get('.c-application-form__form-submit-button')
        .should('be.visible')
        .click();
      cy.wait('@postApplication').then((res) => {
        cy.log('res: ', res);
      });
      //check if success message is showing
      cy.get('.c-application_success-container').should('be.visible');
      cy.location('search').should('include', 'success');
      cy.log('application succesful');
    },
  );

  it(
    '6. CHECK IF APPLICATION ERROR MESSAGE SHOWS',
    { scrollBehavior: 'center' },
    () => {
      cy.log(
        `Visiting http://localhost:8080/${this.ctx.customerObject.jobListerUrl}`,
      );
      cy.visit(this.ctx.customerObject.jobListerUrl);

      cy.get('.c-vacancy-list-item__vacancy-card').first().click();
      cy.location('pathname').should('include', '/job/');

      cy.get('.c-sticky-header__outer-wrapper').should('be.visible');
      cy.get('.c-sticky-header__application-button').first().click();
      cy.location('pathname').should('include', '/application');

      //fill in form
      this.ctx.customerObject.formFields.forEach((el) => {
        if (el.type === 'text')
          return cy.get(el.id).should('be.visible').type(el.testInput);
        if (el.type === 'file')
          return cy.get(el.id).should('be.visible').selectFile(el.testInput);
        if (el.type === 'checkbox') return cy.get(el.id).should('be.visible');
      });

      if (this.ctx.customerObject.checkBoxes)
        return cy.get('[type="checkbox"]').check({ force: true });

      //intercept post request
      cy.intercept(
        { method: 'POST', url: '/api/post-application-form' },
        {
          statusCode: 422,
          body: {
            message: 'cypress test error',
            status: 'error',
            data: { atsId: 'test', insertedId: 'test' },
          },
        },
      ).as('postApplication');
      cy.get('.form-submit-button').should('be.visible').click();
      cy.wait('@postApplication').then((res) => {
        cy.log('res: ', res);
      });

      //check if success message is showing
      cy.get('.c-application_error-container').should('be.visible');
      cy.location('search').should('include', 'error');
      cy.log('application unsuccessful');
    },
  );

  // it('7. CHECK IF DATALAYER AND GTM IS LOADED', () => {
  //   cy.window().then((window) => {
  //     assert.exists(window.dataLayer, 'window.dataLayer exists');

  //     it('looks inside script gtm', () => {
  //       cy.get('head script[data-type="gtm-script"]')
  //         .should('have.length', 1)
  //         .and('not.be.empty');
  //     });

  //     assert.isDefined(
  //       window.dataLayer.find((x) => x.event === 'gtm.js'),
  //       'GTM is loaded',
  //     );
  //     assert.exists(
  //       window.dataLayer.find(
  //         (y) => y.hasOwnProperty('gtm.uniqueEventId'),
  //         'GTM returns event unique ID',
  //       ),
  //     );
  //   });
  // });

  it('8. CHECK IF IT HAS A SEGMENT KEY', () => {
    cy.window({ timeout: 2000 }).then((window) => {
      if (window.__NEXT_DATA__.runtimeConfig.SEGMENT_KEY) {
        assert.isDefined(
          window.__NEXT_DATA__.runtimeConfig.SEGMENT_KEY,
          'Segment key exists and is defined',
        );
        // assert
        //   .exists(
        //     window.__NEXT_DATA__.runtimeConfig.hasOwnProperty('SEGMENT_KEY'),
        //     'Segment key exists',
        //   )
        //   .should('not.have.value', undefined || null);
        // assert.isDefined(
        //   window.__NEXT_DATA__.runtimeConfig.SEGMENT_KEY,
        //   'Segment key is defined',
        // );

        // cy.wait(3000);
      } else {
        cy.log('client has no Segment implementation enabled');
      }
    });
  });

  it('9. CHECK IF IT HAS A SEGMENT AND ANALYTICS KEY AND IS INITIALIZED', () => {
    cy.window({ timeout: 10000 }).then((window) => {
      if (window.__NEXT_DATA__.runtimeConfig.SEGMENT_KEY) {
        assert.exists(
          window.__NEXT_DATA__.runtimeConfig.hasOwnProperty('SEGMENT_KEY'),
          'Segment key exists',
        );

        // assert.isDefined(
        //   window.__NEXT_DATA__.runtimeConfig.SEGMENT_KEY,
        //   'Segment key is defined',
        // );

        assert.exists(window.analytics.initialized, 'Segment is initialized');

        // assert
        //   .exists(
        //     window.analytics.hasOwnProperty('initialized'),
        //     'Segment initialized exists',
        //   )
        //   .should('have.value', true);

        expect(window.analytics.initialized).to.be.true;

        // cy.wait(2000).then(() => {
        //   assert.exists(
        //     window.analytics.hasOwnProperty('initialized'),
        //     'Segment initialized exists',
        //   );

        //   assert.isTrue(
        //     window.analytics.initialized === true,
        //     'Segment initianlized is true',
        //   );
        // });
      } else {
        cy.log('client has no Segment implementation enabled');
      }
    });
  });

  // TODO => Each page should have all the SEO properties
  // TODO => Forms should be focusable and sendable (we can block api routes on NODE ENV TEST)
});
