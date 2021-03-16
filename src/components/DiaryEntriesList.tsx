import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../stores/rootReducer";
import { Entry } from "../interfaces/entryinterface";
import { setEntries } from "../features/entry/entrySlice";
import dayjs from "dayjs";
import {
  setCanEdit,
  setActiveDiaryId,
  setCurrentlyEditing,
} from "../features/entry/editorSlice";
import http from "../services/mirage/api";
import { useAppDispatch } from "../stores/index";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
const useStyles = makeStyles({
  root: {
    width: "20%",
    textAlign: "center",

    minWidth: "276px",
    margin: "10px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});
const DiaryEntriesList: FC = () => {
  const { entries } = useSelector((state: RootState) => state);

  const dispatch = useAppDispatch();
  const { id }: any = useParams();
  const { currentlyEditing: canEdit } = useSelector(
    (state: RootState) => state.editor
  );

  const classes = useStyles();

  useEffect(() => {
    if (id != null) {
      http
        .get<null, { entries: Entry[] }>(`/diaries/entries/${id}`)
        .then(({ entries: _entries }) => {
          if (_entries) {
            const sortByLastUpdated = _entries.sort((a, b) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            dispatch(setEntries(sortByLastUpdated));
          }
        });
    } else {
      entries.map((entry: any) => {
        if (canEdit) {
          dispatch(setEntries(entry));
        }
        return <></>;
      });
    }
  }, [id, dispatch, canEdit, entries]);

  return (
    <div>
      <Button
        size="large"
        color="secondary"
        style={{ marginLeft: "45%" }}
        variant="outlined"
        onClick={() => {
          dispatch(setCanEdit(true));
          dispatch(setActiveDiaryId(id as string));
          dispatch(setCurrentlyEditing(null));
        }}
      >
        Add New Entry
      </Button>

      <ul className="entries">
        {entries.map((entry) => (
          <Card className={classes.root} key={entry.title}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {entry.title}
              </Typography>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {entry.content}
              </Typography>
            </CardContent>
            <Button
              size="medium"
              color="primary"
              onClick={() => {
                dispatch(setCurrentlyEditing(entry));
                dispatch(setCanEdit(true));
              }}
            >
              Edit Entry
            </Button>
          </Card>

          // <li
          //   key={entry.id}
          //   onClick={() => {
          //     dispatch(setCurrentlyEditing(entry));
          //     dispatch(setCanEdit(true));
          //   }}
          // >
          //   {entry.title}
          // </li>
        ))}
      </ul>
    </div>
  );
};

export default DiaryEntriesList;
