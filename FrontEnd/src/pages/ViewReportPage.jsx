import React from "react";
import { Helmet } from "react-helmet";
import { Heading, Button, Img, SelectBox } from "../components";
import Sidebar1 from "../components/SideBar";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function ReportGeneratedPage() {
  return (
    <>
      <Helmet>
        <title>BitBusters</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="flex md:flex-col justify-between items-start w-full pr-8 gap-5 sm:pr-5 bg-white-A700">
        <Sidebar1 className="flex flex-col w-[78px] h-screen gap-6 top-0 py-3 bg-indigo-700 !sticky overflow-auto" />
        <div className="flex justify-center w-[80%] md:w-full">
          <div className="flex flex-col w-full gap-7">
            <div className="flex md:flex-col justify-end items-start ml-[738px] gap-[23px] md:ml-0">
              <SelectBox
                size="xs"
                variant="fill"
                shape="round"
                indicator={<Img src="images/img_arrowdown.svg" alt="arrow_down" />}
                name="select"
                placeholder={`Personal Info/Log Out`}
                options={dropDownOptions}
                className="mt-5 mb-5 gap-px sm:pr-5 font-montserrat flex-1"
              />
              <Img src="images/img_vector.svg" alt="vector_one" className="h-[54px] md:w-full md:h-auto mt-6" />
            </div>
            <div className="flex sm:flex-col justify-between w-[61%] md:w-full mt-[633px] gap-5 md:p-5">
              <Button
                color="indigo_700"
                size="lg"
                className="sm:px-5 font-dmsans font-bold min-w-[132px] rounded-[24px]"
              >
                Edit report
              </Button>
              <Button color="gray_900" size="lg" className="sm:px-5 font-dmsans font-bold min-w-[166px] rounded-[24px]">
                Sign Document
              </Button>
              <Button
                color="indigo_700"
                size="lg"
                className="sm:px-5 font-dmsans font-bold min-w-[150px] rounded-[24px]"
              >
                Export to pdf
              </Button>
            </div>
            <Heading
              size="md"
              as="h1"
              className="mt-[19px] ml-[241px] md:ml-0 !text-white-A700 !font-dmsans text-center"
            >
              Signature here{" "}
            </Heading>
          </div>
        </div>
      </div>
    </>
  );
}
