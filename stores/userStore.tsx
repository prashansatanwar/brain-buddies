import { Submission } from "@/models/Submission";
import { User } from "@/models/User";
import { Row } from "@/models/Row";
import create from "zustand";

interface UserStoreState {
    user?: User;
    allUsers?: User[];
    // submissions?: [];
    myQuestions?: Submission[];
    allQuestions?: Row[];
    fetchStatus: "idle" | "fetching" | "error" | "success";
    error?: Error;

    fetchInitialData(userId: string): any;

    fetchAllUsers(): any;
    fetchUserData(userId: string): any;
    fetchMyQuestions(cfHandle: string): any;
    fetchAllQuestions(cfdata: { username: string; codeforcesHandle: string }, buddyIds: string[]): any;

    updateUser(userId: string, updates: any): any;
}

const compareSubmissions = (a: Submission, b: Submission): number => {
    const verdictOrder = ['WRONG_ANSWER', 'OK'];
    return verdictOrder.indexOf(a.verdict) - verdictOrder.indexOf(b.verdict);
};

async function getCfHandle(id: string): Promise<{ username: string | undefined; codeforcesHandle: string | undefined }> {
    try {
        const response = await fetch(`/api/user/${id}`);
        const data = await response.json();
        return {
        username: data.user?.username,
        codeforcesHandle: data.user?.codeforcesHandle,
        };
    } catch (error) {
        console.error(`Error fetching CF handle for user ${id}:`, error);
        return { username: undefined, codeforcesHandle: undefined };
    }
}

async function getALlQuestions(cfdata: { username: string ; codeforcesHandle: string }, buddyIds: string[]): Promise<Row[] | undefined> {
    const buddyData = await Promise.all(buddyIds.map(getCfHandle));
    const filteredBuddies = buddyData.filter((data) => data.codeforcesHandle !== undefined);

    console.log(filteredBuddies)

    const seenQuestions = new Map<string, Row>(); 

    const compareRows = (a: Row, b: Row): number => {
        const verdictOrder = ["WRONG_ANSWER","OK"]; 
        return verdictOrder.indexOf(a.user_verdict) - verdictOrder.indexOf(b.user_verdict);
    };

    for (const d of [cfdata, ...filteredBuddies]) {
        const cfHandle = d.codeforcesHandle!;
        const username = d.username!;
        const url = `https://codeforces.com/api/user.status?handle=${cfHandle}`;

        console.log(cfHandle,username);

        try {
            const submissionResponse = await fetch(url);
            const submissions = await submissionResponse.json();

            for (const item of submissions.result) {
                const questionKey = `${item.problem.contestId}-${item.problem.index}`;

                let question: Row = {
                    submissionId: -1,
                    question: "",
                    question_link: "",
                    source: "",
                    tags: [],
                    difficulty: "",
                    user_verdict: "",
                    buddies_verdict: []
                };

                if (!seenQuestions.has(questionKey) || compareRows(seenQuestions.get(questionKey)!, item) < 0) {
                    question = {
                        submissionId:item.id,
                        question: item.problem.name,
                        question_link: `https://codeforces.com/problemset/problem/${item.problem.contestId}/${item.problem.index}`,
                        source: 'Codeforces',
                        tags: item.problem.tags || [],
                        difficulty: item.problem.rating?.toString() || "Unrated",
                        user_verdict: cfHandle === cfdata.codeforcesHandle ? item.verdict : "Unknown",
                        buddies_verdict: [],
                    };

                    seenQuestions.set(questionKey, question); 
                }

                console.log(cfHandle)
                    
                if (cfHandle != cfdata.codeforcesHandle && username != cfdata.username) {
                    question.buddies_verdict.push({ username: username , verdict: item.verdict });
                }
                else {
                    question.buddies_verdict.push({ username: username , verdict: "Unknown"});

                }
            }

            } catch (error) {
                console.error(`Error fetching data for user ${username}:`, error);
                return undefined;
            }
    }


    const questionsArray = Array.from(seenQuestions.values());

    questionsArray.sort(((a: Row, b: Row) => b.submissionId - a.submissionId));

    return questionsArray;
            
}

