export interface Submission {
    id: number;
    problem: {
        contestId: number;
        index: string;
        name: string;
        tags: string[];
        rating: string;
    };
    programmingLanguage: string;
    author: { handle: string }; // Assuming author field exists
    verdict: string;
  }