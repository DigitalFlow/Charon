import * as React from "react";
import { Navbar, Nav, Button, Card, Col, Row } from "react-bootstrap";
import Board from "react-trello";
import UserInputModal from "./UserInputModalProps";

interface ProjectTask {
  id: number;
  name: string;
  description: string;
  dueDate: Date;
  order: number;
  priority: number;
  phase: number;
  externalUrl?: any;
  estimatedTime: number;
  usedTime: number;
}

interface AppState {
  tasks: Array<ProjectTask>;
  showTaskForm?: boolean;
}

export default class App extends React.PureComponent<any, AppState> {
    constructor(props: any) {
        super(props);

        this.state = {
          tasks: []
        };
    }

    componentDidMount() {
      fetch("/tasks")
      .then(result => result.json())
      .then(tasks => {
        this.setState({tasks: tasks});
      });
    }

    convertData = () => ({
        lanes: [
          {
            id: "lane1",
            title: "Planned Tasks",
            label: "2/2",
            cards: this.state.tasks.map(t => ({ id: t.id.toString(), title: t.name, description: t.description, label: (t.estimatedTime || 0).toString() }))
          },
          {
            id: "lane2",
            title: "Completed",
            label: "0/0",
            cards: [
              {id: "Card2", title: "Pay Rent", description: "Transfer via NEFT", label: "5 mins", metadata: {sha: "be312a1"}}
            ]
          }
        ]
    });

    showTaskForm = () => {
      this.setState({showTaskForm: true});
    }

    hideTaskForm = () => {
      this.setState({showTaskForm: false});
    }

    render() {
        return (
          <div>
            <UserInputModal show={this.state.showTaskForm} title="Create a task" text="Please enter your information" yesCallBack={() => {}} noCallBack={() => {}} finally={this.hideTaskForm} />
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
              data={this.convertData()}
              cardDragClass="draggingCard"
              laneDragClass="draggingLane"
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
