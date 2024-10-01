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
        this.expendedCandidate = null
        this.dialog
            .open(EditCandidateComponent, {
                data: { edit: true, candidate },
            })
            .afterClosed()
            .subscribe((data?: { success: boolean }) => {
                if (!data) return
                const success = data.success ? 'uspešno' : 'neuspešno'
                this.snackbar.open(`Kandidat je ${success} ažuriran.`)
            })
    }

    ngOnDestroy(): void {
        this.breakpointSub.unsubscribe()
    }

    private isExpended(candidate: Candidate) {
        return candidate === this.expendedCandidate
    }
}
