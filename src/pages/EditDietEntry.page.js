import { useContext, useEffect, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import DietForm from "../components/DietForm.component";
import { useParams, useNavigate } from "react-router-dom";

const EditDietEntry = () => {
  const { user } = useContext(UserContext);
  const [form, setForm] = useState({
    calories: "",    
    createDate: new Date(),
    foodItem: "",
    servingSize: "",
    mealType: ""
  });

  const { id: dietId } = useParams();
  const navigate = useNavigate();
  const userID = user.id;

  const loadDietEntries = async () => {

    const getDietQuery = gql`
      query getDiet($query: TbldietQueryInput!) {
        tbldiet(query: $query) {
          _id
          calories
          createDate
          foodItem
          servingSize,
          mealType,
          userID
        }
      }
      `;

    const queryVariables = { query: { _id: dietId } }
    const headers = { Authorization: `Bearer ${user._accessToken}` };
    const resp = await request(GRAPHQL_ENDPOINT, getDietQuery, queryVariables, headers);
    console.log(resp);

    // Destructuring the values of the diet entries fetched
    // and auto-filling it into the form.
    const { calories, createDate, foodItem, servingSize, mealType } = resp.tbldiet;
    setForm({
      calories,
      createDate,
      foodItem,
      servingSize,
      mealType
    });
  };

  useEffect(() => {
    loadDietEntries();
  }, []);

  const onSubmit = async (event) => {

    event.preventDefault();
    const { calories, createDate, foodItem, servingSize, mealType } = form;

    if (mealType.length === 0 || mealType === '') {
      alert("Please enter meal type.");
      return;
    }
    if (foodItem === '') {
      alert("Please enter food item.");
      return;
    }

    // GraphQL mutation to edit the details of an expense
    const editDietMutation = gql`
    mutation EditDiet($query: TbldietQueryInput!, $set: TbldietUpdateInput!) {
      updateOneTbldiet(query: $query, set: $set) {
        _id
      }
    }
    `;

    // Here, we will be including all the keys and their respective values needed
    // to fetch the exact expense and update it accordingly with
    // newly inputted values.
    const queryAndUpdateVariables = {
      query: {
        _id: dietId
      },
      set: {
        calories: calories,
        createDate: createDate,
        foodItem: foodItem,
        servingSize: servingSize,
        mealType: mealType
      },
    };

    const headers = { Authorization: `Bearer ${user._accessToken}` };

    try {
      await request(GRAPHQL_ENDPOINT, editDietMutation, queryAndUpdateVariables, headers);
      // Navigating to homepage once the updates are sent and confirmed.
      navigate(`/dietentries`);
    } catch (error) {
      alert(error)
    }
  };

  return <PageContainer>
    <DietForm onSubmit={onSubmit} form={form} setForm={setForm} editing />
  </PageContainer>
}

export default EditDietEntry;