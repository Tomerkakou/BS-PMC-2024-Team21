import { CodeiumEditor } from '@codeium/react-code-editor';
import { Box, CircularProgress } from '@mui/material';
import React from 'react'
import { Control, Controller, RegisterOptions } from 'react-hook-form';

const languageMapper:Record<string,string> = {
    'Python':'python',
    'Java':'java',
    'JavaScript':'javascript',
    'C#':'csharp',
    'SQL':'sql'
};

interface CodeEditorProps {
    language:string;
    theme?:"vs-dark" | "light";
    value?:string;
    defaultValue?:string;
    startComment?:string;
    onChange?:any;
    id?:string
}

const CodeEditor:React.FC<CodeEditorProps> = ({language,value,onChange,id,theme="vs-dark"}) => {

    const handleRemoveG=() => {
        const elements = document.getElementsByTagName('g');
        const elementsArray = Array.from(elements);
        elementsArray.forEach(element => {
            element.parentNode?.removeChild(element);
        });
    }

  return (
    <CodeiumEditor 
        language={languageMapper[language]}
        theme={theme}
        value={value}
        height='100%'
        onChange={onChange}
        onMount={handleRemoveG}
        loading={<Box>
            <svg width={0} height={0}>
              <defs>
                <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e01cd5" />
                  <stop offset="100%" stopColor="#1CB5E0" />
                </linearGradient>
              </defs>
            </svg>
            <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
          </Box>
        }
    />
  )
}

interface CodeEditorInputProps extends CodeEditorProps {
    fieldName:string;
    control:Control<any>;
    rules?: RegisterOptions<any>;
}

const CodeEditorInput:React.FC<CodeEditorInputProps> = (props) => {
  return (
    <Controller 
        name="template"
        control={props.control}
        render={({ field, fieldState }) => (
        <CodeEditor 
            language={props.language}
            theme={props.theme}
            value={field.value}
            id={props.fieldName}
            onChange={field.onChange}
        />
        )}
    />
  )
}

function createComment(comment:string,language:string) {
    switch (languageMapper[language]) {
        case 'python':
            return `# ${comment}`;
        case 'javascript':
            return `// ${comment}`;
        case 'java':
            return `// ${comment}`;
        case 'c#':
            return `// ${comment}`;
        case 'sql':
            return `-- ${comment}`;
        default:
            return `// ${comment}`;
    }
}


export {CodeEditorInput,CodeEditor,createComment}
