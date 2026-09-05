let booking_id;
let calendar;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Calendar
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            height: '100%',
            initialView: 'dayGridMonth',
            firstDay: 1,
            locale: 'en-gb',
            timeZone: 'UTC',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: {
                url: '/bookings/api/bookings/',
                method: 'GET',
                failure: function () {
                    console.error('Error loading events for the calendar.');
                }
            },
            dateClick: function (info) {
                calendar.changeView('timeGridDay', info.date);
            },
            dayMaxEvents: 3,
            eventClick: function (info) {
                const bookingId = info.event.extendedProps.id;
                const card = document.querySelector(`.booking-card[data-id="${bookingId}"]`);
                if (card) {
                    show_booking(card)
                    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
                    modal.show();
                }
            }
        });
        calendar.render();
    } else {
        console.error('Calendar element not found.');
    }
})

// Lazy Loading for Bookings
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {threshold: 0.1});

document.querySelectorAll('.booking-card').forEach(card => {
    observer.observe(card);
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.booking-card').forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const date = card.dataset.date.toLowerCase();
            const room = card.dataset.room.toLowerCase();
            console.log(card.dataset);
            if (name.includes(searchTerm) || date.includes(searchTerm) || room.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function show_booking(card) {
    const modalContent = document.getElementById('modalContent');

    booking_id = card.dataset.id

    modalContent.innerHTML = `
        <p><strong>Name:</strong> ${card.getAttribute('data-name')}</p>
        <p><strong>Date:</strong> ${card.getAttribute('data-date')}</p>
        <p><strong>Room:</strong> ${card.getAttribute('data-room')}</p>
        <p><strong>Status:</strong> ${card.querySelector('.badge').textContent}</p>
        <p><strong>Notes:</strong> <textarea id="note-textarea" placeholder="Type here..." onkeydown="if(((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's')) { event.preventDefault(); update_note(); }">${card.getAttribute('data-note')}</textarea></p>
    `;
}

// Details Button (Fill Modal)
document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const card = this.closest('.booking-card');

        show_booking(card);
    });
});

function check_in(alt_booking_id = null) {
    if (alt_booking_id) {
        booking_id = alt_booking_id
    }
    fetch(`/bookings/api/bookings/${booking_id}/checkin/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: JSON.stringify({checked_in: true})
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload()
            } else {
                console.error('Error updating check-in status:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function update_note() {
    fetch(`/bookings/api/bookings/${booking_id}/update_note/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: document.getElementById("note-textarea").value
    })
        .catch(error => {
            console.error('Error:', error);
        });
}

function clear_booking_id() {
    booking_id = null;
}
