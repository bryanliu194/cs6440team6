import { useContext, useState, useEffect } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import ExerciseEntryForm from "../components/ExerciseEntryForm.component";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
//import BloodSugarLevelCard from "../components/BloodSugarLevelTable.component";

const CreateExerciseEntry = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const getUserID = user.id;

  console.log(user.id);

  // Some prefilled form state
  const [form, setForm] = useState({
    exerciseName: '',
    exerciseTime: '',
    createDate: new Date(),
    userID: getUserID
  });

  // GraphQL query to create a weight entry
  const createExerciseEntryQuery = gql`
  mutation AddExercise($data: TblexerciseInsertInput!) {
    insertOneTblexercise(data: $data) {
      _id 
      exerciseName
      exerciseTime
      createDate
      userID
    }
  }
  `;

  const queryVariables = {
    data: {
      exerciseName: form.exerciseName,
      exerciseTime: form.exerciseTime,
      createDate: form.createDate,
      userID: user.id
    }
  };


  const headers = {
    Authorization: `Bearer ${user._accessToken}`
  }


  const onSubmit = async (event) => {
    event.preventDefault();
    const { exerciseName, exerciseTime, createDate, userID } = form;
    if (exerciseName.length === 0 || exerciseTime.length == 0 || createDate.length === 0) {
      alert("All fields are required! please fill all fields");
      return;
    }
    try {

      await request(GRAPHQL_ENDPOINT, createExerciseEntryQuery, queryVariables, headers);
      // console.log(request);
      // Navigate to the Home page after creating a weight entry
      alert("Exercise added successefull going to dashboard");
      navigate(`/exerciseanalytics`);
    } catch (error) {
      console.log("didn't work")
      console.log(error)
    }
  };

  return <PageContainer>
    <ExerciseEntryForm onSubmit={onSubmit} form={form} setForm={setForm} title="Create Exercise Entry" />
    <p>Exercise suggestion</p>
  </PageContainer>
}

export default CreateExerciseEntry;