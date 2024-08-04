import { Box, Card, Container, Pagination, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import PDFViewer from 'components/PDFViewer';
import LayoutSplashScreen from 'layouts/dashboard/common/LayoutSplashScreen';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Document{
    id:number;
    title:string;
    content:string;
    pages:number;
    pagesSummary:string[];
}

const DocumentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [doc, setDoc] = useState<Document>();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchDocument = async (id: string) => {
            try {
                setLoading(true);
                //fetch document from server
                const response = await axios.get<Document>(`/document/${id}`);
                setDoc(response.data);
            } catch (e:any) {
                if(e.response){
                    navigate('/documents', { state: { message: e.response.data } });
                }
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        if(id){
            fetchDocument(id);
        }
    }, [id,navigate]);

  return (
    <>
        {loading && <LayoutSplashScreen/>}
        {!loading && doc && <Container sx={{p:1}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">{`${doc.title} page ${currentPage}`}</Typography>
            </Stack>
            <Stack direction='row' spacing={2}>

                    <PDFViewer
                        pdfUrl={doc.content}
                        pageNumber={currentPage}
                    />
                    <Card sx={{p:2,display:'flex',flexGrow:1,flexDirection:'column'}}>
                        <TextField 
                            label="Summary"
                            multiline
                            value={doc.pagesSummary[currentPage-1]}
                            rows={20}
                            variant="outlined"
                            fullWidth
                            inputProps={{readOnly:true}}
                        />
                        <Box sx={{mt:'auto',display:'flex',justifyContent:'center'}}>
                            <Pagination count={doc.pages} page={currentPage} onChange={(e,page)=>setCurrentPage(page)} variant="outlined" color="secondary" />
                        </Box>
                    </Card>
            </Stack>
        </Container>}
    </>
  )
}

export default DocumentView