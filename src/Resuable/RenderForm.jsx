import React from "react";
import { ErrorMessage } from "formik";
import {
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import DynamicSelection from "./DynamicSelection";

const RenderForm = ({ fields, formik }) => {
  const renderField = ({
    label,
    name,
    type,
    row,
    options,
    required,
    path,
    selectionType,
  }) => {
    const { values, errors, touched, handleChange, handleBlur } = formik;

    switch (type) {
      case "text":
      case "email":
      case "password":
        return (
          <TextField
            name={name}
            label={label}
            type={type}
            multiline={Boolean(row)}
            rows={row}
            fullWidth
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[name] && Boolean(errors[name])}
            helperText={touched[name] && errors[name]}
            required={required}
          />
        );

      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                name={name}
                color="primary"
                checked={Boolean(values[name])}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            }
            label={label}
          />
        );

      case "select":
        return (
          <FormControl sx={{ width: "100%" }}>
            <InputLabel>{label}</InputLabel>

            <Select
              name={name}
              label={label}
              fullWidth
              value={values[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched[name] && Boolean(errors[name])}
              helperText={touched[name] && errors[name]}
            >
              <MenuItem value="">None</MenuItem>
              {options &&
                options.map((option, index) => (
                  <MenuItem key={index} value={option.id}>
                    {option.value}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        );

      case "dymaicDropDown":
        return (
          <DynamicSelection
            label={label}
            value={values[name]}
            formik={formik}
            path={path}
            onBlur={handleBlur}
            required={required}
            name={name}
            selectionType={selectionType}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      {fields?.map((fieldConfig) => (
        <Grid item xs={fieldConfig.col} key={fieldConfig.name}>
          {renderField(fieldConfig)}
        </Grid>
      ))}
    </Grid>
  );
};

export default React.memo(RenderForm);