async function getMyQuestions(cfHandle: string): Promise<Submission[] | undefined> {
    try {
        const url = `https://codeforces.com/api/user.status?handle=${cfHandle}`;
        const submissionsResponse = await fetch(url);
        const submissions = await submissionsResponse.json();
    
        const seenQuestions = new Map<string, Submission>();

        for(const item of submissions.result) {
            const questionKey = `${item.problem.contestId}-${item.problem.index}`;

            if(!seenQuestions.has(questionKey) || compareSubmissions(seenQuestions.get(questionKey)!,item) < 0) {
                seenQuestions.set(questionKey,item);
            }
        }

        const questionsArray = Array.from(seenQuestions.values());

        questionsArray.sort(((a: Submission, b:Submission) => b.id - a.id));

        return questionsArray;
    } catch (error) {
        console.error("Error fetching data",error);
        return undefined;
    }
}

async function getUser(userId: string): Promise<User | undefined> {
    try {
        const response = await fetch(`/api/user/${userId}`);
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error("Error fetching user",error);
        return undefined;
    }
}

async function getAllUsers(): Promise<User[] | undefined> {
    try {
        const response = await fetch("/api/user");
        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error("Error fetching users", error);
        return undefined;
    }
}

async function updateUser_(userId: string, updates: any) {
    try {
        const response = await fetch(`api/user/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates)
        });
    } catch (error) {
        console.error(`Error updating user ${userId}:`,error);
    }
}
  

export const useUserStore = create<UserStoreState>((set) => ({
    user: undefined,
    allUsers: undefined,
    // submissions: undefined,
    myquestions: undefined,
    allQuestions: undefined,
    fetchStatus: "idle",
    error: undefined,

    fetchInitialData: async (userId: string) => {
        set((state) => ({ fetchStatus: "fetching" }));

        try {
            const allUsers_ = await getAllUsers();
            const user_ = await getUser(userId);

            let myQuestions_: Submission[] | undefined;
            let allQuestions_: Row[] | undefined;
            
            if(user_ && user_.codeforcesHandle) {
                myQuestions_ = await getMyQuestions(user_.codeforcesHandle) ;
            }

            if(user_ && user_.username && user_.codeforcesHandle) {
                const buddies = user_.buddies || [];
                allQuestions_ = await getALlQuestions({username: user_.username, codeforcesHandle:user_.codeforcesHandle}, buddies);
            }

            set((state) => ({
                user: user_,
                allUsers: allUsers_,
                myQuestions: myQuestions_,
                allQuestions: allQuestions_,
                fetchStatus: "success"
            }))

        } catch (err) {
            console.error("Error fetching initial data:", err);
            set((state) => ({
                fetchStatus: "error",
                err
            }))
        }
    },

    fetchAllUsers: async () => {
        set((state) => ({ fetchStatus: "fetching" }));
        try {
            const allUsers_ = await getAllUsers();
            set((state) => ({
                allUsers: allUsers_,
                fetchStatus: "success"
            }))

        } catch (err) {
            console.error("Error fetching initial data:", err);
            set((state) => ({
                fetchStatus: "error",
                err
            }))
        }
    },
    
    fetchUserData: async (userId: string) => {
        set((state) => ({ fetchStatus: "fetching" }));
        try {
            const user_ = await getUser(userId);

            set((state) => ({
                user: user_,
                fetchStatus: "success"
            }))

        } catch (err) {
            console.error("Error fetching initial data:", err);
            set((state) => ({
                fetchStatus: "error",
                err
            }))
        }
    },

    fetchMyQuestions: async (cfHandle: string) => {
        set((state) => ({ fetchStatus: "fetching" }));

        try {
            const myQuestions_ = await getMyQuestions(cfHandle) ;

            set((state) => ({
                myQuestions: myQuestions_,
                fetchStatus: "success"
            }))

        } catch (err) {
            console.error("Error fetching initial data:", err);
            set((state) => ({
                fetchStatus: "error",
                err
            }))
        }
    },

    fetchAllQuestions: async (cfdata, buddyIds) => {
        set((state) => ({ fetchStatus: "fetching" }));

        try {
            const allQuestions_ = await getALlQuestions(cfdata,buddyIds) ;

            set((state) => ({
                allQuestions: allQuestions_,
                fetchStatus: "success"
            }))

        } catch (err) {
            console.error("Error fetching initial data:", err);
            set((state) => ({
                fetchStatus: "error",
                err
            }))
        }
    },

    updateUser: async (userId: string, updates: any) => {
        set((state) => ({ fetchStatus: "fetching" }));

        try {
            await updateUser_(userId, updates);
            const user_ = await getUser(userId);
            set((state) => ({ 
                user:user_,
                fetchStatus: "success"
            }));
        } catch (err) {
            console.error(err);
            set((state) => ({
                fetchStatus: "error",
                err
            }))
        }
    }

}))