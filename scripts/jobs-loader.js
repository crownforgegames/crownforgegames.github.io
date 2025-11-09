const GIST_API = "https://api.github.com/gists/585f1fffc569eebe7112436490db6649"; 

fetch(GIST_API)
    .then(res => res.json())
    .then(data => {
        const file = data.files["jobs.json"];
        const jobs = JSON.parse(file.content);

        const container = document.getElementById("jobs-container");

        jobs.forEach((job, index) => {
            const card = document.createElement("div");
            card.classList.add("game-card");

            card.innerHTML = `
                ${job.image ? `<img src="${job.image}" alt="${job.title}">` : ''}
                <div class="card-info">
                    <h2>${job.title}</h2>
                    <span class="job-type">${job.type}</span>
                    <span class="job-type">${job.experience} Experience Required</span>
                    <p>${job.description}</p>
                    <a href="${job.applyLink}" target="_blank" class="game-button">Apply Now</a>
                </div>
            `;

            container.appendChild(card);

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add("visible");
                        }, index * 250); // staggered delay
                        obs.unobserve(entry.target); // animate only once
                    }
                });
            }, { threshold: 0.2 }); // trigger when 20% of card is visible

            observer.observe(card);
        });
    })
    .catch(err => console.error(err));
