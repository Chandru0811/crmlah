import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import { FaUserTie } from "react-icons/fa";
import "../../styles/custom.css";
import { MdOutlineClose } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";
import axios from "axios";
import ActivityAdd from "./ActivityAdd";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function Activity({ id }) {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [data, setData] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAccountActivityWithClientDataByAccountId/${id}`
      );
      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
        toast.error("Unexpected response format: data is not an array");
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "NEW":
        return { backgroundColor: "blue", text: "N", fullText: "New" };
      case "CONTACTED":
        return { backgroundColor: "orange", text: "C", fullText: "Contacted" };
      case "QUALIFIED":
        return { backgroundColor: "purple", text: "Q", fullText: "Qualified" };
      case "PROPOSAL_SENT":
        return { backgroundColor: "teal", text: "PS", fullText: "Proposal Sent" };
      case "NEGOTIATION":
        return { backgroundColor: "rgb(32 199 128)", text: "N", fullText: "Negotiation" };
      case "WON":
        return { backgroundColor: "green", text: "W", fullText: "Won" };
      case "LOST":
        return { backgroundColor: "red", text: "L", fullText: "Lost" };
      case "ON_HOLD":
        return { backgroundColor: "#ff681f", text: "OH", fullText: "On Hold" };
      case "CANCELLED":
        return { backgroundColor: "red", text: "C", fullText: "Cancelled" };
      case "DELIVERY":
        return { backgroundColor: "green", text: "D", fullText: "Delivery" };
      case "FOLLOW_UP":
        return { backgroundColor: "teal", text: "FU", fullText: "Follow Up" };
      default:
        return { backgroundColor: "lightgray", text: "NS", fullText: "No Status" };
    }
  };

  const CustomTooltip = ({ children, tooltipText }) => {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="button-tooltip" className="custom-tooltip">
            {tooltipText}
          </Tooltip>
        }
      >
        {children}
      </OverlayTrigger>
    );
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Activity
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton className="Calenderview">
          <Modal.Title>Recent Activity</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <ActivityAdd id={id} onClick={handleClose} fetchData={fetchData} />
        </Modal.Footer>
        <Modal.Body className={viewAll ? "scrollable-modal-body" : ""}>
          <Accordion
            activeKey={expanded}
            onSelect={(e) => setExpanded(e)}
            className="custom-accordion"
          >
            {data.length > 0 ? (
              data
                .slice(0, viewAll ? data.length : 3)
                .map((activity, index) => {
                  const statusStyle = getStatusStyle(activity.status);
                  return (
                    <Accordion.Item eventKey={index.toString()} key={activity.id}>
                      <Accordion.Header>
                         <CustomTooltip tooltipText={statusStyle.fullText}>
                          <div
                            className="iconDesign"
                            style={{ backgroundColor: statusStyle.backgroundColor }}
                          >
                            {statusStyle.text}
                          </div>
                        </CustomTooltip>
                        <div className="flex-group-1">
                          <b>{activity.activityOwner || ""}</b>
                          <br />
                          <span className="text-muted small">
                            {expanded !== index.toString() &&
                              truncateText(activity.note, 10)}
                          </span>
                        </div>
                        <div className="text-end ms-auto">
                          <span className="text-muted small text-end">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        {activity.note}
                        {activity.clientData &&
                          activity.clientData.map((client, clientIndex) => (
                            <div className="mt-3" key={client.id}>
                              <span>
                                <b>Name:</b> {client.clientName}
                              </span>
                              <br />
                              <span>
                                <b>Email:</b> {client.clientEmail}
                              </span>
                              <br />
                              <span>
                                <b>Phone no:</b> {client.clientCountryCode}{" "}
                                {client.clientPhone}
                              </span>
                            </div>
                          ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })
            ) : (
              <p>No activities available.</p>
            )}
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="viewBtn"
            variant="primary"
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? "Show Less" : "View All"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Activity;
