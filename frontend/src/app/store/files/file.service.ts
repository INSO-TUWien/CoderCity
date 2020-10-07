import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { FileStore } from './file.store';
import { File } from '../../model/file.model';

@Injectable({ providedIn: 'root' })
export class FileService {

  constructor(private fileStore: FileStore,
              private http: HttpClient) {
  }

  get() {
  }

  add(file: File) {
    this.fileStore.add(file);
  }

  update(id, file: Partial<File>) {
    this.fileStore.update(id, file);
  }

  set(files: File[]) {
    this.fileStore.set(files);
  }

  remove(id: ID) {
    this.fileStore.remove(id);
  }
}
