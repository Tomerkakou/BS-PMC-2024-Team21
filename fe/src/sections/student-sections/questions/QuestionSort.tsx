import React from "react";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { listClasses } from "@mui/material/List";
import Typography from "@mui/material/Typography";

import Iconify from "components/iconify";
import { QuestionAnswer } from "./QuestionAnswer";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

const QuestionSort = ({
  setQuestions,
}: {
  setQuestions: React.Dispatch<React.SetStateAction<QuestionAnswer[]>>;
}) => {
  const [open, setOpen] = useState(null);
  const [selected, setSelected] = useState(SORT_OPTIONS[0]);

  const handleOpen = (event: any) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSort = (option: any) => {
    //sort questions
    setSelected(option);
    setQuestions((questions) => [
      ...questions.sort((a, b) => {
        if (option.value === "newest") {
          return a.createdAt.getTime() - b.createdAt.getTime();
        } else {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
      }),
    ]);
    handleClose();
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={
          <Iconify
            icon={open ? "eva:chevron-up-fill" : "eva:chevron-down-fill"}
          />
        }
      >
        Sort By:&nbsp;
        <Typography
          component="span"
          variant="subtitle2"
          sx={{ color: "text.secondary" }}
        >
          {selected.label}
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={selected === option}
            onClick={() => handleSort(option)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default QuestionSort;
