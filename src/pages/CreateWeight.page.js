import { useContext, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import WeightForm from "../components/WeightForm.component";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CreateWeight = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const getUserID = user.id;

  console.log(getUserID);
  // Some prefilled form state
  const [form, setForm] = useState({
    weight: '',
    createDate: new Date(),
    userID: getUserID
  });

  // GraphQL query to create a weight entry
  const createWeightQuery = gql`
  mutation AddWeight($data: TblweightInsertInput!) {
    insertOneTblweight(data: $data) {
      _id
      weight
      createDate
      userID  
    }
  }
  `;

  // All the data that needs to be sent to the GraphQL endpoint
  // to create an expense will be passed through queryVariables.
  const queryVariables = {
    data: {
      weight: form.weight,
      createDate: form.createDate,
      userID: getUserID
    }
  };

  // To prove that the identity of the user, we are attaching
  // an Authorization Header with the request
  // const headers = { Authorization: `Bearer ${user._accessToken}` };
  const headers = {
    Authorization: `Bearer ${user._accessToken}`
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    const { weight, createDate, userID } = form;
    // if (weight.length === 0) {
    //   return;
    // }
    try {

      await request(GRAPHQL_ENDPOINT, createWeightQuery, queryVariables, headers);
      console.log(request);
      // Navigate to the Home page after creating a weight entry
      navigate(`/weightanalytics`);
    } catch (error) {
      console.log(error)
    }
  };

  return <PageContainer>
    <WeightForm onSubmit={onSubmit} form={form} setForm={setForm} title="Create Weight Entry" />
  </PageContainer>
}

export default CreateWeight;