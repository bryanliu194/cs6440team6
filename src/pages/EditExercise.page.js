import { useContext, useEffect, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import ExerciseEntryForm from "../components/ExerciseEntryForm.component";
import { useParams, useNavigate } from "react-router-dom";

const EditExercise = () => {
  const { user } = useContext(UserContext);
  const [form, setForm] = useState({
    exerciseName: "",
    exerciseTime: "",
    createDate: new Date()
  });

  const { id: exerciseId } = useParams();
  const navigate = useNavigate();
  const userID = user.id;

  const loadExercise = async () => {
    // GraphQL query to fetch the details of an exercise
    // using expenseId
    const getExerciseQuery = gql`
      query getExercise($query: TblexerciseQueryInput!) {
        tblexercise(query: $query) {
          _id
          exerciseName
          exerciseTime
          createDate
          userID
        }
      }
      `;

    const queryVariables = { query: { _id: exerciseId } }

    const headers = { Authorization: `Bearer ${user._accessToken}` };

    const resp = await request(GRAPHQL_ENDPOINT, getExerciseQuery, queryVariables, headers);
    console.log(resp);


    // and auto-filling it into the form.
    const { exerciseName, exerciseTime, createDate } = resp.tblexercise;
    setForm({
      exerciseName,
      exerciseTime,
      createDate
    });
  };

  useEffect(() => {
    loadExercise(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const { exerciseName, exerciseTime, createDate } = form;

    // Checking if values are empty before submitting.
    if (exerciseName.length === 0 || exerciseTime.length === 0 || createDate.length === 0) {
      alert("All fields are required! please fill all fields");
      return;
    }

    // GraphQL mutation to edit the details of an expense
    const editExerciseMutation = gql`
    mutation EditExercise($query: TblexerciseQueryInput!, $set: TblexerciseUpdateInput!) {
      updateOneTblexercise(query: $query, set: $set) {
        _id
      }
    }
    `;

    // Here, we will be including all the keys and their respective values needed
    // to fetch the exact expense and update it accordingly with
    // newly inputted values.
    const queryAndUpdateVariables = {
      query: {
        _id: exerciseId
      },
      set: {
        exerciseName: exerciseName,
        exerciseTime: exerciseTime,
        createDate: createDate
      },
    };

    const headers = { Authorization: `Bearer ${user._accessToken}` };

    try {
      await request(GRAPHQL_ENDPOINT, editExerciseMutation, queryAndUpdateVariables, headers);

      // Navigating to homepage once the updates are sent and confirmed.
      alert("Exercise record updated successefully.");
      navigate(`/exerciseanalytics`);
    } catch (error) {
      alert(error)
    }
  };

  return <PageContainer>
    <ExerciseEntryForm onSubmit={onSubmit} form={form} setForm={setForm} editing />
  </PageContainer>
}

export default EditExercise;