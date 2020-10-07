import { Injectable } from '@angular/core';
import { EntityState, EntityStore, MultiActiveState, StoreConfig } from '@datorama/akita';
import { File } from '../../model/file.model';

export interface FileState extends EntityState<File>, MultiActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'file' , idKey: 'name'})
export class FileStore extends EntityStore<FileState, File> {

  constructor() {
    super();
  }

}

