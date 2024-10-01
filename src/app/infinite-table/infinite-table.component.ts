import { Component, OnDestroy } from '@angular/core'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { AsyncPipe, DatePipe } from '@angular/common'
import { BreakpointObserver, Breakpoints as BP } from '@angular/cdk/layout'
import { Subscription } from 'rxjs'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'

import { CandidateService } from '../service/candidate.service'
import { Candidate } from '../model/candidate'
import { EditCandidateComponent } from '../edit-candidate/edit-candidate.component'
import { DeleteCandidateComponent } from '../delete-candidate/delete-candidate.component'

@Component({
    selector: 'app-infinite-table',
    standalone: true,
    imports: [
        InfiniteScrollDirective,
        AsyncPipe,
        DatePipe,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
    templateUrl: './infinite-table.component.html',
    styleUrl: './infinite-table.component.scss',
})
export class InfiniteTableComponent implements OnDestroy {
    private breakpointSub: Subscription

    breakpoint: 'xs' | 's' | 'm' | 'l' = 'l'
    colspan = 8
    expendedCandidate: Candidate | null = null

    constructor(
        public candidateService: CandidateService,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        breakpointObserver: BreakpointObserver,
    ) {
        this.breakpointSub = breakpointObserver
            .observe([BP.XSmall, BP.Small, BP.Medium, BP.Large, BP.XLarge])
            .subscribe(({ breakpoints: bps }) => {
                if (bps[BP.XSmall]) {
                    this.breakpoint = 'xs'
                    this.colspan = 2
                } else if (bps[BP.Small]) {
                    this.breakpoint = 's'
                    this.colspan = 3
                } else if (bps[BP.Medium]) {
                    this.breakpoint = 'm'
                    this.colspan = 6
                } else if (bps[BP.Large] || bps[BP.XLarge]) {
                    this.breakpoint = 'l'
                    this.colspan = 8
                    this.expendedCandidate = null
                }
            })
    }

    expendHandler(candidate: Candidate) {
        this.expendedCandidate = this.isExpended(candidate) ? null : candidate
    }

    editHandler(candidate: Candidate) {
        this.dialog
            .open(EditCandidateComponent, {
                data: { edit: true, candidate },
            })
            .afterClosed()
            .subscribe((data?: { success: boolean }) => {
                this.expendedCandidate = null
                if (!data) return
                const message = data.success
                    ? 'Kandidat je uspešno ažuriran.'
                    : 'Greška. Kandidat nije ažuriran.'
                this.snackbar.open(message)
            })
    }

    deleteHandler(candidate: Candidate) {
        this.dialog
            .open(DeleteCandidateComponent)
            .afterClosed()
            .subscribe(confirmation => {
                this.expendedCandidate = null
                if (confirmation)
                    this.candidateService
                        .deleteCandidate(candidate.jmbg)
                        .subscribe(res => {
                            let message: string
                            if (res.ok) {
                                message = 'Kandidat je uspešno izbririsan.'
                                this.candidateService.restart()
                            } else {
                                message = 'Greška. Kandidat nije izbrisan.'
                            }
                            this.snackbar.open(message)
                        })
            })
    }

    ngOnDestroy(): void {
        this.breakpointSub.unsubscribe()
    }

    private isExpended(candidate: Candidate) {
        return candidate === this.expendedCandidate
    }
}
