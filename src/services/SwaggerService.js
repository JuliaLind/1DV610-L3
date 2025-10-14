// import fs from 'fs/promises'
// import swaggerUi from 'swagger-ui-express'

// /**
//  * Service to handle Swagger UI and document retrieval.
//  */
// export class SwaggerService {
//     #pathToDocument = './src/config/swagger-spec.json'

//     /**
//      * Get the Swagger UI configuration.
//      *
//      * @returns {Object} - The Swagger UI configuration.
//      */
//     async getSwaggerUi() {
//         const swaggerDocument = await this.getSwaggerDocument()

//         return {
//             serve: swaggerUi.serve,
//             setup: swaggerUi.setup(swaggerDocument)
//         }
//     }

//     /**
//      * Get the Swagger document to use for swagger setup.
//      *
//      * @returns {object} - the UI specification
//      */
//     async getSwaggerDocument() {
//         const swaggerDocument = JSON.parse(await fs.readFile(this.#pathToDocument, 'utf-8'))

//         return swaggerDocument
//     }
// }