import * as React from "react";
import { ProjectTask } from "../domain/ProjectTask";
import { Button } from "react-bootstrap";

export const CustomCard = (props: any) => {
    const task = props.metadata as ProjectTask;

    const clickHandler = (e: any) => {
      e.stopPropagation();
      props.deleteCallback(props.id, props.laneId);
    };

    const linkHandler = (e: any) => {
      e.stopPropagation();

      window.open(task.externalUrl, "_blank");
    };

    return (
      <div style={{padding: "5px", overflow: "auto"}}>
        <header
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: 6,
            marginBottom: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
          <div style={{fontSize: 14, fontWeight: "bold"}}>{task.name}</div>
          <div style={{fontSize: 11}}>{task.dueDate && task.dueDate.toDateString()}</div>
        </header>
        <div style={{fontSize: 12}}>
          { task.description && <div style={{padding: "5px 0px"}}>
            <i>{task.description.split("\n").map((line, index) => <span key={index}>{line}<br/></span>)}</i>
          </div> }
          {task.externalUrl && <Button style={{marginTop: 10, paddingLeft: 0}} variant="link" onClick={linkHandler}>Open in External System</Button>}
        </div>
        <Button className="float-right" onClick={clickHandler} variant={"secondary"}>Delete</Button>
      </div>
    );
  };