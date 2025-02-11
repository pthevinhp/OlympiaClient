import React, { Component } from "react";
import logo from "../../logo.svg";
import io from "socket.io-client";
import "../../App.css";
import $ from "jquery";
import port from "../../port.json";
import "./CHP.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
import {
  Card,
  Button,
  ListGroup,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";
const socket = io.connect(port.port); //change when change wifi
let check = true;
let time1, time2;
let stop = false;
let oneTime = 0;
class ContentCHP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gmail: "",
      password: "",
      data: [],
      question: "",
      score: 0,
      current: 0,
      winnerName: "",
    };
  }
  componentDidMount() {
    $(".WinnerCHP").hide();
    $(".ChoosePointVD").hide();
    this.setState({
      data: this.props.data,
      current: this.props.current[0] ? this.props.current[0].current : 0,
    });
    socket.on("send VD", (ques) => {
      if (ques) {
        stops();
        console.log(ques.id);
        $(".names").removeClass("onAlertVD");
        $(".names").eq(ques.id).addClass("onAlertVD");
        oneTime = 0;
      }
    });
    // this.setState({
    //   score: this.state.data[this.state.current]
    //     ? this.state.data[this.state.current].score
    //     : "gasg",
    // });
    socket.on("choose Star", (crr) => {
      if (crr) console.log(crr);
    });
    socket.on("open choose quesVD", (crr) => {
      if (crr) {
        let nameId = "#" + crr;
        $(".ChoosePointVD").show(1000);
        console.log(nameId);
        $(nameId).html("✔");
      }
    });
    socket.on("close choose quesVD", (crr) => {
      $(".ChoosePointVD").hide(1000);
    });
    socket.on("next pp vd", (crr) => {
      if (crr) {
        $(".TickVD").html("");
        $(".names").removeClass("activeNameVD");
        $(".names").eq(crr).addClass("activeNameVD");
      }
    });
    // socket.on("next pp vd", (crr) => {
    //   if (crr) console.log(crr);
    // });
    socket.on("start time", (crr) => {
      if (crr && oneTime == 0) {
        $(".names").removeClass("onAlertVD");
        oneTime = 1;
        start();
        console.log(crr);
        progress(crr, 15, $("#progressBar"));
      }
    });
    socket.on("true chp", (crr) => {
      if (crr) {
        $(".WinnerCHP").show(1000);
        console.log(crr);
        this.setState({
          winnerName: crr,
        });
      }
    });
    socket.on("Add score", (crr) => {
      if (crr != []) {
        this.setState({ data: crr.data });
      }
    });
    socket.on("choose ques", (ques) => {
      console.log(ques);
      this.setState({
        question: ques,
      });
      check = true;
    });
    socket.on("time VD", (time) => {
      if (check == true) {
        console.log(time);
        $("#progressBar").css("background-color", "#cfd6d9");
        $(".bar").css("background-color", "#428bca");
        progress(time, time, $("#progressBar"));
        check = false;
      }
    });

    socket.on("add point ok", (data) => {
      this.setState({
        score: data.point,
        current: data.stt,
      });
      if (data.data != null) this.setState({ data: data.data });
    });
  }
  //qweg
  render() {
    return (
      <div className="App row">
        <div className="App-header">
          {/* <table id="NameList">
            <tbody>
              <tr>
                {this.state.data.map((user, id) => {
                  if (id == 1 || id == 2) {
                    return (
                      <td className="names pointer" key={id}>
                        {user.name} ({user.score})
                      </td>
                    );
                  } else {
                    return <td className="names pointer" key={id}></td>;
                  }
                })}
              </tr>
            </tbody>
          </table>

          <div className="questions col-11">
            <div>
              <p className="question quess questionCHP">
                {this.state.question}
              </p>
            </div>
          </div>

          <p className="VDText abso" onClick={this.NextQuesVD}>
            {this.state.data[this.state.currentUser]
              ? this.state.data[this.state.currentUser].name +
                (this.state.question ? " " + this.state.question.point : "")
              : ""}
          </p>

          <div id="progressBar" className="progressBarVD ">
            <div className="bar barVD"></div>
          </div>

          <div className="WinnerCHP">
            <div className="BlackCHP">
              <p className="WinnerName">WINNER:{this.state.winnerName}</p>
            </div>
          </div> */}
          <Card
            className="text-center"
            style={{ width: "90%", borderRadius: "20px" }}
          >
            <ListGroup.Item>
              <h5>Câu hỏi phụ</h5>
              Trong vòng 1 phút, mỗi thí sinh khởi động bằng cách trả lời nhanh
              các câu hỏi. Số lượng câu hỏi không hạn chế. Mỗi câu trả lời đúng
              được 10 điểm, trả lời sai hoặc bỏ qua liên tiếp 5 câu sẽ bị dừng
              phần thi này dù còn thời gian.
              <Table style={{ marginTop: "10px" }} striped bordered hover>
                <tbody>
                  <tr>
                    {this.state.data.map((user, id) => {
                      if (id == 1 || id == 2)
                        return (
                          <td key={id} className="names pointer">
                            {user.name} ({user.score})
                          </td>
                        );
                        else {
                          return <td className="names pointer" key={id}></td>;
                        }
                    })}
                     
                  </tr>
                </tbody>
              </Table>
            </ListGroup.Item>
            <ListGroup.Item>
              <Container>
                <Row>
                  <Col xs={12}>
                    <h3>{this.state.question}</h3>
                  </Col>
                </Row>
              </Container>
            </ListGroup.Item>
            <ListGroup.Item>
              <div style={{ borderRadius: "50px" }} id="progressBar">
                <div className="bar" style={{ borderRadius: "50px" }}></div>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <Card.Link href="#">THPT Chuyên Đại Học Vinh</Card.Link>
              <Card.Link href="#">KC Olympia Squad</Card.Link>
            </ListGroup.Item>
          </Card>
          <div className="WinnerCHP">
            <div className="BlackCHP">
              <p className="WinnerName">WINNER:{this.state.winnerName}</p>
            </div>
          </div> 
        </div>
      </div>
    );
  }
}

export default ContentCHP;
function progress(timeleft, timetotal, $element) {
  if (stop == false) {
    time1 = timeleft;
    time2 = timetotal;
    var progressBarWidth = (timeleft * $element.width()) / timetotal;
    $element
      .find("div")
      .animate({ width: progressBarWidth }, 500)
      .html(timeleft % 60);
    if (timeleft > 0) {
      setTimeout(function () {
        progress(timeleft - 1, timetotal, $element);
        //$(".bar").css("background-color", "red");
      }, 1000);
    } else {
      $("#progressBar").css("background-color", "red");
      $(".bar").css("background-color", "red");
      check = true;
    }
  }
}
function stops() {
  stop = true;
}
function start() {
  stop = false;
}
