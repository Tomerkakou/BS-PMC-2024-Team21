
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { CodeEditor, createComment } from 'components/CodeEditor';
import { TextInput } from 'components/Inputs';
import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';



const Coding = ({language}:{language:string}) => {
    const {control}=useFormContext();

    const template=useController({
        name:"template",
        control:control,
        defaultValue:createComment("Write your template here",language),
    });

    const answer=useController({
      name:"correct_answer",
      control:control,
      defaultValue:createComment("Write your correct answer here",language),
      rules:{validate:(value:string)=>{
        if(value===createComment("Write your correct answer here",language)){
          return '• Correct Answer is required!';
        }
        return true;
      }}
    });
    
    const [tab,setTab] = useState<string>("template");

    const handleChange = (value:string) => {
      if(tab==="answer"){
        answer.field.onChange(value);
      }
      else{
        template.field.onChange(value);
      }
    }

    return (
      <Box sx={{display:"flex",flexDirection:"column",flexGrow:1}}>
            <TextInput control={control} fieldName="question" multiline={5} label="Question"/>
            <Tabs
                value={tab}
                onChange={(e:any, value:string) => setTab(value)}
                textColor="secondary"
                centered
                indicatorColor="secondary"
                sx={{my:2}}
              >
                <Tab value="template" label="Template"/>
                <Tab value="answer" label="Correct Answer" />
            </Tabs>
            {answer.fieldState.invalid && 
              <Typography component="p"
                sx={{color:theme=>theme.palette.error.dark,mb:2}}
              >
                {answer.fieldState.error?.message}
              </Typography>
            }
          <Box sx={{height:"50vh"}}>
            <CodeEditor language={language} value={tab ==="answer" ? answer.field.value : template.field.value} onChange={handleChange}/>
          </Box>
      </Box>
    )
}

export default Coding