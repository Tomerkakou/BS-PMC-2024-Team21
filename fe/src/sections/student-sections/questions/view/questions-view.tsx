import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QuestionAnswerView, { QuestionAnswer } from "../QuestionAnswer";
import QuestionSort from "../QuestionSort";


const QuestionsView = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionAnswer[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get<QuestionAnswer[]>(
          `/student/get-questions`
        );
        console.log(response.data);
        const result = response.data.map((question) => ({
          ...question,
          createdAt: new Date(question.createdAt),
        }));
        setQuestions(result);
      } catch (e: any) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [searchParams]);

  return (
    <>
      {
        <Container sx={{ p: 1, width: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4">Question Assasment</Typography>
            <Box>
              <QuestionSort setQuestions={setQuestions} />
            </Box>
          </Stack>
          <Grid container spacing={2}>
            {!loading &&
              questions.map((question, index) => (
                <Grid item xs={12} md={6} key={question.answer_id}>
                  <Card sx={{ p: 2 }}>
                    <QuestionAnswerView {...question} />
                  </Card>
                </Grid>
              ))}
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Skeleton variant="text" height={30} />
                    </Grid>
                    <Grid item xs={6}>
                      <Skeleton variant="rectangular" height={220} />
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <Skeleton variant="rounded" height={90} />
                        <Skeleton variant="rounded" height={90} />
                        <Skeleton variant="text" height={20} />
                      </Stack>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "end" }}
                    >
                      <Skeleton variant="rectangular" width={50} />
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            {!loading && questions.length === 0 && (
              <Typography variant="h6">No Answers found</Typography>
            )}
          </Grid>
        </Container>
      }
    </>
  );
};

export default QuestionsView;
