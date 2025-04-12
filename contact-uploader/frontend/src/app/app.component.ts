import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UploadService } from './services/upload.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'contact-uploader-frontend';

  selectedFile: File | null = null;

  constructor(private uploadService: UploadService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) return;
    this.uploadService.upload(this.selectedFile).subscribe({
      next: (res) => alert('Upload successful'),
      error: (err) => alert('Upload failed')
    });
  }
}
