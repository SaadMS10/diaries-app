
import React, {  useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/rootReducer';

import { Entry } from '../interfaces/entryinterface';
import { Diary } from '../interfaces/diaryinterface';
import { setCurrentlyEditing, setCanEdit } from '../features/entry/editorSlice';
import { updateDiary } from  '../features/diary/diarySlice';
import { updateEntry } from '../features/entry/entrySlice';
import { showAlert } from '../util';
import http from '../services/mirage/api'
import { useAppDispatch } from '../stores/index';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog() {
    
    
    const { currentlyEditing: entry, canEdit, activeDiaryId } = useSelector(
        (state: RootState) => state.editor
      );
      const [editedEntry, updateEditedEntry] = useState(entry);
      const dispatch = useAppDispatch();
    
      const saveEntry = async () => {
        if (activeDiaryId == null) {
          return showAlert('Please select a diary.', 'warning');
        }
        if (entry == null) {
          http
            .post<Entry, { diary: Diary; entry: Entry }>(
              `/diaries/entry/${activeDiaryId}`,
              editedEntry
            )
            .then((data) => {
              if (data != null) {
                const { diary, entry: _entry } = data;
                dispatch(setCurrentlyEditing(_entry));
                dispatch(updateDiary(diary));
                showAlert('Saved', 'success');
              }
            });
        } else {
          http
            .put<Entry, Entry>(`diaries/entry/${entry.id}`, editedEntry)
            .then((_entry) => {
              if (_entry != null) {
                dispatch(setCurrentlyEditing(_entry));
                dispatch(updateEntry(_entry));
                showAlert('Edited', 'success');
              }
            });
        }
        dispatch(setCanEdit(false));
      
      };

  const handleClose = () => {
    dispatch(setCanEdit(false))
  };
      
  useEffect(() => {
    updateEditedEntry(entry);
   
  }, [entry]);
  



  return (
    <div>
 
      <Dialog open={canEdit} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Entry</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            fullWidth
            onChange={(e) => {
                if (editedEntry) {
                  updateEditedEntry({
                    ...editedEntry,
                    title: e.target.value,
                    
                  });
                } else {
                  updateEditedEntry({
                    title: e.target.value,
                    content: '',
                  });
 
                }
              }}
              value={editedEntry?.title ?? ''}
          />
        <TextField
          id="standard-multiline-flexible"
          label="Description"
          multiline
          rowsMax={4}
          value={editedEntry?.content ?? ''}
          onChange={(e) => {
            if (editedEntry) {
              updateEditedEntry({
                ...editedEntry,
                content: e.target.value,
              });
            } else {
              updateEditedEntry({
                title: '',
                content: e.target.value,
              });
            }
          }}
  
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={saveEntry} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
