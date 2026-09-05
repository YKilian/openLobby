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
                        failure: function() {
                            console.error('Error loading events for the calendar.');
                        }
                    },
                    dateClick: function(info) {
                        calendar.changeView('timeGridDay', info.date);
                    },
                    dayMaxEvents: 3,
                    eventClick: function(info) {
                        const bookingId = info.event.extendedProps.id;
                        const card = document.querySelector(`.booking-card[data-id="${bookingId}"]`);
                        if (card) {
                            const modalContent = document.getElementById('modalContent');
                            modalContent.innerHTML = `
                                <p><strong>Name:</strong> ${card.getAttribute('data-name')}</p>
                                <p><strong>Date:</strong> ${card.getAttribute('data-date')}</p>
                                <p><strong>Room:</strong> ${card.getAttribute('data-room')}</p>
                                <p><strong>Status:</strong> ${card.querySelector('.badge').textContent}</p>
                            `;
                            const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
                            modal.show();
                        }
                    }
                });
                calendar.render();
            } else {
                console.error('Calendar element not found.');
            }

            // Lazy Loading for Bookings
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.booking-card').forEach(card => {
                observer.observe(card);
            });

            // Search Functionality
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
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

            // Details Button (Fill Modal)
            document.querySelectorAll('.details-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const card = this.closest('.booking-card');
                    const modalContent = document.getElementById('modalContent');
                    modalContent.innerHTML = `
                        <p><strong>Name:</strong> ${card.getAttribute('data-name')}</p>
                        <p><strong>Date:</strong> ${card.getAttribute('data-date')}</p>
                        <p><strong>Room:</strong> ${card.getAttribute('data-room')}</p>
                        <p><strong>Status:</strong> ${card.querySelector('.badge').textContent}</p>
                    `;
                });
            });

            // Check-in Button
            document.querySelectorAll('.checkin-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const card = this.closest('.booking-card');
                    const bookingId = card.dataset.id;

                    // AJAX request to Django to save check-in status
                    fetch(`/bookings/api/bookings/${bookingId}/checkin/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                        },
                        body: JSON.stringify({ checked_in: true })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            card.querySelector('.badge').textContent = 'Checked In';
                            card.querySelector('.badge').classList.replace('bg-secondary', 'bg-success');
                            this.closest('.col-auto').remove();
                            // Refresh calendar to reflect changes
                            if (calendar) {
                                calendar.refetchEvents();
                            }
                        } else {
                            console.error('Error updating check-in status:', data.error);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                });
            });
        });