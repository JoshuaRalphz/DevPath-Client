import { styles } from "@/app/styles/style";
import React, { FC } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";

type Props = {
  benefits: { title: string }[];
  setBenefits: (benefits: { title: string }[]) => void;
  prerequisites: { title: string }[];
  setPrerequisites: (prerequisites: { title: string }[]) => void;
  active: number;
  setActive: (active: number) => void;
};

const CourseData: FC<Props> = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {

  const handleBenefitChange = (index: number, value: any) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index].title = value;
    setBenefits(updatedBenefits);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handlePrerequisitesChange = (index: number, value: any) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].title = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  }

  const handleOptions = () => {
    if (benefits[benefits.length - 1]?.title !== "" && prerequisites[prerequisites.length - 1]?.title !== "") {
      setActive(active + 1);
    } else {
      toast.error("Please fill the fields to proceed to the next step!");
    }
  };

  return (
    <div className="w-[90%] lg:w-[80%] m-auto mt-12 lg:mt-24">
      <div>
        <label className={`${styles.label} text-[18px] lg:text-[20px]`} htmlFor="email">
          What are the benefits for students in this course?
        </label>
        <br />
        {benefits.map((benefit: any, index: number) => (
          <input
            type="text"
            key={index}
            name="Benefit"
            placeholder="You will be able to build a full stack LMS Platform..."
            required
            className={`${styles.input} my-2 w-full`}
            value={benefit.title}
            onChange={(e) => handleBenefitChange(index, e.target.value)}
          />
        ))}
        <AiOutlinePlusCircle
          className="mt-2 mb-4 cursor-pointer w-[25px] lg:w-[30px]"
          onClick={handleAddBenefit}
        />
      </div>

      <div>
        <label className={`${styles.label} text-[18px] lg:text-[20px]`} htmlFor="email">
          What are the prerequisites for starting this course?
        </label>
        <br />
        {prerequisites.map((prerequisite: any, index: number) => (
          <input
            type="text"
            key={index}
            name="prerequisites"
            placeholder="You need basic knowledge of MERN stack"
            required
            className={`${styles.input} my-2 w-full`}
            value={prerequisite.title}
            onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
          />
        ))}
        <AiOutlinePlusCircle
          className="mt-2 mb-4 cursor-pointer w-[25px] lg:w-[30px]"
          onClick={handleAddPrerequisites}
        />
      </div>

      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
        <div
          className="w-full lg:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-white rounded cursor-pointer"
          onClick={prevButton}
        >
          Prev
        </div>
        <div
          className="w-full lg:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-white rounded cursor-pointer"
          onClick={handleOptions}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseData;
