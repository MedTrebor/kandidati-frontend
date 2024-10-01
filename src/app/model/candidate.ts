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

export type CandidateInsert = {
    jmbg: string
    firstName: string
    lastName: string
    birthYear: number
    email: string
    phone: string
    employed: boolean
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

    static formToInsert(
        candidate: Partial<{
            jmbg: string | null
            firstName: string | null
            lastName: string | null
            birthYear: string | number | null
            email: string | null
            phone: string | null
            employed: boolean | null
        }>,
    ): CandidateInsert {
        return {
            jmbg: candidate.jmbg as string,
            firstName: (candidate.firstName as string).trim(),
            lastName: (candidate.lastName as string).trim(),
            birthYear: candidate.birthYear as unknown as number,
            email: (candidate.email as string).trim(),
            phone: (candidate.phone as string).trim(),
            employed: !!candidate.employed,
        }
    }
}
