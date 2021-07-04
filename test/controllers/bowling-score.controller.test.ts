import { Request, Response } from 'express';
import { HttpCodes } from 'typed-rest-client/HttpClient';
import { BowlingScoreController } from '../../src/controllers';

/**
 * API Tests
 * 
 * @group api
 */

class BowlingScoreControllerTest {
    private static instance: BowlingScoreControllerTest;
    private mockRequest: Partial<Request> = { };
    private mockResponse: Partial<Response> = { };

    private constructor (
        private scoreController = new BowlingScoreController()
    ) {
    }

    private resetJestMocks(): void {
        this.mockRequest = { };
        this.mockResponse = {
            status: jest.fn().mockImplementation((a: any) => this.mockResponse),
            json: jest.fn().mockImplementation((a: any) => this.mockResponse)
        };
    }

    public static getInstance(): BowlingScoreControllerTest {
        if (!this.instance) {
            this.instance = new BowlingScoreControllerTest();
        }

        return this.instance;
    }

    public async testGetScoreCard(frameThrows: string, expectedHttpStatus: HttpCodes): Promise<void> {
        this.resetJestMocks();

        this.mockRequest = { query: { throws: frameThrows } };
        const realResponse: Response = await this.scoreController.getScoreCard(this.mockRequest as Request,
                                                                               this.mockResponse as Response);

        expect(this.mockResponse.status).toHaveBeenCalledWith(expectedHttpStatus);
        expect(this.mockResponse.json).toHaveBeenCalled();
    }

}

describe('Simple happy path case', () => {
    test('Test a simple case of 1 throw ', async () => {
        BowlingScoreControllerTest.getInstance().testGetScoreCard('6', HttpCodes.OK);
    });
});

describe('Simple sad path case', () => {
    test('Test where no input was actually provided', async () => {
        BowlingScoreControllerTest.getInstance().testGetScoreCard('', HttpCodes.BadRequest);
    });

    test('Test a simple case of 1 throw containing invalid input', async () => {
        BowlingScoreControllerTest.getInstance().testGetScoreCard('X', HttpCodes.BadRequest);
    });

    test('Test a case of 1 throw containing too many pins', async () => {
        BowlingScoreControllerTest.getInstance().testGetScoreCard('10,10', HttpCodes.BadRequest);
    });

    test('Test where too many throws were entered', async () => {
        const frameThrows: string = new Array(100).fill('1').join(',');

        BowlingScoreControllerTest.getInstance().testGetScoreCard(frameThrows, HttpCodes.BadRequest);
    });

    test('Test a case where a throw contains too many pins', async () => {
        BowlingScoreControllerTest.getInstance().testGetScoreCard('26,58', HttpCodes.BadRequest);
    });

    test('Test a case where a throw contains a negative number of pins', async () => {
        BowlingScoreControllerTest.getInstance().testGetScoreCard('-2,-5', HttpCodes.BadRequest);
    });
});
