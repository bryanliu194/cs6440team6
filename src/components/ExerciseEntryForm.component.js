import { Button, Card, CardContent, Grid, TextField } from "@mui/material";
import CustomDatePicker from "./CustomDatePicker.component";
import PageContainer from "./PageContainer.component";
import { Link } from "react-router-dom";

const ExerciseEntryForm = ({ onSubmit, form, setForm, editing }) => {
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  return <PageContainer>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <form onSubmit={onSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
          <h1>{editing ? "Edit Exercise Entry" : "Create Exercise Entry"}</h1>
          <CustomDatePicker
            label="Date"
            value={form.createDate}
            onChange={(v) => { setForm({ ...form, createDate: v }) }}
            style={{ marginBottom: "1rem", display: "block" }}
          />
          <TextField
            label="Exercise Name"
            type="text"
            variant="outlined"
            name="exerciseName"
            value={form.exerciseName}
            onChange={onFormInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }} />

          <TextField
            label="Exercise Time(Min)"
            type="text"
            variant="outlined"
            name="exerciseTime"
            value={form.exerciseTime}
            onChange={onFormInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }} />

          <Button variant="contained" color="primary" onClick={onSubmit} type="submit">
            {editing ? "Update" : "Create"}
          </Button>
        </form>
      </Grid>
      <Grid item xs={6}>
        <br /><br /><br />
        <Card style={{ backgroundColor: "lightgray" }}>
          <CardContent>
            <p>According to the American Diabetes Association, adults with type 2 diabetes should perform at least 150 minutes of moderate- to vigorous-intensity physical activity per week.
              Ideally, weekly exercise would be spread over at least three days, with no more than two days passing without some form of activity.
              For more exercise suggestions and videos
              <Button size="small" component={Link} to="/exerciseresource">click here</Button></p>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </PageContainer>;
}

export default ExerciseEntryForm;