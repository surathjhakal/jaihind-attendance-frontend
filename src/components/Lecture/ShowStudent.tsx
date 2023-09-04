import React from "react";
import { Button } from "react-bootstrap";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

type Props = {};

const ShowStudent = ({
  title,
  data,
  disableButtons,
  onSelect,
  onCancel,
  color,
  isDisabled,
}: any) => {
  const getColor = () => {
    if (color === "green") return "addGreen";
    else if (color === "red") return "addRed";
    else return "addOrange";
  };
  return (
    <div className="showStudent">
      <h3 className={getColor()}>{title}</h3>
      <div className="showStudentList">
        {data?.map((student: any) => (
          <div className="showStudentBox">
            <h3 className="showStudentName">{student.name}</h3>
            {!isDisabled && (
              <div className="showStudentActionButtons">
                {!disableButtons?.select && (
                  <Button
                    variant="success"
                    className="showStudentActionButton"
                    onClick={() => onSelect(student)}
                  >
                    <TiTick />
                  </Button>
                )}
                <Button
                  variant="danger"
                  className="showStudentActionButton"
                  onClick={() => onCancel(student)}
                >
                  <RxCross2 />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowStudent;
