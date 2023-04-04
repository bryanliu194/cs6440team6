import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TimePicker from '@mui/lab/TimePicker';

const HealthyDietaryHabitsText = ({ style }) => {
  return (
    <p>
        Choose low-glycemic index (GI) foods: These foods have a lower impact on blood sugar levels. Examples include non-starchy vegetables, legumes, whole grains, nuts, and seeds.

Monitor carbohydrate intake: Carbohydrates have the most significant effect on blood sugar levels. Therefore, it is essential to monitor the amount and type of carbohydrates consumed. Consider working with a registered dietitian to help determine your specific carbohydrate needs.

Incorporate lean protein: Protein can help slow the absorption of carbohydrates and help manage blood sugar levels. Lean protein sources include chicken, turkey, fish, lean beef, tofu, and legumes.

Choose healthy fats: Include healthy fats such as avocado, nuts, seeds, and olive oil in your diet. However, keep in mind that fat is high in calories, so it is essential to monitor portions.

Avoid sugary and processed foods: Sugary and processed foods should be avoided, as they can cause rapid spikes in blood sugar levels.

Stay hydrated: Drink plenty of water to help control blood sugar levels and prevent dehydration.

Spread meals throughout the day: Eating smaller, more frequent meals throughout the day can help maintain stable blood sugar levels.

Remember, it is essential to work with a registered dietitian or healthcare provider to determine an individualized meal plan that fits your unique needs and preferences.

    </p>
  );
};

export default HealthyDietaryHabitsText;