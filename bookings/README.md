<p align="center">
  <img src="static/global/images/logo.svg" alt="openLobby Logo" width="200">
</p>

# openLobby - App descripton

![Django](https://img.shields.io/badge/django-%23092e20.svg?style=for-the-badge&logo=django&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

## Bookings

The **Bookings** module provides a dual-interface for managing reservations. It synchronizes a visual calendar with a searchable, interactive list, allowing for seamless check-ins and detail management.

## Features

* **Dual-View Interface**: A split-screen layout featuring a **FullCalendar v6** integration on the left and a detailed booking list on the right.
* **Real-time Check-in**: Integrated AJAX-based check-in system that updates the database and the UI without reloading the page.
* **Dynamic Search**: Instant filtering of bookings by name or date using Vanilla JS.
* **Performance Optimized**: Uses the **Intersection Observer API** for lazy-loading/animations of booking cards.
* **API-Driven**: Calendar events are fetched dynamically from a dedicated Django JSON endpoint.

## Technical Implementation

### Frontend
- **FullCalendar**: Initialized in `dayGridMonth` with `timeGridDay` drill-down on date click.
- **Bootstrap 5 Modals**: Used for displaying detailed booking information fetched from the DOM or API.
- **Vanilla JS**: No jQuery dependency. All logic for search, modal filling, and AJAX is written in pure JavaScript.

### Backend (Django)
- **Models**: Extends the core system with `first_name`, `last_name`, `booking_from`, `booking_to`, and `checked_in` status.
- **API Endpoints**:
    - `/bookings/api/bookings/`: Returns JSON events for the calendar.
    - `/bookings/api/bookings/<id>/checkin/`: POST endpoint for status updates (requires CSRF token).

## File Structure

| File | Purpose |
| :--- | :--- |
| `templates/bookings.html` | The main dashboard layout for the booking module. |
| `static/bookings/bookings.js` | Contains calendar init, search logic, and AJAX handlers. |
| `static/bookings/bookings.css` | Custom styling for the booking cards and scroll containers. |

## How to use it
### Manage your bookings
* Calendar Navigation: Click on any date in the Booking Calendar to switch to the day-view for detailed time slots. Use the navigation buttons to navigate between months.
* Search: Type in the search bar to filter bookings by name or date.
* Check-in:
1. Locate the guest in the booking list. 
2. Click the green Check-in button. 
3. The status badge will update to "Checked In" immediately via AJAX, and the calendar will refresh to reflect the new status.
* View Details: Click the Details button on any card to open a modal with the full guest information.