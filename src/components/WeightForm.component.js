import { Button, TextField } from "@mui/material";
import { Hidden, Paper } from "@material-ui/core";
import CustomDatePicker from "./CustomDatePicker.component";
import PageContainer from "./PageContainer.component";
import { UserContext } from "../contexts/user.context";


const WeightForm = ({ onSubmit, form, setForm, editing }) => {
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  return <PageContainer>
    <form onSubmit={onSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>{editing ? "Edit weight" : "Create Weight Entry"}</h1>
      <TextField
        label="Weight"
        type="number"
        variant="outlined"
        name="weight"
        value={form.weight}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} />
      <CustomDatePicker
        label="Date"
        value={form.createdAt}
        onChange={(v) => { setForm({ ...form, createdAt: v }) }}
        style={{ marginBottom: "1rem", display: "block" }}
      />
      <Button variant="contained" color="primary" disabled={form.weight==''} onClick={onSubmit} type="submit">
        {editing ? "Update" : "Create"} Weight
      </Button>
    </form>
  </PageContainer>;
}

export default WeightForm;