const WEBHOOK = "https://discord.com/api/webhooks/1437785605919740015/GyOZSClX5eVEOifwtE4HiZ12eORzKkTlzU_rjkdUP3mY59MEH0B7v3c7s15ExltEvHwo";
const GIST_API = "https://api.github.com/gists/585f1fffc569eebe7112436490db6649";

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/`;
}

function sendDiscordMessage(content) {
    fetch(WEBHOOK, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ content })
    })
        .then(res => {
            if (!res.ok) throw new Error(`Error: ${res.status}`);
        })
        .catch(err => console.error("Failed to send message:", err));
}



document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const formId = params.get("id");
    const sessionId = params.get("session");
    const formTitle = document.getElementById("form-title");
    const formContainer = document.getElementById("form-container");
    const submitButton = document.getElementById("submit-form");

    function complete() {
        formContainer.innerHTML = `
            <div class="thank-you">
                <h1>Submission Successful</h1>
                <p>Thank you for applying! You will get a response shortly.</p>
                <a href="/" class="back-home">Return to Home</a>
            </div>
        `;
        formContainer.classList.remove("fade-out");
        formContainer.classList.add("fade-in");
        submitButton.classList.add("fade-out");
        formTitle.classList.add("fade-out");
    }

    if (getCookie(formId)) {
        complete();
        return;
    }

    if (!formId) {
        formTitle.textContent = "Form Not Found";
        formContainer.innerHTML = "<p>Missing form ID in URL.</p>";
        submitButton.style.display = "none";
        return;
    }

    try {
        const response = await fetch(GIST_API);
        const data = (await response.json()).files["forms.json"]
        const form = JSON.parse(data.content)[formId];

        if (!form) {
            formTitle.textContent = "Form Not Found";
            formContainer.innerHTML = "<p>No form found for this ID.</p>";
            submitButton.style.display = "none";
            return;
        }

        formTitle.textContent = form.title || "Application Form";

        // Build questions dynamically
        form.questions.forEach((q, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");

            // Label with optional required asterisk
            const label = document.createElement("label");
            label.textContent = q.question + (q.required ? " *" : "");
            label.htmlFor = `question-${index}`;
            if (q.required) label.classList.add("required");

            if (q.type === "section") {
                const sectionDiv = document.createElement("div");
                sectionDiv.classList.add("form-section");

                const title = document.createElement("h2");
                title.textContent = q.title || "Section";
                sectionDiv.appendChild(title);

                formContainer.appendChild(sectionDiv);
                return; // skip to next question
            } else if (q.type === "info") {
                const infoDiv = document.createElement("div");
                infoDiv.classList.add("form-info");

                const header = document.createElement("h2");
                header.textContent = q.title || "Information";

                const desc = document.createElement("p");
                desc.textContent = q.value || "";

                infoDiv.append(header, desc);
                formContainer.appendChild(infoDiv);
                return; // skip to next questio
            }

            // --- Short Answer ---
            if (q.type === "short answer") {
                const input = document.createElement("input");
                input.type = "text";
                input.id = `question-${index}`;
                input.name = q.question;
                input.placeholder = "Your answer...";
                if (q.required) input.required = true;
                questionDiv.append(label, input);
            }

            // --- Paragraph ---
            if (q.type === "paragraph") {
                const textarea = document.createElement("textarea");
                textarea.id = `question-${index}`;
                textarea.name = q.question;
                textarea.placeholder = "Type your response here...";
                if (q.required) textarea.required = true;
                questionDiv.append(label, textarea);
            }

            // --- Multiple Choice ---
            if (q.type === "multiple choice" && q.options) {
                const select = document.createElement("select");
                select.id = `question-${index}`;
                select.name = q.question;
                if (q.required) select.required = true;

                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "Select an option...";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);

                q.options.forEach(opt => {
                    const option = document.createElement("option");
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });

                questionDiv.append(label, select);
            }

            if (q.type === "scale" && q.min !== undefined && q.max !== undefined) {
                const scaleContainer = document.createElement("div");
                scaleContainer.classList.add("scale-container");

                const scaleLabels = document.createElement("div");
                scaleLabels.classList.add("scale-labels");
                scaleLabels.innerHTML = `
                <span>${q.minLabel || ""}</span>
                <span>${q.maxLabel || ""}</span>
                `;

                const scaleRow = document.createElement("div");
                scaleRow.classList.add("scale-row");

                for (let i = q.min; i <= q.max; i++) {
                    const optionDiv = document.createElement("div");
                    optionDiv.classList.add("scale-option");

                    const input = document.createElement("input");
                    input.type = "radio";
                    input.name = `question-${index}`;
                    input.id = `question-${index}-${i}`;
                    input.value = i;
                    if (q.required) input.required = true;

                    const label = document.createElement("label");
                    label.htmlFor = input.id;
                    label.textContent = i;

                    optionDiv.append(input, label);
                    scaleRow.appendChild(optionDiv);
                }

                scaleContainer.append(scaleLabels, scaleRow);
                questionDiv.append(label, scaleContainer);
            }

            formContainer.appendChild(questionDiv);
        });

        // Handle submission
        submitButton.addEventListener("click", () => {
            const answers = [];
            let valid = true;

            if (fnv1aHex(getCookie("_ajshxXawd129")) != sessionId) {
                //alert("Session ID mismatch. Please access the form through the official application link.");
                //window.location.href = "/apply.html";
                //return;
            }

            form.questions.forEach((q, index) => {
                let value = "";

                if (q.type === "info" || q.type === "section") {
                    return;
                }

                if (q.type === "scale") {
                    const checked = document.querySelector(`input[name="question-${index}"]:checked`);
                    value = checked ? checked.value : "";
                } else {
                    const el = document.getElementById(`question-${index}`);
                    value = el?.value?.trim() ?? "";
                    if (q.required && !value) {
                        valid = false;
                        el.classList.remove("error"); // reset animation if triggered before
                        void el.offsetWidth; // force reflow to restart CSS animation
                        el.classList.add("error");
                    } else if (el) {
                        el.classList.remove("error");
                    }
                }

                if (q.required && !value) valid = false;

                answers.push({ question: q.question, answer: value });
            });

            if (!valid) {
                return;
            }

            let message = `<@834489773573406770> New form submission for ${form.title}:\n\n`;
            answers.forEach(a => {
                message += `**${a.question}**\n${a.answer || "No response"}\n\n`;
            });
            sendDiscordMessage(message);

            setCookie(formId, Math.random() * 100);
            complete();
        });

    } catch (err) {
        console.error("Error loading form:", err);
        formTitle.textContent = "Error loading form";
        formContainer.innerHTML = "<p>Could not fetch form data.</p>";
    }
});
