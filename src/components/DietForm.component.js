import { Button, TextField, MenuItem, FormControl, InputLabel, NativeSelect } from "@mui/material";
import CustomDatePicker from "./CustomDatePicker.component";
import PageContainer from "./PageContainer.component";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/user.context"


const DietForm = ({ onSubmit, form, setForm, editing}) => {

const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };
  return <PageContainer>
    <form onSubmit={onSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>{editing ? "Edit food item" : "Enter Food"}</h1>
      <CustomDatePicker
        label="Date"
        value={form.createDate}
        onChange={(v) => { setForm({ ...form, createDate: v }) }}
        style={{ marginBottom: "1rem", display: "block" }}
      />
<TextField
        label="Meal Type"
        type="text"
        variant="outlined"
        name="mealType"
        value={form.mealType}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem", marginTop: "1rem" }} />

      <TextField
        label="Food Item"
        type="text"
        variant="outlined"
        name="foodItem"
        value={form.foodItem}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem", marginTop: "1rem" }} />
        <TextField
        label="Serving Size"
        type="text"
        variant="outlined"
        name="servingSize"
        value={form.servingSize}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} />
        <TextField
        label="Calories"
        type="number"
        variant="outlined"
        name="calories"
        value={form.calories}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} />
      <Button variant="contained" color="primary" disabled={form.foodItem==''||form.mealType==''} onClick={onSubmit} type="submit">
        {editing ? "Update" : "Create"} Food Entry
      </Button>
    </form>
  </PageContainer>;
}

export default DietForm;