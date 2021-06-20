import { Request, Response } from 'express';
import { HttpCodes } from 'typed-rest-client/HttpClient';
import { BowlingScoreController } from '../../src/controllers';

class BowlingScoreControllerTest {
    private static instance: BowlingScoreControllerTest;
    private mockRequest: Partial<Request> = { };
    private mockResponse: Partial<Response> = { };

    private constructor (
        private scoreController = new BowlingScoreController()
    ) {
    }

    /**
     * Unfortunately we have to repeat code due to Typescript compilation issues
     * :facepalm
     */
    private resetJestMocks(): void {
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
    test('Test a simple case of 1 throw containing invalid input', async () => {
        BowlingScoreControllerTest.getInstance().testGetScoreCard('X', HttpCodes.BadRequest);
    });
});