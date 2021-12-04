import axios from 'axios';

export const getStudents = async () => {
  try {
    const { data } = await axios.get(
      'https://api.hatchways.io/assessment/students'
    );

    return data.students;
  } catch (error) {
    throw new Error(error);
  }
};
