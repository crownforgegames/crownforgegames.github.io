const WEBHOOK = "https://discord.com/api/webhooks/1437130090801795183/_gtLdeqLIekwsz18ss7SRvVi_jZxs5mpE__UGN8F1ThX4N3d89rJnzyDZcznP_D_NoSV"
const VISIT_NOTIFY_INTERVAL_MINUTES = 15;

function setCookie(name, value, minutes) {
    const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}


function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function sendDiscordMessage(content) {
    fetch(WEBHOOK, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: content // this is the message text
        })
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
        })
        .catch(err => console.error("Failed to send message:", err));
}


async function notifyVisit() {
    const lastVisit = getCookie("lastNotifyVisit");
    const now = Date.now();

    if (!lastVisit || now - Number(lastVisit) > VISIT_NOTIFY_INTERVAL_MINUTES * 60 * 1000) {
        sendDiscordMessage(`New visit at ${window.location.href} detected at ${new Date().toLocaleString()}`);
        setCookie("lastNotifyVisit", now, 15); // optional: cookie expires in 15 minutes
    } else {
        console.log("Visit notification skipped (within 15 min window)");
    }
}

async function notifyClick(action) {
    //sendDiscordMessage(`<@834489773573406770> User performed action: ${action} at ${new Date().toLocaleString()}`);
}

notifyVisit()