import * as React from "react";
import { Form } from "react-bootstrap";
import UserInputModal from "./UserInputModalProps";
import { ProjectTask } from "../domain/ProjectTask";

interface TaskFormProps {
  showTaskForm: boolean;
  task: ProjectTask;
  updateTask: (task: ProjectTask, callback?: () => void) => void;
  submitTask: () => void;
  hideTaskForm: () => void;
}

export default class TaskForm extends React.PureComponent<TaskFormProps, undefined> {
  constructor(props: TaskFormProps) {
    super(props);
  }

  setTaskName = (e: any) => {
    const value = e.target.value as string;

    this.props.updateTask({
      ...( this.props.task || {} as ProjectTask ), name: value
    });
  }

  setDescription = (e: any) => {
    const value = e.target.value as string;

    this.props.updateTask({
      ...( this.props.task || {} as ProjectTask ), description: value
    });
  }

  setExternalUrl = (e: any) => {
    const value = e.target.value as string;

    this.props.updateTask({
      ...( this.props.task || {} as ProjectTask ), externalUrl: value
    });
  }

  setEstimatedTime = (e: any) => {
    const value = e.target.valueAsNumber as number;

    this.props.updateTask({
      ...( this.props.task || {} as ProjectTask ), estimatedTime: value
    });
  }

  setDueDate = (e: any) => {
    const value = e.target.valueAsDate as Date;

    this.props.updateTask({
      ...( this.props.task || {} as ProjectTask ), dueDate: value
    });
  }

  render() {
    return (
        <UserInputModal show={this.props.showTaskForm} title={this.props.task && this.props.task.id ? "Update Task" : "Create Task"} yesCallBack={this.props.submitTask} finally={this.props.hideTaskForm}>
            <Form>
                <Form.Group controlId="Task Creation">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter text" value={this.props.task && this.props.task.name} onChange={this.setTaskName} />

                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="5" placeholder="Enter text" value={this.props.task && this.props.task.description} onChange={this.setDescription} />

                    <Form.Label>DueDate</Form.Label>
                    <Form.Control type="date" placeholder="Enter date" value={this.props.task && this.props.task.dueDate ? this.props.task.dueDate.toISOString().split("T")[0] : undefined} onChange={this.setDueDate} />

                    <Form.Label>Priority</Form.Label>
                    <Form.Control as="select">
                        <option>Low</option>
                        <option>Mid</option>
                        <option>High</option>
                        <option>Critical</option>
                    </Form.Control>

                    <Form.Label>ExternalUrl</Form.Label>
                    <Form.Control type="text" placeholder="Enter url" value={this.props.task && this.props.task.externalUrl} onChange={this.setExternalUrl} />

                    <Form.Label>EstimatedTime</Form.Label>
                    <Form.Control type="number" step="0.25" placeholder="Enter number" value={this.props.task && this.props.task.estimatedTime as any} onChange={this.setEstimatedTime} />
                </Form.Group>
            </Form>
        </UserInputModal>
    );
  }
}