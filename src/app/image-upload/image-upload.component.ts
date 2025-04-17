import { Component, OnInit , inject} from '@angular/core';
import { UploadService } from '../_services/upload.service'; 
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  imports: [NgIf] 
})

export class ImageUploadComponent implements OnInit {
  uploadProgress = 0;
  loading: boolean = false; 
  imageFile!: File; 
  previewUrl: string | ArrayBuffer | null = null;
  extractedText: string = '';

  private toastr = inject(ToastrService); 
  private uploadService = inject(UploadService);

  ngOnInit(): void {
  }

  onChange(event: any) {
    const file = event.target.files[0];
    if (file && this.validateFile(file)) {
      this.extractedText = '';
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  validateFile(file: File): boolean {
    const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
    const isValidSize = file.size <= 2 * 1024 * 1024;
    if (!isValidType) {
      this.toastr.error('Only JPEG or PNG images are allowed.');
      return false;
    }
    if (!isValidSize) {
      this.toastr.error('The image size must not exceed 2 MB.');
      return false;
    }
    return true;
  }

  getFileSize(bytes: number): string {
    return (bytes / (1024*1024)).toFixed(2) + ' MB';
  }

  extractText() {
    if (!this.imageFile) return;

    this.loading = true;
    this.uploadProgress = 0;
    this.extractedText = '';

    this.uploadService.upload(this.imageFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        }

        if (event.type === HttpEventType.Response) {
          const response = event.body;
          this.loading = false;

          if (Array.isArray(response)) {
            if (!response.length) {
              this.toastr.error('The text in the image was not found.');
              return;
            }

            this.extractedText = response.map((item: any) => item.text).join(' ');
          } else {
            this.toastr.error('Unknown response format.');
          }
        }
      },
      error: () => {
        this.loading = false;
        this.toastr.error('An error occurred with Ninjas API.');
      }
    });

  }

  clearImage() {
    this.previewUrl = null;
    this.imageFile = null!;
    this.extractedText = '';
  }

  copyToClipboard() {
    if (this.extractedText) {
      navigator.clipboard.writeText(this.extractedText).then(() => {
        this.toastr.success('Text copied to clipboard!');
      }).catch(() => {
        this.toastr.error('Could not copy text.');
      });
    }
  }
}
