import Quiz from "../models/quiz.schema.js";

export const addQuiz = async (quizData) => {
  const newQuiz = await Quiz.create(quizData);
  return newQuiz;
};

export const getQuiz = async (quizId) => {
  const quiz = await Quiz.findById(quizId).populate("lesson");
  return quiz;
};

export const updateQuizById = async (quizId, quizData) => {
  const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, quizData, {
    new: true,
  });
  return updatedQuiz;
};

export const deleteQuizById = async (quizId) => {
  const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
  return deletedQuiz;
};
