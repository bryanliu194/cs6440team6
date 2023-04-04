import { useContext, useEffect, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import BloodSugarLevelForm from "../components/BloodSugarLevelForm.component";
import { useParams, useNavigate } from "react-router-dom";

const EditBloodSugarLevel = () => {
  const { user } = useContext(UserContext);
  const [form, setForm] = useState({
    bloodSugarLevel: "",
    userID: user.id,
    createDate: new Date()
  });

  const { id: bloodSugarLevelId } = useParams();
  const navigate = useNavigate();
  const userID = user.id;

  const loadBloodSugarLevel = async () => {
    // GraphQL query to fetch the details of an expense
    // using expenseId
    const getBloodSugerLevelQuery = gql`
      query getBloodSugar($query: TblbloodsugarQueryInput!) {
        tblbloodsugar(query: $query) {
          _id
          bloodSugarLevel
          userID
          createDate
        }
      }
      `;

    const queryVariables = { query: { _id: bloodSugarLevelId } }

    const headers = { Authorization: `Bearer ${user._accessToken}` };

    const resp = await request(GRAPHQL_ENDPOINT, getBloodSugerLevelQuery, queryVariables, headers);

    // Destructuring the values of the expense fetched
    // and auto-filling it into the form.
    const { bloodSugarLevel, createDate } = resp.tblbloodsugar;
    setForm({
      bloodSugarLevel,
      createDate,
      userID
    });
  };

  useEffect(() => {
    loadBloodSugarLevel(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const { bloodSugarLevel, userID, createDate } = form;

    // Checking if values are empty before submitting.
    if (bloodSugarLevel.length === 0 || createDate.length === 0) {
      alert("All fields are required! please fill all fields");
      return;
    }

    // GraphQL mutation to edit the details of an expense
    const editBloodSugarMutation = gql`
    mutation EditBloodSugar($query: TblbloodsugarQueryInput!, $set: TblbloodsugarUpdateInput!) {
      updateOneTblbloodsugar(query: $query, set: $set) {
        _id
      }
    }
    `;

    // Here, we will be including all the keys and their respective values needed
    // to fetch the exact expense and update it accordingly with
    // newly inputted values.
    const queryAndUpdateVariables = {
      query: {
        _id: bloodSugarLevelId
      },
      set: {
        bloodSugarLevel: bloodSugarLevel,
        createDate: createDate
      },
    };

    const headers = { Authorization: `Bearer ${user._accessToken}` };

    try {
      await request(GRAPHQL_ENDPOINT, editBloodSugarMutation, queryAndUpdateVariables, headers);

      // Navigating to homepage once the updates are sent and confirmed.
      alert("Blood Sugar Level updated successfully.");
      navigate(`/bloodsugarlevelanalytics`);
    } catch (error) {
      alert(error)
    }
  };

  return <PageContainer>
    <BloodSugarLevelForm onSubmit={onSubmit} form={form} setForm={setForm} editing />
  </PageContainer>
}

export default EditBloodSugarLevel;