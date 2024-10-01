import { Component, Inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

import { CandidateService } from '../service/candidate.service'
import { Candidate } from '../model/candidate'

@Component({
    selector: 'app-edit-candidate',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
    ],
    templateUrl: './edit-candidate.component.html',
    styleUrl: './edit-candidate.component.scss',
})
export class EditCandidateComponent {
    candidateForm = this.formBuilder.group({
        jmbg: [
            this.data.candidate?.jmbg ?? '',
            [Validators.required, Validators.pattern(/^\d{13}$/)],
        ],
        firstName: [this.data.candidate?.firstName ?? '', Validators.required],
        lastName: [this.data.candidate?.lastName ?? '', Validators.required],
        birthYear: [
            this.data.candidate?.birthYear ?? '',
            [
                Validators.required,
                Validators.min(1900),
                Validators.max(new Date().getFullYear()),
            ],
        ],
        email: [
            this.data.candidate?.email ?? '',
            [Validators.required, Validators.email],
        ],
        phone: [
            this.data.candidate?.phone ?? '',
            [Validators.required, Validators.minLength(9)],
        ],
        employed: [this.data.candidate?.employed ?? false],
    })

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { edit: boolean; candidate?: Candidate },
        public dialogRef: MatDialogRef<EditCandidateComponent>,
        private formBuilder: FormBuilder,
        private candidateService: CandidateService,
    ) {}

    closeDialog(response?: { success: boolean }) {
        if (response) {
            this.dialogRef.close(response)
            return
        }
        this.dialogRef.close()
    }

    submit() {
        if (this.candidateForm.valid) {
            const submition = this.data.edit
                ? this.candidateService.updateCandidate(
                      this.data.candidate!.jmbg,
                      Candidate.formToInsert(this.candidateForm.value),
                  )
                : this.candidateService.insertCandidate(
                      Candidate.formToInsert(this.candidateForm.value),
                  )

            submition.subscribe(response => {
                if (response.ok) {
                    this.candidateService.restart()
                    this.closeDialog({ success: true })
                } else {
                    console.error(response)
                    this.closeDialog({ success: false })
                }
            })
        } else {
            console.error('Form Invalid')
        }
    }
}
