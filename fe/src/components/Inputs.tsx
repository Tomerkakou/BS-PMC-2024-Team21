import { Autocomplete, Checkbox, CircularProgress, createFilterOptions, darken, FilterOptionsState, FormControlLabel, InputProps, lighten, styled, SxProps, TextField, TextFieldVariants } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { MuiFileInput } from 'mui-file-input';
import React, { useEffect } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';

// Define the props for TextInput component
interface TextInputProps {
    control: Control<any>;
    rules?: RegisterOptions<any>;
    label: string;
    fieldName: string;
    InputProps?: InputProps;
    sx?: SxProps;
    variant?: TextFieldVariants;
    disabled?: boolean;
    readonly?: boolean;
    size?: 'small' | 'medium';
    type?: string;
}

// TextInput component
const TextInput: React.FC<TextInputProps> = ({ control, rules, label, fieldName, InputProps, sx, disabled, variant = "outlined", size = "medium",type="text" }) => {
    return (
        <Controller
            name={fieldName}
            control={control}
            rules={rules}
            defaultValue={''}
            render={({ field, fieldState }) => (
                <TextField
                    {...field}
                    label={label}
                    variant={variant}
                    fullWidth
                    required={Boolean(rules?.required)}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    InputProps={InputProps}
                    disabled={disabled}
                    size={size}
                    type={type}
                    sx={sx}
                />
            )}
        />
    );
};

// Define the props for CheckBoxInput component
interface CheckBoxInputProps {
    control: Control<any>;
    rules?: RegisterOptions<any>;
    label: string;
    fieldName: string;
    CheckSx?: SxProps;
    sx?: SxProps;
}

//CheckBox component
const CheckBoxInput: React.FC<CheckBoxInputProps> = ({ control, rules, label, fieldName, CheckSx, sx }) => {
    return (
        <Controller
            name={fieldName}
            control={control}
            rules={rules}
            defaultValue={false}
            render={({ field }) => (
                <FormControlLabel required={Boolean(rules?.required)}
                    sx={sx}
                    control={
                        <Checkbox
                            sx={CheckSx}
                            checked={field.value}
                            {...field}
                        />
                    }
                    label={label} />
            )}
        />
    );
};

// Styled component for group header
const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,//'#1976d2',
    backgroundColor:
        theme.palette.mode === 'light'
            ? lighten(theme.palette.primary.light, 0.85)//'#42a5f5'
            : darken(theme.palette.primary.main, 0.8),//'#1976d2'
}));

// Styled component for group items
const GroupItems = styled('ul')({
    padding: 0,
});

// Define the props for SelectInput component
interface SelectInputProps extends TextInputProps {
    options: any[];
    getOptionLabel?: (option: any) => string;
    groupBy?: (option: any) => string;
    isMulti?: boolean;
    isOptionEqualToValue?: (option: any, value: any) => boolean;
    renderTags?: (tagValue: any, getTagProps: any) => React.ReactNode;
    onChange?: (event: React.SyntheticEvent, value: any, reason: string, details?: any) => void;
    disableClearable?: boolean;
    loading?: boolean;
    onInputChange?: (event: React.SyntheticEvent, value: string, reason: string) => void;
    getOptionKey?: (option: any) => string | number;
    createable?: boolean;
}

const filter = createFilterOptions();

// SelectInput component
const SelectInput: React.FC<SelectInputProps> = ({
    control,
    rules,
    label,
    fieldName,
    disabled,
    sx,
    options,
    groupBy,
    getOptionLabel,
    isOptionEqualToValue,
    renderTags,
    InputProps,
    isMulti,
    onChange,
    disableClearable,
    loading,
    onInputChange,
    getOptionKey,
    createable,
    readonly,
    variant = "outlined",
    size = "medium"
}) => {

    useEffect(() => {
        if (createable && !options.every(element => typeof element === 'string')) {
            throw new Error('All options should be string when createable is true');
        }
    }, [createable, options]);

    const filterOptions = !createable ? undefined : (options: any[], params: FilterOptionsState<any>) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === params.getOptionLabel(option));
        if (inputValue !== '' && !isExisting) {
            filtered.push({
                inputValue,
                label: `Add "${inputValue}"`,
            });
        }

        return filtered;
    }
    return (
        <Controller
            name={fieldName}
            control={control}
            rules={rules}
            defaultValue={isMulti ? [] : null}
            render={({ field, fieldState }) => (
                <Autocomplete
                    {...field}
                    options={options}
                    getOptionLabel={getOptionLabel}
                    getOptionKey={getOptionKey}
                    disabled={disabled}
                    freeSolo={createable}
                    readOnly={readonly}
                    isOptionEqualToValue={isOptionEqualToValue}
                    onChange={(_, data, reason, details) => {
                        if (onChange) {
                            onChange(_, data, reason, { option: details?.option, fieldName: fieldName });
                        }

                        if (createable && reason === 'selectOption') {
                            if (isMulti) {
                                const dataArr = data as any[];
                                const last = dataArr.length - 1;
                                dataArr[last] = dataArr[last]?.inputValue ?? dataArr[last];
                            }
                            else {
                                data = (data as any)?.inputValue ?? data;
                            }
                        }
                        field.onChange(data)
                    }}
                    filterOptions={filterOptions}
                    groupBy={groupBy}
                    filterSelectedOptions={isMulti}
                    fullWidth
                    multiple={isMulti}
                    loading={loading}
                    onInputChange={onInputChange}
                    disableClearable={disableClearable}
                    value={field.value}
                    renderGroup={(params) => (
                        <li key={params.key}>
                            <GroupHeader>{params.group}</GroupHeader>
                            <GroupItems>{params.children}</GroupItems>
                        </li>
                    )}
                    sx={sx}
                    renderTags={renderTags}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            required={Boolean(rules?.required)}
                            label={label}
                            variant={variant}
                            size={size}
                            error={Boolean(fieldState.error)}
                            helperText={fieldState.error?.message}
                            InputProps={{
                                ...params.InputProps,
                                ...InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                />
            )}
        />
    );
};

const DateInput: React.FC<TextInputProps> = ({ control, rules, label, fieldName, InputProps, sx, disabled, variant = "outlined", size = "medium" }) => {
    return (
        <Controller
            name={fieldName}
            control={control}
            rules={rules}
            defaultValue={null}
            render={({ field, fieldState }) => (
                <DatePicker
                    {...field}
                    label={label}
                    format='dd/MM/yyyy'
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            variant: variant,
                            required: Boolean(rules?.required),
                            error: Boolean(fieldState.error),
                            helperText: fieldState.error?.message,
                            InputProps: InputProps,
                            disabled: disabled,
                            size: size,
                        },
                        popper: {
                            placement: 'left',
                        }
                    }}
                    disabled={disabled}
                    sx={sx}
                />
            )}
        />
    );

}

interface MuiFileInputProps {
    placeholder: string;
    control: Control<any>;
    rules?: RegisterOptions<any>;
    accept?:string;
    icon?:React.ReactNode;
    fieldName:string;
}
const FileInput:React.FC<MuiFileInputProps> = ({
    placeholder,
    control,
    rules,
    accept,
    icon,
    fieldName
}) => {
    return (
        <Controller
            name={fieldName}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
              <MuiFileInput
                placeholder={placeholder}
                {...field}
                helperText={fieldState.invalid ? fieldState.error?.message : ''}
                error={fieldState.invalid}
                InputProps={{
                  inputProps: {
                    accept: accept,
                  },
                  startAdornment: icon,
                }}
              />
            )}
          />
    );
}


export { CheckBoxInput, DateInput, SelectInput, TextInput,FileInput };

