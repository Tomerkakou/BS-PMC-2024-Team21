import { LoadingButton } from "@mui/lab";
import { Alert, Button, Stack } from "@mui/material";
import axios from "axios";
import Iconify from "components/iconify";
import { DropBoxInput, SelectInput, TextInput } from "components/Inputs";
import MainModal from "components/MainModal";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface NewDocumentProps {
  handleNewDocument: (doc: any) => void;
}

interface FormValues {
  docName: string;
  subject: string;
  description: string;
  doc: File;
}

const NewDocument: React.FC<NewDocumentProps> = ({ handleNewDocument }) => {
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
      const doc = await fileToBase64(data.doc);
      const response = await axios.post("/document/new", {
        ...data,
        doc: doc,
      });
      toast.success("Document summarized successfully");
      handleNewDocument(response.data);
      handleClose();
    } catch (e: any) {
      if (e.response) {
        toast.error(e.response.data);
      }
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
        id="new-document-btn"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={() => setOpen(true)}
      >
        New Document
      </Button>
      <MainModal
        open={open}
        handleClose={handleClose}
        xBtn
        title="New Document"
        sx={{
          width: 0.4,
        }}
        buttons={[
          <LoadingButton onClick={handleSubmit(onSubmit)} loading={loading} id='new-doc-submit'>
            Save Document
          </LoadingButton>,
        ]}
      >
        <Stack spacing={2}>
          <Alert severity="info">Make sure to upload only PDF files with text inside.<br/>Images will not be summarized.</Alert>
          <TextInput
            label="Document Name"
            control={control}
            fieldName="docName"
            id="new-doc-name"
            rules={{
              required: "Document Name is required",
              maxLength: { value: 50, message: "Document Name is too long" },
            }}
          />
          <SelectInput
            label="Subject"
            control={control}
            fieldName="subject"
            id='new-doc-subject'
            rules={{ required: "Subject is required" }}
            options={["C#", "Java", "Python", "JavaScript", "SQL"]}
          />
          <DropBoxInput
            control={control}
            fieldName="doc"
            id='new-doc-file'
            placeholder="Drop document here (.pdf)"
            accept=".pdf"
            rules={{ required: "Document is required" }}
            icon={<Iconify icon="mdi:file-upload-outline" />}
          />
          <TextInput
            label="Description"
            control={control}
            fieldName="description"
            multiline={5}
            rules={{
              maxLength: { value: 100, message: "Description is too long" },
            }}
          />
        </Stack>
      </MainModal>
    </>
  );
};

const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default NewDocument;
