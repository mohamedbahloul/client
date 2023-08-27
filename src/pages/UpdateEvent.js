import React, { useState, useEffect } from "react";
import axios, { Axios } from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import EditEventPopup from "../components/EditEventPopup";
import CreateEventPopup from "../components/CreateEventPopup";
import {
  ChooseButtonsContainer,
  ChooseButton,
  Container,
  Button,
  Table,
  Th,
  Td,
  ButtonDelete,
  ButtonEdit,
  TdActions,
  StatusButton,
} from "../styles/UpdateEvent";

const UpdateEvent = () => {
  const [events, setEvents] = useState([]);
  const [brainEvents, setBrainEvents] = useState([]);
  const [customEvents, setCustomEvents] = useState([]);
  const [selectedButton, setSelectedButton] = useState("brain"); // Par défaut, "brain" est sélectionné

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res1 = await axios.get(`http://localhost:3001/event/all`);
        setBrainEvents(res1.data);

        const res2 = await axios.get(`http://localhost:3001/event/custom`);
        setCustomEvents(res2.data);

        if (selectedButton === "brain") {
          setEvents(res1.data);
        } else {
          setEvents(res2.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEventData();
  }, [selectedButton]);

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const handleCreateEvent = async () => {
    setShowCreatePopup(true);
  };

  const handleDeleteEvent = async (eventId) => {
    axios
      .delete(`http://localhost:3001/event/custom/${eventId}`)
      .then((res) => {
        console.log(res.data);
        fetchEvents();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const handleEditEvent = (event) => {
    setShowEditPopup(true);
    setEventToEdit(event);
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
    setEventToEdit(null);
  };
  const handleCloseCreatePopup = () => {
    setShowCreatePopup(false);
  };
  const handleSaveEventChanges = async (updatedEvent) => {
    if (selectedButton === "brain") {
      axios
        .put(`http://localhost:3001/event/${updatedEvent.id}`, updatedEvent)
        .then(async (res) => {
          console.log(res.data);
          try {
            const formData = new FormData();
            formData.append("imageName", `${updatedEvent.id}.jpg`); // Add the image_name to the FormData
            formData.append("image", updatedEvent.selectedImage);
            const response = await axios.post(
              "http://localhost:3001/uploadImage",
              formData
            );
            console.log(response);
            if (response.status === 200) {
              // Image uploaded successfully
              const imageUrl = response.data.imageUrl;
              //setImageUrl(imageUrl);
            } else {
              // Handle error if necessary
            }
          } catch (error) {
            // Handle error if necessary
          }
          fetchEvents();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .put(
          `http://localhost:3001/event/custom/${updatedEvent.id}`,
          updatedEvent
        )
        .then(async (res) => {
          console.log(res.data);
          try {
            const formData = new FormData();
            formData.append("imageName", `${updatedEvent.id}.jpg`); // Add the image_name to the FormData
            formData.append("image", updatedEvent.selectedImage);
            const response = await axios.post(
              "http://localhost:3001/uploadImage",
              formData
            );
            console.log(response);
            if (response.status === 200) {
              // Image uploaded successfully
              const imageUrl = response.data.imageUrl;
              //setImageUrl(imageUrl);
            } else {
              // Handle error if necessary
            }
          } catch (error) {
            // Handle error if necessary
          }
          fetchEvents();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setShowEditPopup(false);
  };

  const handleTogglePrivacy = async (eventId) => {
    try {
      const eventToUpdate = events.find(event => event.id === eventId);
      const updatedEvent = {
        ...eventToUpdate,
        isPrivate: eventToUpdate.isPrivate === 't' ? 'f' : 't'
      };
      
      const res = await axios.put(
        `http://localhost:3001/event/changePrivacy/${eventId}`,
        updatedEvent
      );

      if (res.status === 200) {
        fetchEvents(); // Refresh the event list
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCreateCustomEvent = async (createdEvent) => {
    axios
      .post(`http://localhost:3001/event/custom`, createdEvent)
      .then(async (res) => {
        let id = null;
        axios
          .get(`http://localhost:3001/event/lastCustom`)

          .then(async (res) => {
            id = res.data;
            console.log(id);
            if (id != null) id = id + 1;
            else id = 1;
            if (createdEvent.selectedImage != null) {
              const formData = new FormData();
              formData.append("imageName", `${id}.jpg`); // Add the image_name to the FormData
              formData.append("image", createdEvent.selectedImage);
              const response = await axios.post(
                "http://localhost:3001/uploadImage",
                formData
              );
              if (response.status === 200) {
                // Image uploaded successfully
                const imageUrl = response.data.imageUrl;
                //setImageUrl(imageUrl);
              } else {
                // Handle error if necessary
              }
            }
          });

        //console.log(res.data);
        fetchEvents();
      })
      .catch((err) => {
        console.log(err);
      });
    setShowCreatePopup(false);
  };
  const fetchEvents = async () => {
    const res = await axios.get(`http://localhost:3001/event/all`);
    setBrainEvents(res.data);
    const res2 = await axios.get(`http://localhost:3001/event/custom`);
    setCustomEvents(res2.data);
    if (selectedButton === "brain") setEvents(res.data);
    else setEvents(res2.data);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Ajoute un zéro devant le jour et le mois si nécessaire
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  return (
    <>
      <ChooseButtonsContainer>
        <ChooseButton
          onClick={() => {
            setSelectedButton("brain");
            setEvents(brainEvents);
          }}
          active={selectedButton === "brain"}
        >
          Brain Events
        </ChooseButton>
        <ChooseButton
          onClick={() => {
            setSelectedButton("custom");
            setEvents(customEvents);
          }}
          active={selectedButton === "custom"}
        >
          Custom Events
        </ChooseButton>
      </ChooseButtonsContainer>
      <Container>
        <Button onClick={handleCreateEvent}>Créer un nouvel événement</Button>
        {events.length === 0 ? (
    <p>Aucun événement disponible.</p>
  ) : (
        <Table>
          <thead>
            <tr>
              <Th>Titre</Th>
              <Th>Date</Th>
              <Th>Lieu</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <Td>{event.nom}</Td>
                <Td>{formatDate(event.startDateTime)}</Td>
                <Td>{event.location}</Td>
                {selectedButton === "custom" && (
                  <TdActions>
                    <ButtonEdit onClick={() => handleEditEvent(event)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </ButtonEdit>
                    <ButtonDelete onClick={() => handleDeleteEvent(event.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </ButtonDelete>
                  </TdActions>
                )}
                {selectedButton === "brain" && (
                  <TdActions>
                    <ButtonEdit onClick={() => handleEditEvent(event)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </ButtonEdit>
                    <StatusButton
      isPrivate={event.isPrivate}
      onClick={() => handleTogglePrivacy(event.id)}
    >
      {event.isPrivate === 't' ? 'Privé' : 'Public'}
    </StatusButton>
                  </TdActions>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
  )}
        {/* Pop-up d'édition */}
        {showEditPopup && eventToEdit && (
          <EditEventPopup
            event={eventToEdit}
            onSave={handleSaveEventChanges}
            onClose={handleCloseEditPopup}
          />
        )}
        {showCreatePopup && (
          <CreateEventPopup
            onSave={handleCreateCustomEvent}
            onClose={handleCloseCreatePopup}
          />
        )}
      </Container>
    </>
  );
};

export default UpdateEvent;