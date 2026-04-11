import { Component, inject, model, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourLog, TourStateService } from '../tour-state-service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { Rating } from 'primeng/rating';

@Component({
  selector: 'app-tour-logs-dialog',
  imports: [Dialog, ButtonModule, Textarea, Rating, FormsModule, DatePipe],
  templateUrl: './tour-logs-dialog.html',
  styleUrl: './tour-logs-dialog.css',
})
export class TourLogsDialog {
  visible = model(false);

  tourStateService = inject(TourStateService);

  editingLog = signal<TourLog | null>(null);
  logDescription = signal('');
  logRating = signal(0);

  saveLog() {
    const editing = this.editingLog();
    if (editing) {
      this.tourStateService.editTourLog({
        id: editing.id,
        creationDate: editing.creationDate,
        description: this.logDescription(),
        rating: this.logRating(),
      });
    } else {
      this.tourStateService.addTourLog({
        creationDate: new Date(),
        description: this.logDescription(),
        rating: this.logRating(),
      });
    }
    this.resetForm();
  }

  startEdit(log: TourLog) {
    this.editingLog.set(log);
    this.logDescription.set(log.description);
    this.logRating.set(log.rating);
  }

  deleteLog(logId: number) {
    this.tourStateService.removeTourLog(logId);
  }

  resetForm() {
    this.editingLog.set(null);
    this.logDescription.set('');
    this.logRating.set(0);
  }

  onHide() {
    this.resetForm();
    this.tourStateService.clearSelection();
  }
}
