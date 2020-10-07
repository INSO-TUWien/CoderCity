import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FileStore, FileState } from './file.store';
import { File } from '../../model/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileQuery extends QueryEntity<FileState, File> {

  constructor(protected store: FileStore) {
    super(store);
  }

}
