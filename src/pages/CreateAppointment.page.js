import { useContext, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import AppointmentForm from "../components/AppointmentForm.component";
import { useNavigate } from "react-router-dom";

const CreateDietEntry = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const getUserID = user.id;

  console.log(getUserID);
  // Some prefilled form state
  const [form, setForm] = useState({
    provider: '',
    description: '',
    createDate: new Date(),
    modifyDate: new Date(),
    appointmentDate: new Date(),
    userID: getUserID
  });

  // GraphQL query to create a weight entry
  const createDietyQuery = gql`
  mutation AddAppointment($data: TblappointmentInsertInput!) {
    insertOneTblappointment(data: $data) {
      provider
      description
      createDate
      modifyDate
      appointmentDate
      userID
    }
  }
  `;

  // All the data that needs to be sent to the GraphQL endpoint
  // to create an expense will be passed through queryVariables.
  const queryVariables = {
    data: {
      provider: form.provider,
      description: form.description,
      createDate: form.appointmentDate,
      modifyDate: form.appointmentDate,
      appointmentDate: form.appointmentDate,
      userID: getUserID
    }
  };

  // To prove that the identity of the user, we are attaching
  // an Authorization Header with the request
  // const headers = { Authorization: `Bearer ${user._accessToken}` };
  const headers = {
  Authorization: `Bearer ${user._accessToken}`}

  const onSubmit = async (event) => {
    event.preventDefault();
    const { provider, description, createDate, modifyDate, appointmentDate, userID, } = form;

    try {
      console.log(queryVariables.data)
      await request(GRAPHQL_ENDPOINT, createDietyQuery, queryVariables, headers);
      console.log(request);
      // Navigate to the Home page after creating a weight entry
      navigate(`/appointment`);
    } catch (error) {
      console.log(error)
    }
  };

  return <PageContainer>
    <AppointmentForm onSubmit={onSubmit} form={form} setForm={setForm} title="Add Appointment" />
  </PageContainer>
}

export default CreateDietEntry;