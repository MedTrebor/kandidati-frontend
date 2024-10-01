import { ListRange } from '@angular/cdk/collections'
import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { BehaviorSubject, catchError, map, of } from 'rxjs'

import { Candidate, CandidateFetch, CandidateInsert } from '../model/candidate'

@Injectable({ providedIn: 'root' })
export class CandidateService {
    private url = 'http://127.0.0.1:8080'
    // start is inclusive, end is exclusive
    private oldRange: ListRange = { start: 0, end: 0 }
    private length = 100
    private page = 0
    private maxPageSize = 30
    private pageSize = this.maxPageSize
    private lastPage = 14
    private chunk = 5

    candidates$ = new BehaviorSubject<Candidate[]>([])

    constructor(private http: HttpClient) {
        this.restart()
    }

    restart() {
        this.getCount().subscribe(count => {
            if (typeof count != 'number') {
                console.error(count)
                return
            }

            this.page = 0
            this.length = count
            this.pageSize = Math.min(this.length, this.maxPageSize)
            this.lastPage = Math.ceil(
                (this.length - this.pageSize) / this.chunk,
            )
            if (this.pageSize)
                this.fetchCandidates({ start: 0, end: this.pageSize }, true)
            else this.candidates$.next([])
        })
    }

    nextPage() {
        if (this.page >= this.lastPage) return

        this.page++
        let start = this.oldRange.start + this.chunk
        let end = this.oldRange.end + this.chunk

        if (end > this.length) {
            start -= end - this.length
            end -= end - this.length
        }

        this.fetchCandidates({ start, end })
    }

    previousPage() {
        if (this.page <= 0) return

        let start = this.oldRange.start - this.chunk
        let end = this.oldRange.end - this.chunk
        if (this.page === 1) {
            start = 0
            end = start + this.pageSize
        }

        this.page--

        this.fetchCandidates({ start, end })
    }

    getCount() {
        return this.http
            .get<number>(this.url + '/count')
            .pipe(catchError((err: HttpErrorResponse) => of(err)))
    }

    getCandidates(limit: number, offset = 0) {
        return this.http
            .get<
                CandidateFetch[]
            >(this.url + `?limit=${limit}&offset=${offset}`)
            .pipe(
                map(candidates =>
                    candidates.map(candidate => Candidate.fromFetch(candidate)),
                ),
                catchError((err: HttpErrorResponse) => of(err)),
            )
    }

    fetchCandidates(range: ListRange, restart = false) {
        this.validateRange(range)

        const startInRange = this.inRange(range.start) && !restart
        const endInRange = this.inRange(range.end) && !restart

        let limit = 0
        let offset = 0
        let forward = true

        const candidates = [...this.candidates$.value]

        if (restart || (!startInRange && !endInRange)) {
            offset = range.start
            limit = range.end - range.start

            candidates.splice(0)
        }

        if (startInRange && endInRange) {
            const candidates = [...this.candidates$.value]
            // deleting back
            candidates.splice(
                candidates.length - (this.oldRange.end - range.end),
            )
            // deleting front
            candidates.splice(0, range.start - this.oldRange.start)

            this.oldRange = range
            this.candidates$.next(candidates)

            return
        }

        // move forward
        if (startInRange) {
            offset = this.oldRange.end
            limit = range.end - offset

            candidates.splice(0, range.start - this.oldRange.start)
        }

        // move backward
        if (endInRange) {
            offset = range.start
            limit = this.oldRange.start - offset

            candidates.splice(
                candidates.length - (this.oldRange.end - range.end),
            )
            forward = false
        }

        this.getCandidates(limit, offset).subscribe(newCandidates => {
            if (newCandidates instanceof HttpErrorResponse) {
                console.error(newCandidates)
                return
            }
            if (forward) {
                candidates.push(...newCandidates)
            } else {
                candidates.unshift(...newCandidates)
            }

            this.oldRange = range
            this.candidates$.next(candidates)
        })
    }

    insertCandidate(candidate: CandidateInsert) {
        return this.http
            .post(this.url, candidate, {
                observe: 'response',
                responseType: 'text',
            })
            .pipe(catchError((err: HttpErrorResponse) => of(err)))
    }

    updateCandidate(jmbg: string, candidate: CandidateInsert) {
        return this.http
            .put(this.url + `?jmbg=${jmbg}`, candidate, {
                observe: 'response',
                responseType: 'text',
            })
            .pipe(catchError((err: HttpErrorResponse) => of(err)))
    }

    deleteCandidate(jmbg: string) {
        return this.http
            .delete(this.url, {
                body: [jmbg],
                observe: 'response',
                responseType: 'text',
            })
            .pipe(catchError((err: HttpErrorResponse) => of(err)))
    }

    private inRange(index: number) {
        return index >= this.oldRange.start && index < this.oldRange.end
    }

    private validateRange(range: ListRange) {
        if (
            !Number.isInteger(range.start) ||
            !Number.isInteger(range.end) ||
            range.start < 0 ||
            range.end < 1
        )
            throw new Error('Range have to be positive integers')

        if (range.start >= range.end)
            throw new Error('Range start has to be less than range end')
    }
}
