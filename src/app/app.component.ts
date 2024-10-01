import { Component } from '@angular/core'
import { MatToolbarModule } from '@angular/material/toolbar'
import { InfiniteTableComponent } from './infinite-table/infinite-table.component'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MatToolbarModule, InfiniteTableComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
