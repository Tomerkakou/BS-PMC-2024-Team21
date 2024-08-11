import { LoadingButton } from "@mui/lab";
import {
  Grid,
  Stack,
  styled,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import axios from "axios";
import { TextInput } from "components/Inputs";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export interface QuestionAnswer {
  answer_id: number;
  assessment: string;
  question_description: string;
  answer: string;
  score: number;

  createdAt: Date;
}

const QuestionAnswerView: React.FC<QuestionAnswer> = (props) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          Description : {props.question_description}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Answer"
          inputProps={{ readOnly: true }}
          multiline
          rows={15}
          value={props.answer}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={1}>
          <TextField
            label="Assasment"
            inputProps={{ readOnly: true }}
            multiline
            rows={12}
            value={props.assessment}
            fullWidth
          />
          <TextField
            label="Score"
            inputProps={{ readOnly: true }}
            value={props.score}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default QuestionAnswerView;
