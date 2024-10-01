import { Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'

@Component({
    selector: 'app-delete-candidate',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './delete-candidate.component.html',
    styleUrl: './delete-candidate.component.scss',
})
export class DeleteCandidateComponent {}
