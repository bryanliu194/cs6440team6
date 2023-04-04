import { useContext, useEffect, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import { useParams, useNavigate } from "react-router-dom";
import AppointmentForm from "../components/AppointmentForm.component";

const EditWeight = () => {
  const { user } = useContext(UserContext);
  const [form, setForm] = useState({
    provider: "",
    description: "",
    modifyDate: new Date(),
    appointmentDate: new Date(),
    createDate: new Date()
  });

  const { id: weightId } = useParams();
  const navigate = useNavigate();
  const userID = user.id;

  const loadWeight = async () => {
    // GraphQL query to fetch the details of an expense
    // using expenseId
    const getWeightQuery = gql`
      query getAppointment($query: TblappointmentQueryInput!) {
        tblappointment(query: $query) {
          _id
          provider
          description
          modifyDate
          appointmentDate
          createDate
          userID
        }
      }
      `;

    const queryVariables = { query: { _id: weightId } }

    const headers = { Authorization: `Bearer ${user._accessToken}` };

    const resp = await request(GRAPHQL_ENDPOINT, getWeightQuery, queryVariables, headers);
    console.log(resp)
    // Destructuring the values of the expense fetched
    // and auto-filling it into the form.
    const { provider, description, modifyDate, appointmentDate, createDate } = resp.tblappointment;
    setForm({
      provider,
      description,
      modifyDate,
      appointmentDate,
      createDate,
      userID
    });
  };

  useEffect(() => {
    loadWeight(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const { provider, description, appointmentDate } = form;

    // Checking if values are empty before submitting.
    // if (amount.length === 0 || category.length === 0 || mode.length === 0 || title.length === 0) {
    //   return;
    // }

    // GraphQL mutation to edit the details of an expense
    const editWeightMutation = gql`
    mutation EditAppointment($query: TblappointmentQueryInput!, $set: TblappointmentUpdateInput!) {
      updateOneTblappointment(query: $query, set: $set) {
        _id
      }
    }
    `;

    // Here, we will be including all the keys and their respective values needed
    // to fetch the exact expense and update it accordingly with
    // newly inputted values.
    const queryAndUpdateVariables = {
      query: {
        _id: weightId
      },
      set: {
        provider: provider,
        description: description,
        modifyDate: appointmentDate,
        appointmentDate: appointmentDate,
        createDate: appointmentDate
      },
    };

    const headers = { Authorization: `Bearer ${user._accessToken}` };

    try {
      await request(GRAPHQL_ENDPOINT, editWeightMutation, queryAndUpdateVariables, headers);

      // Navigating to homepage once the updates are sent and confirmed.
      navigate(`/appointment`);
    } catch (error) {
      console.log(error)
    }
  };

  return <PageContainer>
    <AppointmentForm onSubmit={onSubmit} form={form} setForm={setForm} editing />
  </PageContainer>
}

export default EditWeight;