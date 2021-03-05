import React, { FC, useState } from 'react';
import { Diary } from '../interfaces/diaryinterface';
import { updateDiary } from '../features/diary/diarySlice';

import { Link } from 'react-router-dom';
import { showAlert } from '../util';
import http from '../services/mirage/api'
import { useAppDispatch } from '../stores/index';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

interface Props {
  diary: Diary;
}


const useStyles = makeStyles({
  root: {
    width:"20%",
    textAlign:"center",
    minWidth: "276px",
    margin: "10px"
   
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const DiaryTile: FC<Props> = (props) => {

  const [diary, setDiary] = useState(props.diary);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const totalEntries = props.diary?.entryIds?.length;
  const classes = useStyles();


  const saveChanges = () => {
    http
      .put<Diary, Diary>(`/diaries/${diary.id}`, diary)
      .then((diary) => {
        if (diary) {
          dispatch(updateDiary(diary));
          showAlert('Saved!', 'success');
        }
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  return (
    <div className="diary-tile">
 
      <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
     {diary.type}
        </Typography>
        <Typography variant="h5" component="h2"  title="Click to edit"  onClick={() => setIsEditing(true)}
        style={{
          cursor: 'pointer',
        }}>
        {isEditing ? (
          <input 
          className="diaryinput"
            value={diary.title}
            onChange={(e) => {
              setDiary({
                ...diary,
                title: e.target.value,
              });
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                saveChanges();
              }
            }}
          />
        ) : (
          <span>{diary.title}</span>
        )}
      
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
        {totalEntries ?? '0'} Saved Entries
        </Typography>
  
      </CardContent>
        <Link to={`diary/${diary.id}`} style={{textDecoration:"none" }}>
        <Button size="medium" color="primary">
        Entries →
        </Button>
        </Link>
    </Card>
    
     
    </div>
  );
};

export default DiaryTile;
