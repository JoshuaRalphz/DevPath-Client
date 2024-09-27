import React, { FC } from "react";
import CoursePlayer from "../../../utils/CoursePlayer";
import { styles } from "../../../../app/styles/style";
import Ratings from "../../../../app/utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isEdit?: boolean;
};

const CoursePreview: FC<Props> = ({
  courseData,
  handleCourseCreate,
  setActive,
  active,
  isEdit
}) => {
  const discountPercentage =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100;

  const discountPercentagePrice = discountPercentage.toFixed(0);

  const prevButton = () => {
    setActive(active - 1);
  };

  const createCourse = () => {
    handleCourseCreate();
  };

  return (
    <div className="w-[95%] lg:w-[90%] xl:w-[80%] m-auto py-5 mb-5">
      <div className="w-full relative">
        {/* Video Player */}
        <div className="w-full mt-10">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>

        {/* Pricing and Discount */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mt-5">
          <h1 className="text-[20px] sm:text-[25px] font-bold">
            {courseData?.price === 0 ? "Free" : "₱" + courseData?.price }
          </h1>
          <h5 className="pl-0 sm:pl-3 text-[18px] sm:text-[20px] line-through opacity-80 mt-2 sm:mt-0">
            ₱{courseData?.estimatedPrice}
          </h5>
          <h4 className="pl-0 sm:pl-5 text-[18px] sm:text-[22px] mt-2 sm:mt-0">
            {discountPercentagePrice}% Off
          </h4>
        </div>

        {/* Buy Now Button */}
        <div className="flex items-center mt-4">
          <div
            className={`${styles.button} !w-full sm:!w-[180px] my-3 font-Poppins !bg-[crimson] cursor-not-allowed`}
          >
            Buy Now ₱{courseData?.price}
          </div>
        </div>

        {/* What you will learn */}
        <div className="w-full mt-10">
          <h1 className="text-[22px] sm:text-[25px] font-Poppins font-semibold">
            What you will learn from this course?
          </h1>
          {courseData?.benefits?.map((item: any, index: number) => (
            <div className="flex items-start sm:items-center py-2" key={index}>
              <IoCheckmarkDoneOutline size={20} className="mr-2" />
              <p className="text-[16px] sm:text-[18px]">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Prerequisites */}
        <div className="w-full mt-10">
          <h1 className="text-[22px] sm:text-[25px] font-Poppins font-semibold">
            What are the prerequisites for starting this course?
          </h1>
          {courseData?.prerequisites?.map((item: any, index: number) => (
            <div className="flex items-start sm:items-center py-2" key={index}>
              <IoCheckmarkDoneOutline size={20} className="mr-2" />
              <p className="text-[16px] sm:text-[18px]">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Course Description */}
        <div className="w-full mt-10">
          <h1 className="text-[22px] sm:text-[25px] font-Poppins font-semibold">
            Course Details
          </h1>
          <p className="text-[16px] sm:text-[18px] mt-[20px] whitespace-pre-line w-full">
            {courseData?.description}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-8">
        <div
          className="w-full sm:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-white rounded cursor-pointer mb-4 sm:mb-0"
          onClick={() => prevButton()}
        >
          Prev
        </div>
        <div
          className="w-full sm:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-white rounded cursor-pointer"
          onClick={() => createCourse()}
        >
          {isEdit ? 'Update' : 'Create'}
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
