import * as React from "react";
import { Navbar, Nav, Button, Card, Col, Row, Form } from "react-bootstrap";
import Board from "react-trello";
import TaskForm from "./TaskForm";
import { ProjectTask } from "../domain/ProjectTask";

interface AppState {
  showTaskForm?: boolean;

  boardData?: ReactTrello.BoardData<ProjectTask>;
  task?: ProjectTask;
}

export default class App extends React.PureComponent<any, AppState> {
    constructor(props: any) {
        super(props);

        this.state = {
          boardData: { lanes:  [] }
        };
    }

    mapNumber = (x: any) => x && x.value ? x.value : undefined;

    mapDate = (x: any) => x && x.value ? new Date(x.value) : undefined;

    mapTask = (t: ProjectTask) => {
      return {
        ...t,
        dueDate: this.mapDate(t.dueDate),
        estimatedTime: this.mapNumber(t.estimatedTime),
        usedTime: this.mapNumber(t.usedTime),
        order: this.mapNumber(t.order),
        priority: this.mapNumber(t.priority)
      };
    }

    fetchData = () => {
      fetch("/tasks")
      .then(result => result.json())
      .then((tasks: Array<ProjectTask>) => {
        const map = (t: ProjectTask) => ({ id: t.id.toString(), title: t.name, description: t.description, label: (t.estimatedTime || 0).toString(), metadata: t });

        const lanes = tasks.reduce((all, t) => {
          const task = this.mapTask(t);

          if (task.phase) {
            const lane = all.find(l => l.id === task.phase);

            if (lane) {
              lane.cards.push(map(task));
            }
            else {
              all.push({ id: task.phase, title: task.phase, cards: [ map(task) ] });
            }
          }
          else {
            const backlog = all.find(l => l.id === "backlog");

            if (backlog) {
              backlog.cards.push(map(task));
            }
            else {
              all.push({ id: "backlog", title: "Backlog", cards: [ map(task) ] });
            }
          }

          return all;
        }, [{ id: "backlog", title: "Backlog", cards: [] }, {id: "open", title: "Open", cards: [] }, { id: "inprogress", title: "In Progress", cards: [] }, { id: "intesting", title: "In Testing", cards: [] }, { id: "done", title: "Done", cards: []}] as Array<ReactTrello.Lane<ProjectTask>>);

        this.setState({ boardData: { lanes: lanes } });
      });
    }

    componentDidMount() {
      this.fetchData();
    }

    showTaskForm = () => {
      this.setState({showTaskForm: true});
    }

    hideTaskForm = () => {
      this.setState({showTaskForm: false, task: undefined});
    }

    submitTask = () => {
      const task = { ...this.state.task };

      (task.dueDate as any) = task.dueDate ? { "case": "Some", "fields": [task.dueDate] } : { "case": "None" };
      (task.estimatedTime as any) = task.estimatedTime || task.estimatedTime === 0 ? { "case": "Some", "fields": [task.estimatedTime] } : { "case": "None" };
      (task.usedTime as any) = task.usedTime || task.usedTime === 0 ? { "case": "Some", "fields": [task.usedTime] } : { "case": "None" };
      (task.order as any) = task.order || task.order === 0 ? { "case": "Some", "fields": [task.order] } : { "case": "None" };
      (task.priority as any) = task.priority || task.priority === 0 ? { "case": "Some", "fields": [task.priority] } : { "case": "None" };

      fetch("/tasks", { method: task.id ? "PATCH" : "POST", body: JSON.stringify(task) })
      .then(result => result.json())
      .then(result => {
        this.setState({task: undefined}, this.fetchData);
      });
    }

    updateTask = (task: ProjectTask, callback?: () => void) => {
      this.setState({task: task}, callback);
    }

    onCardClick = (cardId: string, metadata: any, laneId: string) => {
      const lane = this.state.boardData.lanes.find(l => l.id === laneId);

      this.setState({
        task: lane.cards.find(t => t.id.toString() === cardId).metadata,
        showTaskForm: true
      });
    }

    updateBoard = (data: ReactTrello.BoardData<any>) => {
      this.setState({ boardData: data });
    }

    render() {
        return (
          <div>
            <TaskForm task={this.state.task} showTaskForm={this.state.showTaskForm} updateTask={this.updateTask} submitTask={this.submitTask} hideTaskForm={this.hideTaskForm} />
            <Navbar bg="dark" variant="dark">
              <Navbar.Brand href="/">
                <img alt ="" src="/content/icons8-drachenboot-48.png" width="48" height="48" className="d-inline-block align-top" />
                <div style={{display: "inline-block", lineHeight: "100%", fontSize: "48px", fontWeight: 500, marginLeft: "5px"}}>Charon</div>
              </Navbar.Brand>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto"></Nav>
                <Button onClick={this.showTaskForm}>Create New Task</Button>
              </Navbar.Collapse>
            </Navbar>
            <Board
              data={this.state.boardData}
              cardDragClass="draggingCard"
              laneDragClass="draggingLane"
              onCardClick={this.onCardClick}
              updateBoard={this.updateBoard}
              draggable
            />
            <Card bg="dark">
              <Row className="justify-content-center">
                  <a href="https://icons8.com/icon/71493/drachenboot">Drachenboot icon by Icons8</a>
              </Row>
            </Card>
          </div>
        );
    }
}
