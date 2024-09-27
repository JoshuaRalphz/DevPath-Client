import { styles } from "@/app/styles/style";
import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import Loader from "../../Loader/Loader";

type FAQ = {
  _id: string;
  question: string;
  answer: string;
  active: boolean;
};

const EditFaq: React.FC = () => {
  const { data, isLoading } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] = useEditLayoutMutation();
  const [questions, setQuestions] = useState<FAQ[]>([]);
  const [toastShown, setToastShown] = useState(false); // State to track if toast has been shown

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq.map((faq: FAQ) => ({ ...faq, active: faq.active || false })));
    }
    if (layoutSuccess && !toastShown) {
      toast.success("FAQ updated successfully");
      setToastShown(true); // Set toastShown to true after showing the toast
    }
    if (error && !toastShown) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
        setToastShown(true); // Set toastShown to true after showing the toast
      }
    }
  }, [data, layoutSuccess, error, toastShown]);

  const toggleQuestion = (id: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: string, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id: string, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        _id: uuid4(), // Ensure new FAQ items get a unique ID
        question: "",
        answer: "",
        active: false,
      },
    ]);
  };

  const areQuestionsUnchanged = (originalQuestions: FAQ[], newQuestions: FAQ[]) => {
    return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
  };

  const isAnyQuestionEmpty = (questions: FAQ[]) => {
    return questions.some((q) => q.question === "" || q.answer === "");
  };

  const handleEdit = async () => {
    if (!areQuestionsUnchanged(data.layout.faq, questions) && !isAnyQuestionEmpty(questions)) {
      console.log("Saving FAQ:", questions);
      try {
        await editLayout({ type: "FAQ", faq: questions });
        console.log("FAQ saved successfully");
        window.location.reload(); // Refresh the browser
      } catch (error) {
        console.error("Error saving FAQ:", error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
          <div className="mt-12">
            <dl className="space-y-8">
              {questions.map((q) => (
                <div
                  key={q._id}
                  className={`${
                    q._id !== questions[0]?._id ? "border-t" : ""
                  } border-gray-200 pt-6`}
                >
                  <dt className="text-lg">
                    <button
                      className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                      onClick={() => toggleQuestion(q._id)}
                    >
                      <input
                        className={`${styles.input} border-none`}
                        value={q.question}
                        onChange={(e) => handleQuestionChange(q._id, e.target.value)}
                        placeholder="Add your question..."
                      />
                      <span className="ml-6 flex-shrink-0">
                        {q.active ? <HiMinus className="h-6 w-6" /> : <HiPlus className="h-6 w-6" />}
                      </span>
                    </button>
                  </dt>
                  {q.active && (
                    <dd className="mt-2 pr-12">
                      <input
                        className={`${styles.input} border-none`}
                        value={q.answer}
                        onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                        placeholder="Add your answer..."
                      />
                      <span className="ml-6 flex-shrink-0">
                        <AiOutlineDelete
                          className="dark:text-white text-black text-[18px] cursor-pointer"
                          onClick={() =>
                            setQuestions((prevQuestions) =>
                              prevQuestions.filter((item) => item._id !== q._id)
                            )
                          }
                        />
                      </span>
                    </dd>
                  )}
                </div>
              ))}
            </dl>
            <br />
            <br />
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newFaqHandler}
            />
          </div>

          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
                ${
                  areQuestionsUnchanged(data.layout.faq, questions) || isAnyQuestionEmpty(questions)
                    ? "!cursor-not-allowed"
                    : "!cursor-pointer !bg-[#42d383]"
                }
                !rounded fixed bottom-12 right-12`}
            onClick={
              areQuestionsUnchanged(data.layout.faq, questions) || isAnyQuestionEmpty(questions)
                ? () => null
                : handleEdit
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditFaq;
function uuid4(): string {
  throw new Error("Function not implemented.");
}

