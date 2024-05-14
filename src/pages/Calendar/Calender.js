import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";
import axios from "axios";
import CalenderEdit from "./CalenderEdit";
import CalenderAdd from "./CalenderAdd";

function Calendar() {
  const [data, setData] = useState([]);
  console.log("data:", data);
  const [events, setEvents] = useState([]);
  const companyId = sessionStorage.getItem("companyId");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newEvent, setNewEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedId, setSelectedId] = useState();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}getAllAppointmentsByCompanyId/${companyId}`
      );
      setData(response.data);
    } catch (error) {
      toast.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Transform data into FullCalendar event format
    const formattedEvents = data.map((item) => ({
      id: item.id,
      title: `${item.appointmentName} - ${item.appointmentFor}`, // Concatenate appointmentName and title
      start: `${item.appointmentStartDate}`,
      end: `${item.appointmentStartDate}`,
      allDay: false, // Assuming appointments are not all-day events
    }));
    setEvents(formattedEvents);
  }, [data]);

  const handleEventAdd = (eventAddInfo) => {
    const { event } = eventAddInfo;
    const newEventWithId = { ...event, id: uuidv4() };
    setEvents([...events, newEventWithId]);
    console.log(
      `Added event: ID - ${newEventWithId.id}, Title - ${newEventWithId.title}, Start - ${newEventWithId.start}, End - ${newEventWithId.end}`
    );
  };

  const handleEventUpdate = (eventUpdateInfo) => {
    const { event } = eventUpdateInfo;
    const updatedEvent = { ...event, id: event.id };
    console.log(
      `Updated event: ID - ${updatedEvent.id}, Title - ${updatedEvent.title}, Start - ${updatedEvent.start}, End - ${updatedEvent.end}`
    );
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const handleEventDelete = (eventDeleteInfo) => {
    const { event } = eventDeleteInfo;
    const filteredEvents = events.filter((e) => e.id !== event.id);
    setEvents(filteredEvents);
    console.log(
      `Deleted event: ID - ${event.id}, Title - ${event.title}, Start - ${event.start}, End - ${event.end}`
    );
  };

  // const handleEventClick = (eventClickInfo) => {
  //   setSelectedEvent(eventClickInfo.event);
  //   setShowViewModal(true);
  // };

  const handleEventClick = (eventClickInfo) => {
    setSelectedEvent(eventClickInfo.event);
    const { event } = eventClickInfo;
    const filteredEvents = events.filter((e) => e.id !== event.id);
    setSelectedId(event.id);

    setEvents(filteredEvents);
    console.log(
      `View event: ID - ${event.id}, Title - ${event.title}, Start - ${event.start}, End - ${event.end}`
    );
    setShowViewModal(true);
  };

  console.log("selectid", selectedId);
  const handleModalSave = () => {
    if (newEvent && newEvent.title) {
      const eventToAdd = {
        ...newEvent,
        id: uuidv4(),
        start: newEvent.start.toISOString(), // Convert to ISO string
        end: newEvent.end.toISOString(), // Convert to ISO string
      };
      setEvents([...events, eventToAdd]);
      setShowModal(false);
      setNewEvent(null);
      console.log(
        `Added event: ID - ${eventToAdd.id}, Title - ${eventToAdd.title}, Start - ${eventToAdd.start}, End - ${eventToAdd.end}`
      );
    }
  };

  const handleEditModalSave = () => {
    if (selectedEvent && selectedEvent.title) {
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, title: selectedEvent.title }
          : event
      );
      setEvents(updatedEvents);
      setShowEditModal(false);
      setSelectedEvent(null);
      console.log(
        `Updated event: ID - ${selectedEvent.id}, Title - ${selectedEvent.title}, Start - ${selectedEvent.start}, End - ${selectedEvent.end}`
      );
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      const filteredEvents = events.filter(
        (event) => event.id !== selectedEvent.id
      );
      setEvents(filteredEvents);
      setSelectedEvent(null);
      setShowDeleteModal(false);
      console.log(
        `Deleted event: ID - ${selectedEvent.id}, Title - ${selectedEvent.title}, Start - ${selectedEvent.start}, End - ${selectedEvent.end}`
      );
    }
  };

  const handleEditClick = () => {
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    setShowViewModal(false);
    setShowDeleteModal(true);
  };

  const handleEventDrop = (eventDropInfo) => {
    const { event } = eventDropInfo;
    console.log(
      `Event dropped: ID - ${event.id}, Title - ${event.title}, Start - ${event.start}, End - ${event.end}`
    );
  };

  const handleEventResize = (eventResizeInfo) => {
    const { event } = eventResizeInfo;
    console.log(
      `Event resized: ID - ${event.id}, Title - ${event.title}, Start - ${event.start}, End - ${event.end}`
    );
  };

  return (
    <div className="calender">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today,prev,next",
          center: "title",
          end: "customMonth,customWeek,customWorkWeek,customDay,customAgenda",
        }}
        height={"90vh"}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        views={{
          customWorkWeek: {
            type: "timeGridWeek",
            duration: { weeks: 1 },
            buttonText: "Work Week",
            hiddenDays: [0, 6],
          },
          customAgenda: {
            type: "listWeek",
            buttonText: "Agenda",
          },
          customDay: {
            type: "timeGridDay",
            buttonText: "Day",
          },
          customWeek: {
            type: "timeGridWeek",
            buttonText: "Week",
          },
          customMonth: {
            type: "dayGridMonth",
            buttonText: "Month",
          },
        }}
        select={(info) => {
          console.log("Whole Info", info);
          setNewEvent({
            title: "",
            start: info.start, // Use startStr instead of start
            end: info.end, // Use endStr instead of end
            allDay: info.allDay,
          });
          setShowModal(true);
        }}
        eventAdd={handleEventAdd}
        eventClick={handleEventClick}
        eventChange={handleEventUpdate}
        eventRemove={handleEventDelete}
        eventDrop={handleEventDrop} // Handle event drop
        eventResize={handleEventResize} // Attach event resize callback
      />

      {/* Add Event Modal */}
      <CalenderAdd
        showModal={showModal}
        getData={fetchData}
        setShowModal={setShowModal}
        name={"Create Appointment"}
        eventData={newEvent}
      />
      {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Add Title"
            value={newEvent ? newEvent.title : ""}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
          <button
            type="submit"
            className="btn btn-sm btn-primary"
            onClick={handleModalSave}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal> */}

      {/* View Event Modal */}
      <Modal
        show={showViewModal}
        size="lg"
        onHide={() => setShowViewModal(false)}
        centered
        scrollable
      >
        <Modal.Header className="custom-modal-header">
          <div>
            <b>
              <h5 className="modal-title">View Event Details</h5>
            </b>
          </div>
          <button className="btn close" onClick={() => setShowViewModal(false)}>
            <span className="text-light">X</span>
          </button>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="row">
            <div className="col-6">
              <p className="fw-medium">Event Title</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">
                : {selectedEvent ? selectedEvent.title : ""}
              </p>
            </div>
            <div className="col-6">
              <p className="fw-medium">Event Title</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">
                : {selectedEvent ? selectedEvent.title : ""}
              </p>
            </div>
            <div className="col-6">
              <p className="fw-medium">Event Title</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">
                : {selectedEvent ? selectedEvent.title : ""}
              </p>
            </div>
            <div className="col-6">
              <p className="fw-medium">Event Title</p>
            </div>
            <div className="col-6">
              <p className="text-muted text-sm">
                : {selectedEvent ? selectedEvent.title : ""}
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Event Modal */}

      {/* <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Event Title"
            value={selectedEvent ? selectedEvent.title : ""}
            onChange={(e) =>
              setSelectedEvent({ ...selectedEvent, title: e.target.value })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleEditModalSave}
          >
            Update
          </button>
        </Modal.Footer>
      </Modal> */}

      {/* Delete Event Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={handleDeleteEvent}
          >
            Yes
          </button>
          <button type="button" className="btn btn-sm btn-light">
            No
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Calendar;
