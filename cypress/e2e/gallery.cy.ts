import { MAX_THUMBNAIL_KEYS } from '../../src/utils/CONSTANTS';

type sizeType = Cypress.ViewportPreset | number[]

const sizes: sizeType[] = ['iphone-6', [1024, 768]]

describe('Image Gallery Mobile and Desktop', () => {
    sizes.forEach((size: sizeType) => {
        it('displays a constant number of images by default', () => {
            cy.visit('http://localhost:5173')
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.get('ul li').should('have.length', MAX_THUMBNAIL_KEYS)
        })
    
        it('fetches more images when reaching the bottom of current set of images', () => {
            cy.visit('http://localhost:5173')
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.get('ul li').should('have.length', MAX_THUMBNAIL_KEYS)
            cy.scrollTo('bottom', {duration: 1000})
            cy.get('ul li').should('have.length', 2*MAX_THUMBNAIL_KEYS)
        })
    
        it('clicking on an image in the gallery loads the related image modal', () => {
            cy.visit('http://localhost:5173')
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.get('ul li').should('have.length', MAX_THUMBNAIL_KEYS)
    
            cy.get('dialog img').should('not.exist')
    
            // Click on 4th picture
            cy.get('ul li:nth-of-type(4)').click()
            
            cy.get('dialog img').should('exist')
    
            // Should bring up full version of 4th picture
            cy.get('dialog img').should('have.attr', 'src').should('include','4')
        })
    
        it('closes image modal using close button or clicking outside modal', () => {
            cy.visit('http://localhost:5173')
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.get('ul li').should('have.length', MAX_THUMBNAIL_KEYS)
    
            cy.get('dialog img').should('not.exist')
    
            // Click on 4th picture
            cy.get('ul li:nth-of-type(4)').click()
            
            cy.get('dialog img').should('exist')
    
            // Should bring up full version of 4th picture
            cy.get('dialog img').should('have.attr', 'src').should('include','4')
    
            // Close with button
            cy.get('dialog button').click()
    
            cy.get('dialog img').should('not.exist')
    
            cy.get('ul li:nth-of-type(4)').click()
            
            cy.get('dialog img').should('exist')
    
            // Should bring up full version of 4th picture
            cy.get('dialog img').should('have.attr', 'src').should('include','4')
    
            // Close by clicking outside modal
            cy.get('body').click(0,0)
    
            cy.get('dialog img').should('not.exist')
        })
    })
})