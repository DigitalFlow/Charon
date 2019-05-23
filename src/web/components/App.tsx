import * as React from "react";
import { Navbar, Nav, Button, Card, Col, Row, Form } from "react-bootstrap";
import Board from "react-trello";
import TaskForm from "./TaskForm";
import { ProjectTask } from "../domain/ProjectTask";
import UserInputModal from "./UserInputModalProps";
import { CustomCard } from "./CustomCard";

interface AppState {
  showTaskForm?: boolean;

  boardData?: ReactTrello.BoardData<ProjectTask>;
  task?: ProjectTask;
  showDeletionVerification?: boolean;
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

    submitTask = (refreshAfterwards = true) => {
      const task = { ...this.state.task };

      (task.dueDate as any) = task.dueDate ? { "case": "Some", "fields": [task.dueDate] } : { "case": "None" };
      (task.estimatedTime as any) = task.estimatedTime || task.estimatedTime === 0 ? { "case": "Some", "fields": [task.estimatedTime] } : { "case": "None" };
      (task.usedTime as any) = task.usedTime || task.usedTime === 0 ? { "case": "Some", "fields": [task.usedTime] } : { "case": "None" };
      (task.order as any) = task.order || task.order === 0 ? { "case": "Some", "fields": [task.order] } : { "case": "None" };
      (task.priority as any) = task.priority || task.priority === 0 ? { "case": "Some", "fields": [task.priority] } : { "case": "None" };

      fetch("/tasks", { method: task.id ? "PATCH" : "POST", body: JSON.stringify(task) })
      .then(result => result.json())
      .then(result => {
        this.setState({task: undefined}, () => refreshAfterwards && this.fetchData);
      });
    }

    updateTask = (task: ProjectTask, callback?: () => void) => {
      this.setState({task: task}, callback);
    }

    findCard = (cardId: string, laneId: string) => this.state.boardData.lanes.find(l => l.id === laneId).cards.find(t => t.id.toString() === cardId).metadata;

    onCardClick = (cardId: string, metadata: any, laneId: string) => {
      this.setState({
        task: this.findCard(cardId, laneId),
        showTaskForm: true
      });
    }

    updateBoard = (data: ReactTrello.BoardData<any>) => {
      this.setState({ boardData: data });
    }

    verifyDeletion = (cardId: string, laneId: string) => {
      this.setState({ showDeletionVerification: true, task: this.findCard(cardId, laneId) });
    }

    deleteTask = () => {
      fetch("/tasks", { method: "DELETE", body: JSON.stringify({ id: this.state.task.id }) })
      .then(result => result.json())
      .then(result => {
        this.setState({ task: undefined }, this.fetchData);
      });
    }

    hideDeletionVerification = () => {
      this.setState({ showDeletionVerification: false });
    }

    onDragEnd = (cardId: string, sourceLaneId: string, targetLaneId: string, position: number, card: ReactTrello.Card<ProjectTask>) => {
      const targetCard = card.metadata;

      if (sourceLaneId === targetLaneId) {
        return;
      }

      const sourceLane = this.state.boardData.lanes.find(l => l.id === sourceLaneId);
      const targetLane = this.state.boardData.lanes.find(l => l.id === targetLaneId);

      const newSourceLane = { ...sourceLane, cards: sourceLane.cards.filter(c => c.id !== cardId) };
      const newTargetLane = { ...targetLane, cards: [...targetLane.cards, card] };

      const update = { lanes: this.state.boardData.lanes.map(l => l.id === sourceLaneId ? newSourceLane : (l.id === targetLaneId ? newTargetLane : l)) };

      targetCard.phase = targetLane.id;
      targetCard.order = position;

      this.setState({
        boardData: update,
        task: targetCard
      }, () => this.submitTask(false));
    }

    render() {
        return (
          <div>
            <TaskForm task={this.state.task} showTaskForm={this.state.showTaskForm} updateTask={this.updateTask} submitTask={this.submitTask} hideTaskForm={this.hideTaskForm} />
            <UserInputModal title="Verify Task Deletion" yesCallBack={this.deleteTask} finally={this.hideDeletionVerification} show={this.state.showDeletionVerification}>
              <div>Are you sure you want to delete task '{this.state.task && this.state.task.name}' (ID: {this.state.task && this.state.task.id})?</div>
            </UserInputModal>
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
              onCardDelete={this.verifyDeletion}
              handleDragEnd={this.onDragEnd}
              updateBoard={this.updateBoard}
              draggable
              customCardLayout
            >
              <CustomCard deleteCallback={this.verifyDeletion} />
            </Board>
            <Card bg="dark">
              <Row className="justify-content-center">
                  <a href="https://icons8.com/icon/71493/drachenboot">Drachenboot icon by Icons8</a>
              </Row>
            </Card>
          </div>
        );
    }
}
