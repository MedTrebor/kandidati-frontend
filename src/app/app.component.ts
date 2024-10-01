import { Component, OnDestroy } from '@angular/core'
import { MatToolbarModule } from '@angular/material/toolbar'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subscription } from 'rxjs'

import { InfiniteTableComponent } from './infinite-table/infinite-table.component'
import { EditCandidateComponent } from './edit-candidate/edit-candidate.component'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        MatToolbarModule,
        InfiniteTableComponent,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
    isSmall = false

    private breakpointSub: Subscription

    constructor(
        brakepointObserver: BreakpointObserver,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
    ) {
        this.breakpointSub = brakepointObserver
            .observe([
                Breakpoints.XSmall,
                Breakpoints.Small,
                Breakpoints.Medium,
                Breakpoints.Large,
                Breakpoints.XLarge,
            ])
            .subscribe(({ breakpoints }) => {
                if (
                    breakpoints[Breakpoints.XSmall] ||
                    breakpoints[Breakpoints.Small]
                ) {
                    this.isSmall = true
                } else {
                    this.isSmall = false
                }
            })
    }

    addCandidate() {
        this.dialog
            .open(EditCandidateComponent, { data: { edit: false } })
            .afterClosed()
            .subscribe((data?: { success: boolean }) => {
                if (!data) return
                const success = data.success ? 'uspešno' : 'neuspešno'
                this.snackbar.open(`Kandidat je ${success} dodat.`)
            })
    }

    ngOnDestroy(): void {
        this.breakpointSub?.unsubscribe()
    }
}
