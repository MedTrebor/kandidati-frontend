import { Component, OnDestroy } from '@angular/core'
import { MatToolbarModule } from '@angular/material/toolbar'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { Subscription } from 'rxjs'

import { InfiniteTableComponent } from './infinite-table/infinite-table.component'

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

    constructor(brakepointObserver: BreakpointObserver) {
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

    ngOnDestroy(): void {
        this.breakpointSub?.unsubscribe()
    }
}
