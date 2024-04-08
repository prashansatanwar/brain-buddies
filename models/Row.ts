export interface Row {
    submissionId: number,
    question: string,
    question_link: string,
    source: string,
    tags: string[],
    difficulty: string,
    user_verdict: string; 
    buddies_verdict: { username: string; verdict: string }[];
  }