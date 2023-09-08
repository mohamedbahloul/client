import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import "../styles/common/layout.css";
import ScrollButton from "../components/ScrollButton";
import CarteButton from "../components/CarteButton";
import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBill } from "react-icons/fa";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  @media (min-width: 990px) {
    width: 90%;
    align-items: flex-start;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @media (min-width: 990px) {
    align-items: flex-start;
    text-align: left;
  }
`;

const EventStatus = styled.h2`
  font-size: 20px;
  color: red;
  margin-left: 10px;
`;

const EventTitle = styled.h2`
  font-size: 30px;
  font-weight: bold;
  color: black;
  margin-top: 3px;
`;

const EventFieldContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 0;
  gap: 20px;
`;

const DateText = styled.div`
  text-transform: capitalize;
`;

const EventIcon = styled.div`
  width: 24px;
  height: 24px;
  color: red;
`;

const EventLocation = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: #555;
`;

const ContactSection = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-left: 0;
  gap: 10px;
`;

const ContactTitle = styled.h3`
  font-weight: bold;
  color: red;
`;

const ContactInfo = styled.div`
  font-style: italic;
`;

const ContactName = styled.div`
  font-weight: 600;
`;

const EventImage = styled.img`
  max-width: 90%;
  height: auto;
  margin-top: 20px;
  border-radius: 10%;
  align-self: center;
  width: 600px;
`;

const EventDescription = styled.p`
  margin-top: 20px;
  font-size: 16px;
  text-align: left;
  overflow-wrap: break-word;
`;

const EventLink = styled.a`
  color: var(--color3);
  background-color: var(--color2);
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  text-decoration: none;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color1);
  }
`;

const EventGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 15px;
  gap: 50px;
`;

const EventCardContainer = styled.div`
  width: auto;
  margin-bottom: 20px;

  @media (max-width: 990px) {
    width: auto;
  }
`;

const SimilarEventsTitle = styled.h3`
  margin-top: 40px;
  text-align: center;

  @media (min-width: 768px) {
    text-align: center;
  }
`;

function EventDetails() {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };
  const { eventId } = useParams();
  const [event, setEvent] = useState({});
  const [similarEvents, setSimilarEvents] = useState([]);
  // const similarEvents = [
  //   event,event,event
  // ]

  const customEventURL = `http://localhost:3001/detailsEvent/custom/${eventId}`;
  console.log("Custom Event URL:", customEventURL);
  useEffect(() => {
    axios.get(`http://localhost:3001/detailsEvent/brain/${eventId}`).then((res) => {
      if (res.data !== null) {
        setEvent(res.data);
      } else {
        axios.get(customEventURL).then((res) => {
          if (res.data === null) {
              window.location.replace("/404");
          } else {
              setEvent(res.data);
          }
      });
      }
    });
  }, [eventId]);

  useEffect(() => {
    axios.get(`http://localhost:3001/similarEvents/${eventId}`).then((res) => {
        setSimilarEvents(res.data.similarEvents);
    });
  }, [eventId]);

  const eventDetails = {
    price: "Gratuitement",
    contact: {
      name: "Cédrik Ferrero",
      address: "cedrik.ferrero@bordeaux-inp.fr",
      phone: "+33 123456789",
      poste: "Animateur R3MOB",
    },
    registrationLink: "https://www.bordeaux-inp.fr/fr/formation/2021/PR/ing%C3%A9nieur-enseirb-matmeca",
  };
  const formattedDate = new Date(event.startDateTime).toLocaleDateString(
    "fr-FR",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Remplacer les balises <br/> par des sauts de ligne
  const eventDesc = event.description || "";
  var formattedDescription = eventDesc.replace(/\\t/g, "<pre/>");
  const imageUrl = `../events_imgs/${eventId}.jpg`;
  const fallbackImageUrl = "../events_imgs/event_default.jpg";

  return (
    <div className="body">
      <header>header</header>
      <div className="main" style={{marginTop:"100px"}}>
        <aside className="left">left</aside>
        <main>
          <TitleContainer>
            <EventStatus> #Événement {event.isPrivate === 't' ? "Privé" : "Publique"}</EventStatus>
            <EventTitle>{event.nom}</EventTitle>
          </TitleContainer>
          <DetailsContainer>
            <div>
              <EventFieldContainer>
                <EventIcon>
                  <FaCalendarAlt />
                </EventIcon>

                <DateText>{formattedDate}</DateText>
              </EventFieldContainer>
              <EventFieldContainer>
                <EventIcon>
                  <FaMapMarkerAlt />
                </EventIcon>

                <div>{event.location}</div>
              </EventFieldContainer>

              <EventFieldContainer>
                <EventIcon>
                  <FaMoneyBill />
                </EventIcon>

                <div>{eventDetails.price}</div>
              </EventFieldContainer>
              <EventFieldContainer>
                <EventLink href={eventDetails.registrationLink}>
                  S'inscrire
                </EventLink>
              </EventFieldContainer>
              <ContactSection>
                <ContactTitle>Contact</ContactTitle>
                <ContactName>{eventDetails.contact.name}</ContactName>
                <ContactInfo>{eventDetails.contact.address}</ContactInfo>
                <ContactInfo>{eventDetails.contact.phone}</ContactInfo>
                <ContactInfo>{eventDetails.contact.poste}</ContactInfo>
              </ContactSection>
            </div>
            <RightSide>
               <EventImage src={fallbackImageUrl} alt="Image de l'événement" /> 
              {formattedDescription.split("<br/>").map((paragraph, index) => (
                <EventDescription key={index}>
                  
                  {paragraph.replaceAll("<pre/>", " ")}
                </EventDescription>
              ))}
            </RightSide>
          </DetailsContainer>
          <SimilarEventsTitle>Ces événements pourraient vous intéresser</SimilarEventsTitle>
          <EventGrid>
            {similarEvents.map((value, key) => (
              <EventCardContainer key={key}>
                <EventCard
                  id={value.id}
                  date={formatDate(value.startDateTime)}
                  title={value.nom}
                  eventType={value.locationType}
                  location={
                    value.locationType === "Visio"
                      ? "En ligne"
                      : value.location
                  }
                  registrationLink={value.lienInscription}
                  imageUrl = {`../events_imgs/${value.id}.jpg`}
                    fallbackImageUrl = {"../events_imgs/event_default.jpg"}
                />
              </EventCardContainer>
            ))}
          </EventGrid>
        </main>
        <aside className="right">
          <ScrollButton />
          <CarteButton />
        </aside>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default EventDetails;
