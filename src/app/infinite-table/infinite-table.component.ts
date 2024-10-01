import { Component, OnDestroy } from '@angular/core'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { AsyncPipe, DatePipe } from '@angular/common'
import { BreakpointObserver, Breakpoints as BP } from '@angular/cdk/layout'
import { Subscription } from 'rxjs'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

import { CandidateService } from '../service/candidate.service'
import { Candidate } from '../model/candidate'

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

    isExpended(candidate: Candidate) {
        return candidate === this.expendedCandidate
    }

    ngOnDestroy(): void {
        this.breakpointSub.unsubscribe()
    }
}
