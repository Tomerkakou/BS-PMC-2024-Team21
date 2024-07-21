import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import axios from "axios";
import Iconify from "components/iconify";
import { SelectInput } from "components/Inputs";
import MainModal from "components/MainModal";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface NewLecturerProps {
  lecturers: { id: string; name: string }[];
  handleNewLecturer: (lectuers: any[]) => void;
}

interface FormValues {
  newLecturers: { id: string; name: string }[];
}

const NewLecturer: React.FC<NewLecturerProps> = ({
  lecturers,
  handleNewLecturer,
}) => {
  const [open, setOpen] = useState(false);
  const { control, reset, handleSubmit } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/student/add-lecturers",
        data.newLecturers.map((lecturer) => lecturer.id)
      );
      handleNewLecturer(response.data.ids);
      toast.success(response.data.msg);
      handleClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={() => setOpen(true)}
      >
        New Lecturers
      </Button>
      <MainModal
        open={open}
        handleClose={handleClose}
        xBtn
        title="New Lecturers"
        sx={{
          width: 0.4,
          height: 0.4,
        }}
        buttons={[
          <LoadingButton onClick={handleSubmit(onSubmit)} loading={loading}>
            Save Lecturers
          </LoadingButton>,
        ]}
      >
        <SelectInput
          control={control}
          fieldName="newLecturers"
          label="Lecturers"
          options={lecturers}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          isMulti
        />
      </MainModal>
    </>
  );
};

export default NewLecturer;
