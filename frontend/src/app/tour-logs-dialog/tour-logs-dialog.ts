import { Component, inject, model, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourDifficulty, TourLog, TourStateService } from '../tour-state-service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { Rating } from 'primeng/rating';
import { Tag } from 'primeng/tag';
import { getValidationErrors } from '../shared/validation-utils';
import * as v from 'valibot';

const TourLogSchema = v.object({
  description: v.pipe(v.string(), v.minLength(1, 'Description is required.')),
  rating: v.pipe(v.number(), v.minValue(1, 'Rating must be at least 1.')),
});

@Component({
  selector: 'app-tour-logs-dialog',
  imports: [Dialog, ButtonModule, Textarea, Rating, FormsModule, DatePipe, Tag],
  templateUrl: './tour-logs-dialog.html',
  styleUrl: './tour-logs-dialog.css',
})
export class TourLogsDialog {

  TourDifficulty = TourDifficulty;

  visible = model(false);

  tourStateService = inject(TourStateService);

  editingLog = signal<TourLog | null>(null);
  logDescription = signal('');
  logRating = signal(0);
  errors = signal<Record<string, string>>({});
  logDifficulty = signal<TourDifficulty>(TourDifficulty.Easy)
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
      description: this.logDescription(),
      rating: this.logRating(),
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
    if (editing) {
      this.tourStateService.editTourLog({
        id: editing.id,
        creationDate: editing.creationDate,
        description: this.logDescription(),
        rating: this.logRating(),
        difficulty: this.logDifficulty(),
        totalDistance: this.logTotalDistance(),
        totalTime: this.logTotalTime()
      });
    } else {
      this.tourStateService.addTourLog({
        creationDate: new Date(),
        description: this.logDescription(),
        rating: this.logRating(),
        difficulty: this.logDifficulty(),
        totalDistance: this.logTotalDistance(),
        totalTime: this.logTotalTime()
      });
    }
    this.resetForm();
  }

  startEdit(log: TourLog) {
    this.editingLog.set(log);
    this.logDescription.set(log.description);
    this.logRating.set(log.rating);
    this.logDifficulty.set(log.difficulty)
    this.logTotalDistance.set(log.totalDistance);
    this.logTotalTime.set(log.totalTime)
  }

  deleteLog(logId: number) {
    this.tourStateService.removeTourLog(logId);
  }

  resetForm() {
    this.editingLog.set(null);
    this.logDescription.set('');
    this.logRating.set(0);
    this.errors.set({});
    this.logDifficulty.set(TourDifficulty.Easy)
    this.logTotalDistance.set(0)
    this.logTotalTime.set(0)
  }

  onHide() {
    this.resetForm();
    this.tourStateService.clearSelection();
  }
}
