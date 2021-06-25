export const apiHealth = {
    get: {
        tags: ['ApiHealth'],
        description: "Returns the health status of the API.",
        operationId: 'getApiHealth',
        responses: {
            "200": {          
                description: "The health of the API.",
                "content": {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                status: {
                                    type: 'string',
                                    description: 'The health status of the API'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
} 