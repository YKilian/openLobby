let booking_id;
let calendar;
let current_card;

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
    const modalContent = document.getElementById('modal-content');

    booking_id = card.dataset.id
    current_card = card

    modalContent.innerHTML = `
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-person-badge-fill"></i> Booking Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="modalContent">
                    <div class="form-floating mb-3">
                      <input type="text" readonly class="form-control-plaintext" id="modal-name" placeholder="${card.getAttribute('data-name')}" value="${card.getAttribute('data-name')}">
                      <label for="modal-name"><i class="bi bi-person-fill"></i> Name</label>
                    </div>
                    
                    <div class="form-floating mb-3">
                      <input type="email" readonly class="form-control-plaintext" id="model-email" placeholder="${card.getAttribute('data-email')}" value="${card.getAttribute('data-email')}">
                      <label for="model-email"><i class="bi bi-envelope-at-fill"></i> Email</label>
                    </div>
                    
                    <div class="form-floating mb-3">
                      <input type="text" readonly class="form-control-plaintext" id="modal-phone" placeholder="${card.getAttribute('data-tel')}" value="${card.getAttribute('data-tel')}">
                      <label for="modal-phone"><i class="bi bi-telephone-fill"></i> Phone</label>
                    </div>
        
                    <div class="form-floating mb-3">
                      <input type="text" readonly class="form-control-plaintext" id="modal-date" placeholder="${card.getAttribute('data-date')}" value="${card.getAttribute('data-date')}">
                      <label for="modal-date"><i class="bi bi-calendar-range-fill"></i> Date</label>
                    </div>
        
                    <div class="form-floating mb-3">
                      <input type="number" readonly class="form-control-plaintext" id="modal-room" placeholder="${card.getAttribute('data-room')}" value="${card.getAttribute('data-room')}">
                      <label for="modal-room"><i class="bi bi-door-open-fill"></i> Room</label>
                    </div>
        
                    <div class="form-floating mb-3">
                      <input type="text" readonly class="form-control-plaintext" id="modal-status" placeholder="${card.querySelector('.badge').textContent}" value="${card.querySelector('.badge').textContent}">
                      <label for="modal-status"><i class="bi bi-bookmark-check-fill"></i> Status</label>
                    </div>
        
                    <div class="form-floating">
                        <textarea class="form-control" placeholder="Leave a note here" id="note-textarea" style="height: 100px" onkeydown="if(((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's')) { event.preventDefault(); update_note(); }">${card.getAttribute('data-note') && card.getAttribute('data-note') !== '{}' ? card.getAttribute('data-note') : ''}</textarea>
                        <label for="note-textarea"><i class="bi bi-card-text"></i> Note</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="update_note()">Safe Changes</button>
                ${card.querySelector('.badge').textContent.trim() === 'Not Checked In' ? '<button type="button" class="btn btn-success" onclick="check_in()">Check-in</button>' : ''}
                <button type="button" class="btn btn-secondary" onclick="clear_booking_id()" data-bs-dismiss="modal">Close</button>
            </div>
    `;
}

// Details Button (Fill Modal)
document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const card = this.closest('.booking-card');

        show_booking(card);
    });
});

function check_in(alt_booking_id = null, trigger= null) {
    if (alt_booking_id) {
        booking_id = alt_booking_id
        current_card = document.querySelector(`.booking-card[data-id="${booking_id}"]`);
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
                calendar.refetchEvents();
                current_card.querySelector('.badge').textContent = 'Checked In';
                current_card.querySelector('.badge').classList.replace('bg-secondary', 'bg-success');
                current_card.querySelector('.checkin-btn').closest('.col-auto').remove();
                document.getElementById("modal-content").querySelector('.modal-footer .btn.btn-success').remove();
            } else {
                console.error('Error updating check-in status:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function update_note() {
    let new_content = document.getElementById("note-textarea").value
    fetch(`/bookings/api/bookings/${booking_id}/update_note/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: new_content
    })
    .catch(error => {
        console.error('Error:', error);
    });

    current_card.setAttribute('data-note', new_content)
}

function clear_booking_id() {
    booking_id = null;
}
