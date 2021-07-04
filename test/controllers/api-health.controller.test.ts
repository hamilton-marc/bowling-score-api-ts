import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiHealthController } from '../../src/controllers';

/**
 * API Tests
 * 
 * @group api
 */

class ApiHealthControllerTest {
    private static instance: ApiHealthControllerTest;
    private mockRequest: Partial<Request> = { };
    private mockResponse: Partial<Response> = { };

    private constructor (
        private healthController = new ApiHealthController()
    ) {
    }

    private resetJestMocks(): void {
        this.mockRequest = { };
        this.mockResponse = {
            status: jest.fn().mockImplementation((a: any) => this.mockResponse),
            json: jest.fn().mockImplementation((a: any) => this.mockResponse)
        };
    }

    public static getInstance(): ApiHealthControllerTest {
        if (!this.instance) {
            this.instance = new ApiHealthControllerTest();
        }

        return this.instance;
    }

    public testApiHealth(expectedHttpStatus: number = StatusCodes.OK): void {
        this.resetJestMocks();

        const realResponse: Response = this.healthController.getMessage (this.mockRequest as Request,
                                                                         this.mockResponse as Response);

        expect(this.mockResponse.status).toHaveBeenCalledWith(expectedHttpStatus);
        expect(this.mockResponse.json).toHaveBeenCalled()
    }
}

describe('Simple happy path case', () => {
    test('Test to make sure our Api Health Controller returns Ok', () => {
        ApiHealthControllerTest.getInstance().testApiHealth();
    });
});

