import * as React from "react";
import { Well } from "react-bootstrap";
import Board from "react-trello";

interface AppState {
}

export default class App extends React.PureComponent<any, AppState> {
    constructor(props: any) {
        super(props);

        this.state = { };
    }

    componentDidMount() {
    }

    data = {
        lanes: [
          {
            id: "lane1",
            title: "Planned Tasks",
            label: "2/2",
            cards: [
              {id: "Card1", title: "Write Blog", description: "Can AI make memes", label: "30 mins"},
              {id: "Card2", title: "Pay Rent", description: "Transfer via NEFT", label: "5 mins", metadata: {sha: "be312a1"}}
            ]
          },
          {
            id: "lane2",
            title: "Completed",
            label: "0/0",
            cards: []
          }
        ]
    };

    render() {
        return (
        <Well>
            <Board data={this.data} />
        </Well>
        );
    }
}
