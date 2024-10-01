import { Component } from '@angular/core'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { AsyncPipe, DatePipe } from '@angular/common'

import { CandidateService } from '../service/candidate.service'

@Component({
    selector: 'app-infinite-table',
    standalone: true,
    imports: [InfiniteScrollDirective, AsyncPipe, DatePipe],
    templateUrl: './infinite-table.component.html',
    styleUrl: './infinite-table.component.scss',
})
export class InfiniteTableComponent {
    constructor(public candidateService: CandidateService) {}
}
