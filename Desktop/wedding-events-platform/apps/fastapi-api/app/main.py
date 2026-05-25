from fastapi import FastAPI, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from uuid import uuid4
import csv
import io

app = FastAPI(title="Wedding Events API", version="1.0.0")

events: Dict[str, dict] = {}
guests: Dict[str, Dict[str, dict]] = {}
invite_index: Dict[str, dict] = {}


class EventCreate(BaseModel):
    date: str
    place: str
    bride: str
    groom: str
    publicInvitationUrl: Optional[str] = None
    canvaUrl: Optional[str] = None
    canvaEmbedHtml: Optional[str] = None


class EventUpdate(BaseModel):
    date: Optional[str] = None
    place: Optional[str] = None
    bride: Optional[str] = None
    groom: Optional[str] = None
    publicInvitationUrl: Optional[str] = None
    canvaUrl: Optional[str] = None
    canvaEmbedHtml: Optional[str] = None


class GuestCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    passes: int
    table: Optional[str] = None
    status: Optional[str] = "PENDING"


class GuestUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    passes: Optional[int] = None
    table: Optional[str] = None
    status: Optional[str] = None


class RSVPRequest(BaseModel):
    status: str
    confirmedAttendees: int = 0
    comments: Optional[str] = None


@app.post("/events")
def create_event(payload: EventCreate):
    event_id = str(uuid4())
    event_code = f"EVENT-{event_id[:8].upper()}"

    event = {
        "PK": f"EVENT#{event_id}",
        "SK": "METADATA",
        "eventId": event_id,
        "eventCode": event_code,
        "date": payload.date,
        "place": payload.place,
        "bride": payload.bride,
        "groom": payload.groom,
        "publicInvitationUrl": payload.publicInvitationUrl,
        "canvaUrl": payload.canvaUrl,
        "canvaEmbedHtml": payload.canvaEmbedHtml,
    }

    events[event_id] = event
    guests[event_id] = {}

    return event


@app.get("/events/{eventId}")
def get_event(eventId: str):
    if eventId not in events:
        raise HTTPException(status_code=404, detail="Event not found")
    return events[eventId]


@app.put("/events/{eventId}")
def update_event(eventId: str, payload: EventUpdate):
    if eventId not in events:
        raise HTTPException(status_code=404, detail="Event not found")

    update_data = payload.model_dump(exclude_unset=True)
    events[eventId].update(update_data)

    return events[eventId]


@app.post("/events/{eventId}/guests")
def create_guest(eventId: str, payload: GuestCreate):
    if eventId not in events:
        raise HTTPException(status_code=404, detail="Event not found")

    guest_id = str(uuid4())[:8]
    invite_code = str(uuid4())[:8].upper()

    guest = {
        "PK": f"EVENT#{eventId}",
        "SK": f"GUEST#{guest_id}",
        "guestId": guest_id,
        "name": payload.name,
        "phone": payload.phone,
        "email": str(payload.email),
        "passes": payload.passes,
        "table": payload.table,
        "status": payload.status,
        "inviteCode": invite_code,
        "confirmedAttendees": 0,
        "comments": None,
        "personalInviteLink": f"/invite/{invite_code}",
    }

    guests[eventId][guest_id] = guest
    invite_index[invite_code] = {
        "eventId": eventId,
        "guestId": guest_id,
    }

    return guest


@app.get("/events/{eventId}/guests")
def list_guests(eventId: str):
    if eventId not in events:
        raise HTTPException(status_code=404, detail="Event not found")

    return list(guests[eventId].values())


@app.put("/events/{eventId}/guests/{guestId}")
def update_guest(eventId: str, guestId: str, payload: GuestUpdate):
    if eventId not in events:
        raise HTTPException(status_code=404, detail="Event not found")

    if guestId not in guests[eventId]:
        raise HTTPException(status_code=404, detail="Guest not found")

    update_data = payload.model_dump(exclude_unset=True)

    if "email" in update_data:
        update_data["email"] = str(update_data["email"])

    guests[eventId][guestId].update(update_data)

    return guests[eventId][guestId]


@app.delete("/events/{eventId}/guests/{guestId}")
def delete_guest(eventId: str, guestId: str):
    if eventId not in events:
        raise HTTPException(status_code=404, detail="Event not found")

    if guestId not in guests[eventId]:
        raise HTTPException(status_code=404, detail="Guest not found")

    guest = guests[eventId].pop(guestId)
    invite_index.pop(guest["inviteCode"], None)

    return {
        "message": "Guest deleted successfully",
        "guestId": guestId,
    }


@app.get("/invite/{inviteCode}")
def get_invite(inviteCode: str):
    if inviteCode not in invite_index:
        raise HTTPException(status_code=404, detail="Invite not found")

    ref = invite_index[inviteCode]
    event = events[ref["eventId"]]
    guest = guests[ref["eventId"]][ref["guestId"]]

    return {
        "event": event,
        "guest": guest,
        "inviteCode": inviteCode,
    }


@app.post("/invite/{inviteCode}/rsvp")
def submit_rsvp(inviteCode: str, payload: RSVPRequest):
    if inviteCode not in invite_index:
        raise HTTPException(status_code=404, detail="Invite not found")

    if payload.status not in ["CONFIRMED", "DECLINED", "PENDING"]:
        raise HTTPException(status_code=400, detail="Invalid RSVP status")

    ref = invite_index[inviteCode]
    guest = guests[ref["eventId"]][ref["guestId"]]

    guest["status"] = payload.status
    guest["confirmedAttendees"] = payload.confirmedAttendees
    guest["comments"] = payload.comments

    return {
        "message": "RSVP registered successfully",
        "guest": guest,
    }


@app.get("/events/{eventId}/summary")
def get_event_summary(eventId: str):
    if eventId not in events:
        raise HTTPException(status_code=404, detail="Event not found")

    event_guests = list(guests[eventId].values())

    return {
        "eventId": eventId,
        "totalGuests": len(event_guests),
        "totalPasses": sum(g["passes"] for g in event_guests),
        "confirmedGuests": len([g for g in event_guests if g["status"] == "CONFIRMED"]),
        "declinedGuests": len([g for g in event_guests if g["status"] == "DECLINED"]),
        "pendingGuests": len([g for g in event_guests if g["status"] == "PENDING"]),
        "confirmedAttendees": sum(g["confirmedAttendees"] for g in event_guests),
    }


@app.get("/events/{eventId}/export", response_class=PlainTextResponse)
def export_event_guests(eventId: str):
    if eventId not in events:
        raise HTTPException(status_code=404, detail="Event not found")

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "guestId",
        "name",
        "phone",
        "email",
        "passes",
        "table",
        "status",
        "inviteCode",
        "confirmedAttendees",
        "comments",
    ])

    for guest in guests[eventId].values():
        writer.writerow([
            guest["guestId"],
            guest["name"],
            guest["phone"],
            guest["email"],
            guest["passes"],
            guest["table"],
            guest["status"],
            guest["inviteCode"],
            guest["confirmedAttendees"],
            guest["comments"],
        ])

    return output.getvalue()


@app.get("/health")
def health():
    return {"status": "ok"}