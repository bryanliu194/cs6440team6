import { useContext, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import DietForm from "../components/DietForm.component";
import { useNavigate } from "react-router-dom";

const CreateDietEntry = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const getUserID = user.id;

  // Some prefilled form state
  const [form, setForm] = useState({
    fooditem: '',
    servingsize: '',
    calories: '',
    mealType: '',
    createDate: new Date(),
    userID: getUserID
  });

  // GraphQL query to create a weight entry
  const createDietyQuery = gql`
  mutation AddFoodItem($data: TbldietInsertInput!) {
    insertOneTbldiet(data: $data) {
      foodItem
      servingSize
      calories
      createDate
      mealType
      userID
    }
  }
  `;

  // All the data that needs to be sent to the GraphQL endpoint
  // to create an expense will be passed through queryVariables.
  const queryVariables = {
    data: {
      foodItem: form.foodItem,
      servingSize: form.servingSize,
      calories: form.calories,
      createDate: form.createDate,
      mealType: form.mealType,
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
    const { foodItem, calories, servingSize, createDate, userID, mealType} = form;

    if (mealType.length === 0 || mealType === '') {
      alert("Please enter meal type.");
      return;
    }
    if (foodItem === '') {
      alert("Please enter food item.");
      return;
    }

    try {
      await request(GRAPHQL_ENDPOINT, createDietyQuery, queryVariables, headers);
      console.log(request);
      // Navigate to the Home page after creating a weight entry
      navigate(`/dietentries`);
    } catch (error) {
      console.log(error)
    }
  };

  return <PageContainer>
    <DietForm onSubmit={onSubmit} form={form} setForm={setForm} title="Add Food" />
  </PageContainer>
}

export default CreateDietEntry;