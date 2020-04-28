import {
  isLabelCreate, isLabelUpdate, LabelCreate, LabelUpdate,
} from 'book-app-shared/types/Label';
import { ExportedCheckFunction } from '../../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../../helpers/checks/constructCheckResult';


export const checkLabelCreate: ExportedCheckFunction<LabelCreate> = (body) => (
  executeCheckCreate(body, isLabelCreate)
);

export const checkLabelUpdate: ExportedCheckFunction<LabelUpdate> = (body) => (
  executeCheckUpdate(body, isLabelUpdate)
);
