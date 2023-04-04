import { useContext, useState, useEffect } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import BloodSuagrLevelForm from "../components/BloodSugarLevelForm.component";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
//import BloodSugarLevelCard from "../components/BloodSugarLevelTable.component";

const CreateBloodSugarLevel = () => {
  const { user } = useContext(UserContext);
  //const [bloodSugarLevels, setBloodSugarLevels] = useState([]);
  const navigate = useNavigate();

  console.log(user.id);

  // Some prefilled form state
  const [form, setForm] = useState({
    bloodSugarLevel: '',
    createDate: new Date(),
  });

  // GraphQL query to create a weight entry
  const createBloodSugarQuery = gql`
  mutation AddBloodsugar($data: TblbloodsugarInsertInput!) {
    insertOneTblbloodsugar(data: $data) {
      _id 
      bloodSugarLevel
      createDate
    }
  }
  `;

  const queryVariables = {
    data: {
      bloodSugarLevel: form.bloodSugarLevel,
      createDate: form.createDate,
      userID: user.id
    }
  };


  const headers = {
    Authorization: `Bearer ${user._accessToken}`
  }


  const onSubmit = async (event) => {
    event.preventDefault();
    const { bloodSugarLevel, createDate } = form;
    if (bloodSugarLevel.length === 0 || createDate.length === 0) {
      alert("All fields are required! please fill all fields");
      return;
    }
    try {

      await request(GRAPHQL_ENDPOINT, createBloodSugarQuery, queryVariables, headers);
      // console.log(request);
      // Navigate to the Home page after creating a weight entry
      alert("Blood Sugar Level added successefull going to dashboard");
      navigate(`/bloodsugarlevelanalytics`);
    } catch (error) {
      console.log("didn't work")
      console.log(error)
    }
  };

  return <PageContainer>
    <BloodSuagrLevelForm onSubmit={onSubmit} form={form} setForm={setForm} title="Create Blood Sugar Level Entry" />
  </PageContainer>
}

export default CreateBloodSugarLevel;