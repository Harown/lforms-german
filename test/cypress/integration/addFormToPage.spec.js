import { AddFormToPageTestPage } from "../support/addFormToPageTest.po";
import {TestUtil} from "../support/testUtilFacade.js";
import * as util from "../support/util";
import {facadeExpect as expect, protractor, by, element, browser} from "../support/protractorFacade.js";
const po = new AddFormToPageTestPage();
//const cypressExpect = expect;
//expect = facadeExpect;

describe('addFormToPage test page', function() {
  before(() => {
    po.openPage();
    util.addFormToPage('lforms/allInOne.json', 'formContainer');

    util.addFormToPage('lforms/rxTerms.json', 'formContainer2');
  });

  it('should have two forms displayed on the page', function() {
    // three tags
    element.all(by.tagName('wc-lhc-form')).then(function (items) {
      expect(items.length).toBe(2);
    });
    // two forms
    element.all(by.css('.lhc-form-title')).then(function (items) {
      expect(items.length).toBe(2);
    });
  });


  it('should have a drug name field in the RxTerms form', function() {
    po.rxDrugNameField.should('be.visible');
    po.searchResults.should('not.be.visible');
    TestUtil.sendKeys(po.rxDrugNameField, 'ar');
    po.searchResults.should('be.visible');
    po.rxDrugNameField.getCyElem().clear();
  });


  it('should have a drug name field in the "full featured" form', function() {
    po.ffDrugNameField.click();
    po.searchResults.should('not.be.visible');
    po.ffDrugNameField.should('be.visible');
    TestUtil.sendKeys(po.ffDrugNameField, 'ar');
    po.searchResults.should('be.visible');
    po.ffDrugNameField.getCyElem().clear();
  });

  it('DTM datetime picker should work', function () {
    var minMax = [TestUtil.getCurrentDTMString(-60000), TestUtil.getCurrentDTMString(+60000)]; // -/+ a minute
    let dtmInput = element(by.id('/type7/1')).element(by.css("input"));
    let nowButton = element(by.css(".ant-picker-now-btn"));
    let okButton = element(by.css(".ant-picker-ok")).element(by.css("button"))
    dtmInput.click();
    nowButton.click()
    okButton.click()
    dtmInput.getCyElem().invoke('val').then((value)=>{
      expect(value >= minMax[0]);
      expect(value <= minMax[1]);
      console.log('A'); console.log(value); console.log('b');
    });
  });

  it('should be able to display a very nested form', function() {
    util.addFormToPage('lforms/very-nested-form.json', 'formContainer'); // uses addFormToPage
    cy.get('#formContainer').should('contain', 'NestedQ');
    // Make sure the error message div is blank
    expect(element(by.id('loadMsg')).getText()).toBe('');
  });


  describe('addFormToPage', function () {
    beforeEach(()=> {
      po.openPage();
      // Pre-condition -- Form USSG-FHT should not be in formContainer
      cy.get("#formContainer").invoke('html').should(
        html=>expect(html.indexOf("USSG-FHT")).toBe(-1));
      const lformsFHTFile = 'test/data/lforms/FHTData.json';
      cy.readFile(lformsFHTFile).then((formDef) => {
        cy.window().then(win=>{
          win.FHTData = formDef;
        });
      });
    });

    it('should be able to be called with FHIR Questionnaire', function () {
      // Put form USSG-FHT on the page using a FHIR object
      const fhirFHTFile = 'test/data/R4/ussg-fhp.json';
      cy.readFile(fhirFHTFile).then((fhirData) => {
        cy.window().then(win=>{
          win.LForms.Util.addFormToPage(fhirData, 'formContainer', { fhirVersion: 'R4' });
        });
      });
      cy.get('.lhc-form-title').should('exist');
      cy.get('#formContainer').should('contain', "US Surgeon General family health portrait");
    });

    it('should be able to called a second time with a new form for the same form '+
       'container', function() {
      // Now put form USSG-FHT on the page, using the variable name method
      // (FHTData).
      cy.window().then(win=>
        win.LForms.Util.addFormToPage('FHTData', 'formContainer')
      );
      // Confirm it is there
      cy.get('#formContainer').should('contain', "USSG-FHT");
    });

    it('should be able to take a form object',  function() {
      // Now put form USSG-FHT on the page, using the form object method
      cy.window().then(win=>
        win.LForms.Util.addFormToPage(win.FHTData, 'formContainer')
      );
      // Confirm it is there
      cy.get('#formContainer').should('contain', "USSG-FHT");
    });

    it('should be able to take a JSON form definition',  function() {
      // Now put form USSG-FHT on the page, using the form JSON string method
      cy.window().then(win=>
        win.LForms.Util.addFormToPage(JSON.stringify(win.FHTData), 'formContainer')
      );
      // Confirm it is there
      cy.get('#formContainer').should('contain', "USSG-FHT");
    });

  });
});
