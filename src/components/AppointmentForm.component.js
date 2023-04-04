import { Button, TextField } from "@mui/material";
import { Hidden, Paper } from "@material-ui/core";
import CustomDateTimePicker from "./CustomDateTimePicker.component";
import PageContainer from "./PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { Link } from 'react-router-dom';

const DietForm = ({ onSubmit, form, setForm, editing }) => {
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  return <PageContainer>
    <form onSubmit={onSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>{editing ? "Edit appointment" : "Add appointment"}</h1>
      
      {/* <CustomDatePicker
        label="Date"
        value={form.createDate}
        onChange={(v) => { setForm({ ...form, createDate: v }) }}
        style={{ marginBottom: "1rem", display: "block" }}
      /> */}
      <CustomDateTimePicker
        label="Date"
        value={form.appointmentDate}
        onChange={(v) => { setForm({ ...form, appointmentDate: v }) }}
        style={{ marginBottom: "1rem", display: "block" }}
      />
      {/* <CustomDatePicker
        label="Date"
        value={form.modifyDate}
        onChange={(v) => { setForm({ ...form, modifyDate: v }) }}
        style={{ marginBottom: "1rem", display: "block" }}
      /> */}
      <TextField
        label="Provider"
        type="text"
        variant="outlined"
        name="provider"
        value={form.provider}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} />
        <TextField
        label="Description"
        type="text"
        variant="outlined"
        name="description"
        value={form.description}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} />
        {/* <TextField
        label="Calories"
        type="number"
        variant="outlined"
        name="calories"
        value={form.calories}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} /> */}
      <Button variant="contained" color="primary" disabled={form.provider==''||form.description==''} onClick={onSubmit} type="submit">
        {editing ? "Update" : "Create"} Appointment
      </Button>
      {/* <Button variant="contained" color="primary" component={Link} to="/appointment" >
        Cancel
      </Button> */}
    </form>
  </PageContainer>;
}

export default DietForm;