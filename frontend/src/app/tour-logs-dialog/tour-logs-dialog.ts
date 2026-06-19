import { Component, inject, model, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourStateService } from '../tour-state-service';
import { TourLog } from '../models/tour-log';
import { TourDifficulty } from '../models/tour-difficulty';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { getValidationErrors } from '../shared/validation-utils';
import * as v from 'valibot';

const TourLogSchema = v.object({
  comment: v.pipe(v.string(), v.minLength(1, 'Description is required.')),
  rating: v.pipe(v.number(), v.minValue(1, 'Rating must be at least 1.')),
  totalDistance: v.pipe(v.number(), v.minValue(0.1, 'Total distance must be at least 0.1 km.')),
  totalTime: v.pipe(v.number(), v.minValue(1, 'Total time must be at least 1 min.')),
});

@Component({
  selector: 'app-tour-logs-dialog',
  imports: [Dialog, ButtonModule, Textarea, Rating, FormsModule, DatePipe, Tag, InputNumberModule],
  templateUrl: './tour-logs-dialog.html',
  styleUrl: './tour-logs-dialog.css',
})
export class TourLogsDialog {

  TourDifficulty = TourDifficulty;

  difficultyLabel: Record<TourDifficulty, string> = {
    [TourDifficulty.Easy]: 'Easy',
    [TourDifficulty.Medium]: 'Medium',
    [TourDifficulty.Hard]: 'Hard',
  };

  visible = model(false);

  tourStateService = inject(TourStateService);
  private messageService = inject(MessageService);

  editingLog = signal<TourLog | null>(null);
  logComment = signal('');
  logRating = signal(0);
  errors = signal<Record<string, string>>({});
  logDifficulty = signal<TourDifficulty>(TourDifficulty.Easy);
  logTotalDistance = signal(0);
  logTotalTime = signal(0);

  onDistanceChange(event: Event) {
    this.logTotalDistance.set(+(event.target as HTMLInputElement).value);
  }

  onTimeChange(event: Event) {
    this.logTotalTime.set(+(event.target as HTMLInputElement).value);
  }


  onSubmit() {
    const formResult = v.safeParse(TourLogSchema, {
      comment: this.logComment(),
      rating: this.logRating(),
      totalDistance: this.logTotalDistance(),
      totalTime: this.logTotalTime(),
    });

    if (formResult.success) {
      this.errors.set({});
      this.saveLog();
    } else {
      this.errors.set(getValidationErrors(formResult.issues));
    }
  }

  saveLog() {
    const editing = this.editingLog();
    const payload = {
      comment: this.logComment(),
      rating: this.logRating(),
      difficulty: this.logDifficulty(),
      totalDistance: this.logTotalDistance(),
      totalTime: this.logTotalTime(),
    };
    const action$ = editing
      ? this.tourStateService.editTourLog(editing.id, payload)
      : this.tourStateService.addTourLog(payload);
    action$.subscribe({
      next: () => {
        this.resetForm();
        this.messageService.add({
          severity: 'success',
          summary: editing ? 'Log updated' : 'Log added',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: editing ? 'Update failed' : 'Add failed',
          detail: 'Could not save the tour log',
        });
      },
    });
  }

  startEdit(log: TourLog) {
    this.editingLog.set(log);
    this.logComment.set(log.comment);
    this.logRating.set(log.rating);
    this.logDifficulty.set(log.difficulty);
    this.logTotalDistance.set(log.totalDistance);
    this.logTotalTime.set(log.totalTime);
  }

  deleteLog(logId: number) {
    this.tourStateService.removeTourLog(logId).subscribe({
      next: () =>
        this.messageService.add({ severity: 'success', summary: 'Log deleted' }),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Delete failed',
          detail: 'Could not delete the tour log',
        }),
    });
  }

  resetForm() {
    this.editingLog.set(null);
    this.logComment.set('');
    this.logRating.set(0);
    this.errors.set({});
    this.logDifficulty.set(TourDifficulty.Easy);
    this.logTotalDistance.set(0);
    this.logTotalTime.set(0);
  }

  onHide() {
    this.resetForm();
    this.tourStateService.clearSelection();
  }
}
