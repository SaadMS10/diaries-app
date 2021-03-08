import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import http from "../services/mirage/api";
import { useAppDispatch } from "../stores/index";
import { RootState } from "../stores/rootReducer";
import { Diary } from "../interfaces/diaryinterface";
import { addDiary } from "../features/diary/diarySlice";
import Swal from "sweetalert2";
import { setUser } from "../features/auth/userSlice";
import DiaryTile from "./DiaryTile";
import { User } from "../interfaces/userinterface";
import { Route, Switch } from "react-router-dom";
import DiaryEntriesList from "./DiaryEntriesList";
import Button from "@material-ui/core/Button";

import dayjs from "dayjs";

const Diaries: FC = () => {
  const dispatch = useAppDispatch();
  const diaries = useSelector((state: RootState) => state.diary);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        http.get<null, Diary[]>(`diaries/${user.id}`).then((data) => {
          if (data && data.length > 0) {
            const sortedByUpdatedAt = data.sort((a, b) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            dispatch(addDiary(sortedByUpdatedAt));
          }
        });
      }
    };
    fetchDiaries();
  }, [dispatch, user]);
  const createDiary = async () => {
    const result = (await Swal.mixin({
      input: "text",
      confirmButtonText: "Next →",
      showCancelButton: true,
      progressSteps: ["1", "2"],
    }).queue([
      {
        titleText: "Diary title",
        input: "text",
      },
      {
        titleText: "Private or public diary?",
        input: "radio",
        inputOptions: {
          private: "Private",
          public: "Public",
        },
        inputValue: "private",
      },
    ])) as any;
    if (result.value) {
      const { value } = result;
      const { diary, user: _user } = await http.post<
        Partial<Diary>,
        { diary: Diary; user: User }
      >("/diaries/", {
        title: value[0],
        type: value[1],
        userId: user?.id,
      });
      if (diary && user) {
        dispatch(addDiary([diary] as Diary[]));
        dispatch(addDiary([diary] as Diary[]));
        dispatch(setUser(_user));
        return Swal.fire({
          titleText: "All done!",
          confirmButtonText: "OK!",
        });
      }
    }
    Swal.fire({
      titleText: "Cancelled",
    });
  };

  return (
    <div style={{ padding: "1em 0.4em" }}>
      <Switch>
        <Route path="/diary/:id">
          <DiaryEntriesList />
        </Route>
        <Route path="/">
          <h1 className="embosed">DIARIES </h1>
          <Button
            style={{ marginLeft: "45%" }}
            variant="outlined"
            color="primary"
            onClick={createDiary}
          >
            Create New
          </Button>
          <div className="entries">
            {diaries.map((diary, idx) => (
              <DiaryTile key={idx} diary={diary} />
            ))}
          </div>
        </Route>
      </Switch>
    </div>
  );
};

export default Diaries;
