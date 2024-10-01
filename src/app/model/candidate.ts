export type CandidateFetch = {
    jmbg: string
    firstName: string
    lastName: string
    birthYear: number
    email: string
    phone: string
    employed: boolean
    lastUpdated: number
}

export class Candidate {
    constructor(
        public jmbg: string,
        public firstName: string,
        public lastName: string,
        public birthYear: number,
        public email: string,
        public phone: string,
        public employed: boolean,
        public lastUpdated: Date,
    ) {}

    static fromFetch(candidateRaw: CandidateFetch) {
        return new Candidate(
            candidateRaw.jmbg,
            candidateRaw.firstName,
            candidateRaw.lastName,
            candidateRaw.birthYear,
            candidateRaw.email,
            candidateRaw.phone,
            candidateRaw.employed,
            new Date(candidateRaw.lastUpdated),
        )
    }
}
