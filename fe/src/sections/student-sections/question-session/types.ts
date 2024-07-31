export type Question={
    id:number;
    qtype:string;
    subject:string;
    question:string;
    description:string;
    level:string;
}

//open is similar to question 

export type Coding= Question & {
    template:string;
}

export type SingleChoice=Question & {
    options:string[];
}

export type Evaluation={
    score:number;
    correct_answer:string;
    assessment:string;
}
