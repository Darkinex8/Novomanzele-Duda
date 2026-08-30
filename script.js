// Otevření svatební pozvánky s plynulým přechodem na stránku.
function openEnvelope() {
    const overlay = document.getElementById('envelope-overlay');
    const card = document.querySelector('.invitation-card');

    if (!overlay || overlay.classList.contains('opened')) return;

    if (card) {
        card.style.transform = 'translateY(-18px) scale(1.035)';
        card.style.opacity = '0';
        card.style.transition = 'transform .65s ease, opacity .65s ease';
    }

    setTimeout(() => {
        overlay.classList.add('opened');
    }, 420);
}

// Odpočet do 8. května 2027 11:00
const targetDate = new Date("May 8, 2027 11:00:00").getTime();

function updateCountdownTimer() {
    const currentTime = new Date().getTime();
    const timeDifference = targetDate - currentTime;

    const daysEl = document.getElementById("days");
    if (!daysEl) return;

    if (timeDifference < 0) {
        document.getElementById("countdown").innerHTML = "<p>Dnes je náš svatební den! 🎉</p>";
        return;
    }

    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = daysLeft.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hoursLeft.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutesLeft.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = secondsLeft.toString().padStart(2, '0');
}

setInterval(updateCountdownTimer, 1000);
updateCountdownTimer();


// Kalendář je řešen přes skutečný .ics soubor, aby fungoval i v mobilních
// prohlížečích (iOS i Android). Odkaz je přímo v HTML.

// Přidávání dalších řádků hostů ve formuláři
let guestIndex = 1;

function addGuestRow() {
    guestIndex++;
    const guestContainer = document.getElementById("guests-container");
    if (!guestContainer) return;

    const newRow = document.createElement("div");
    newRow.className = "guest-row-grid";
    newRow.style.marginTop = "10px";
    newRow.innerHTML = `
        <div>
            <label class="mini-label">Jméno a příjmení</label>
            <input type="text" name="guest_name_${guestIndex}" placeholder="Jméno hosta" required>
        </div>
        <div>
            <label class="mini-label">Účast</label>
            <select name="guest_attending_${guestIndex}">
                <option value="Přijede">Přijede</option>
                <option value="Nepřijede">Nepřijede</option>
            </select>
        </div>
        <div>
            <label class="mini-label">Alergie / speciální strava</label>
            <input type="text" name="guest_diet_${guestIndex}" placeholder="např. bez lepku">
        </div>
        <div>
            <label class="mini-label">Přespání</label>
            <select name="guest_sleep_${guestIndex}">
                <option value="Ano">Ano</option>
                <option value="Ne">Ne</option>
            </select>
        </div>
        <div>
            <label class="mini-label">Vlastní odvoz</label>
            <select name="guest_transport_${guestIndex}">
                <option value="Ano">Ano</option>
                <option value="Ne">Ne</option>
            </select>
        </div>
    `;
    
    guestContainer.appendChild(newRow);
}

// Odesílání dotazníku
const rsvpForm = document.getElementById("wedding-rsvp-form");
const statusMessage = document.getElementById("form-status");

if (rsvpForm) {
    rsvpForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        statusMessage.style.color = "#113426";
        statusMessage.innerText = "Odesílám dotazník...";

        try {
            const response = await fetch(e.target.action, {
                method: rsvpForm.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                statusMessage.style.color = "green";
                statusMessage.innerText = "Děkujeme! Váš dotazník byl úspěšně odeslán.";
                rsvpForm.reset();
            } else {
                statusMessage.style.color = "red";
                statusMessage.innerText = "Při odesílání došlo k chybě. Zkontrolujte prosím pole formuláře.";
            }
        } catch (error) {
            statusMessage.style.color = "red";
            statusMessage.innerText = "Chyba sítě. Zkuste to prosím znovu.";
        }
    });
}