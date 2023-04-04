import { Button, TextField } from "@mui/material";
import CustomDatePicker from "./CustomDatePicker.component";
import PageContainer from "./PageContainer.component";

const BloodSuagrLevelForm = ({ onSubmit, form, setForm, editing }) => {
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  return <PageContainer>
    <form onSubmit={onSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h1>{editing ? "Edit Blood Sugar Level" : "Create Blood Sugar Level Entry"}</h1>
      <TextField
        label="Blood Sugar Level"
        type="number"
        variant="outlined"
        name="bloodSugarLevel"
        value={form.bloodSugarLevel}
        onChange={onFormInputChange}
        fullWidth
        style={{ marginBottom: "1rem" }} />
      <CustomDatePicker
        label="Date"
        value={form.createdAt}
        onChange={(v) => { setForm({ ...form, createdAt: v }) }}
        style={{ marginBottom: "1rem", display: "block" }}
      />
      <Button variant="contained" color="primary" onClick={onSubmit} type="submit">
        {editing ? "Update" : "Create"}
      </Button>
    </form>
  </PageContainer>;
}

export default BloodSuagrLevelForm;