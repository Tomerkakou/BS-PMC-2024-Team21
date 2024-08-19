import { Box, Card, Container, Pagination, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import PDFViewer from 'components/PDFViewer';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Iconify from 'components/iconify';
import { Button } from '@mui/material';

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
    const [loading, setLoading] = useState(true);


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
    const title = doc? `${doc.title} page ${currentPage}` : 'Loading...';
  return (
    <>
        

        <Container sx={{p:1}}>
        
        
            <Stack direction="row" alignItems="center" mb={5} spacing={5}>
            <Button  onClick={()=> navigate('/documents')} sx={{ color: 'black' }} id="doc-back-btn">
                <Iconify icon="icon-park-twotone:back" /> 
            </Button>
            <Typography variant="h4">{title}</Typography>
            </Stack>
            <Stack direction='row' spacing={2}>

                    {!loading && doc &&<Box sx={{width:'45vw'}}> 
                        <PDFViewer
                        pdfUrl={doc.content}
                        pageNumber={currentPage}
                    />
                    </Box>}
                    {loading && <Stack direction='column' height={1} width={0.5} spacing={2}>
                        <Skeleton variant="text"/>
                        <Skeleton variant="text"/>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text"/>
                        <Skeleton variant="text"/>
                        <Skeleton variant="text"/>
                        <Skeleton variant="rectangular" height={60} />
                        <Skeleton variant="text"/>
                        <Skeleton variant="text"/>
                        <Skeleton variant="text"/>
                        <Skeleton variant="rectangular" height={60} />
                        <Skeleton variant="text"/>
                        <Skeleton variant="text"/>
                        <Skeleton variant="text"/>
                        <Skeleton variant="text"/>
                    </Stack>
                    }
                    <Card sx={{p:2,display:'flex',flexGrow:1,flexDirection:'column'}}>
                        <TextField 
                            label="Summary"
                            multiline
                            value={doc?.pagesSummary[currentPage-1]}
                            rows={20}
                            variant="outlined"
                            fullWidth
                            autoFocus
                            inputProps={{readOnly:true}}
                        />
                        <Box sx={{mt:'auto',display:'flex',justifyContent:'center'}}>
                            <Pagination count={doc?.pages} page={currentPage} onChange={(e,page)=>setCurrentPage(page)} variant="outlined" color="secondary" />
                        </Box>
                    </Card>
            </Stack>
        </Container>
    </>
  )
}

export default DocumentView