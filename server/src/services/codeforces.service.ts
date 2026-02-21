import axios from 'axios';

export interface CodeforcesSubmission {
    id: number;
    contestId?: number;
    creationTimeSeconds: number;
    relativeTimeSeconds: number;
    problem: {
        contestId?: number;
        index: string;
        name: string;
        type: string;
        points?: number;
        rating?: number;
        tags: string[];
    };
    author: {
        contestId?: number;
        members: { handle: string }[];
        participantType: string;
        ghost: boolean;
        startTimeSeconds?: number;
    };
    programmingLanguage: string;
    verdict?: string;
    testset: string;
    passedTestCount: number;
    timeConsumedMillis: number;
    memoryConsumedBytes: number;
}

export class CodeforcesService {
    private static readonly BASE_URL = 'https://codeforces.com/api';

    static async getUserSubmissions(handle: string): Promise<CodeforcesSubmission[]> {
        try {
            const response = await axios.get(`${this.BASE_URL}/user.status`, {
                params: {
                    handle,
                    from: 1,
                    count: 100, // Fetch last 100 submissions for analysis
                },
            });

            if (response.data.status !== 'OK') {
                throw new Error('Codeforces API error: ' + response.data.comment);
            }

            return response.data.result;
        } catch (error: any) {
            console.error('Error fetching Codeforces submissions:', error.message);
            throw error;
        }
    }

    static async getUserInfo(handle: string) {
        try {
            const response = await axios.get(`${this.BASE_URL}/user.info`, {
                params: {
                    handles: handle,
                },
            });

            if (response.data.status !== 'OK') {
                throw new Error('Codeforces API error: ' + response.data.comment);
            }

            return response.data.result[0];
        } catch (error: any) {
            console.error('Error fetching Codeforces user info:', error.message);
            throw error;
        }
    }
}
